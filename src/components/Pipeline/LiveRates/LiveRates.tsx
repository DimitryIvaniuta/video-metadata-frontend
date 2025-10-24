import React from "react";
import "./styles.scss";
import {useLiveRates, UseLiveRatesArgs} from "@/components/Pipeline/LiveRates/hooks/useLiveRates";

const Spinner: React.FC = () => (
    <svg className="ccv-spinner" viewBox="0 0 50 50" width="18" height="18" aria-label="Loading">
        <circle className="ccv-spinner-path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"/>
    </svg>
);
/*
type Props = {
    source?: "USD" | "EUR" | "INR" | "CAD" | "AUD" | "NZD" | "PLN" | "MXN";
    currencies?: Array<"USD" | "EUR" | "INR" | "CAD" | "AUD" | "NZD" | "PLN" | "MXN">;
    pollMs?: number;
};*/

const LiveRates = ({
                                        source = "EUR",
                                        currencies = ["USD", "INR", "CAD", "AUD", "NZD"],
                                        pollMs = 30_000,
                                    } : UseLiveRatesArgs) => {
    const { source: src, rates, loading, error, refresh } = useLiveRates({ source, currencies, pollMs });

    const rows = currencies.map(c => ({ currency: c, rate: rates[c] ?? 0 }));

    return (
        <div className="card pa-30 live-card">
            <div className="live-header">
                <div className="live-title">
                    Live FX Rates&nbsp;<span className="muted">(base: {src})</span>
                    {loading && <Spinner />}
                </div>
                <div className="live-actions">
                    <button className="btn btn-sm btn-outline-success" onClick={refresh} disabled={loading}>
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-warning mt-2" role="alert">
                    Failed to load live quotes. Showing last cached/zero values.
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-dark table-striped align-middle mb-0">
                    <thead>
                    <tr>
                        <th style={{width: 140}}>Currency</th>
                        <th>Rate ({src}→*)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map(r => (
                        <tr key={r.currency}>
                            <td>{r.currency}</td>
                            <td>{r.rate ? r.rate.toFixed(6) : "—"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="live-foot muted">
                Updates every {(pollMs/1000)|0}s • Pauses when tab is hidden • Data via /fxLive
            </div>
        </div>
    );
};

export default LiveRates;
