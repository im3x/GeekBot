// 微擎商城信息列表

const Bot = require('../modules/bot');
const Cache = require('../modules/cache');
const axios = require('axios').default;

class Plugin extends Bot {
  constructor () {
    super();
    this.COOKIE = process.env.w7_cookie;
    if (!this.COOKIE) return this.exit();
  }
  run () {
    const cache = new Cache();
    axios.get('https://user.w7.cc/v1/message/list?page=1', {
      headers: {
        'Cookie': this.COOKIE
      }
    }).then(res => {
      const { data } = res.data;
      if (!data) return this.sendText("w7_message: cookie过期了");
      const d = data[0];
      const c = cache.get(d.createtime);
      if (c) return console.log('sended');
      this.sendMarkdown(`# ${d.type_text}\n> ${d.create_date_format}\n\n${d.detail}`);
      cache.set(d.createtime, "ok");
    });
  }
}

new Plugin().run();