import React from "react";

/**
 * Blocks entering negative or non-numeric signs in <input type="number">.
 * Blocks '-', '+', 'e'/'E' in number inputs
 * Use as: <input onKeyDown={preventNegative} ... />
 */
export const preventNegative = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const disallowed = ['-', '+', 'e', 'E'];
    if (disallowed.includes(e.key)) {
        e.preventDefault();
    }
}