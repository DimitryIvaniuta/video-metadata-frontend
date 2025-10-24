import { useEffect, useMemo, useRef } from "react";
import { useFxLiveQuery } from "@/graphql/generated/graphql";

export type CurrencyCode = "USD" | "EUR" | "INR" | "CAD" | "AUD" | "NZD" | "PLN" | "MXN";
export type RatesMap = Record<string, number>;

export type UseLiveRatesArgs = {
    source?: CurrencyCode;             // base/source currency; default "USD"
    currencies?: CurrencyCode[];        // targets to quote against source
    pollMs?: number;                   // polling interval; default 30s
};

export function useLiveRates({
        source = "USD",
        currencies,
        pollMs = 30_000,
    }: UseLiveRatesArgs) {
    const { data, loading, error, refetch, startPolling, stopPolling } = useFxLiveQuery({
        variables: { source, currencies },
        fetchPolicy: "cache-and-network",
        nextFetchPolicy: "cache-first",
        notifyOnNetworkStatusChange: true,
        pollInterval: pollMs,     // initial polling
    });

    // Pause polling when tab not visible; resume when visible
    const pollMsRef = useRef(pollMs);
    useEffect(() => { pollMsRef.current = pollMs; }, [pollMs]);

    useEffect(() => {
        const handler = () => {
            if (document.hidden) stopPolling();
            else startPolling(pollMsRef.current);
        };
        document.addEventListener("visibilitychange", handler);
        return () => document.removeEventListener("visibilitychange", handler);
    }, [startPolling, stopPolling]);

    // Normalize: convert "EURUSD" → key "USD", value rate
    const sourceCode = data?.fxLive?.source ?? source;
    const rates: RatesMap = useMemo(() => {
        const out: RatesMap = {};
        data?.fxLive?.quotes?.forEach(q => {
            if (!q?.symbol) return;
            const target = q.symbol.replace(sourceCode, "");
            if (target) out[target] = Number(q.rate ?? 0);
        });
        // ensure all requested currencies exist (fill 0 if missing)
        currencies?.forEach(c => { if (out[c] === undefined) out[c] = 0; });
        return out;
    }, [data, sourceCode, currencies]);

    return {
        source: sourceCode,
        rates,
        loading,
        error,
        refresh: () => refetch({ source, currencies }),
    };
}
