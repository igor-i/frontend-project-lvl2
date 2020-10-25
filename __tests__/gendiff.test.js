import { createRequire } from 'module';
import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import genDiff from '../lib/gendiff.js';

const require = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8').trim();

test('Result of YAML file comparison. Paths are correct. Default formatter', () => {
  expect(genDiff(getFixturePath('file1.yml'), getFixturePath('file2.yml'))).toBe(readFile('expected_file.yml'));
});

test('Result of INI file comparison. Paths are correct. Default formatter', () => {
  expect(genDiff(getFixturePath('file1.ini'), getFixturePath('file2.ini'))).toBe(readFile('expected_file.ini'));
});

test('Result of JSON complex file comparison. Paths are correct. Default formatter', () => {
  expect(genDiff(getFixturePath('file_complex1.json'), getFixturePath('file_complex2.json'))).toBe(readFile('expected_file_complex.json'));
});

test('Reaction to an error in specifying a path or file name', () => {
  expect(genDiff(getFixturePath('file_complex1.json'), getFixturePath('file_complex3.json'))).toBe('File name or path error');
});

test('Reaction to mismatch of file extensions', () => {
  expect(genDiff(getFixturePath('file_complex1.json'), getFixturePath('file_complex2.yml'))).toBe('File extensions should not be different');
});

test('Reaction to unknown file extensions', () => {
  expect(genDiff(getFixturePath('file1.txt'), getFixturePath('file2.txt'))).toBe('Unknown file extensions');
});

test('Reaction to unknown formatter type', () => {
  expect(genDiff(getFixturePath('file_complex1.json'), getFixturePath('file_complex2.json'), 'unknownFormatter')).toBe('Unknown formatter type');
});
