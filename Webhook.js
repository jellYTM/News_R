function doPost(e) {
  //webhookから返答用トークン、メッセージ、useridを取得
  const token = PropertiesService.getScriptProperties().getProperty('TOKEN');
  let eventData = JSON.parse(e.postData.contents).events[0];
  let replyToken = eventData.replyToken;
  let userMessage = eventData.message.text;
  let userId = eventData.source.userId;

  if (userMessage == 'random-news'){
    random_pusher(userId);
  }else{
    //タイムスタンプを取得
    const dateNow = new Date();
    const date = Utilities.formatDate(dateNow, "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");

    //取得したメッセージのurl先のhtmlから<tytle>タグ内のデータを取得
    try {
      let response = UrlFetchApp.fetch(userMessage);
      let content = response.getContentText("utf-8");
      let title = Parser.data(content).from('<title>').to('</title>').iterate();
    } catch(e) {
      let title = userMessage
    }

    //userの名前を取得
    const endPoint = `https://api.line.me/v2/bot/profile/${userId}`;
    const res = UrlFetchApp.fetch(endPoint, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + token,
      },
      method: "GET",
    });
    const userDisplayName = JSON.parse(res.getContentText()).displayName;
    //取得したデータをスプレッドシートに記録
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    let values = sheet.getDataRange().getValues();
    const new_value = [date,userMessage,title,1,userId,userDisplayName];
    sheet.getRange(values.length+1,1,1,values[0].length).setValues([new_value]);

    //ユーザーからの投稿メッセージから応答メッセージを用意
    let replyMessage = '『通知登録完了』' + '\n \n' + title ; 
    //APIリクエスト時にセットするペイロード値を設定する
    let payload = {
      'replyToken': replyToken,
      'messages': [{
          'type': 'text',
          'text': replyMessage
        }]
    };

    //HTTPSのPOST時のオプションパラメータを設定する
    let options = {
      'payload' : JSON.stringify(payload),
      'myamethod'  : 'POST',
      'headers' : {"Authorization" : "Bearer " + token},
      'contentType' : 'application/json'
    };
    //LINE Messaging APIにリクエストし、ユーザーからの投稿に返答する
    let url = 'https://api.line.me/v2/bot/message/reply';
    UrlFetchApp.fetch(url, options);
  }
}
