import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  VideoProvider,
  useImportVideosByPublisherMutation,
} from "@/graphql/generated/graphql";
import "../ImportPage.scss";

interface FormState {
  provider: VideoProvider;
  channelId: string;
}

interface FormErrors {
  provider?: string;
  channelId?: string;
  server?: string;
}

type ImportChanelPageProps = {
  onImported?: () => void;
};

export const ImportChannelPage = ({ onImported }: ImportChanelPageProps) => {
  // Extract enum values in a type-safe way
  const providers: VideoProvider[] = Object.values(VideoProvider).filter(
    (v): v is VideoProvider => true,
  );

  // React state for form values & errors
  const [form, setForm] = useState<FormState>({
    provider: providers[0],
    channelId: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [importChannel, { data, loading, error }] =
    useImportVideosByPublisherMutation(
        {
          refetchQueries: ['GetVideosCount'],
          awaitRefetchQueries: true,
        }
    );

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "provider" ? (value as VideoProvider) : value,
    }));
    setErrors((err) => ({ ...err, [name]: undefined, server: undefined }));
  };

  // Basic validation logic
  const validate = (values: FormState): FormErrors => {
    const errs: FormErrors = {};
    if (!providers.includes(values.provider)) {
      errs.provider = "Please select a valid provider.";
    }
    if (!values.channelId.trim()) {
      errs.channelId = "Channel ID cannot be empty.";
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
      await importChannel({ variables: { provider: form.provider, publisherName: form.channelId } });
      // Clear only the channelId
      setForm((f) => ({ ...f, channelId: "" }));
    } catch {
      // GraphQL errors appear in `error`
    }
  };

  // Format enum to human-readable
  const formatProvider = (prov: VideoProvider) =>
    prov.charAt(0) + prov.slice(1).toLowerCase();

  return (
    <div className="import-single-container">
      <div>
        <h2 className="import-single-card">
          Import Channel
        </h2>

        <form onSubmit={handleSubmit} className="import-single-form">
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
              className={`form-select ${errors.provider ? 'error' : ''}`}
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
          <div className="import-input">
            <label htmlFor="channelId" className="block text-gray-700 mb-1">
              Channel ID
            </label>
            <input
              id="channelId"
              name="channelId"
              type="text"
              value={form.channelId}
              onChange={handleChange}
              className={`form-input ${errors.channelId ? 'error' : ''}`}
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
            className="btn-import"
          >
            {loading ? "Importing…" : "Import Channel"}
          </button>
        </form>

        {/* Success Summary */}
        {data?.importVideosByPublisher && (
            <div className="import-success">
              <h3 className="import-success-title">
              Imported Successfully!
            </h3>
            <p>
              <strong>Videos imported:</strong>{" "}
              {data.importVideosByPublisher?.length}
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
};
