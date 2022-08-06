import * as assert from 'assert';
import * as vscode from 'vscode';
import { uniq, convertGlobToRegex } from '../../uniq-glob-pattenrs';
import { testData } from './uniq-cases.json';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Known values', () => {
        for (let pair of testData) {
            assert.deepStrictEqual(uniq(pair.input), pair.correctOutput);
        }
    });
});
