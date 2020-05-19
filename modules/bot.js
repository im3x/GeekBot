const axios = require('axios').default;
const fs = require('fs');
const crypto = require('crypto');
const process = require('process');
const FormData = require('form-data');

class Bot {
  constructor () {
    // 企业微信机器人API地址
    const { bot_api } = process.env;
    if (!bot_api) {
      console.log('[!] 请先设置企业微信群机器人webhook');
      return this.exit();
    }
    this.BOT_API = process.env.bot_api;
    this.BOT_KEY = this.BOT_API.split('key=')[1];
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
    return await axios.post(this.BOT_API, Object.assign({
      msgtype: type,
    }, data))
  }

  // 计算md5
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
  async sendText (content, mentioned_list = [], mentioned_mobile_list = []) {
    return await this._send('text', {
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
  async sendMarkdown (content) {
    return await this._send('markdown', {
      markdown: {
        content
      }
    })
  }

  /**
   * 发送文件，media_id为上传文件后获得的id
   * @param {string} media_id 临时文件的id，也可以直接传递this.uploadFile后的返回值
   */
  async sendFile (media_id) {
    if (typeof media_id === 'object') media_id = media_id.media_id;
    return await this._send("file", {
      file: {
        media_id
      }
    });
  }

  /**
   * 发送图片
   * @param {string} src 图片路径，可以是本地仓库（path/file.jpg），或者远程URL（http..
   */
  async sendImage (src) {
    return await new Promise(RES => {
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
      return await this._send("image", {
        image: {
          base64: _b64,
          md5: _md5
        }
      })
    });
  }

  /**
   * 发送文章列表
   * @param {array} articles 文章列表（title,description,url,picurl）
   */
  async sendNews (articles) {
    return await this._send('news', {
      news: {
        articles
      }
    })
  }

  /**
   * 上传文件，返回文件media_id，media_id仅三天内有效，且只能在同一个企业应用内共享
   * @param {string} filename 文件名称，在文件卡片显示
   * @param {buffer} data 文件内容
   */
  async uploadFile (filename, data) {
    const UPLOAD_API = `https://qyapi.weixin.qq.com/cgi-bin/webhook/upload_media?key=${this.BOT_KEY}&type=file`;
    const file = new FormData();
    file.append("media", data, {
      filename,
      knownLength: Buffer.from(data).byteLength
    });

    return await axios({
      method: 'POST',
      url: UPLOAD_API,
      data: file,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(async r => {
      return await r.data;
    })
  }
}
module.exports = Bot