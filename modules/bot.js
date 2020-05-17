const axios = require('axios').default;
const fs = require('fs');
const crypto = require('crypto');
const process = require('process');

class Bot {
  constructor () {
    // 企业微信机器人API地址
    const { bot_api } = process.env;
    if (!bot_api) {
      console.log('[!] 请先设置企业微信群机器人webhook');
      return this.exit();
    }
    this.BOT_API = process.env.bot_api;
  }

  exit () {
    process.exit(0);
  }

  /**
   * 发送HTTP请求到API
   * @param {string} type 
   * @param {object} data 
   */
  async _send (type, data) {
    await axios.post(this.BOT_API, Object.assign({
      msgtype: type,
    }, data))
  }

  _md5 (data) {
    let hash = crypto.createHash('md5');
    return hash.update(data).digest('hex');
  }

  /**
   * 发送纯文本信息，第一个参数必选，后两个参数可选
   * @param {string} content 要发送的文本内容
   * @param {array} mentioned_list 要AT的用户ID列表
   * @param {array} mentioned_mobile_list 要AT的用户手机列表
   */
  async text (content, mentioned_list = [], mentioned_mobile_list = []) {
    await this._send('text', {
      text: {
        mentioned_list,
        mentioned_mobile_list,
        content
      }
    })
  }

  /**
   * 发送markdown富文本内容
   * @param {string} content 
   */
  async markdown (content) {
    await this._send('markdown', {
      markdown: {
        content
      }
    })
  }

  /**
   * 上传图片
   * @param {string} src 图片的链接SRC，可以是代码仓库路径，也可以是URL
   */
  async image (src) {
    await new Promise(RES => {
      if (src.startsWith('http')) {
        // 远程图片
        axios.get(src, {
          responseType: 'arraybuffer'
        }).then(res => {
          RES(res.data);
        });
      } else {
        // 本地仓库图片
        RES(fs.readFileSync(src));
      }
    }).then(async data => {
      const _md5 = this._md5(data);
      const _b64 = Buffer.from(data).toString("base64");
      await this._send("image", {
        image: {
          base64: _b64,
          md5: _md5
        }
      })
    });
  }

  // 发送文件
  file () {}
  /**
   * 发送文章列表
   * @param {array} articles 文章列表（title,description,url,picurl）
   */
  async news (articles) {
    await this._send('news', {
      news: {
        articles
      }
    })
  }
}
module.exports = Bot