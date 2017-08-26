const assert = require('assert');
const {beforeEach, describe, it} = require('mocha');

const MatchNScanner = require('../../lib/MatchNScanner');


describe('lib/MatchNScanner', function() {
  const createMatrixFromMapText = (mapText) => {
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
    const sortIndexedElements = (indexedElements) => {
      indexedElements.sort((a, b) => {
        if (a.rowIndex !== b.rowIndex) {
          return a.rowIndex - b.rowIndex;
        }
        return a.columnIndex - b.columnIndex;
      });
    };

    describe('In the case of a horizontal straight line', function() {
      const matrix = createMatrixFromMapText([
        'AAA',
      ].join('\n'));
      const instance = new MatchNScanner(matrix);
      const expected = [
        { element: 'A',
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
      ];

      it('can scan from the left', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(0, 0),
        ]);
        sortIndexedElements(matched);

        assert.deepEqual(matched, expected);
      });

      it('can scan from the center', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(0, 1),
        ]);
        sortIndexedElements(matched);

        assert.deepEqual(matched, expected);
      });

      it('can scan from the right', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(0, 2),
        ]);
        sortIndexedElements(matched);

        assert.deepEqual(matched, expected);
      });
    });

    describe('In the case of a vertical straight line', function() {
      const matrix = createMatrixFromMapText([
        'A',
        'A',
        'A',
      ].join('\n'));
      const instance = new MatchNScanner(matrix);
      const expected = [
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
      ];

      it('can scan from the top', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(0, 0),
        ]);
        sortIndexedElements(matched);

        assert.deepEqual(matched, expected);
      });

      it('can scan from the center', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(1, 0),
        ]);
        sortIndexedElements(matched);

        assert.deepEqual(matched, expected);
      });

      it('can scan from the bottom', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(2, 0),
        ]);
        sortIndexedElements(matched);

        assert.deepEqual(matched, expected);
      });
    });

    describe('In the case of a box', function() {
      const matrix = createMatrixFromMapText([
        'AA',
        'AA',
      ].join('\n'));
      const instance = new MatchNScanner(matrix);
      const expected = [
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
          rowIndex: 1,
          columnIndex: 0,
        },
        {
          element: 'A',
          rowIndex: 1,
          columnIndex: 1,
        },
      ];

      it('can scan from the top-left', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(0, 0),
        ]);
        sortIndexedElements(matched);

        assert.deepEqual(matched, expected);
      });

      it('can scan from the bottom-right', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(0, 0),
        ]);
        sortIndexedElements(matched);

        assert.deepEqual(matched, expected);
      });
    });

    describe('In the case of a nested tree', function() {
      const matrix = createMatrixFromMapText([
        'A A ',
        'AAAA',
        'A A ',
      ].join('\n'));
      const instance = new MatchNScanner(matrix);
      const expected = [
        {
          element: 'A',
          rowIndex: 0,
          columnIndex: 0,
        },
        {
          element: 'A',
          rowIndex: 0,
          columnIndex: 2,
        },
        {
          element: 'A',
          rowIndex: 1,
          columnIndex: 0,
        },
        {
          element: 'A',
          rowIndex: 1,
          columnIndex: 1,
        },
        {
          element: 'A',
          rowIndex: 1,
          columnIndex: 2,
        },
        {
          element: 'A',
          rowIndex: 1,
          columnIndex: 3,
        },
        {
          element: 'A',
          rowIndex: 2,
          columnIndex: 0,
        },
        {
          element: 'A',
          rowIndex: 2,
          columnIndex: 2,
        },
      ];

      it('can scan from the edge of top', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(0, 2),
        ]);
        sortIndexedElements(matched);

        assert.deepEqual(matched, expected);
      });

      it('can scan from the edge of left', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(1, 0),
        ]);
        sortIndexedElements(matched);

        assert.deepEqual(matched, expected);
      });

      it('can scan from the center of the cross', function() {
        const matched = instance._scanAroundRecursively([
          instance._getIndexedElement(1, 2),
        ]);
        sortIndexedElements(matched);

        assert.deepEqual(matched, expected);
      });
    });
  });

  describe('scan', function() {
    describe('In the case of only one element type', function() {
      const matrix = createMatrixFromMapText([
        'AA',
        'AA',
      ].join('\n'));
      const instance = new MatchNScanner(matrix);

      it('should be executed correctly', function() {
        assert.deepEqual(instance.scan(), [
          [
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
              rowIndex: 1,
              columnIndex: 0,
            },
            {
              element: 'A',
              rowIndex: 1,
              columnIndex: 1,
            },
          ],
        ]);
      });
    });

    describe('In the case of two element types', function() {
      const matrix = createMatrixFromMapText([
        'AAB',
        'ABB',
      ].join('\n'));
      const instance = new MatchNScanner(matrix);

      it('should be executed correctly', function() {
        assert.deepEqual(instance.scan(), [
          [
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
              rowIndex: 1,
              columnIndex: 0,
            },
          ],
          [
            {
              element: 'B',
              rowIndex: 0,
              columnIndex: 2,
            },
            {
              element: 'B',
              rowIndex: 1,
              columnIndex: 1,
            },
            {
              element: 'B',
              rowIndex: 1,
              columnIndex: 2,
            },
          ],
        ]);
      });
    });

    describe('options.minMatchLength', function() {
      it('should be executed correctly', function() {
        const matrix = createMatrixFromMapText([
          'ABB',
          'CCC',
        ].join('\n'));
        const instance = new MatchNScanner(matrix);

        const matchesAbove2Length = instance.scan({minMatchLength: 2});
        assert.deepEqual(matchesAbove2Length, [
          [
            {
              element: 'B',
              rowIndex: 0,
              columnIndex: 1,
            },
            {
              element: 'B',
              rowIndex: 0,
              columnIndex: 2,
            },
          ],
          [
            {
              element: 'C',
              rowIndex: 1,
              columnIndex: 0,
            },
            {
              element: 'C',
              rowIndex: 1,
              columnIndex: 1,
            },
            {
              element: 'C',
              rowIndex: 1,
              columnIndex: 2,
            },
          ],
        ]);

        const matchesAbove3Length = instance.scan({minMatchLength: 3});
        assert.deepEqual(matchesAbove3Length, [
          [
            {
              element: 'C',
              rowIndex: 1,
              columnIndex: 0,
            },
            {
              element: 'C',
              rowIndex: 1,
              columnIndex: 1,
            },
            {
              element: 'C',
              rowIndex: 1,
              columnIndex: 2,
            },
          ],
        ]);

        const matchesAbove4Length = instance.scan({minMatchLength: 4});
        assert.deepEqual(matchesAbove4Length, []);
      });
    });

    describe('options.sieve', function() {
      it('should be executed correctly', function() {
        const matrix = createMatrixFromMapText([
          '    ',
          ' AB ',
          ' A  ',
        ].join('\n'));
        const instance = new MatchNScanner(matrix);

        const matches = instance.scan({
          sieve: (element) => element !== ' ',
        });
        assert.deepEqual(matches, [
          [
            {
              element: 'A',
              rowIndex: 1,
              columnIndex: 1,
            },
            {
              element: 'A',
              rowIndex: 2,
              columnIndex: 1,
            },
          ],
          [
            {
              element: 'B',
              rowIndex: 1,
              columnIndex: 2,
            },
          ],
        ]);
      });
    });
  });

  describe('constructor', function() {
    it('should raise an error when the matrix is wrong', function() {
      assert.throws(() => {
        new MatchNScanner(undefined);
      }, / matrix /);

      assert.throws(() => {
        new MatchNScanner([]);
      }, / matrix /);

      assert.throws(() => {
        new MatchNScanner([[]]);
      }, / matrix /);

      assert.throws(() => {
        new MatchNScanner([[1], []]);
      }, / matrix /);

      assert.throws(() => {
        new MatchNScanner([[1], [1, 1]]);
      }, / matrix /);
    });

    describe('options.equalityChecker', function() {
      it('should be executed correctly', function() {
        const matrix = createMatrixFromMapText([
          'ABC',
        ].join('\n'));
        const instance = new MatchNScanner(matrix, {
          equalityChecker: (a, b) => {
            return a === b ||
              a === 'A' && b === 'B' ||
              a === 'B' && b === 'A';
          }
        });

        assert.deepEqual(instance.scan(), [
          [
            {
              element: 'A',
              rowIndex: 0,
              columnIndex: 0,
            },
            {
              element: 'B',
              rowIndex: 0,
              columnIndex: 1,
            },
          ],
          [
            {
              element: 'C',
              rowIndex: 0,
              columnIndex: 2,
            },
          ],
        ]);
      });
    });
  });
});
