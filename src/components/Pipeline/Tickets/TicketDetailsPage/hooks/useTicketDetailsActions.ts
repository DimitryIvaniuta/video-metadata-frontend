import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    TicketStatus,
    useTicketByIdQuery,
    useUpdateTicketMutation,
    useAddTicketCommentMutation,
    useSearchUsersLazyQuery,
    TicketByIdQuery,
    SearchUsersQuery,
} from "@/graphql/generated/graphql";

/**
 * Helper types derived from codegen so we don't guess shapes.
 */

// One Ticket from TicketByIdQuery["ticket"]
export type TicketDetails = NonNullable<TicketByIdQuery["ticket"]>;

// One comment item, after filtering out nulls
export type TicketCommentItem = NonNullable<
    NonNullable<TicketDetails["comments"]>[number]
>;

// One user search result item, after filtering out nulls
export type SearchUserItem = NonNullable<
    NonNullable<SearchUsersQuery["searchUsers"]>[number]
>;

export interface UseTicketDetailsActionsResult {
    // ticket query
    ticket: TicketDetails | null;
    loadingTicket: boolean;
    errorTicket: unknown;
    refetchTicket: () => Promise<any>;

    // editable fields
    status: string;
    setStatus: (v: string) => void;

    assigneeId: string; // string-wrapped numeric ID or ""
    assigneeName: string;
    assigneeQuery: string;
    handleAssigneeInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePickAssignee: (id: number, username: string) => void;
    handleClearAssignee: () => void;

    // dropdown visibility
    showUserDropdown: boolean;
    setShowUserDropdown: (v: boolean) => void;

    // debounced search results
    userSearchResults: SearchUserItem[];

    // comment box
    commentText: string;
    setCommentText: (v: string) => void;

    // submit handlers
    handleUpdateSubmit: (e: React.FormEvent) => void;
    handleCommentSubmit: (e: React.FormEvent) => void;

    // mutation states / errors
    savingTicket: boolean;
    errorUpdate: unknown;
    postingComment: boolean;
    errorComment: unknown;
}

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

    // normalize ticket
    const rawTicket = data?.ticket ?? null;
    const ticket: TicketDetails | null = rawTicket ?? null;

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

    // status is a string so it binds cleanly with <select />
    const [status, setStatus] = useState<string>("");

    // assignee state
    const [assigneeId, setAssigneeId] = useState<string>(""); // "42" or ""
    const [assigneeName, setAssigneeName] = useState<string>(""); // e.g. "alice"
    const [assigneeQuery, setAssigneeQuery] = useState<string>(""); // text in input

    // dropdown visibility for user search
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
            const nm = ticket.assigneeUsername ?? "";
            setAssigneeId(idStr);
            setAssigneeName(nm);
            setAssigneeQuery(nm ? `${nm} (${idStr})` : idStr);
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
        // if empty, hide dropdown
        if (!assigneeQuery.trim()) {
            setShowUserDropdown(false);
            return;
        }

        // If assigneeQuery looks like a locked selection `"alice (12)"`,
        // don't auto-query unless user edits it.
        // A quick heuristic: ends with ")"
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

    // flatten + filter nulls from userSearchData
    const userSearchResults: SearchUserItem[] = (
        userSearchData?.searchUsers ?? []
    ).filter((u): u is SearchUserItem => Boolean(u));

    // -----------------------------
    // Handlers for assignee search/select
    // -----------------------------

    const handleAssigneeInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = e.target.value;
        // user is typing -> break the "locked" selection
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

    // -----------------------------
    // Add comment
    // -----------------------------
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
                // clear comment box
                setCommentText("");
                // DO NOT reset status/assignee; keep user's in-progress edits
                return refetch();
            })
            .catch(() => {
                // GraphQL error is surfaced by errorComment
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
                    assigneeId: assigneeId === "" ? null : Number(assigneeId),
                },
            },
        })
            .then(() => {
                // go back to ticket list, preserving filters
                console.log('Ticket created: ' + returnTo);
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
