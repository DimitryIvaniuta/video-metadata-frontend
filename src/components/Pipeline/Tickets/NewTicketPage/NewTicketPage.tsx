import React, { FormEvent, useState } from "react";
import {
    TicketPriority,
    useCreateTicketMutation,
} from "@/graphql/generated/graphql";
import "./NewTicketPage.scss";

type TicketFormState = {
    title: string;
    description: string;
    priority: TicketPriority;
};

type TicketFormErrors = {
    title?: string;
};

type NewTicketPageProps = {
    onCreated?: () => void;
};

const priorities: TicketPriority[] = Object.values(TicketPriority).filter(
    (p): p is TicketPriority => true,
);

const formatPriority = (p: TicketPriority): string => {
    const lower = p.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
};

export const NewTicketPage: React.FC<NewTicketPageProps> = ({ onCreated }) => {
    const [form, setForm] = useState<TicketFormState>({
        title: "",
        description: "",
        priority: TicketPriority.Medium,
    });

    const [errors, setErrors] = useState<TicketFormErrors>({});

    const [createTicket, { data, loading, error }] = useCreateTicketMutation({
        refetchQueries: ["TicketsConnection"],
        awaitRefetchQueries: true,
    });

    const validate = (values: TicketFormState): TicketFormErrors => {
        const errs: TicketFormErrors = {};
        if (!values.title.trim()) {
            errs.title = "Title is required.";
        }
        return errs;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setForm((f) => ({
            ...f,
            [name]:
                name === "priority"
                    ? (value as TicketPriority)
                    : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const fieldErrors = validate(form);
        if (Object.keys(fieldErrors).length) {
            setErrors(fieldErrors);
            return;
        }

        try {
            await createTicket({
                variables: {
                    input: {
                        title: form.title,
                        description: form.description,
                        priority: form.priority,
                    },
                },
            });

            onCreated?.();

            // reset form after success
            setForm({
                title: "",
                description: "",
                priority: TicketPriority.Medium,
            });
        } catch {
            // GraphQL error exposed via `error`
        }
    };

    return (
        <div className="new-ticket-container">
            <div>
                <h2 className="new-ticket-card">Create Support Ticket</h2>

                <form onSubmit={handleSubmit} className="new-ticket-form">
                    {/* Title */}
                    <div className="ticket-input">
                        <label htmlFor="title" className="form-label">
                            Title <span className="text-danger">*</span>
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={form.title}
                            onChange={handleChange}
                            className={`form-input ${errors.title ? "error" : ""}`}
                            placeholder="Short summary of the problem"
                            disabled={loading}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-danger">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="ticket-input">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={form.description}
                            onChange={handleChange}
                            className="form-textarea"
                            placeholder="Steps to reproduce, expected vs actual, etc."
                            disabled={loading}
                        />
                    </div>

                    {/* Priority */}
                    <div className="ticket-input">
                        <label htmlFor="priority" className="form-label">
                            Priority
                        </label>
                        <select
                            id="priority"
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            className="form-select"
                            disabled={loading}
                        >
                            {priorities.map((p) => (
                                <option key={p} value={p}>
                                    {formatPriority(p)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Server error */}
                    {error && (
                        <p className="text-center text-sm text-danger">{error.message}</p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-create-ticket"
                    >
                        {loading ? "Submitting…" : "Create Ticket"}
                    </button>
                </form>

                {data?.createTicket && (
                    <div className="ticket-success">
                        <h3 className="ticket-success-title">Ticket Created!</h3>
                        <p>
                            <strong>ID:</strong> {data.createTicket.id}
                        </p>
                        <p>
                            <strong>Title:</strong> {data.createTicket.title}
                        </p>
                        <p>
                            <strong>Status:</strong> {data.createTicket.status}
                        </p>
                        <p>
                            <strong>Priority:</strong> {data.createTicket.priority}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
