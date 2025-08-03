#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import readline from 'readline';

// 1) How we invoke Vite
const cmd  = 'pnpm';
const args = ['exec','vite','--clearScreen=false'];

const vite = spawn(cmd, args, {
    cwd: process.cwd(),
    shell: true,
    stdio: ['inherit','pipe','pipe'],
});

// 2) Match Windows (drive:\path), relative (./src/…), or POSIX (/src/…)
//    with line mandatory and column optional
const fileRegex = /FILE\s+(([A-Za-z]:[\\/][^\s:]+|\.[\\/][^\s:]+|\/[^\s:]+)):(\d+)(?::(\d+))?/g;

// Strip ANSI colors so we don’t break the link escapes
function stripAnsi(s) {
    return s.replace(/\x1B\[[0-9;]*[A-Za-z]/g, '');
}

// 3) Wrap every match in an OSC8 hyperlink
function linkify(raw) {
    const line = stripAnsi(raw);
    return line.replace(
        fileRegex,
        (_match, filePath, _2, _3, lineNum, colNum) => {
            // Absolute, normalized path
            const abs = path.resolve(filePath).replace(/\\/g, '/');
            // Column is optional
            const loc = colNum ? `${abs}:${lineNum}:${colNum}` : `${abs}:${lineNum}`;
            const uri = `file:///${loc}`;
            const OSC = '\u001b]8;;';
            const ST  = '\u001b\\';
            const blue  = '\u001b[34m';
            const reset = '\u001b[39m';
            // Show exactly what was in the raw output
            const text = colNum
                ? `${blue}FILE: ${filePath}:${lineNum}:${colNum}${reset}`
                : `${blue}FILE: ${filePath}:${lineNum}${reset}`;

            // console.log(`URI:TEXT = ${uri}:${text}`);
            return `${blue}${OSC}${uri}${ST}${text}${OSC}${ST}${reset}`;
        }
    );
}

// 4) Always print stdout through linkify
readline
    .createInterface({ input: vite.stdout })
    .on('line', (l) => console.log(linkify(l)));

// 5) And stderr too
readline
    .createInterface({ input: vite.stderr })
    .on('line', (l) => console.error(linkify(l)));

vite.on('close', (code) => process.exit(code));
