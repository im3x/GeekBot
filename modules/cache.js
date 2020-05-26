const os = require('os');
const fs = require('fs');
const path = require('path');

class Cache {
  constructor () {
    this.PATH = os.tmpdir();
  }
  set (key, value) {
    try {
      fs.writeFileSync(path.join(this.PATH, 'w7_'+String(key)), value);
      return true;
    } catch(e) {
      return false;
    }
  }
  get (key) {
    try {
      const data = fs.readFileSync(path.join(this.PATH, 'w7_'+String(key)));
      return data.toString();
    } catch(e) {
      return false;
    }
  }
}

module.exports = Cache;