import React, { useState } from "react";
import {
    TicketStatus,
    useAddTicketCommentMutation,
    useTicketByIdQuery,
    useUpdateTicketMutation
} from "@/graphql/generated/graphql";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

type JwtPayload = { sub: string };

const TicketDetailsPage = () => {
    const { id } = useParams();
    const ticketId = Number(id);
    const { data, loading, refetch } = useTicketByIdQuery({ variables: { id: ticketId, includeComments: true } });
    const [updateTicket] = useUpdateTicketMutation();
    const [addComment] = useAddTicketCommentMutation();
    const [body, setBody] = useState("");
    const { token } = useAuth();
    const myId = (() => { try { return token ? Number((jwtDecode<JwtPayload>(token)).sub) : undefined; } catch { return undefined; } })();

    if (loading || !data?.ticket) return <div className="container py-3">Loading…</div>;
    const t = data.ticket;

    const setStatus = async (s: TicketStatus) => {
        await updateTicket({ variables: { input: { id: t.id!, status: s } } });
        refetch();
    };
    const setAssignee = async (assigneeId: number | null) => {
        await updateTicket({ variables: { input: { id: t.id!, assigneeId } } });
        refetch();
    };
    const submitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!myId || !body.trim()) return;
        await addComment({ variables: { authorId: myId, input: { ticketId, body } } });
        setBody("");
        refetch();
    };

    return (
        <div className="container py-3">
            <div className="card mb-3"><div className="card-body">
                <h5 className="card-title mb-0">{t.title}</h5>
                <div className="text-muted small">#{t.id} • priority {t.priority} • reporter {t.reporterId}</div>
                <p className="mt-3">{t.description}</p>

                <div className="d-flex gap-2">
                    <div className="btn-group">
                        {Object.values(TicketStatus).map(s =>
                            <button key={s} className={`btn btn-sm btn-outline-primary ${t.status===s?"active":""}`} onClick={()=>setStatus(s)}>{s}</button>
                        )}
                    </div>
                    <button className="btn btn-sm btn-outline-secondary" onClick={()=>setAssignee(myId ?? null)}>Assign to me</button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={()=>setAssignee(null)}>Unassign</button>
                </div>
            </div></div>
            <div className="card">
                <div className="card-body">
                    <h6 className="card-title">Comments</h6>
                    <ul className="list-group mb-3">
                        {(t.comments ?? []).map(c => (
                            <li key={c!.id} className="list-group-item">
                                <div className="small text-muted">by {c!.authorId} • {c!.createdAt}</div>
                                <div>{c!.body}</div>
                            </li>
                        ))}
                        {(!t.comments || t.comments.length === 0) &&
                            <li className="list-group-item text-muted">No comments</li>}
                    </ul>
                    <form onSubmit={submitComment} className="d-flex gap-2">
                        <input className="form-control" value={body} onChange={e => setBody(e.target.value)}
                               placeholder="Write a comment…"/>
                        <button className="btn btn-primary" disabled={!myId || !body.trim()}>Post</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default TicketDetailsPage;
