import * as assert from 'assert';
import * as vscode from 'vscode';
import { uniq, convertGlobToRegex } from '../../uniq-glob-pattenrs';
import { testData } from './uniq-cases.json';
import * as convertCases from './pattern-convert-cases.json';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Test convertGlobToRegex() w/ Known values', () => {
        for (let pair of convertCases) {
            assert.deepStrictEqual(convertGlobToRegex(pair.input), pair.correctOutput);
        }
    });

    test('Test uniq() w/ Known values', () => {
        for (let pair of testData) {
            assert.deepStrictEqual(uniq(pair.input), pair.correctOutput);
        }
    });
});
