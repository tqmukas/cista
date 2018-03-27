# Cista [![Build Status](https://travis-ci.org/tqmukas/cista.svg?branch=master)](https://travis-ci.org/tqmukas/cista)
Create and manipulate a temporary project.

Might be useful to test node tools that interact with the file system.

[![NPM](https://nodei.co/npm/cista.png)](https://nodei.co/npm/cista/)

## Install
`npm install cista`

## Usage
```js
const cista = require('cista');

const fileTree = {
  'src/app.js': ';',
  'package.json': '{}'
};

const project = cista(fileTree);
```

## API
### .dir {String}
Path to the temporary project.

### .files {Object}
Retrieve and modify files in the temporary directory.

#### .files.list {Array<String>}
The list of files in the temporary project.

#### .files[fileName] {String}
Read, change or write the content of a single file.

```js
const {files} = cista(fileTree);

console.log(files['src/app.js']); // Outputs `;`

project.files['src/app.js'] = 'break;';

console.log(files['src/app.js']); // Outputs `break;`
```

### cleanup()
Delete the temporary project from file system.

## License
[MIT](/LICENSE)
