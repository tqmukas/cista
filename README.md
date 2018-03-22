# Tempura
Create and manipulate a temporary project.

Might be useful to test node tools that interact with the file system.

## Install
`npm install tempura`

## Usage
```js
const tempura = require('tempura');

const fileTree = {
  'src/app.js': ';',
  'package.json': '{}'
};

const project = tempura(fileTree);
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
const {files} = tempura(fileTree);

console.log(files['src/app.js']); // Outputs `;`

project.files['src/app.js'] = 'break;';

console.log(files['src/app.js']); // Outputs `break;`
```

### project.cleanup()
Delete the temporary project from file system.

## License
[MIT](/LICENSE)
