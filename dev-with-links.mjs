#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import readline from 'readline';

const cmd  = 'pnpm';
const args = ['exec','vite','--clearScreen=false'];

const vite = spawn(cmd, args, {
    cwd: process.cwd(),
    shell: true,
    stdio: ['inherit','pipe','pipe'],
});

// Matches: C:\foo\bar.ts:12:34   or   ./src/baz.ts:5:6   or   /usr/src/qux.ts:7:8
const fileRegex = /(([A-Za-z]:[\\/][^\s:]+|\.[\\/][^\s:]+|\/[^\s:]+)):(\d+):(\d+)/g;

function stripAnsi(s) {
    return s.replace(/\x1B\[[0-9;]*[A-Za-z]/g, '');
}

function linkify(raw) {
    // remove colors
    const line = stripAnsi(raw);
    // wrap every match in an OSC8 hyperlink
    return line.replace(fileRegex, (_, filePath, __, ___, lineNum, colNum) => {
        // resolve to absolute and normalize slashes
        const abs = path.resolve(filePath).replace(/\\/g, '/');
        const uri = `file:///${abs}:${lineNum}:${colNum}`;
        const OSC = '\u001b]8;;';
        const ST  = '\u001b\\';
        const text = `${filePath}:${lineNum}:${colNum}`;
        return `${OSC}${uri}${ST}${text}${OSC}${ST}`;
    });
}

// pipe stdout → linkify → stdout
readline.createInterface({ input: vite.stdout })
    .on('line', l => console.log(linkify(l)));

// pipe stderr → linkify → stderr
readline.createInterface({ input: vite.stderr })
    .on('line', l => console.error(linkify(l)));

vite.on('close', code => process.exit(code));
