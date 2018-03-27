const {tmpdir} = require('os');
const {writeFileSync, readFileSync} = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const glob = require('glob');

module.exports = (tree = {}) => {
  const dir = uniqueDir();
  const flatten = flattenTree(tree);
  const files = new Proxy({}, {
    get: (obj, prop) => {
      if (prop in obj) {
        return obj[prop];
      } else if (prop === 'list') {
        return glob.sync('**/*', {cwd: dir, nodir: true});
      } else {
        return readFile(prop);
      }
    },
    set: (obj, prop, value) =>
      prop in obj ? obj[prop] = value : writeFile(prop, value)
  });
  const cista = {dir, cleanup, files};

  mkdirp.sync(dir);
  Object.keys(flatten).forEach(file =>
    cista.files[file] = flatten[file]);

  function readFile(file) {
    try {
      return readFileSync(path.join(dir, file), 'utf-8');
    } catch(ex) {};
  }

  function writeFile(file, data) {
    const fullPath = path.join(dir, file);
    const content = data.replace(/'/g, `'\\''`);
    mkdirp.sync(path.dirname(fullPath));
    return writeFileSync(fullPath, content);
  }

  function cleanup() {
    return rimraf.sync(dir, {rmdir: true});
  }

  return cista;
}

function uniqueDir() {
  return path.join(tmpdir(), new Date().getTime().toString());
}

function flattenTree(tree, prefix) {
  let result = {};
  prefix = prefix ? prefix + path.sep : '';
  Object.keys(tree).forEach(key => {
    const value = tree[key];
    if (typeof value === 'string') {
      result[prefix + key] = value;
    } else {
      result = Object.assign(result, flattenTree(value, prefix + key));
    }
  });
  return result;
}
