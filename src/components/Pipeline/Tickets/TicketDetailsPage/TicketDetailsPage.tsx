import React, { FormEvent, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    TicketStatus,
    useTicketByIdQuery,
    useUpdateTicketMutation,
    useAddTicketCommentMutation,
    TicketByIdDocument,
    TicketsConnectionDocument,
} from "@/graphql/generated/graphql";
import "./TicketDetailsPage.scss";

/**
 * Small util: safe number parsing from route param.
 * If NaN -> undefined, and we won't query.
 */
function parseIdParam(v: string | undefined): number | undefined {
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
}

export const TicketDetailsPage: React.FC = () => {
    // --- get ticketId from route ---
    const { ticketId: ticketIdParam } = useParams<{ ticketId: string }>();
    const ticketIdNum = useMemo(() => parseIdParam(ticketIdParam), [ticketIdParam]);

    // If ticketId is invalid, we render an error immediately
    const skipQuery = ticketIdNum === undefined;

    // --- load ticket details (with comments) ---
    const {
        data,
        loading: loadingTicket,
        error: errorTicket,
        refetch,
    } = useTicketByIdQuery({
        variables: {
            id: ticketIdNum ?? 0,
            includeComments: true,
        },
        skip: skipQuery,
        fetchPolicy: "cache-and-network",
    });

    const ticket = data?.ticket;

    // --- UPDATE TICKET form state ---
    const [status, setStatus] = useState<TicketStatus | "">(
        ticket?.status ?? ""
    );
    const [assigneeId, setAssigneeId] = useState<number | "">(
        ticket?.assigneeId ?? ""
    );

    const [updateTicket, { loading: savingTicket, error: errorUpdate }] =
        useUpdateTicketMutation({
            refetchQueries: ["TicketById", "TicketsConnection"],
            awaitRefetchQueries: true,
        });

    const handleUpdateSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!ticketIdNum) return;
        try {
            await updateTicket({
                variables: {
                    input: {
                        id: ticketIdNum,
                        status: status === "" ? null : (status as TicketStatus),
                        assigneeId: assigneeId === "" ? null : Number(assigneeId),
                    },
                },
            });
            // after successful update, refresh local query so UI shows new state
            await refetch();
        } catch {
            // graphql errors are surfaced via errorUpdate
        }
    };

    // Keep status/assignee inputs synced when ticket data first loads
    React.useEffect(() => {
        if (ticket?.status && status === "") {
            setStatus(ticket.status);
        }
        if (
            ticket &&
            (assigneeId === "" || assigneeId === undefined) &&
            ticket.assigneeId != null
        ) {
            setAssigneeId(ticket.assigneeId);
        }
    }, [ticket, status, assigneeId]);

    // --- ADD COMMENT form state ---
    const [commentText, setCommentText] = useState("");

    const [addComment, { loading: postingComment, error: errorComment }] =
        useAddTicketCommentMutation({
            refetchQueries: ["TicketById"],
            awaitRefetchQueries: true,
        });

    const handleCommentSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!ticketIdNum) return;
        if (!commentText.trim()) return;

        try {
            await addComment({
                variables: {
                    input: {
                        ticketId: ticketIdNum,
                        body: commentText.trim(),
                    },
                },
            });
            setCommentText("");
            await refetch();
        } catch {
            // graphql errors in errorComment
        }
    };

    // --- RENDER ---

    // invalid ticket id in URL
    if (skipQuery) {
        return (
            <div className="ticket-details-container">
                <div className="alert alert-danger">
                    Invalid ticket id in URL.
                </div>
            </div>
        );
    }

    // loading main ticket
    if (loadingTicket && !ticket) {
        return (
            <div className="ticket-details-container">
                <div className="ticket-card shadow-sm p-3">
                    <div className="text-muted">Loading ticket…</div>
                </div>
            </div>
        );
    }

    // error loading main ticket
    if (errorTicket) {
        return (
            <div className="ticket-details-container">
                <div className="alert alert-danger">
                    Failed to load ticket: {errorTicket.message}
                </div>
            </div>
        );
    }

    // not found
    if (!ticket) {
        return (
            <div className="ticket-details-container">
                <div className="alert alert-warning">Ticket not found.</div>
            </div>
        );
    }

    return (
        <div className="ticket-details-container">
            {/* Ticket summary card */}
            <div className="ticket-card shadow-sm">
                <div className="ticket-header">
                    <div className="ticket-header-main">
                        <h2 className="ticket-title">
                            Ticket #{ticket.id} – {ticket.title ?? "(no title)"}
                        </h2>
                        <div className="ticket-meta-line">
              <span className="badge bg-secondary me-2">
                Status: {ticket.status ?? "N/A"}
              </span>
                            <span className="badge bg-info text-dark me-2">
                Priority: {ticket.priority ?? "N/A"}
              </span>
                            <span className="badge bg-light text-dark border me-2">
                Reporter: {ticket.reporterId ?? "?"}
              </span>
                            <span className="badge bg-light text-dark border">
                Assignee: {ticket.assigneeId ?? "—"}
              </span>
                        </div>
                    </div>
                    <div className="ticket-header-times text-muted">
                        <div>
                            <small>
                                Created:&nbsp;
                                {ticket.createdAt ?? "—"}
                            </small>
                        </div>
                        <div>
                            <small>
                                Updated:&nbsp;
                                {ticket.updatedAt ?? "—"}
                            </small>
                        </div>
                    </div>
                </div>

                <div className="ticket-body">
                    <div className="ticket-desc-block">
                        <h5 className="mb-2">Description</h5>
                        <p className="ticket-description">
                            {ticket.description || <em>No description provided.</em>}
                        </p>
                    </div>

                    {/* Update ticket form (status / assignee) */}
                    <form onSubmit={handleUpdateSubmit} className="ticket-update-form card p-3">
                        <h6 className="mb-3">Update Ticket</h6>

                        {errorUpdate && (
                            <div className="alert alert-danger py-2">
                                Failed to update: {errorUpdate.message}
                            </div>
                        )}

                        <div className="row">
                            <div className="col-12 col-md-4 mb-3">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    value={status || ""}
                                    onChange={(e) =>
                                        setStatus(e.target.value as TicketStatus)
                                    }
                                    disabled={savingTicket}
                                >
                                    {Object.values(TicketStatus).map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12 col-md-4 mb-3">
                                <label className="form-label">Assignee ID</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={assigneeId}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setAssigneeId(v === "" ? "" : Number(v));
                                    }}
                                    disabled={savingTicket}
                                    placeholder="User ID or blank"
                                />
                            </div>

                            <div className="col-12 col-md-4 mb-3 d-flex align-items-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={savingTicket}
                                >
                                    {savingTicket ? "Saving…" : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Comments card */}
            <div className="ticket-card shadow-sm mt-4">
                <div className="ticket-comments-header">
                    <h4 className="mb-0">Comments</h4>
                    <small className="text-muted ms-2">
                        ({ticket.comments?.length ?? 0})
                    </small>
                </div>

                <div className="ticket-comments-body">
                    {ticket.comments && ticket.comments.length > 0 ? (
                        ticket.comments.map((c, idx) =>
                                c ? (
                                    <div key={idx} className="ticket-comment-row">
                                        <div className="ticket-comment-meta">
                    <span className="badge bg-light text-dark border me-2">
                      Author: {c.authorId ?? "?"}
                    </span>
                                            <small className="text-muted">
                                                {c.createdAt ?? "—"}
                                            </small>
                                        </div>
                                        <div className="ticket-comment-body">
                                            {c.body || <em>(empty)</em>}
                                        </div>
                                    </div>
                                ) : null
                        )
                    ) : (
                        <div className="text-muted fst-italic">
                            No comments yet.
                        </div>
                    )}

                    {/* Add new comment */}
                    <form
                        onSubmit={handleCommentSubmit}
                        className="ticket-comment-form mt-3"
                    >
                        {errorComment && (
                            <div className="alert alert-danger py-2">
                                Failed to add comment: {errorComment.message}
                            </div>
                        )}

                        <div className="input-group">
                            <input
                                className="form-control"
                                placeholder="Write a comment…"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                disabled={postingComment}
                            />
                            <button
                                className="btn btn-outline-primary"
                                disabled={
                                    postingComment ||
                                    !commentText.trim()
                                }
                            >
                                {postingComment ? "Posting…" : "Post"}
                            </button>
                        </div>

                        <div className="form-text text-muted">
                            You’re posting as the currently authenticated user. Your userId
                            is resolved on the server side (no JWT parsing in the UI).
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
