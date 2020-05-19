# GeekBot

企业微信机器人专用的每日信息更新脚本。
目前支持如下插件：
- 毒鸡汤文本（dujitang，每1小时推送）
- v2ex 每日最新帖子（v2ex_latest，每天08:00推送)
- v2ex 每日最热帖子（v2ex_hot, 每天18:00推送）
- 彩云天气预报（caiyun_weather，每小时整推送）

## 配置
在项目的 `settings` -> `Secrets` 中添加 `bot_api` 字段，内容为企业群机器人webhook接口地址

## 禁用插件
比如禁用毒鸡汤，则添加`secrets`->`plug_dujitang_disabled`=`true`

## 彩云天气配置
在项目`settings`->`Secrets` 中，添加：
1. `caiyun_key`，为彩云API的开发者令牌（前往[彩云天气开发者中心](https://dashboard.caiyunapp.com/)申请），或使用官方测试KEY（仅供测试）：`TAkhjf8d1nlSlspN`
2. `caiyun_gps`，为要获取的天气的GPS坐标，可在[百度地图GPS获取](https://api.map.baidu.com/lbsapi/getpoint/index.html)页面获取后复制，多个GPS坐标请用`|`符号分割，地名在坐标后用`@`符号链接

`caiyun_gps` 格式如下：
> `111.22,333.44@地址1|444.55,555.66@地址2`


## 注意
cron 时间为美国时间，需要北京时间减去8小时设置。
比如你想在北京时间`08:00`运行，则需要设置（8-8=0）成：`0 0 * * *`

