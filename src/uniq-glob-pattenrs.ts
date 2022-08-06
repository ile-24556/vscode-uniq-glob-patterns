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
    const patterns: Pattern[] = [];
    for (const line of lines) {
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
    public regex: RegExp;
    public isAlive = true;
    constructor(
        public text: string
    ) {
        this.regex = new RegExp(convertGlobToRegex(text));
    }
};

export function convertGlobToRegex(pattern: string) {
    pattern = pattern.replaceAll('.', '\\.');
    pattern = pattern.replaceAll('?', '.');
    pattern = pattern.replaceAll('*', '.*');
    pattern = pattern.replaceAll('[!', '[^');
    return '^' + pattern + '$';
}


function dumpLines(editor: vscode.TextEditor, range: vscode.Range, lines: string[]) {
    const newline = '\n';
    const text = lines.join(newline) + newline;
    editor.edit(editBuilder => editBuilder.replace(range, text));
}
