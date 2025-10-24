import {useCallback, useEffect, useMemo, useState} from "react";
import {
    useFxConvertLazyQuery,
    useFxLiveQuery,
} from "@/graphql/generated/graphql";

/** defaults for UI/tests */
export const DEFAULT_CURRENCY = "INR" as const;
export const DEFAULT_INPUT = 1 as const;

export type CurrencyCode = "INR" | "CAD" | "EUR" | "AUD" | "NZD" | "USD";
export type RatesMap = Record<string, number>;

type UseExchangeRatesArgs = {
    /** list in the select */
    currencies?: CurrencyCode[];
    /** live base used to prefetch table of rates (optional) */
    liveBase?: CurrencyCode;
};

/**
 * Loads live rates table (optional) and exposes a typed `convertToUSD` using fxConvert.
 * We use convert(from=<selected>, to="USD") so the UI just multiplies `amount` by returned rate.
 */
export function useExchangeRates(
    { currencies = ["INR", "CAD", "EUR", "AUD", "NZD"], liveBase = "USD" }: UseExchangeRatesArgs = {}
) {
    // Prefetch a live snapshot for the select (not required for conversion, but useful to show cached rates if needed)
    const { data: liveData, loading: liveLoading, error: liveError } = useFxLiveQuery({
        variables: { source: liveBase, currencies },
        fetchPolicy: "cache-first",
    });

    // Normalize live quotes into { [symbol]: rate } where symbol is just the target (remove base prefix)
    const liveRates: RatesMap = useMemo(() => {
        const src = liveData?.fxLive?.source ?? liveBase;
        const out: RatesMap = {};
        liveData?.fxLive?.quotes?.forEach(q => {
            if (!q) return;
            const target = q.symbol?.replace(src, "") ?? "";
            if (target) out[target] = Number(q.rate ?? 0);
        });
        return out;
    }, [liveData, liveBase]);

    // Lazy convert query (from -> USD)
    const [convertQuery, { loading: convertLoading, error: convertError }] = useFxConvertLazyQuery({
        fetchPolicy: "no-cache",
    });

    const convertToUSD = useCallback(
        async (from: string, amount: number) => {
            const { data } = await convertQuery({ variables: { from, to: "USD", amount } });
            const res  = Number(data?.fxConvert?.result ?? 0);
            const rate = Number(data?.fxConvert?.rate ?? 0);
            return { result: res, rate };
        },
        [convertQuery] // stable dependency from Apollo
    );

    return {
        currencies,
        liveRates,                     // optional snapshot { INR: <USDINR>, ... } — FYI it's per liveBase
        loading: liveLoading || convertLoading,
        error: liveError ?? convertError ?? null,
        convertToUSD,
    };
}
