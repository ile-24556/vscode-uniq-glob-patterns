import * as vscode from 'vscode';

export function uniqGlobPattenrs() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return undefined;
    }
    const selection = editor.selection;
    const range = extendRangeToFullLines(selection);
    if (range.isEmpty) {
        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(editor.document.lineCount, 0);
        const wholeRange = new vscode.Range(start, end);
        return uniq(editor, wholeRange);
    }
    if (range.isSingleLine) {
        return undefined;
    }
    return uniq(editor, range);
}

function uniq(editor: vscode.TextEditor, range: vscode.Range) {
    const lines = loadLines(editor, range);
    // TODO: make lines unique
    return lines;
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
