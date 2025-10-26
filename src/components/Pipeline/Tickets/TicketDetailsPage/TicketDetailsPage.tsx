import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
} from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import {
    TicketStatus,
    useTicketByIdQuery,
    useUpdateTicketMutation,
    useAddTicketCommentMutation,
    useSearchUsersLazyQuery,
} from "@/graphql/generated/graphql";

import "./TicketDetailsPage.scss";

export const TicketDetailsPage: React.FC = () => {
    // -------------------------------------------------
    // Routing / navigation context (for "go back" UX)
    // -------------------------------------------------
    const { ticketId } = useParams<{ ticketId: string }>();
    const ticketIdNum = ticketId ? Number(ticketId) : NaN;

    const location = useLocation();
    const navigate = useNavigate();

    // This is passed from the tickets grid page:
    // <Link to={`/tickets/${id}`} state={{ returnTo: location.pathname + location.search }} />
    const returnTo: string =
        (location.state && (location.state as any).returnTo) || "/tickets";

    // -------------------------------------------------
    // GraphQL queries/mutations
    // -------------------------------------------------

    // Ticket details (includes comments)
    const {
        data,
        loading,
        error,
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

    // Update ticket mutation
    const [updateTicket, { loading: savingTicket, error: errorUpdate }] =
        useUpdateTicketMutation({
            // warm the grid before we navigate back
            refetchQueries: ["TicketsConnection", "TicketsCount"],
            awaitRefetchQueries: true,
        });

    // Add comment mutation
    const [addComment, { loading: postingComment, error: errorComment }] =
        useAddTicketCommentMutation({
            refetchQueries: ["TicketById"],
            awaitRefetchQueries: true,
        });

    // Lazy user search query for assignee dropdown
    const [runUserSearch, { data: userSearchData }] =
        useSearchUsersLazyQuery();

    // -------------------------------------------------
    // Local editable form state
    // -------------------------------------------------

    // status field
    const [status, setStatus] = useState<string>("");

    // assignee selection
    const [assigneeId, setAssigneeId] = useState<string>(""); // numeric id stored as string or ""
    const [assigneeName, setAssigneeName] = useState<string>(""); // username string

    // string shown in the assignee input field.
    // We'll render `${assigneeName} (${assigneeId})` if we have both.
    const [assigneeQuery, setAssigneeQuery] = useState<string>("");

    // comment compose box
    const [commentText, setCommentText] = useState<string>("");

    // dropdown UI state
    const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // We only want to "initialize" the edit form from ticket data ONCE,
    // so that after refetch (like after adding a comment) we don't blow away
    // whatever the user already picked.
    const initializedRef = useRef<boolean>(false);

    useEffect(() => {
        if (!ticket) return;
        if (initializedRef.current) return; // do not clobber user edits after first load

        // init status field
        setStatus(ticket.status ?? "");

        // init assignee info
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

    // -------------------------------------------------
    // Debounced assignee search
    // -------------------------------------------------

    // whenever user types in assignee box, wait 300ms then query backend
    useEffect(() => {
        // if the user cleared it, hide dropdown
        if (!assigneeQuery.trim()) {
            setShowUserDropdown(false);
            return;
        }

        // If they're just seeing the "pretty" value like "alex (15)" from selection,
        // we don't auto-search that until they change it.
        // Heuristic: if it ends with ")": treat as chosen.
        if (/\)\s*$/.test(assigneeQuery)) {
            return;
        }

        // start dropdown
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

    // click outside dropdown to close
    useEffect(() => {
        function handleDocClick(e: MouseEvent) {
            if (!showUserDropdown) return;
            if (!dropdownRef.current) return;

            if (!dropdownRef.current.contains(e.target as Node)) {
                setShowUserDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleDocClick);
        return () => document.removeEventListener("mousedown", handleDocClick);
    }, [showUserDropdown]);

    // -------------------------------------------------
    // Event handlers
    // -------------------------------------------------

    const handleStatusChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setStatus(e.target.value);
    };

    const handleAssigneeInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = e.target.value;
        // user is actively typing -> it's no longer the locked "name (id)" string,
        // so wipe internal selection until they pick again
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
                // we intentionally DO NOT reset assignee/status here
                // because initializedRef.current stays true
                return refetch();
            })
            .catch(() => {
                /* handled by errorComment */
            });
    };

    // After saving ticket changes:
    // 1. We trigger updateTicket mutation.
    // 2. Apollo refetches TicketsConnection/TicketsCount (because of hook config).
    // 3. We navigate back to the tickets grid using `returnTo` so the user
    //    sees the updated row in context.
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
                navigate(returnTo, { replace: true });
            })
            .catch(() => {
                // errorUpdate already contains the GraphQL error
            });
    };

    // -------------------------------------------------
    // Render states (loading/error/not found)
    // -------------------------------------------------

    if (loading && !ticket) {
        return (
            <div className="ticket-details-container">
                <div className="ticket-card">Loading ticket…</div>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="ticket-details-container">
                <div className="ticket-card text-danger">
                    {error ? error.message : "Ticket not found"}
                </div>
            </div>
        );
    }

    // prettified timestamps
    const createdAt = ticket.createdAt
        ? new Date(ticket.createdAt).toLocaleString()
        : "—";
    const updatedAt = ticket.updatedAt
        ? new Date(ticket.updatedAt).toLocaleString()
        : "—";

    const comments = ticket.comments ?? [];

    const searchResults = userSearchData?.searchUsers ?? [];

    return (
        <div className="ticket-details-container">
            {/* MAIN CARD */}
            <div className="ticket-card">
                <div className="ticket-header">
                    <div className="ticket-header-main">
                        <h3 className="ticket-title">{ticket.title || "(Untitled)"}</h3>

                        <div className="ticket-meta-line">
              <span className="badge bg-light border">
                Status: {ticket.status ?? "UNKNOWN"}
              </span>

                            <span className="badge bg-light border">
                Priority: {ticket.priority ?? "N/A"}
              </span>

                            <span className="badge bg-light border">
                Reporter ID: {ticket.reporterId ?? "?"}
              </span>

                            <span className="badge bg-light border">
                Assignee:&nbsp;
                                {ticket.assigneeUsername
                                    ? `${ticket.assigneeUsername} (${ticket.assigneeId ?? "?"})`
                                    : ticket.assigneeId != null
                                        ? `(${ticket.assigneeId})`
                                        : "Unassigned"}
              </span>
                        </div>
                    </div>

                    <div className="ticket-header-times">
                        <small>
                            <strong>Created:</strong> {createdAt}
                        </small>
                        <small>
                            <strong>Updated:</strong> {updatedAt}
                        </small>
                    </div>
                </div>

                {/* DESCRIPTION + UPDATE FORM */}
                <div className="ticket-body">
                    <div className="ticket-desc-block">
                        <h5>Description</h5>
                        <p className="ticket-description">
                            {ticket.description || "No description provided."}
                        </p>
                    </div>

                    {/* UPDATE FORM */}
                    <form
                        className="ticket-update-form p-3 mb-3"
                        onSubmit={handleUpdateSubmit}
                    >
                        <h6>Edit Ticket</h6>

                        {errorUpdate && (
                            <div className="alert alert-danger">
                                {errorUpdate.message}
                            </div>
                        )}

                        <div className="row g-3">
                            {/* STATUS SELECT */}
                            <div className="col-12 col-md-4">
                                <label htmlFor="status" className="form-label">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    className="form-select"
                                    value={status}
                                    disabled={savingTicket}
                                    onChange={handleStatusChange}
                                >
                                    {Object.values(TicketStatus).map((st) => (
                                        <option key={st} value={st}>
                                            {st.charAt(0) + st.slice(1).toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* ASSIGNEE SEARCH/SELECT */}
                            <div className="col-12 col-md-5 position-relative" ref={dropdownRef}>
                                <label htmlFor="assigneeQuery" className="form-label">
                                    Assign to
                                </label>

                                <div className="d-flex flex-column">
                                    <div className="d-flex w-100">
                                        <input
                                            id="assigneeQuery"
                                            className="form-control"
                                            placeholder="Search username…"
                                            value={assigneeQuery}
                                            disabled={savingTicket}
                                            onChange={handleAssigneeInputChange}
                                            onFocus={() => {
                                                if (assigneeQuery.trim()) {
                                                    setShowUserDropdown(true);
                                                }
                                            }}
                                        />
                                        {assigneeId && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary ms-2"
                                                disabled={savingTicket}
                                                onClick={handleClearAssignee}
                                                title="Clear assignee"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>

                                    {showUserDropdown && searchResults.length > 0 && (
                                        <ul
                                            className="list-group mt-2"
                                            style={{
                                                position: "absolute",
                                                top: "100%",
                                                left: 0,
                                                right: 0,
                                                zIndex: 10,
                                                maxHeight: "200px",
                                                overflowY: "auto",
                                            }}
                                        >
                                            {searchResults.map((u) =>
                                                u ? (
                                                    <li
                                                        key={u.id ?? "unknown"}
                                                        className="list-group-item list-group-item-action"
                                                        role="button"
                                                        onMouseDown={(e) => {
                                                            // onMouseDown so the input doesn't lose focus before we set state
                                                            e.preventDefault();
                                                            if (u.id != null && u.username) {
                                                                handlePickAssignee(u.id, u.username);
                                                            }
                                                        }}
                                                    >
                                                        <div className="fw-semibold">
                                                            {u.username ?? "(no username)"}
                                                        </div>
                                                        <div className="text-muted small">
                                                            ID: {u.id ?? "?"}
                                                        </div>
                                                    </li>
                                                ) : null,
                                            )}
                                        </ul>
                                    )}

                                    <small className="form-text">
                                        Selected:{" "}
                                        {assigneeId
                                            ? assigneeName
                                                ? `${assigneeName} (${assigneeId})`
                                                : `(${assigneeId})`
                                            : "none"}
                                    </small>
                                </div>
                            </div>

                            {/* SAVE CHANGES BUTTON */}
                            <div className="col-12 col-md-3 d-flex align-items-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={savingTicket}
                                    title="Save and return to tickets list"
                                >
                                    {savingTicket ? "Saving…" : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* COMMENTS CARD */}
            <div className="ticket-card">
                <div className="ticket-comments-header">
                    <h4>Comments</h4>
                    <small>{comments.length} total</small>
                </div>

                <div className="ticket-comments-body">
                    {comments.length === 0 && (
                        <div className="fst-italic text-muted">
                            No comments yet.
                        </div>
                    )}

                    {comments.map((c) =>
                            c ? (
                                <div key={c.id ?? Math.random()} className="ticket-comment-row">
                                    <div className="ticket-comment-meta">
                  <span className="badge">
                    Author:&nbsp;
                      {c.authorUsername
                          ? `${c.authorUsername} (${c.authorId ?? "?"})`
                          : c.authorId != null
                              ? `(${c.authorId})`
                              : "Unknown"}
                  </span>
                                        <small>
                                            {c.createdAt
                                                ? new Date(c.createdAt).toLocaleString()
                                                : ""}
                                        </small>
                                    </div>
                                    <p className="ticket-comment-body">{c.body}</p>
                                </div>
                            ) : null,
                    )}

                    {/* ADD COMMENT */}
                    <form
                        className="ticket-comment-form mt-4"
                        onSubmit={handleCommentSubmit}
                    >
                        {errorComment && (
                            <div className="alert alert-danger">
                                {errorComment.message}
                            </div>
                        )}

                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Add a comment…"
                                value={commentText}
                                disabled={postingComment}
                                maxLength={500}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button
                                className="btn btn-outline-primary"
                                disabled={postingComment || !commentText.trim()}
                                title="Add comment"
                            >
                                {postingComment ? "Posting…" : "Comment"}
                            </button>
                        </div>

                        <div className="form-text">
                            Your identity is taken from the authenticated session.
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
