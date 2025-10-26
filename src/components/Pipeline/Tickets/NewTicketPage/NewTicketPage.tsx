import React, { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    TicketPriority,
    TicketPriority as TicketPriorityEnum,
    useCreateTicketMutation,
} from "@/graphql/generated/graphql";

import "./NewTicketPage.scss";

type FormState = {
    title: string;
    description: string;
    priority: TicketPriority;
};

type FormErrors = {
    title?: string;
    description?: string;
    priority?: string;
};

export const NewTicketPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // where to go back after success
    const returnTo: string =
        (location.state && (location.state as any).returnTo) || "/tickets";

    const [form, setForm] = useState<FormState>({
        title: "",
        description: "",
        priority: TicketPriorityEnum.Medium,
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const [createTicket, { loading, error }] = useCreateTicketMutation({
        // still refetch so list is hot when we go back
        refetchQueries: ["TicketsConnection", "TicketsCount"],
        awaitRefetchQueries: true,
    });

    // client-side validation
    const validate = (values: FormState): FormErrors => {
        const errs: FormErrors = {};
        if (!values.title.trim()) {
            errs.title = "Title is required.";
        }
        if (!values.description.trim()) {
            errs.description = "Description is required.";
        }
        if (
            !values.priority ||
            !Object.values(TicketPriorityEnum).includes(values.priority)
        ) {
            errs.priority = "Please select a valid priority.";
        }
        return errs;
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setForm((f) => ({
            ...f,
            [name]:
                name === "priority"
                    ? (value as TicketPriorityEnum)
                    : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    /**
     * Generic helper that:
     *  - inspects mutation result,
     *  - optionally logs/telemetry,
     *  - then routes back to ticket list.
     *
     * You can extend this later (toast "Ticket #123 created", etc.)
     */
    const handleMutationResult = (result: any) => {
        // OPTIONAL: pull new ticket id for analytics/telemetry
        const newId = result?.data?.createTicket?.id;
        console.debug("Ticket created:", newId);

        // In a real product you'd fire a toast here, or
        // push to an audit log service, etc.

        // Navigate back to where user came from
        navigate(returnTo, { replace: true });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const fieldErrors = validate(form);
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return;
        }

        // fire mutation
        createTicket({
            variables: {
                input: {
                    title: form.title.trim(),
                    description: form.description.trim(),
                    priority: form.priority,
                },
            },
        })
            .then(handleMutationResult)
            .catch(() => {
                // GraphQL error already exposed via `error`
                // but we intentionally swallow here so we don't blow up the UI
            });
    };

    return (
        <div className="new-ticket-container">
            <div>
                <h2 className="new-ticket-card">Create New Ticket</h2>

                <form onSubmit={handleSubmit} className="new-ticket-form">
                    {/* Title */}
                    <div className="ticket-input">
                        <label htmlFor="title" className="form-label">
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={form.title}
                            onChange={handleChange}
                            disabled={loading}
                            className={`form-input ${errors.title ? "error" : ""}`}
                            placeholder={`Short summary (e.g. "Player crashes on MKV")`}
                        />
                        {errors.title && (
                            <p className="text-danger text-sm">{errors.title}</p>
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
                            value={form.description}
                            onChange={handleChange}
                            disabled={loading}
                            className={`form-textarea ${
                                errors.description ? "error" : ""
                            }`}
                            placeholder="Steps to reproduce, expected vs actual behavior…"
                        />
                        {errors.description && (
                            <p className="text-danger text-sm">
                                {errors.description}
                            </p>
                        )}
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
                            disabled={loading}
                            className={`form-select ${errors.priority ? "error" : ""}`}
                        >
                            {Object.values(TicketPriorityEnum).map((p) => (
                                <option key={p} value={p}>
                                    {p.charAt(0) + p.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                        {errors.priority && (
                            <p className="text-danger text-sm">{errors.priority}</p>
                        )}
                    </div>

                    {/* Server error */}
                    {error && (
                        <div className="text-danger text-sm text-center">
                            {error.message}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-create-ticket"
                    >
                        {loading ? "Creating…" : "Create Ticket"}
                    </button>
                </form>
            </div>
        </div>
    );
};
