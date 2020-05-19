// 一个图文
const Bot = require('../modules/bot');
const axios = require('axios').default;

class Plugin extends Bot {
  constructor () {
    super();
    this.API = "http://m.wufazhuce.com/one";
  }

  async run () {
    const { cookie, token } = await this._getInfo();
    const data = await this._getData(cookie, token);
    this.sendNews([
      {
        title: data.title,
        description: data.content,
        picurl: data.img_url,
        url: data.url
      }
    ]);
  }

  async _getInfo () {
    const res = await axios.get(this.API);
    const cookie = res.headers['set-cookie'];
    const token = res.data.split("One.token = '")[1].split("'")[0];
    return {
      token,
      cookie: cookie[0],
    }
  }

  async _getData (cookie, token) {
    const api = "http://m.wufazhuce.com/one/ajaxlist/0?_token="+token;
    const res = await axios.get(api, {
      headers: {
        'Cookie': cookie
      }
    });
    const data = res.data;
    return data.data[0];
  }
}

new Plugin().run();