# GeekBot

企业微信机器人专用的每日信息更新脚本。
目前支持如下插件：
- 毒鸡汤文本（dujitang，每1小时推送）
- v2ex 每日最新帖子（v2ex_latest，每天08:00推送)
- v2ex 每日最热帖子（v2ex_hot, 每天18:00推送）

## 配置
在项目的 `settings` -> `Secrets` 中添加 `bot_api` 字段，内容为企业群机器人webhook接口地址