## これは何

HackernewsのBest Storyにあがっている記事のサマリーをVertex AIに作成してもらってSlackに通知してもらうツール。  
定期的に動かして海外のトレンドをざっくり掴めるようにする 💪

## 動かし方
### 前提

- yarnがinstallされている
- Vertex AIを有効化
- Slackのwebhookを有効化

### うごかしかた

- .envに必要な情報を埋める
- `yarn && yarn run exec`


## 参考
### Slack Webhookの作り方

https://api.slack.com/messaging/webhooks