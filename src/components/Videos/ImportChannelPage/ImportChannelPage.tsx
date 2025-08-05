import React, { useState, ChangeEvent, FormEvent } from 'react';
import { VideoProvider, useImportVideosByPublisherMutation } from '@/graphql/generated/graphql';

interface FormState {
    provider: VideoProvider;
    channelId: string;
}

interface FormErrors {
    provider?: string;
    channelId?: string;
    server?: string;
}

export const ImportChannelPage: React.FC = () => {
    // Extract enum values in a type-safe way
    const providers: VideoProvider[] = Object
        .values(VideoProvider)
        .filter((v): v is VideoProvider => typeof v === 'string');

    // React state for form values & errors
    const [form, setForm] = useState<FormState>({
        provider: providers[0],
        channelId: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [importChannel, { data, loading, error }] = useImportVideosByPublisherMutation();

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(f => ({
            ...f,
            [name]: name === 'provider' ? (value as VideoProvider) : value,
        }));
        setErrors(err => ({ ...err, [name]: undefined, server: undefined }));
    };

    // Basic validation logic
    const validate = (values: FormState): FormErrors => {
        const errs: FormErrors = {};
        if (!providers.includes(values.provider)) {
            errs.provider = 'Please select a valid provider.';
        }
        if (!values.channelId.trim()) {
            errs.channelId = 'Channel ID cannot be empty.';
        }
        return errs;
    };

    // Submit handler
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const fieldErrors = validate(form);
        if (Object.keys(fieldErrors).length) {
            setErrors(fieldErrors);
            return;
        }
        try {
            await importChannel({ variables: { publisherName: form.channelId } });
            // Clear only the channelId
            setForm(f => ({ ...f, channelId: '' }));
        } catch {
            // GraphQL errors appear in `error`
        }
    };

    // Format enum to human-readable
    const formatProvider = (prov: VideoProvider) =>
        prov.charAt(0) + prov.slice(1).toLowerCase();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    Import Channel
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Provider */}
                    <div>
                        <label htmlFor="provider" className="block text-gray-700 mb-1">
                            Provider
                        </label>
                        <select
                            id="provider"
                            name="provider"
                            value={form.provider}
                            onChange={handleChange}
                            className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                errors.provider ? 'border-danger' : 'border-gray-300'
                            }`}
                        >
                            {providers.map((prov) => (
                                <option key={prov} value={prov}>
                                    {formatProvider(prov)}
                                </option>
                            ))}
                        </select>
                        {errors.provider && (
                            <p className="mt-1 text-sm text-danger">{errors.provider}</p>
                        )}
                    </div>

                    {/* Channel ID */}
                    <div>
                        <label htmlFor="channelId" className="block text-gray-700 mb-1">
                            Channel ID
                        </label>
                        <input
                            id="channelId"
                            name="channelId"
                            type="text"
                            value={form.channelId}
                            onChange={handleChange}
                            className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                errors.channelId ? 'border-danger' : 'border-gray-300'
                            }`}
                            placeholder="Enter channel ID"
                        />
                        {errors.channelId && (
                            <p className="mt-1 text-sm text-danger">{errors.channelId}</p>
                        )}
                    </div>

                    {/* Server Error */}
                    {error && (
                        <p className="text-center text-sm text-danger">{error.message}</p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                    >
                        {loading ? 'Importing…' : 'Import Channel'}
                    </button>
                </form>

                {/* Success Summary */}
                {data?.importVideosByPublisher && (
                    <div className="mt-8 p-4 bg-green-50 rounded-lg">
                        <h3 className="text-lg font-medium text-success mb-2">
                            Imported Successfully!
                        </h3>
                        <p>
                            <strong>Videos imported:</strong> {data.importVideosByPublisher?.length}
                        </p>
                        <p>
                            <strong>Channel ID:</strong> {form.channelId}
                        </p>
                        <p>
                            <strong>Provider:</strong> {form.provider}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
