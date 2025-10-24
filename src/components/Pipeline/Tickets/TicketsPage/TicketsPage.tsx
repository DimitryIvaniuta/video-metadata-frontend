// src/pages/Tickets/TicketsPage.tsx
import React, { useMemo, useState } from "react";
import { TicketStatus, useTicketsConnectionQuery } from "@/graphql/generated/graphql";
import { NavLink } from "react-router-dom";

const PAGE_SIZE = 10;

const TicketsPage = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<TicketStatus | undefined>(undefined);

    const { data, loading, refetch } = useTicketsConnectionQuery({
        variables: { page, pageSize: PAGE_SIZE, search, status },
        fetchPolicy: "cache-and-network",
    });

    const items = data?.connectionTickets?.items ?? [];
    const total = data?.connectionTickets?.total ?? 0;
    const pages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

    return (
        <div className="container py-3">
            <div className="d-flex gap-2 align-items-end mb-3">
                <div className="flex-grow-1">
                    <label className="form-label">Search</label>
                    <input className="form-control" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div>
                    <label className="form-label">Status</label>
                    <select className="form-select" value={status ?? ""} onChange={e => setStatus((e.target.value || undefined) as any)}>
                        <option value="">All</option>
                        {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <button className="btn btn-outline-primary" onClick={() => refetch({ page: 1, pageSize: PAGE_SIZE, search, status })}>
                    Apply
                </button>
                <NavLink to="/tickets/new" className="btn btn-success">New Ticket</NavLink>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead><tr><th>ID</th><th>Title</th><th>Status</th><th>Priority</th><th>Assignee</th><th>Updated</th></tr></thead>
                        <tbody>
                        {items.map(t => (
                            <tr key={t!.id}>
                                <td>{t!.id}</td>
                                <td><NavLink to={`/tickets/${t!.id}`}>{t!.title}</NavLink></td>
                                <td>{t!.status}</td>
                                <td>{t!.priority}</td>
                                <td>{t!.assigneeId ?? "—"}</td>
                                <td>{t!.updatedAt}</td>
                            </tr>
                        ))}
                        {!loading && items.length === 0 && <tr><td colSpan={6} className="text-center text-muted py-4">No tickets</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            <nav className="mt-3">
                <ul className="pagination">
                    <li className={`page-item ${page===1?"disabled":""}`}><button className="page-link" onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button></li>
                    <li className="page-item disabled"><span className="page-link">{page}/{pages}</span></li>
                    <li className={`page-item ${page>=pages?"disabled":""}`}><button className="page-link" onClick={()=>setPage(p=>Math.min(pages,p+1))}>Next</button></li>
                </ul>
            </nav>
        </div>
    );
};
export default TicketsPage;
