# GeekBot
> 企业微信机器人每日定时推送信息脚本。    
> **也许是最有上班感觉的摸鱼神器！**

![](assets/geekbot.png)

![](https://i.loli.net/2020/05/20/MgEONhb2WKuQ6c4.gif)

### 目前支持如下插件：
- 毒鸡汤文本（dujitang，每1小时推送）
- v2ex 每日最新帖子（v2ex_latest，每天08:00推送)
- v2ex 每日最热帖子（v2ex_hot, 每天18:00推送）
- 彩云天气预报（caiyun_weather，每小时整推送）
- ONE一个图文（one，每天08:20推送）
- 早安心语（good_morning，每天 08:05）

## 配置
在项目的 `settings` -> `Secrets` 中添加 `bot_api` 字段，内容为企业群机器人webhook接口地址
可自行更改`.github/workflows/*.yml`配置文件，比如修改任务的执行时间


### 彩云天气配置
在项目`settings`->`Secrets` 中，添加：
1. `caiyun_key`，为彩云API的开发者令牌（前往[彩云天气开发者中心](https://dashboard.caiyunapp.com/)申请），或使用官方测试KEY（仅供测试）：`TAkhjf8d1nlSlspN`
2. `caiyun_gps`，为要获取的天气的GPS坐标，可在[百度地图GPS获取](https://api.map.baidu.com/lbsapi/getpoint/index.html)页面获取后复制，多个GPS坐标请用`|`符号分割，地名在坐标后用`@`符号链接

`caiyun_gps` 格式如下：
> `111.22,333.44@地址1|444.55,555.66@地址2`

### 早安心语配置
需要用到[天行数据](https://www.tianapi.com/gethttp/143) 接口，你需要自行前往注册登录，申请api后，得到一个key，设置到仓库的secrets中，名称为：`good_morning_key`

## 禁用插件
比如禁用毒鸡汤，则添加`secrets`->`plug_dujitang_disabled`=`true`

## 注意
cron 时间为美国时间，需要北京时间减去8小时设置。
比如你想在北京时间`08:00`运行，则需要设置（8-8=0）成：`0 0 * * *`

由于`GitHub Actions`容器启动耗时等限制，定时任务不一定能`准时`执行

## 开发文档
> 整理中..

1. 在 `plugins` 目录添加一个`module_name.js`插件，代码采用`node.js`编写，示例可以看看`plugins/dujitang.js`插件代码。    
2. 可以在本地测试代码（先设置一个`bot_api`环境变量，然后直接`node plugins/module_name.js`）    
3. 测试没问题后，在`.github/workflows/`中添加`plug_模块名.yml`配置文件，代码参考`plug_caiyun_weather.yml`    


## 如何使用
1. `fork` 本项目到你的仓库    
2. 在仓库`settings`中添加`secrets`配置，比如`bot_api`为你的企业微信机器人webhook    
3. 点击你的项目的`star`按钮，会自动启动。

> 更多人性化的启动方法正在研究中。。。