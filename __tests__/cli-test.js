/*!
 * node-minify
 * Copyright(c) 2011-2018 Rodolphe Stoclin
 * MIT Licensed
 */

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

import childProcess from 'child_process';
import * as cli from '../lib/cli';
import { utils } from '../lib/utils';

describe('cli', () => {
  test('should minify to have been called with gcc', () => {
    const spy = jest.spyOn(cli, 'run');
    return cli
      .run({
        compressor: 'gcc',
        input: 'examples/public/js/sample.js',
        output: 'examples/public/js-dist/babili-es6.js',
        option: '{"createSourceMap": true}'
      })
      .then(() => expect(spy).toHaveBeenCalled());
  });
  test('should minify to have been called with all compressors', () => {
    const spy = jest.spyOn(cli, 'run');
    return cli
      .run({
        compressor: 'all',
        input: 'examples/public/js/sample.js',
        output: 'examples/public/js-dist/babili-es6.js'
      })
      .then(() => expect(spy).toHaveBeenCalled());
  });
});

describe('cli error', () => {
  beforeEach(() => spyOn(childProcess, 'spawn').and.throwError('UnsupportedClassVersionError'));
  test('should minify to throw with gcc error', () => {
    const spy = jest.spyOn(cli, 'run');
    return cli
      .run({
        compressor: 'gcc-java',
        input: 'examples/public/js/sample.js',
        output: 'examples/public/js-dist/babili-es6.js'
      })
      .catch(err => {
        expect(spy).toHaveBeenCalled();
        return expect(err.message).toMatch(
          /(UnsupportedClassVersionError)|(Latest Google Closure Compiler requires Java >= 1.7, please update Java or use gcc-legacy)/
        );
      });
  });
});

describe('getFilesizeInBytes', () => {
  test('should return file size', () => expect(utils.getFilesizeInBytes('examples/public/js/sample.js')).toBe('613 B'));
});

describe('getFilesizeGzippedInBytes', () => {
  test('should return file size', done => {
    utils.getFilesizeGzippedInBytes('examples/public/js/sample.js').then(size => {
      expect(size).toBe('402 B');
      done();
    });
  });
});

describe('pretty bytes', () => {
  test('should throw when not a number', () => {
    expect(() => utils.prettyBytes('a')).toThrow();
  });

  test('should return a negative number', () => expect(utils.prettyBytes(-1)).toBe('-1 B'));

  test('should return 0', () => expect(utils.prettyBytes(0)).toBe('0 B'));
});
