const MatchNScanner = require('../index');

const matrix = [
  ['A', 'B', 'C'],
  ['D', 'D', 'C'],
  ['C', 'A', 'C'],
];

const scanner = new MatchNScanner(matrix);

const matchesOf3OrMore = scanner.scan({minMatchLength: 3});
console.log(matchesOf3OrMore);
// ->
//   [ [ { element: 'C', rowIndex: 0, columnIndex: 2 },
//       { element: 'C', rowIndex: 1, columnIndex: 2 },
//       { element: 'C', rowIndex: 2, columnIndex: 2 } ] ]

const matchesOf2OrMore = scanner.scan({minMatchLength: 2});
console.log(matchesOf2OrMore);
// ->
//   [ [ { element: 'C', rowIndex: 0, columnIndex: 2 },
//       { element: 'C', rowIndex: 1, columnIndex: 2 },
//       { element: 'C', rowIndex: 2, columnIndex: 2 } ],
//     [ { element: 'D', rowIndex: 1, columnIndex: 0 },
//       { element: 'D', rowIndex: 1, columnIndex: 1 } ] ]
