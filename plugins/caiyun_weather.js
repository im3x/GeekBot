// 彩云天气
// GPS 地理位置，请手动获取
// 可以微信搜索：小程序示例，点击接口->位置，获取位置，即可显示当前的GPS坐标

const Bot = require('../modules/bot');
const axios = require('axios').default;

class Plugin extends Bot {
  constructor () {
    super();
    this.API_KEY = 'TAkhjf8d1nlSlspN';
    // 也可以是数组形式，比如['11.11,22.22', '33.33,44.44']
    this.GPS = '109.12,23.20';
  }

  run () {
    const api = `https://api.caiyunapp.com/v2.5/${this.API_KEY}/${this.GPS}/weather.json?alert=true`;
    axios.get(api).then(res => {
      const { data } = res;
      // 预警信息
      let alert_md = '';
      if (data.result.alert.content.length > 0) {
        alert_md += '## ⚠ 天气预警\n';
        data.result.alert.content.map(a => {
          alert_md += `**${a.title}**\n> ${a.description}\n\n`;
        });
      }
      this.markdown(`
## 🌤 彩云天气

**降雨提醒：**
> <font color="warning">${data.result.minutely.description.trim()}</font>

**天气预报：**
> <font color="info">${data.result.hourly.description.trim()}</font>

${alert_md}
`);
    })
  }
}

new Plugin().run()