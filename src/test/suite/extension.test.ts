import * as assert from 'assert';
import * as vscode from 'vscode';
import { uniq, convertGlobToRegex } from '../../uniq-glob-pattenrs';
import * as patternConvertCases from './pattern-convert-cases.json';
import * as uniqCases from './uniq-cases.json';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Test convertGlobToRegex() w/ Known values', () => {
        for (let pair of patternConvertCases) {
            assert.strictEqual(convertGlobToRegex(pair.input), pair.correctOutput);
        }
    });

    test('Test uniq() w/ Known values', () => {
        for (let pair of uniqCases) {
            assert.deepStrictEqual(uniq(pair.input), pair.correctOutput);
        }
    });
});
