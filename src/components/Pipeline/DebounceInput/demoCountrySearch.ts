
/** Simulated API that respects AbortSignal and variable latency */
import {COUNTRIES, Country} from "@/components/Pipeline/DebounceInput/COUNTRIES";

/** Create a standards-like AbortError even if DOMException isn't available (Node, some test envs). */
const createAbortError = (): Error => {
    try {
        // In browsers, this yields { name: 'AbortError' }
        // eslint-disable-next-line no-undef
        return new DOMException("Aborted", "AbortError") as unknown as Error;
    } catch {
        const e = new Error("Aborted");
        (e as any).name = "AbortError";
        return e;
    }
}

/**
 * Simulated country search API that:
 *  - debounces externally (you pass the debounced query),
 *  - respects AbortSignal for cancellation,
 *  - returns at most 20 matches.
 */
export const demoCountrySearch = async (query: string, signal: AbortSignal): Promise<Country[]> => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    // Fast-fail if already aborted
    if (signal.aborted) {
        throw createAbortError();
    }

    // Simulate variable network latency, cancellable
    await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(resolve, 150 + Math.random() * 450);

        const onAbort = () => {
            clearTimeout(timeout);
            reject(createAbortError());
        };

        // Ensure single cleanup
        signal.addEventListener("abort", onAbort, { once: true });
    });

    return COUNTRIES
        .filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.code.toLowerCase().includes(q)
        )
        .slice(0, 20);
}

// Optional: export a typed function signature if you want to reuse it elsewhere.
export type CountrySearchFn = (
    query: string,
    signal: AbortSignal
) => Promise<Country[]>;
