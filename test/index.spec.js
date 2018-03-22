const {accessSync, constants, readFileSync, writeFileSync} = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const glob = require('glob');
const tempura = require('../src');

describe('tempura', () => {
  it('should create empty dir in tmp', () => {
    const {dir, cleanup} = tempura();
    expect(exists(dir)).toBe(true);
    cleanup();
  });

  it('should generate project with few files', () => {
    const tree = {'src/file.js': ';', 'test/test.js': ';', 'package.json': '{}'};
    const {dir, cleanup} = tempura(tree);
    expect(listFiles(dir)).toEqual(expect.arrayContaining(Object.keys(tree)));
    cleanup();
  });

  it('should generate project when passing tree', () => {
    const tree = {src: {'file.js': ';'}};
    const {dir, cleanup} = tempura(tree);
    expect(listFiles(dir)).toEqual(['src/file.js']);
    cleanup();
  });

  describe('.files', () => {
    it('should return the content of a file', () => {
      const {dir, files, cleanup} = tempura({'file.js': ';'});
      const fileContent = readFile(path.join(dir, 'file.js'));
      expect(files['file.js']).toBe(fileContent);
      cleanup();
    });

    it('should return undefined for file which doesn\'t exist', () => {
      const {files, cleanup} = tempura();
      expect(files['file.js']).toBeUndefined();
      cleanup();
    });

    it('should change the content of a file', () => {
      const {dir, files, cleanup} = tempura({'file.js': ';'});
      files['file.js'] = 'break;';
      const fileContent = readFile(path.join(dir, 'file.js'));
      expect(files['file.js']).toBe(fileContent);
      cleanup();
    });

    it('should return the whole list of files', () => {
      const {dir, files, cleanup} = tempura();
      const file = writeFileSync(path.join(dir, 'file.js'), ';');
      expect(files.list).toEqual(['file.js']);
      cleanup();
    });
  });

  describe('.cleanup()', () => {
    it('should remove directory from tmp', () => {
      const {dir, cleanup} = tempura();
      cleanup();
      expect(exists(dir)).toBe(false);
    });
  });
});

function exists(fileOrFolder) {
  try {
    accessSync(fileOrFolder, constants.R_OK);
    return true;
  } catch (err) {
    return false
  }
}

function listFiles(cwd) {
  return glob.sync('**/*', {nodir: true, cwd});
}

function readFile(file) {
  return readFileSync(file, 'utf-8');
}
