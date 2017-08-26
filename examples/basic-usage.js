const MatchNScanner = require('../index');

const matrix = [
  ['A', 'B', 'C'],
  ['D', 'D', 'C'],
  ['C', 'A', 'C'],
];

const scanner = new MatchNScanner(matrix);

const matchesAbove3Length = scanner.scan({minMatchLength: 3});
console.log(matchesAbove3Length);
// ->
//   [ [ { element: 'C', rowIndex: 0, columnIndex: 2 },
//       { element: 'C', rowIndex: 1, columnIndex: 2 },
//       { element: 'C', rowIndex: 2, columnIndex: 2 } ] ]

const matchesAbove2Length = scanner.scan({minMatchLength: 2});
console.log(matchesAbove2Length);
// ->
//   [ [ { element: 'C', rowIndex: 0, columnIndex: 2 },
//       { element: 'C', rowIndex: 1, columnIndex: 2 },
//       { element: 'C', rowIndex: 2, columnIndex: 2 } ],
//     [ { element: 'D', rowIndex: 1, columnIndex: 0 },
//       { element: 'D', rowIndex: 1, columnIndex: 1 } ] ]
