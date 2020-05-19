const Bot = require('./modules/bot');
const process = require('process');

require('./modules/date-format');

class Plugin extends Bot {
  constructor () {
    super();
  }
  async run () {
    await this.image('assets/geekbot.png');
    await this.markdown("🤖 Hello! GeekBot!\n> 项目地址：[@GeekBot](https://github.com/im3x/GeekBot)\n> 启动时间：" + new Date().Format('M/d h:m:s'));

    // 发送环境配置信息
    await this.text("send secrets..");
    await this.markdown(process.env.secrets);
    await this.text("send ok");
  }
}

new Plugin().run();