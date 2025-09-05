import React, { useState } from "react";
import {Autocomplete} from "@/components/Pipeline/DebounceInput/Autocomplete";
import {Country} from "@/components/Pipeline/DebounceInput/COUNTRIES";
import {demoCountrySearch} from "@/components/Pipeline/DebounceInput/demoCountrySearch";

/** Example app wiring the generic Autocomplete with Country suggestions */
export const AutoCompleteApplication = ()=> {
    const [picked, setPicked] = useState<Country | null>(null);

    return (
        <div style={{ fontFamily: "Inter, ui-sans-serif, system-ui, Segoe UI, Roboto, Arial", padding: 24 }}>
            <h2 style={{ margin: "0 0 12px" }}>Autocomplete — Debounced + Abortable</h2>
            <p style={{ marginTop: 0, color: "#555" }}>
                Start typing a country (e.g., <em>po</em>, <em>ge</em>, <em>fr</em>).
            </p>

            <Autocomplete<Country>
                fetchSuggestions={demoCountrySearch}
                onSelect={(c) => setPicked(c)}
                getKey={(c) => c.code}
                getLabel={(c) => `${c.name} (${c.code})`}
                minLength={2}
                debounceMs={300}
                placeholder="Search countries…"
                maxVisible={8}
            />

            <div style={{ marginTop: 16, fontSize: 14, color: "#333" }}>
                <strong>Selected:</strong>{" "}
                {picked ? `${picked.name} (${picked.code})` : "—"}
            </div>

            <hr style={{ margin: "20px 0" }} />

            <details>
                <summary>How to wire to a real API</summary>
                <pre style={{ whiteSpace: "pre-wrap" }}>

                    {`// Example: integrate with your backend
async function fetchCountries(query: string, signal: AbortSignal): Promise<Country[]> {
  const res = await fetch(\`/api/countries?query=\${encodeURIComponent(query)}\`, { signal });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  const data: { code: string; name: string }[] = await res.json();
  return data;
}

// Then pass it to <Autocomplete />:
<Autocomplete<Country>
  fetchSuggestions={fetchCountries}
  onSelect={...}
  getKey={(c) => c.code}
  getLabel={(c) => c.name}
/>`}
        </pre>
            </details>
        </div>
    );
}