// @flow

/*::
export type Element = any;
export type Matrix = Element[][];
type RowIndex = number;
type ColumnIndex = number;
export type EqualityChecker = (Element, Element) => boolean;
type IndexedElement = {
  element: Element,
  rowIndex: RowIndex,
  columnIndex: ColumnIndex,
};
type ConstructorOptions = {
  equalityChecker?: EqualityChecker,
};
 */

class MatchNFinder {
  /*::
  _equalityChecker: EqualityChecker;
  _matrix: Matrix;
   */

  constructor(matrix/*: Matrix*/, options/*: ConstructorOptions*/ = {}) {
    const initializedOptions = Object.assign({}, options, {
      equalityChecker: (a, b) => a === b,
    });

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

  _scanAroundRecursively(matchedIndexedElements/*: IndexedElement[]*/)/*: IndexedElement[]*/ {
    const targetDirections = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];
    const currentIndexedElement = matchedIndexedElements[matchedIndexedElements.length - 1];

    let nextMatchedIndexedElements = matchedIndexedElements.slice();

    targetDirections.forEach(direction => {
      const targetRowIndex = currentIndexedElement.rowIndex + direction[0];
      const targetColumnIndex = currentIndexedElement.columnIndex + direction[1];
      const targetElement = this._getElement(targetRowIndex, targetColumnIndex);

      if (
        !targetElement ||
        nextMatchedIndexedElements.some(v => {
          return v.rowIndex === targetRowIndex && v.columnIndex === targetColumnIndex;
        }) ||
        !this._equalityChecker(currentIndexedElement.element, targetElement)
      ) {
        return;
      }

      nextMatchedIndexedElements = this._scanAroundRecursively(
        nextMatchedIndexedElements.concat([{
          element: targetElement,
          rowIndex: targetRowIndex,
          columnIndex: targetColumnIndex,
        }])
      );
    });

    return nextMatchedIndexedElements;
  }

  findMatches(numberOfMatching/*: number*/)/*: IndexedElement[][]*/ {
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

        const oneMatchedSet = this._scanAroundRecursively([indexedElement]);

        oneMatchedSet.forEach(indexedElement => finishedElements.push(indexedElement.element));

        oneMatchedSet.sort((a, b) => {
          if (a.rowIndex !== b.rowIndex) {
            return a.rowIndex - b.rowIndex;
          }
          return a.columnIndex - b.columnIndex;
        });

        matches.push(oneMatchedSet);
      });
    });

    return matches
      .filter(v => v.length >= numberOfMatching);
  }
}

module.exports = MatchNFinder;
