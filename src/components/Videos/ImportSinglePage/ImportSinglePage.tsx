import React, { FormEvent, useState } from "react";
import {
  VideoProvider,
  useImportVideoMutation,
} from "@/graphql/generated/graphql";
import "../ImportPage.scss";

type FormState = {
  provider: VideoProvider;
  externalVideoId: string;
};

type FormErrors = {
  provider?: string;
  externalVideoId?: string;
};

type ImportSinglePageProps = {
  onImported?: () => void;
};

// 1) Type‐safe extraction of enum *values*
const providers: VideoProvider[] = Object.values(VideoProvider).filter(
  (v): v is VideoProvider => true,
);

// 2) Utility to format e.g. "YOUTUBE" -> "Youtube"
const formatProvider = (prov: VideoProvider): string => {
  const lower = prov.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

export const ImportSinglePage: React.FC<ImportSinglePageProps> = ({
  onImported,
}: ImportSinglePageProps) => {
  const [form, setForm] = useState<FormState>({
    provider: VideoProvider.Youtube,
    externalVideoId: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [importVideo, { data, loading, error }] = useImportVideoMutation();

  const validate = (values: FormState): FormErrors => {
    const errs: FormErrors = {};
    if (
      !values.provider ||
      !Object.values(VideoProvider).includes(values.provider)
    ) {
      errs.provider = "Please select a valid provider.";
    }
    if (!values.externalVideoId.trim()) {
      errs.externalVideoId = "Video ID cannot be empty.";
    }
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "provider" ? (value as VideoProvider) : value,
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
      onImported?.();
    } catch {
      // GraphQL errors surface via `error`
    }
  };

  return (
    <div className="import-single-container">
      <div>
        <h2 className="import-single-card">
          Import Single Video
        </h2>

        <form onSubmit={handleSubmit} className="import-single-form">
          {/* Provider */}
          <div className="import-input">
            <label htmlFor="provider" className="form-label">
              Provider
            </label>
            <select
              id="provider"
              name="provider"
              value={form.provider}
              onChange={handleChange}
              className={`form-select ${errors.provider ? 'error' : ''}`}
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
          <div className="import-input">
            <label
              htmlFor="externalVideoId"
              className="form-label"
            >
              Video ID
            </label>
            <input
              id="externalVideoId"
              name="externalVideoId"
              type="text"
              value={form.externalVideoId}
              onChange={handleChange}
              className={`form-input ${errors.externalVideoId ? 'error' : ''}`}
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
            className="btn-import"
          >
            {loading ? "Importing…" : "Import Video"}
          </button>
        </form>

        {/* Success */}
        {data?.importVideo && (
          <div className="import-success">
            <h3 className="import-success-title">
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
};
