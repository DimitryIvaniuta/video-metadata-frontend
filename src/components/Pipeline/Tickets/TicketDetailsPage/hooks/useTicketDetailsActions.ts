import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    TicketStatus,
    useTicketByIdQuery,
    useUpdateTicketMutation,
    useAddTicketCommentMutation,
    useSearchUsersLazyQuery,
} from "@/graphql/generated/graphql";

type UseTicketDetailsActionsResult = {
    // ticket query
    ticket: ReturnType<typeof useTicketByIdQuery>["data"] extends {
            ticket?: infer T | null;
        }
        ? T | null | undefined
        : any;
    loadingTicket: boolean;
    errorTicket: any;
    refetchTicket: () => Promise<any>;

    // editable fields
    status: string;
    setStatus: (v: string) => void;

    assigneeId: string;
    assigneeName: string;
    assigneeQuery: string;
    handleAssigneeInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePickAssignee: (id: number, username: string) => void;
    handleClearAssignee: () => void;

    // dropdown visibility
    showUserDropdown: boolean;
    setShowUserDropdown: (v: boolean) => void;

    // debounced search results
    userSearchResults: { id?: number | null; username?: string | null }[];
    runUserSearch: ReturnType<typeof useSearchUsersLazyQuery>[0];

    // comment box
    commentText: string;
    setCommentText: (v: string) => void;

    // submit handlers
    handleUpdateSubmit: (e: React.FormEvent) => void;
    handleCommentSubmit: (e: React.FormEvent) => void;

    // mutation states / errors
    savingTicket: boolean;
    errorUpdate: any;
    postingComment: boolean;
    errorComment: any;
};

export function useTicketDetailsActions(
    ticketIdNum: number,
    returnTo: string,
): UseTicketDetailsActionsResult {
    const navigate = useNavigate();

    // -----------------------------
    // GraphQL queries/mutations
    // -----------------------------
    const {
        data,
        loading: loadingTicket,
        error: errorTicket,
        refetch,
    } = useTicketByIdQuery({
        variables: {
            id: ticketIdNum,
            includeComments: true,
        },
        skip: Number.isNaN(ticketIdNum),
        fetchPolicy: "cache-and-network",
    });

    const ticket = data?.ticket ?? null;

    const [updateTicket, { loading: savingTicket, error: errorUpdate }] =
        useUpdateTicketMutation({
            refetchQueries: ["TicketsConnection", "TicketsCount"],
            awaitRefetchQueries: true,
        });

    const [addComment, { loading: postingComment, error: errorComment }] =
        useAddTicketCommentMutation({
            refetchQueries: ["TicketById"],
            awaitRefetchQueries: true,
        });

    // Lazy search for assignee usernames
    const [runUserSearch, { data: userSearchData }] =
        useSearchUsersLazyQuery();

    // -----------------------------
    // Local editable state
    // -----------------------------

    // status select
    const [status, setStatus] = useState<string>("");

    // assignee state
    const [assigneeId, setAssigneeId] = useState<string>(""); // numeric-String or ""
    const [assigneeName, setAssigneeName] = useState<string>(""); // username
    const [assigneeQuery, setAssigneeQuery] = useState<string>(""); // input field text

    // dropdown visibility
    const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

    // comment box
    const [commentText, setCommentText] = useState<string>("");

    // We only initialize from the server ticket ONCE.
    // After that, we keep user edits even if ticket refetches (e.g. after comment).
    const initializedRef = useRef<boolean>(false);

    useEffect(() => {
        if (!ticket) return;
        if (initializedRef.current) return;

        // init status from ticket
        setStatus(ticket.status ?? "");

        // init assignee/display text
        if (ticket.assigneeId != null) {
            const idStr = String(ticket.assigneeId);
            const nameStr = ticket.assigneeUsername || "";
            setAssigneeId(idStr);
            setAssigneeName(nameStr);
            setAssigneeQuery(
                nameStr
                    ? `${nameStr} (${idStr})`
                    : idStr,
            );
        } else {
            setAssigneeId("");
            setAssigneeName("");
            setAssigneeQuery("");
        }

        initializedRef.current = true;
    }, [ticket]);

    // -----------------------------
    // Debounced assignee search
    // -----------------------------
    useEffect(() => {
        // if cleared text → hide
        if (!assigneeQuery.trim()) {
            setShowUserDropdown(false);
            return;
        }

        // if it's already a locked selection like "alex (12)",
        // don't auto-query unless user actually edits it
        if (/\)\s*$/.test(assigneeQuery)) {
            return;
        }

        setShowUserDropdown(true);

        const handle = setTimeout(() => {
            runUserSearch({
                variables: {
                    term: assigneeQuery.trim(),
                    limit: 8,
                },
                fetchPolicy: "network-only",
            });
        }, 300);

        return () => clearTimeout(handle);
    }, [assigneeQuery, runUserSearch]);

    const userSearchResults =
        userSearchData?.searchUsers ?? [];

    // -----------------------------
    // Handlers
    // -----------------------------

    const handleAssigneeInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = e.target.value;
        // user typing -> break current selection
        setAssigneeQuery(value);
        setAssigneeId("");
        setAssigneeName("");
        setShowUserDropdown(!!value.trim());
    };

    const handlePickAssignee = useCallback(
        (id: number, username: string) => {
            const idStr = String(id);
            setAssigneeId(idStr);
            setAssigneeName(username);
            setAssigneeQuery(`${username} (${idStr})`);
            setShowUserDropdown(false);
        },
        [],
    );

    const handleClearAssignee = () => {
        setAssigneeId("");
        setAssigneeName("");
        setAssigneeQuery("");
        setShowUserDropdown(false);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketIdNum || Number.isNaN(ticketIdNum)) return;
        if (!commentText.trim()) return;

        addComment({
            variables: {
                input: {
                    ticketId: ticketIdNum,
                    body: commentText.trim(),
                },
            },
        })
            .then(() => {
                setCommentText("");
                // we do NOT reset status/assignee here,
                // initializedRef.current stays true so local edits persist
                return refetch();
            })
            .catch(() => {
                /* errorComment surfaces in UI */
            });
    };

    // Save Changes:
    //  - updateTicket mutation
    //  - refetch ticket list (done via refetchQueries)
    //  - navigate back to tickets grid with original filters,
    //    using the provided `returnTo`
    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketIdNum || Number.isNaN(ticketIdNum)) return;

        updateTicket({
            variables: {
                input: {
                    id: ticketIdNum,
                    status: status === "" ? null : (status as TicketStatus),
                    assigneeId:
                        assigneeId === "" ? null : Number(assigneeId),
                },
            },
        })
            .then(() => {
                navigate(returnTo, { replace: true });
            })
            .catch(() => {
                /* errorUpdate surfaces in UI */
            });
    };

    return {
        ticket,
        loadingTicket,
        errorTicket,
        refetchTicket: refetch,

        status,
        setStatus,

        assigneeId,
        assigneeName,
        assigneeQuery,
        handleAssigneeInputChange,
        handlePickAssignee,
        handleClearAssignee,

        showUserDropdown,
        setShowUserDropdown,

        userSearchResults,
        runUserSearch,

        commentText,
        setCommentText,

        handleUpdateSubmit,
        handleCommentSubmit,

        savingTicket,
        errorUpdate,
        postingComment,
        errorComment,
    };
}
