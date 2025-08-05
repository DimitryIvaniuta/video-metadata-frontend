// src/pages/ImportSinglePage.tsx
import React, { FormEvent, useState } from 'react';
import { VideoProvider, useImportVideoMutation } from '@/graphql/generated/graphql';

type FormState = {
    provider: VideoProvider;
    externalVideoId: string;
};

type FormErrors = {
    provider?: string;
    externalVideoId?: string;
};

// 1) Type‐safe extraction of enum *values*
const providers: VideoProvider[] = Object
    .values(VideoProvider)
    .filter((v): v is VideoProvider => typeof v === 'string');

// 2) Utility to format e.g. "YOUTUBE" -> "Youtube"
const formatProvider = (prov: VideoProvider): string => {
    const lower = prov.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
};

export const ImportSinglePage: React.FC = () => {
    const [form, setForm] = useState<FormState>({
        provider: VideoProvider.Youtube,
        externalVideoId: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [importVideo, { data, loading, error }] = useImportVideoMutation();

    const validate = (values: FormState): FormErrors => {
        const errs: FormErrors = {};
        if (!values.provider || !Object.values(VideoProvider).includes(values.provider)) {
            errs.provider = 'Please select a valid provider.';
        }
        if (!values.externalVideoId.trim()) {
            errs.externalVideoId = 'Video ID cannot be empty.';
        }
        return errs;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setForm((f) => ({
            ...f,
            [name]:
                name === 'provider'
                    ? (value as VideoProvider)
                    : value,
        }));
        // clear field-level error on change
        setErrors((errs) => ({ ...errs, [name]: undefined }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const validation = validate(form);
        if (Object.keys(validation).length) {
            setErrors(validation);
            return;
        }
        try {
            await importVideo({ variables: form });
            // clear only the video ID, keep provider
            setForm((f) => ({ ...f, externalVideoId: '' }));
        } catch {
            // GraphQL errors surface via `error`
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    Import Single Video
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
                            {providers.map((prov: VideoProvider) => (
                                <option key={prov} value={prov}>
                                    {formatProvider(prov)}
                                </option>
                            ))}
                        </select>
                        {errors.provider && (
                            <p className="mt-1 text-sm text-danger">{errors.provider}</p>
                        )}
                    </div>

                    {/* Video ID */}
                    <div>
                        <label htmlFor="externalVideoId" className="block text-gray-700 mb-1">
                            Video ID
                        </label>
                        <input
                            id="externalVideoId"
                            name="externalVideoId"
                            type="text"
                            value={form.externalVideoId}
                            onChange={handleChange}
                            className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                errors.externalVideoId ? 'border-danger' : 'border-gray-300'
                            }`}
                            placeholder="Enter video ID"
                        />
                        {errors.externalVideoId && (
                            <p className="mt-1 text-sm text-danger">
                                {errors.externalVideoId}
                            </p>
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
                        {loading ? 'Importing…' : 'Import Video'}
                    </button>
                </form>

                {/* Success */}
                {data?.importVideo && (
                    <div className="mt-8 p-4 bg-green-50 rounded-lg">
                        <h3 className="text-lg font-medium text-success mb-2">
                            Imported Successfully!
                        </h3>
                        <p>
                            <strong>Title:</strong> {data.importVideo.title}
                        </p>
                        <p>
                            <strong>ID:</strong> {data.importVideo.id}
                        </p>
                        <p>
                            <strong>Provider:</strong> {data.importVideo.videoProvider}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
