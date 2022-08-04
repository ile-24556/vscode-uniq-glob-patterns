import * as assert from 'assert';
import * as vscode from 'vscode';
import { uniq } from '../../uniq-glob-pattenrs';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Known values', () => {
        const knownCases = require('./test-data.json');
        for (let pair of knownCases) {
            assert.deepStrictEqual(uniq(pair.input), pair.correctOutput);
        }
    });
});
