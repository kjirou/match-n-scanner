# match-n-scanner

[![npm version](https://badge.fury.io/js/match-n-scanner.svg)](https://badge.fury.io/js/match-n-scanner)
[![CircleCI](https://circleci.com/gh/kjirou/match-n-scanner.svg?style=svg)](https://circleci.com/gh/kjirou/match-n-scanner)
[![Build Status](https://travis-ci.org/kjirou/match-n-scanner.svg?branch=master)](https://travis-ci.org/kjirou/match-n-scanner)

Scan the matrix and return parts where equal values are connected.

It is intended to be used for [Match 3 games](https://en.wikipedia.org/wiki/Category:Match_3_games), Match 4 games, .. and others.


## Installation

```bash
npm install match-n-scanner
```


## Basic usage

```js
const MatchNScanner = require('match-n-scanner');

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
```


## APIs

Sorry, see [tests](/test/lib/MatchNScanner.js) or [source code](/lib/MatchNScanner.js) for a detailed explanation.

### MatchNScanner class
#### constructor(matrix, options = {})
#### fromText(matrixAsText, options = {})
### MatchNScanner instance
#### scan(options = {})
