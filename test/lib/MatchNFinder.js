// @flow

const assert = require('assert');
const {beforeEach, describe, it} = require('mocha');

const MatchNFinder = require('../../lib/MatchNFinder');

/*::
import type {Matrix} from '../../lib/MatchNFinder';
 */


describe('lib/MatchNFinder', function() {
  const createMatrixFromMapText = (mapText/*: string*/)/*: Matrix*/ => {
    const symbols = mapText
      .split('\n')
      .map(line => line.split(''));

    return symbols.map(row => {
      return row.map(symbol => {
        return symbol;
      });
    });
  };

  describe('_scanAroundRecursively', function() {
    describe('In the case of a straight line', function() {
      const matrix = createMatrixFromMapText([
        'A',
        'A',
        'A',
      ].join('\n'));

      let instance;

      beforeEach(function() {
        instance = new MatchNFinder(matrix);
      });

      it('can scan from the edge', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(0, 0),
        ]);

        assert.deepEqual(matched, [
          {
            element: 'A',
            rowIndex: 0,
            columnIndex: 0,
          },
          {
            element: 'A',
            rowIndex: 1,
            columnIndex: 0,
          },
          {
            element: 'A',
            rowIndex: 2,
            columnIndex: 0,
          },
        ]);
      });
    });

    describe('In the case of a combination of points or straight lines', function() {
      beforeEach(function() {
        this._matrix = createMatrixFromMapText([
          'ABB',
          'ACD',
          'ACE',
          'FFF',
        ].join('\n'));
      });
    });
  });
});
