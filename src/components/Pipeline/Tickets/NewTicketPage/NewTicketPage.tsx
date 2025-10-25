import React, { useState } from "react";
import { TicketPriority, useCreateTicketMutation } from "@/graphql/generated/graphql";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

type JwtPayload = { sub: string };

const NewTicketPage = () => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [priority, setPriority] = useState<TicketPriority>(TicketPriority.Medium);

    // const [createTicket, { loading }] = useCreateTicketMutation();
    const [createTicket, { loading, error }] = useCreateTicketMutation({
        refetchQueries: ["TicketsConnection"], // refetch list after create
        awaitRefetchQueries: true,
    });

    const { token } = useAuth();
    const navigate = useNavigate();

    const reporterId = (() => {
        try { return token ? Number((jwtDecode<JwtPayload>(token)).sub) : undefined; }
        catch { return undefined; }
    })();

    const submit = async (e: React.FormEvent) => {
        console.log('S1');
        e.preventDefault();
        console.log('S2');
        if (!reporterId) return;
        console.log('S1 reporterId: '+reporterId);
        const { data } = await createTicket({ variables: { reporterId, input: { title, description: desc, priority } } });
        if (data?.createTicket?.id) navigate(`/tickets/${data.createTicket.id}`);
    };

    return (
        <div className="container py-3">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">New Ticket</h5>
                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input className="form-control" value={title}
                                   onChange={e => setTitle(e.target.value)} required/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" rows={4} value={desc} onChange={e =>
                                setDesc(e.target.value)}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Priority</label>
                            <select className="form-select" value={priority} onChange={e =>
                                setPriority(e.target.value as TicketPriority)}>
                                {Object.values(TicketPriority)
                                    .map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <button className="btn btn-success" disabled={loading}>Create</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default NewTicketPage;
