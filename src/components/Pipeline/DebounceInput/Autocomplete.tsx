import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import {useDebouncedValue} from "@/components/Pipeline/DebounceInput/useDebouncedValue";

type AutocompleteProps<T> = {
    /** Fetch suggestions for a query. MUST respect AbortSignal for cancelation. */
    fetchSuggestions: (query: string, signal: AbortSignal) => Promise<T[]>;
    /** Called when user picks an item */
    onSelect: (item: T) => void;
    /** How to get a stable key from a suggestion */
    getKey: (item: T) => string;
    /** How to get a display label from a suggestion */
    getLabel: (item: T) => string;
    /** Minimum characters before searching */
    minLength?: number;
    /** Debounce delay for keystrokes */
    debounceMs?: number;
    /** Placeholder text */
    placeholder?: string;
    /** Optional initial value for the input */
    initialInputValue?: string;
    /** Max results to display (purely for UI) */
    maxVisible?: number;
};

/** Accessible, debounced, abortable Autocomplete */
export const Autocomplete = <T, >({
                                    fetchSuggestions,
                                    onSelect,
                                    getKey,
                                    getLabel,
                                    minLength = 2,
                                    debounceMs = 300,
                                    placeholder = "Search…",
                                    initialInputValue = "",
                                    maxVisible = 8,
                                }: AutocompleteProps<T>)=> {
    const [input, setInput] = useState(initialInputValue);
    const [items, setItems] = useState<T[]>([]);
    const [open, setOpen] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState<number>(-1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedQuery = useDebouncedValue(input.trim(), debounceMs);
    const ctrlRef = useRef<AbortController | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const listboxId = useId();
    const inputId = useId();

    // Close on outside click
    useEffect(() => {
        const onDocMouseDown = (e: MouseEvent) => {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target as Node)) {
                setOpen(false);
                setHighlightIndex(-1);
            }
        };
        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, []);

    // Fetch suggestions with abort + race protection
    useEffect(() => {
        // Clear when query is short
        if (debouncedQuery.length < minLength) {
            if (ctrlRef.current) ctrlRef.current.abort();
            setItems([]);
            setOpen(false);
            setLoading(false);
            setError(null);
            return;
        }

        // Abort any in-flight request
        if (ctrlRef.current) ctrlRef.current.abort();
        const controller = new AbortController();
        ctrlRef.current = controller;

        let alive = true;
        setLoading(true);
        setError(null);

        fetchSuggestions(debouncedQuery, controller.signal)
            .then((res) => {
                if (!alive) return;
                setItems(res);
                setOpen(true);
                setHighlightIndex(res.length ? 0 : -1);
            })
            .catch((err: unknown) => {
                if (!alive) return;
                if ((err as any)?.name === "AbortError") return;
                setError((err as Error).message ?? "Failed to load suggestions");
                setItems([]);
                setOpen(true);
                setHighlightIndex(-1);
            })
            .finally(() => {
                if (!alive) return;
                setLoading(false);
            });

        return () => {
            alive = false;
            controller.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery, minLength, fetchSuggestions]);

    const onPick = (item: T) => {
        onSelect(item);
        setInput(getLabel(item));
        setOpen(false);
        setHighlightIndex(-1);
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (!open && ["ArrowDown", "ArrowUp"].includes(e.key)) {
            setOpen(true);
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex((i) => (items.length ? (i + 1) % items.length : -1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((i) =>
                items.length ? (i - 1 + items.length) % items.length : -1
            );
        } else if (e.key === "Enter") {
            if (open && highlightIndex >= 0 && highlightIndex < items.length) {
                e.preventDefault();
                onPick(items[highlightIndex]);
            }
        } else if (e.key === "Escape") {
            setOpen(false);
            setHighlightIndex(-1);
        }
    };

    const visibleItems = useMemo(
        () => (maxVisible > 0 ? items.slice(0, maxVisible) : items),
        [items, maxVisible]
    );

    return (
        <div ref={rootRef} style={{ position: "relative", maxWidth: 420 }}>
            <label htmlFor={inputId} style={{ display: "block", fontSize: 12, color: "#555", marginBottom: 4 }}>
                Search
            </label>
            <input
                id={inputId}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls={listboxId}
                aria-activedescendant={
                    open && highlightIndex >= 0 ? `${listboxId}-opt-${highlightIndex}` : undefined
                }
                placeholder={placeholder}
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                    setOpen(true);
                }}
                onKeyDown={onKeyDown}
                onFocus={() => { if (items.length) setOpen(true); }}
                style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    outline: "none",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                }}
            />

            {open && (
                <div
                    style={{
                        position: "absolute",
                        zIndex: 20,
                        top: "calc(100% + 6px)",
                        left: 0,
                        right: 0,
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        background: "#fff",
                        boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
                        overflow: "hidden",
                    }}
                >
                    <ul
                        id={listboxId}
                        role="listbox"
                        style={{ margin: 0, padding: 0, listStyle: "none", maxHeight: 280, overflowY: "auto" }}
                    >
                        {loading && (
                            <li
                                style={{ padding: "10px 12px", fontStyle: "italic", color: "#666" }}
                                aria-live="polite"
                            >
                                Loading…
                            </li>
                        )}

                        {!loading && error && (
                            <li style={{ padding: "10px 12px", color: "#b00020" }}>
                                {error}
                            </li>
                        )}

                        {!loading && !error && visibleItems.length === 0 && debouncedQuery.length >= minLength && (
                            <li style={{ padding: "10px 12px", color: "#666" }}>
                                No results
                            </li>
                        )}

                        {!loading && !error &&
                            visibleItems.map((item, idx) => {
                                const active = idx === highlightIndex;
                                return (
                                    <li
                                        id={`${listboxId}-opt-${idx}`}
                                        key={getKey(item)}
                                        role="option"
                                        aria-selected={active}
                                        onMouseEnter={() => setHighlightIndex(idx)}
                                        onMouseDown={(e) => e.preventDefault()} // prevent input blur before click
                                        onClick={() => onPick(item)}
                                        style={{
                                            padding: "10px 12px",
                                            cursor: "pointer",
                                            background: active ? "#f5f7ff" : "#fff",
                                        }}
                                    >
                                        {getLabel(item)}
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            )}
        </div>
    );
}