import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import "./styles.scss";
import {useExchangeRates, DEFAULT_CURRENCY, DEFAULT_INPUT} from "@/components/Pipeline/CurrencyConverter/hooks/useExchangeRates";
import {preventNegative} from "@/components/Pipeline/CurrencyConverter/utils";
import Spinner from "@/components/Pipeline/CurrencyConverter/Spinner";

const fmt3 = (n: number): number => +(n.toFixed(3));

const CurrencyConvertor = () => {
    const { currencies, convertToUSD, loading } = useExchangeRates({
        currencies: ["INR", "CAD", "EUR", "AUD", "NZD"],
        liveBase: "USD",
    });

    const [currency, setCurrency] = useState<string>(DEFAULT_CURRENCY); // e.g., "INR"
    const [amount, setAmount] = useState<string>(String(DEFAULT_INPUT)); // "1"
    const [converted, setConverted] = useState<number | "">("");

    const amountNum = useMemo(() => {
        const a = parseFloat(amount);
        return Number.isFinite(a) && a >= 0 ? a : NaN;
    }, [amount]);

    // convert on mount + whenever currency/amount change
    useEffect(() => {
        if (!Number.isFinite(amountNum)) { setConverted(""); return; }
        convertToUSD(currency as any, amountNum)
            .then(({ result }) => setConverted(fmt3(result)))
            .catch(() => setConverted(""));
    }, [currency, amountNum, convertToUSD]);

    const onAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        if (v === "") { setAmount(""); return; }
        const n = Number(v);
        if (Number.isFinite(n) && n >= 0) setAmount(v);
    };

    const onCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setCurrency(e.target.value);
    };

    return (
        <div>
            <div className="layout-row justify-content-space-evenly min-height mt-75">
                <div className="layout-column w-35 pa-30 card">
                    <div className="ccv-select-wrap">
                        {loading && <Spinner />}
                        <select
                            className="mb-10 ccv-select"   // ← add this class
                            data-testid="select-currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            disabled={loading}
                        >
                            {["INR","CAD","EUR","AUD","NZD"].map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <input
                        className="h-50"
                        type="number"
                        step="any"
                        min={0}
                        value={amount}
                        onChange={onAmountChange}
                        onKeyDown={preventNegative}
                        placeholder={`Enter value in ${currency}`}
                        data-testid="input-value"
                    />

                </div>

                <div className="layout-column w-35 pa-30 card">
                    <h3 className="mb-10 mt-0">USD</h3>
                    <input
                        className="h-50"
                        type="number"
                        readOnly
                        value={converted}
                        data-testid="converted-value"
                    />
                </div>
            </div>

            <div className="layout-row justify-content-center pa-20">
                <button
                    data-testid="clear-values"
                    onClick={() => setAmount(String(DEFAULT_INPUT))}
                    disabled={loading}
                >
                    Clear Input
                </button>
            </div>
        </div>
    );
}

export default CurrencyConvertor;
