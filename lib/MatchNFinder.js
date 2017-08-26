// @flow

/*::
type Element = any;
type Matrix = Element[][];
type RowIndex = number;
type ColumnIndex = number;
type EqualityChecker = (Element, Element) => boolean;
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

  _scanAroundRecursively(
    rowIndex/*: RowIndex*/,
    columnIndex/*: ColumnIndex*/,
    matchedIndexedElements/*: IndexedElement[]*/
  )/*: IndexedElement[]*/ {
    const targetDirections = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];
    const currentElement = this._getElement(rowIndex, columnIndex);

    let nextMatchedIndexedElements = matchedIndexedElements.slice();

    targetDirections.forEach(direction => {
      const targetRowIndex = rowIndex + direction[0];
      const targetColumnIndex = columnIndex + direction[1];
      const targetElement = this._getElement(targetRowIndex, targetColumnIndex);

      if (
        !targetElement ||
        matchedIndexedElements.some(v => v.element === currentElement) ||
        this._equalityChecker(currentElement, targetElement)
      ) {
        return;
      }

      //nextMatchedIndexedElements.push(targetElement);

      nextMatchedIndexedElements = this._scanAroundRecursively(
        targetRowIndex,
        targetColumnIndex,
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

        const oneMatchedSet = this._scanAroundRecursively(
          indexedElement.rowIndex,
          indexedElement.columnIndex,
          [indexedElement]
        );

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
