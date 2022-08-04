import * as assert from 'assert';
import * as vscode from 'vscode';
import { uniq } from '../../uniq-glob-pattenrs';
import { testData } from './test-data.json';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Known values', () => {
        for (let pair of testData) {
            assert.deepStrictEqual(uniq(pair.input), pair.correctOutput);
        }
    });
});
