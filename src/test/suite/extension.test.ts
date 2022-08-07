import * as assert from 'assert';
import * as vscode from 'vscode';
import { uniq, translateGlobIntoRegex } from '../../uniq-glob-pattenrs';
import * as patternConvertCases from './pattern-convert-cases.json';
import * as uniqCases from './uniq-cases.json';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Test convertGlobToRegex() w/ K`known values', () => {
        for (let pair of patternConvertCases) {
            assert.strictEqual(translateGlobIntoRegex(pair.input).regex,
                pair.correctOutput);
        }
    });

    test('Test uniq() w/ known values', () => {
        for (let pair of uniqCases) {
            assert.deepStrictEqual(uniq(pair.input), pair.correctOutput);
        }
    });
});
