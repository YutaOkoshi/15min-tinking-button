const https = require('https');
const url = require('url');
const defaultSlackUrl=process.env['SLACK_URL']
const defaultMessage={
    "SINGLE": "15分たったよ！",
    "DOUBLE": "今のなし！キャンセル！",
    "LONG": "自分で解決できました！"
}


exports.handler = (event, context, callback) => {

    console.log('Received event:', JSON.stringify(event, null, 2));
    var slackUrl = (event.placementInfo.attributes.slackUrl)? event.placementInfo.attributes.slackUrl:defaultSlackUrl
    if(!slackUrl){
        console.log('error: check for slackUrl')
    }
    
    // setting for request body
    var text = event.placementInfo.attributes[event.deviceEvent.buttonClicked.clickType]
    if(text)
    {
        var text = event.placementInfo.attributes[event.deviceEvent.buttonClicked.clickType]
        var payload = {'text': text}
    }
    else {
        var text = defaultMessage[event.deviceEvent.buttonClicked.clickType]
        var payload = {'text': text}
        // var payload = {'text': text, "attachments":[{"text":JSON.stringify(event,null,2)}] }
    }

    /**
     * AWS IoTのデバイスプレイスメントで指定できるもの
     * username : 送信者名
     * iconEmoji : 絵文字
     * iconUrl : アイコン変更用
     * slackChannel : 送信先チャンネル
     */
    if (event.placementInfo.attributes.username)
    {
        payload.username = event.placementInfo.attributes.username;
    }
    if (event.placementInfo.attributes.iconEmoji)
    {
        payload.icon_emoji = event.placementInfo.attributes.iconEmoji;
    }
    if (event.placementInfo.attributes.iconUrl)
    {
        payload.icon_url = event.placementInfo.attributes.iconUrl;
        payload.as_user = false;
    }
    if (event.placementInfo.attributes.slackChannel)
    {
        payload.channel = event.placementInfo.attributes.slackChannel;
        
    }
    var body = JSON.stringify(payload);
    
    // setting for request header
    var slackReqOptions = url.parse(slackUrl);
    slackReqOptions.method = 'POST';
    slackReqOptions.headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
    };

    // http request
    var req = https.request(slackReqOptions, function(res) {
        if (res.statusCode === 200) {
            console.log('Posted to slack');
            callback(null, {"result":"ok"});
        } else {
            callback(false, {"result":"ng", "reason":'Failed to post slack ' + res.statusCode})
        }
        return res;
    });
    req.write(body);
    req.end();
};
