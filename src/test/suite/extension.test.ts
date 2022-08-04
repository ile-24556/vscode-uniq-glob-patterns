import * as assert from 'assert';
import * as vscode from 'vscode';
import { uniq } from '../../uniq-glob-pattenrs';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    const knownCases = [
        [
            ['*.google.com', 'www.google.com',],
            ['*.google.com',]
        ],
    ];

    test('Known values', () => {
        for (let pair of knownCases) {
            const input = pair[0]!;
            const correctAnswer = pair[1];
            assert.deepStrictEqual(uniq(input), correctAnswer);
        }
    });
});
