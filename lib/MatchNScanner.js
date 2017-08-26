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
  // Expression for checking whether elements are equal
  equalityChecker?: EqualityChecker,
};
 */

class MatchNScanner {
  /*::
  _equalityChecker: EqualityChecker;
  _matrix: Matrix;
   */

  constructor(matrix/*: Matrix*/, options/*: ConstructorOptions*/ = {}) {
    const fixedOptions = Object.assign({
      equalityChecker: (a, b) => a === b,
    }, options);

    if (
      !Array.isArray(matrix) ||
      matrix.length === 0 ||
      !Array.isArray(matrix[0]) ||
      matrix[0].length === 0 ||
      !matrix.every(row => row.length === matrix[0].length)
    ) {
      throw new Error('Pass a matrix expressed in a two-dimensional array');
    }

    this._matrix = matrix;
    this._equalityChecker = fixedOptions.equalityChecker;
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

  scan(
    options/*: {
      // Minimum length to return
      minMatchLength?: number,

      // If it returns false, this element will be ignored
      sieve?: (Element) => boolean,
    }*/ = {}
  )/*: IndexedElement[][]*/ {
    const fixedOptions = Object.assign({
      minMatchLength: 1,
      sieve: (element) => true,
    }, options);

    const matches = [];
    let finishedIndexedElements = [];

    this._matrix.forEach((row, rowIndex) => {
      return row.forEach((element, columnIndex) => {
        const indexedElement = {
          element,
          rowIndex,
          columnIndex,
        };

        if (
          finishedIndexedElements.some(v => {
            return v.rowIndex === indexedElement.rowIndex && v.columnIndex === indexedElement.columnIndex;
          }) ||
          !fixedOptions.sieve(indexedElement.element)
        ) {
          return;
        }

        const matched = this._scanAroundRecursively([indexedElement]);

        matched.forEach(indexedElement => finishedIndexedElements.push(indexedElement));

        matched.sort((a, b) => {
          if (a.rowIndex !== b.rowIndex) {
            return a.rowIndex - b.rowIndex;
          }
          return a.columnIndex - b.columnIndex;
        });

        matches.push(matched);
      });
    });

    return matches
      .filter(v => v.length >= fixedOptions.minMatchLength);
  }

  static fromText(matrixAsText/*: string*/, options/*: ConstructorOptions*/ = {}) {
    const matrix = matrixAsText
      .replace(/(?:\r\n|\r)/g, '\n')
      .replace(/\n$/, '')
      .split('\n')
      .map(line => line.split(''));

    return new MatchNScanner(matrix, options);
  }
}

module.exports = MatchNScanner;
