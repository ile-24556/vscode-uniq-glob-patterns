import * as vscode from 'vscode';

export function uniqGlobPattenrs() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return undefined;
    }
    const selection = editor.selection;
    const range = extendRangeToFullLines(selection);
    if (range.isEmpty) {
        return undefined;
    }
    if (range.isSingleLine) {
        return undefined;
    }
    return undefined;
}

function extendRangeToFullLines(range: vscode.Range) {
    const extendedRange = new vscode.Range(
        range.start.line, 0, range.end.line + 1, 0);
    return extendedRange;
}

function loadLines(editor: vscode.TextEditor, range: vscode.Range) {
    const text = editor.document.getText(range);
    const splitters = /\n|\r\n|\r/;
    const lines = text.split(splitters);
    const nonemptyLines = lines.filter(word => word);
    return nonemptyLines;
}
