// src/pages/UserEditPage.tsx
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useGetUserQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    Role,
    UserStatus,
} from '@/graphql/generated/graphql';

interface FormState {
    username: string;
    email: string;
    roles: Role[];
    status: UserStatus;
}

interface FormErrors {
    username?: string;
    email?: string;
    server?: string;
}

export const UserEditPage: React.FC = ()=> {
    const { id } = useParams<{ id: string }>();
    const userId = Number(id);
    const navigate = useNavigate();

    // 1) Fetch user by ID :contentReference[oaicite:3]{index=3}
    const { data, loading, error } = useGetUserQuery({ variables: { id: userId } });
    const user = data?.user;

    // 2) Prepare mutations
    const [updateUser, { loading: updating, error: updateError }] = useUpdateUserMutation();
    const [deleteUser, { loading: deleting, error: deleteError }] = useDeleteUserMutation();

    // 3) Local form state & errors
    const [form, setForm] = useState<FormState>({
        username: '',
        email: '',
        roles: [],
        status: UserStatus.Active,
    });
    const [errors, setErrors] = useState<FormErrors>({});

    // 4) Populate form once data loads
    useEffect(() => {
        if (user) {
            setForm({
                username: user.username || '',
                email: user.email || '',
                roles: user.roles?.filter((r): r is Role => !!r) ?? [],
                status: user.status || UserStatus.Pending,
            });
        }
    }, [user]);

    // 5) Field change handler
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
            // now TS knows `target` is an HTMLInputElement with `.checked`
            const checked = target.checked;
            setForm(f => ({
                ...f,
                roles: checked
                    ? [...f.roles, value as Role]
                    : f.roles.filter(r => r !== value),
            }));
        } else {
            // for text inputs and selects
            setForm(f => ({
                ...f,
                [name]: target.value,
            } as Pick<FormState, keyof FormState>));
        }

        // clear any previous error for this field
        setErrors(err => ({ ...err, [name]: undefined, server: undefined }));
    };

    // 6) Basic validation
    const validate = (vals: FormState): FormErrors => {
        const errs: FormErrors = {};
        if (!vals.username.trim()) errs.username = 'Username is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)) {
            errs.email = 'Must be a valid email';
        }
        return errs;
    };

    // 7) Submit handler (update)
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const fieldErrs = validate(form);
        if (Object.keys(fieldErrs).length) {
            setErrors(fieldErrs);
            return;
        }
        try {
            await updateUser({
                variables: {
                    input: {
                        id: userId,
                        username: form.username,
                        email: form.email,
                        roles: form.roles,
                        status: form.status,
                    },
                },
            });
            navigate('/users', { replace: true });
        } catch {
            // GraphQL errors surface via updateError
        }
    };

    // 8) Delete handler
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteUser({ variables: { id: userId } });
            navigate('/users', { replace: true });
        } catch {
            // GraphQL errors surface via deleteError
        }
    };

    if (loading) return <p className="text-center mt-20">Loading user…</p>;
    if (error)   return <p className="text-center text-red-600">Error: {error.message}</p>;
    if (!user)   return <p className="text-center text-gray-500">User not found.</p>;

    const serverError = errors.server ?? updateError?.message ?? deleteError?.message;
    const isBusy = updating || deleting;

    return (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-8 space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">Edit User</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                    <label className="block text-gray-700 mb-1">Username</label>
                    <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.username ? 'border-danger' : 'border-gray-300'
                        }`}
                    />
                    {errors.username && (
                        <p className="mt-1 text-sm text-danger">{errors.username}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.email ? 'border-danger' : 'border-gray-300'
                        }`}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-danger">{errors.email}</p>
                    )}
                </div>

                {/* Roles */}
                <div>
                    <span className="block text-gray-700 mb-1">Roles</span>
                    <div className="flex space-x-4">
                        {Object.values(Role).map((r) => (
                            <label key={r} className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="roles"
                                    value={r}
                                    checked={form.roles.includes(r)}
                                    onChange={handleChange}
                                    className="form-checkbox h-5 w-5 text-primary"
                                />
                                <span className="ml-2 text-gray-700">{r}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-gray-700 mb-1">Status</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {Object.values(UserStatus).map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {serverError && (
                    <p className="text-center text-sm text-danger">{serverError}</p>
                )}

                {/* Actions */}
                <div className="flex justify-between space-x-4">
                    <button
                        type="submit"
                        disabled={isBusy}
                        className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                    >
                        {updating ? 'Saving…' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isBusy}
                        className="flex-1 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition disabled:opacity-50"
                    >
                        {deleting ? 'Deleting…' : 'Delete User'}
                    </button>
                </div>
            </form>
        </div>
    );
}
