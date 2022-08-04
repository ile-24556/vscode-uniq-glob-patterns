import * as vscode from 'vscode';
import { uniqGlobPattenrs } from './uniq-glob-pattenrs';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('uniq-glob-patterns.uniq', uniqGlobPattenrs);
    context.subscriptions.push(disposable);
}
