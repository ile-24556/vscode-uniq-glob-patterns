import * as vscode from 'vscode';
import { main } from './uniq-glob-pattenrs';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('uniq-glob-patterns.uniq', main);
    context.subscriptions.push(disposable);
}
