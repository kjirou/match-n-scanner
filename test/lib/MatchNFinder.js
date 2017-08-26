// @flow

const assert = require('assert');
const {beforeEach, describe, it} = require('mocha');

const MatchNFinder = require('../../lib/MatchNFinder');

/*::
import type {IndexedElement, Matrix} from '../../lib/MatchNFinder';
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

  const sortIndexedElements = (indexedElements/*: IndexedElement[]*/) => {
    indexedElements.sort((a, b) => {
      if (a.rowIndex !== b.rowIndex) {
        return a.rowIndex - b.rowIndex;
      }
      return a.columnIndex - b.columnIndex;
    });
  };

  describe('_scanAroundRecursively', function() {
    describe('In the case of a horizontal straight line', function() {
      const matrix = createMatrixFromMapText([
        'AAA',
      ].join('\n'));
      const instance = new MatchNFinder(matrix);

      it('can scan from the left', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(0, 0),
        ]);
        sortIndexedElements(matched);

        assert.deepEqual(matched, [
          {
            element: 'A',
            rowIndex: 0,
            columnIndex: 0,
          },
          {
            element: 'A',
            rowIndex: 0,
            columnIndex: 1,
          },
          {
            element: 'A',
            rowIndex: 0,
            columnIndex: 2,
          },
        ]);
      });

      it('can scan from the center', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(0, 1),
        ]);
        sortIndexedElements(matched);

        assert.deepEqual(matched, [
          {
            element: 'A',
            rowIndex: 0,
            columnIndex: 0,
          },
          {
            element: 'A',
            rowIndex: 0,
            columnIndex: 1,
          },
          {
            element: 'A',
            rowIndex: 0,
            columnIndex: 2,
          },
        ]);
      });

      it('can scan from the right', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(0, 2),
        ]);
        sortIndexedElements(matched);

        assert.deepEqual(matched, [
          {
            element: 'A',
            rowIndex: 0,
            columnIndex: 0,
          },
          {
            element: 'A',
            rowIndex: 0,
            columnIndex: 1,
          },
          {
            element: 'A',
            rowIndex: 0,
            columnIndex: 2,
          },
        ]);
      });
    });

    describe('In the case of a vertical straight line', function() {
      const matrix = createMatrixFromMapText([
        'A',
        'A',
        'A',
      ].join('\n'));
      const instance = new MatchNFinder(matrix);

      it('can scan from the top', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(0, 0),
        ]);
        sortIndexedElements(matched);

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

      it('can scan from the center', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(1, 0),
        ]);
        sortIndexedElements(matched);

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

      it('can scan from the bottom', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(2, 0),
        ]);
        sortIndexedElements(matched);

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

    describe('In the case of a box', function() {
      const matrix = createMatrixFromMapText([
        'A',
        'A',
        'A',
      ].join('\n'));
      const instance = new MatchNFinder(matrix);
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
