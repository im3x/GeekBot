// 彩云天气
// 获取GPS地址：https://api.map.baidu.com/lbsapi/getpoint/index.html
// 请先在secrets中设置caiyun_key 和caiyun_gps
// 多个gps坐标，请使用|分隔开，比如11.11,22.22|33.33,44.44

const Bot = require('../modules/bot');
const axios = require('axios').default;
const process = require('process');

class Plugin extends Bot {
  constructor () {
    super();
    const { caiyun_key, caiyun_gps } = process.env;
    if (!caiyun_key || !caiyun_gps) {
      console.error('! 请先配置secrets:caiyun_gps,caiyun_key');
      return this.exit();
    }
    this.API_KEY = caiyun_key;
    this.GPS = caiyun_gps;
  }

  async run () {
    // 判断是否是多gps
    const _gps = this.GPS.split('|');
    _gps.map(async gps => {
      const tmp = gps.split('@');
      const api = `https://api.caiyunapp.com/v2.5/${this.API_KEY}/${tmp[0]}/weather.json?alert=true`;
      await axios.get(api).then(async res => {
        const { data } = res;
        await this._sendData(data, tmp[1]);
      })
    });
  }

  async _sendData (data, addr = '') {
    // 预警信息
    let alert_md = '';
    if (data.result.alert.content.length > 0) {
      alert_md += '天气预警 ⚠\n';
      data.result.alert.content.map(a => {
        alert_md += `**${a.title}**\n> <font color="comment">${a.description}</font>\n\n`;
      });
    }
    await this.sendMarkdown(`
彩云天气 🌤 <font color="info">${addr || ''}</font>

**降雨提醒：**
> <font color="warning">${data.result.minutely.description.trim()}</font>

**天气预报：**
> <font color="info">${data.result.hourly.description.trim()}</font>

${alert_md}`);
  }
}

new Plugin().run()