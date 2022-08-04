import * as vscode from 'vscode';

export function uniqGlobPattenrs() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return undefined;
    }
    const selection = editor.selection;
    const range = normaliseRange(selection);
    if (range.isEmpty) {
        return undefined;
    }
    if (range.isSingleLine) {
        return undefined;
    }
    return undefined;
}

function normaliseRange(range: vscode.Range) {
    const normalizedRange = new vscode.Range(
        range.start.line, 0, range.end.line + 1, 0);
    return normalizedRange;
}

function loadLines(editor: vscode.TextEditor, range: vscode.Range) {
    const text = editor.document.getText(range);
    const splitters = /[\n\r]/;
    const lines = text.split(splitters);
    const nonemptyLines = lines.filter(word => word);
    return nonemptyLines;
}
