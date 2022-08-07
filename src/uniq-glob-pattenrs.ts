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
            continue;
        }
        for (let j = i + 1; j < length; j++) {
            const b = patterns[j];
            if (!b) {
                continue;
            }
            // '*' always defeat '?'
            if (a.excIntoAst === b.text) {
                a.isAlive = false;
            }
            // '*' always defeat '[...]' including '[*]'
            else if (a.rangeIntoAst === b.text) {
                a.isAlive = false;
            }
            // '?' always defeat '[...]'
            else if (a.rangeIntoExc === b.text) {
                a.isAlive = false;
            }
            else if (b.rangeIntoExc === a.text) {
                b.isAlive = false;
            }
            // Finally, regex tests
            else if (a.regex.test(b.text)) {
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
    public rangeIntoExc: string;
    public rangeIntoAst: string;
    public excIntoAst: string;
    public regex: RegExp;
    public isAlive = true;
    constructor(
        public text: string
    ) {
        this.excIntoAst = text.replaceAll('?', '*');
        const results = translateGlobIntoRegex(text);
        this.regex = new RegExp(results.regex);
        this.rangeIntoExc = results.rangeExc;
        this.rangeIntoAst = results.rangeAst;
    }
};

export function translateGlobIntoRegex(pattern: string): {
    regex: string; rangeExc: string; rangeAst: string;
} {
    let regexPattern = '';
    let rangeIntoExclamation = '';
    let rangeIntoAsterisk = '';
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
            regexPattern += '.*?';
            rangeIntoExclamation += '.*?';
            rangeIntoAsterisk += '.*?';
        }
        else if (char === '?') {
            regexPattern += '.';
            rangeIntoExclamation += '.';
            rangeIntoAsterisk += '.';
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
                regexPattern += '\\[';
                rangeIntoExclamation += '\\[';
                rangeIntoAsterisk += '\\[';
            }
            else {
                bracketsContent = pattern.slice(i, j);
                if (isNegation) {
                    bracketsContent = '^' + escapeRegexSpecialChar(bracketsContent.slice(1));
                }
                else {
                    bracketsContent = escapeRegexSpecialChar(bracketsContent);
                }
                regexPattern += '[' + bracketsContent + ']';
                rangeIntoExclamation += '?';
                rangeIntoAsterisk += '*';
                i = j + 1;
            }
        }
        else {
            regexPattern += escapeRegexSpecialChar(char);
        }
    }
    regexPattern = '^' + regexPattern + '$';
    return {
        regex: regexPattern,
        rangeExc: rangeIntoExclamation,
        rangeAst: rangeIntoAsterisk
    };
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
