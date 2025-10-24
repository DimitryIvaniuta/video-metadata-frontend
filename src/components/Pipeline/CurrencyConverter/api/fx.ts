export type RatesResponse = { base: string; rates: Record<string, number> };

export async function fetchRates(): Promise<RatesResponse> {
    const res = await fetch("http://localhost:8080/api/rates");
    if (!res.ok) throw new Error(`FX ${res.status}`);
    return res.json();
}
