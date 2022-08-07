import * as vscode from 'vscode';

export function main() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const selection = editor.selection;
    if (selection.isEmpty) {
        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(editor.document.lineCount, 0);
        const wholeRange = new vscode.Range(start, end);
        return uniqAndReplaceText(editor, wholeRange);
    }
    const range = extendRangeToFullLines(selection);
    if (range.isSingleLine) {
        return;
    }
    return uniqAndReplaceText(editor, range);
}

function extendRangeToFullLines(range: vscode.Range) {
    const extendedRange = new vscode.Range(
        range.start.line, 0, range.end.line + 1, 0);
    return extendedRange;
}

function uniqAndReplaceText(editor: vscode.TextEditor, range: vscode.Range) {
    const lines = loadLines(editor, range);
    const uniqLines = uniq(lines);
    if (!uniqLines) {
        return;
    }
    dumpLines(editor, range, uniqLines);
}

function loadLines(editor: vscode.TextEditor, range: vscode.Range) {
    const text = editor.document.getText(range);
    const splitters = /\n|\r\n|\r/;
    const lines = text.split(splitters);
    const nonemptyLines = lines.filter(word => word);
    return nonemptyLines;
}

export function uniq(lines: string[]) {
    const uniqLines = Array.from(new Set(lines));
    const patterns: Pattern[] = [];
    for (const line of uniqLines) {
        patterns.push(new Pattern(line));
    }
    const length = patterns.length;
    for (let i = 0; i < length; i++) {
        const a = patterns[i];
        if (!a) {
            return undefined;
        }
        for (let j = i + 1; j < length; j++) {
            const b = patterns[j];
            if (!b) {
                return undefined;
            }
            if (a.regex.test(b.text)) {
                b.isAlive = false;
            } else if (b.regex.test(a.text)) {
                a.isAlive = false;
            };
        }
    }
    const aliveLines: string[] = [];
    for (const pattern of patterns) {
        if (pattern.isAlive) {
            aliveLines.push(pattern.text);
        }
    }
    return aliveLines;
}

class Pattern {
    public exclamationed: string = '';
    public asterisked: string;
    public regex: RegExp;
    public isAlive = true;
    constructor(
        public text: string
    ) {
        this.asterisked = text.replaceAll('?', '*');
        this.regex = new RegExp(translateGlobIntoRegex(text));
    }
};

export function translateGlobIntoRegex(pattern: string): string {
    let result = '';
    let i = 0;
    const length = pattern.length;
    let j = length + 1;
    let bracketsContent = '';
    let isNegation = false;

    while (i < length) {
        isNegation = false;
        const char = pattern[i];
        if (char === undefined) {
            break;
        }
        i++;
        if (char === '*') {
            result += '.*?';
        }
        else if (char === '?') {
            result += '.';
        }
        else if (char === '[') {
            // Opening bracket found
            j = i;

            if (j < length && (pattern[j] === '!' || pattern[j] === '^')) {
                isNegation = true;
                j++;
            }
            if (j < length && pattern[j] === ']') {
                // Imidiately closeed after opening or negation:
                // No content in the brackets
                j++;
            }
            // Search for closing bracket
            while (j < length && pattern[j] !== ']') {
                j++;
            }

            if (j >= length) {
                // Not closed: literal
                result += '\\[';
            }
            else {
                bracketsContent = pattern.slice(i, j);
                if (isNegation) {
                    bracketsContent = '^' + escapeRegexSpecialChar(bracketsContent.slice(1));
                }
                else {
                    bracketsContent = escapeRegexSpecialChar(bracketsContent);
                }
                result += '[' + bracketsContent + ']';
                i = j + 1;
            }
        }
        else {
            result += escapeRegexSpecialChar(char);
        }
    }
    return '^' + result + '$';
}

const REGEX_SPECIAL_CHARS = '()[]{}?*+|^$\\.&~#';
function escapeRegexSpecialChar(text: string) {
    let result = '';
    for (const char of text) {
        if (REGEX_SPECIAL_CHARS.includes(char)) {
            result += '\\' + char;
        } else {
            result += char;
        }
    }
    return result;
}

const NEWLINE = '\n';
function dumpLines(editor: vscode.TextEditor, range: vscode.Range, lines: string[]) {
    const text = lines.join(NEWLINE) + NEWLINE;
    editor.edit(editBuilder => editBuilder.replace(range, text));
}
