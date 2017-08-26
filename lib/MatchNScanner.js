// @flow

/*::
export type Element = any;
export type Matrix = Element[][];
type RowIndex = number;
type ColumnIndex = number;
export type EqualityChecker = (Element, Element) => boolean;
export type IndexedElement = {
  element: Element,
  rowIndex: RowIndex,
  columnIndex: ColumnIndex,
};
type ConstructorOptions = {
  equalityChecker?: EqualityChecker,
};
 */

class MatchNScanner {
  /*::
  _equalityChecker: EqualityChecker;
  _matrix: Matrix;
   */

  constructor(matrix/*: Matrix*/, options/*: ConstructorOptions*/ = {}) {
    const initializedOptions = Object.assign({}, {
      equalityChecker: (a, b) => a === b,
    }, options);

    // TODO: Validate the mismatch between row-length and column-length.

    this._matrix = matrix;
    this._equalityChecker = initializedOptions.equalityChecker;
  }

  _getElement(rowIndex/*: RowIndex*/, columnIndex/*: ColumnIndex*/)/*: Element | null*/ {
    const row = this._matrix[rowIndex];
    if (!row) {
      return null;
    }
    return row[columnIndex] || null;
  }

  /**
   * For testing
   */
  _getIndexedElement(rowIndex/*: RowIndex*/, columnIndex/*: ColumnIndex*/)/*: IndexedElement*/ {
    const element = this._getElement(rowIndex, columnIndex);

    if (!element) {
      throw new Error('Can not find an element');
    }

    return {
      element,
      rowIndex,
      columnIndex,
    };
  }

  _scanAroundRecursively(matches/*: IndexedElement[]*/)/*: IndexedElement[]*/ {
    const targetDirections = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];
    const currentIndexedElement = matches[matches.length - 1];

    let nextMatches = matches.slice();

    targetDirections.forEach(direction => {
      const targetRowIndex = currentIndexedElement.rowIndex + direction[0];
      const targetColumnIndex = currentIndexedElement.columnIndex + direction[1];
      const targetElement = this._getElement(targetRowIndex, targetColumnIndex);

      if (
        !targetElement ||
        nextMatches.some(v => {
          return v.rowIndex === targetRowIndex && v.columnIndex === targetColumnIndex;
        }) ||
        !this._equalityChecker(currentIndexedElement.element, targetElement)
      ) {
        return;
      }

      nextMatches = this._scanAroundRecursively(
        nextMatches.concat([{
          element: targetElement,
          rowIndex: targetRowIndex,
          columnIndex: targetColumnIndex,
        }])
      );
    });

    return nextMatches;
  }

  scan()/*: IndexedElement[][]*/ {
    const matches = [];
    let finishedElements = [];

    // TODO: Ignore option
    this._matrix.forEach((row, rowIndex) => {
      return row.forEach((element, columnIndex) => {
        const indexedElement = {
          element,
          rowIndex,
          columnIndex,
        };

        if (
          finishedElements.some(v => v === indexedElement.element)
        ) {
          return;
        }

        const matched = this._scanAroundRecursively([indexedElement]);

        matched.forEach(indexedElement => finishedElements.push(indexedElement.element));

        matched.sort((a, b) => {
          if (a.rowIndex !== b.rowIndex) {
            return a.rowIndex - b.rowIndex;
          }
          return a.columnIndex - b.columnIndex;
        });

        matches.push(matched);
      });
    });

    return matches;
  }
}

module.exports = MatchNScanner;
