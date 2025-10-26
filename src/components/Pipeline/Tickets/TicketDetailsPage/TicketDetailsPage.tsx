import React, { useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";

import { TicketStatus } from "@/graphql/generated/graphql";
import {
    useTicketDetailsActions,
    TicketCommentItem,
    SearchUserItem,
} from "./hooks/useTicketDetailsActions";

import "./TicketDetailsPage.scss";

/**
 * Turn any GraphQL/network error into a readable string.
 */
function toErrorMessage(err: unknown): string {
    if (!err) return "";
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message;
    if (typeof err === "object" && "message" in (err as any)) {
        const m = (err as any).message;
        if (typeof m === "string") return m;
    }
    try {
        return JSON.stringify(err);
    } catch {
        return String(err);
    }
}

export const TicketDetailsPage: React.FC = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const ticketIdNum = ticketId ? Number(ticketId) : NaN;

    // Tickets list should navigate here like:
    // <Link to={`/tickets/${t.id}`} state={{ returnTo: location.pathname + location.search }} />
    const location = useLocation();
    const returnTo: string =
        (location.state && (location.state as any).returnTo) || "/tickets";

    const {
        ticket,
        loadingTicket,
        errorTicket,

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
    } = useTicketDetailsActions(ticketIdNum, returnTo);

    // For closing the assignee dropdown when clicking outside
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleDocClick(e: MouseEvent) {
            if (!showUserDropdown) return;
            if (!dropdownRef.current) return;
            if (!dropdownRef.current.contains(e.target as Node)) {
                setShowUserDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleDocClick);
        return () => {
            document.removeEventListener("mousedown", handleDocClick);
        };
    }, [showUserDropdown, setShowUserDropdown]);

    // Normalize human-readable error messages for safe rendering
    const ticketErrorMsg = errorTicket ? toErrorMessage(errorTicket) : "";
    const updateErrorMsg = errorUpdate ? toErrorMessage(errorUpdate) : "";
    const commentErrorMsg = errorComment ? toErrorMessage(errorComment) : "";

    // Loading / not found states
    if (loadingTicket && !ticket) {
        return (
            <div className="ticket-details-container">
                <div className="ticket-card">Loading ticket…</div>
            </div>
        );
    }

    if (ticketErrorMsg || !ticket) {
        return (
            <div className="ticket-details-container">
                <div className="ticket-card text-danger">
                    {ticketErrorMsg || "Ticket not found"}
                </div>
            </div>
        );
    }

    // Render-friendly timestamps
    const createdAt = ticket.createdAt
        ? new Date(ticket.createdAt).toLocaleString()
        : "—";
    const updatedAt = ticket.updatedAt
        ? new Date(ticket.updatedAt).toLocaleString()
        : "—";

    // Comments array, filtered to non-null and typed
    const comments: TicketCommentItem[] = (ticket.comments ?? []).filter(
        (c): c is TicketCommentItem => Boolean(c),
    );

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
                Reporter:&nbsp;
                                {ticket.reporterUsername
                                    ? `${ticket.reporterUsername} (${ticket.reporterId ?? "?"})`
                                    : ticket.reporterId != null
                                        ? `(${ticket.reporterId})`
                                        : "Unknown"}
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
                    {/* Description */}
                    <div className="ticket-desc-block">
                        <h5>Description</h5>
                        <p className="ticket-description">
                            {ticket.description || "No description provided."}
                        </p>
                    </div>

                    {/* UPDATE TICKET FORM */}
                    <form
                        className="ticket-update-form p-3 mb-3"
                        onSubmit={handleUpdateSubmit}
                    >
                        <h6>Edit Ticket</h6>

                        {updateErrorMsg && (
                            <div className="alert alert-danger">{updateErrorMsg}</div>
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
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    {(Object.values(TicketStatus) as TicketStatus[]).map(
                                        (st: TicketStatus) => (
                                            <option key={st} value={st}>
                                                {st.charAt(0) + st.slice(1).toLowerCase()}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>

                            {/* ASSIGNEE SEARCH/SELECT */}
                            <div
                                className="col-12 col-md-5 position-relative"
                                ref={dropdownRef}
                            >
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

                                    {showUserDropdown && userSearchResults.length > 0 && (
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
                                            {userSearchResults.map((u: SearchUserItem) => (
                                                <li
                                                    key={u.id ?? "unknown"}
                                                    className="list-group-item list-group-item-action"
                                                    role="button"
                                                    onMouseDown={(evt) => {
                                                        // prevent blur before click fires
                                                        evt.preventDefault();
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
                                            ))}
                                        </ul>
                                    )}

                                    <small className="form-text">
                                        Selected:&nbsp;
                                        {assigneeId
                                            ? assigneeName
                                                ? `${assigneeName} (${assigneeId})`
                                                : `(${assigneeId})`
                                            : "none"}
                                    </small>
                                </div>
                            </div>

                            {/* SAVE CHANGES */}
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
                        <div className="fst-italic text-muted">No comments yet.</div>
                    )}

                    {comments.map((c: TicketCommentItem) => (
                        <div key={c.id ?? Math.random()} className="ticket-comment-row">
                            <div className="ticket-comment-meta">
                <span className="badge bg-light border me-2">
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
                    ))}

                    {/* ADD COMMENT */}
                    <form
                        className="ticket-comment-form mt-4"
                        onSubmit={handleCommentSubmit}
                    >
                        {commentErrorMsg && (
                            <div className="alert alert-danger">{commentErrorMsg}</div>
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
                            Your identity comes from the authenticated session.
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
