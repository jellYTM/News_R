function day_counter() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  let values = sheet.getDataRange().getValues() 
  const num_values = values.length
  const url = 'https://api.line.me/v2/bot/message/push';
  const token = PropertiesService.getScriptProperties().getProperty('TOKEN');

  for (i=1;i<num_values;i++){
    values[i][3] = values[i][3] + 1
    const send_dates = [2,7,14,30,60]
    const passed_date = values[i][3]

    if (send_dates.includes(passed_date) === true || passed_date % 100 === 0) {
      const title = values[i][2]
      const message_url = values[i][1]
      const payload = {
                      to: values[i][4],//ユーザーID 
                      messages: [{ type: 'text',
                                   text: title + '\n\n' + message_url
                                   }]
                      };
      const params = {
                      method: 'post',
                      contentType: 'application/json',
                      headers: {Authorization: 'Bearer ' + token},
                      payload: JSON.stringify(payload)
                      };
       UrlFetchApp.fetch(url, params);
    }
  } 

  sheet.getRange(1,1,values.length,values[0].length).setValues(values)
}

function random_pusher(userId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  let values = sheet.getDataRange().getValues();
  const extracted_value = values.filter(record=>record[4]===userId)
  const url = 'https://api.line.me/v2/bot/message/push';
  const num_extracted_value = extracted_value.length
  const message = extracted_value[Math.floor(Math.random()*num_extracted_value)][1]
  const token = PropertiesService.getScriptProperties().getProperty('TOKEN');//チャネルアクセストークン

  const payload = {
                      to: userId,//ユーザーID 
                      messages: [{ type: 'text',
                                   text: message
                                   }]
                      };

  const params = {
                      method: 'post',
                      contentType: 'application/json',
                      headers: {Authorization: 'Bearer ' + token},
                      payload: JSON.stringify(payload)
                      };
  UrlFetchApp.fetch(url, params);
}

function test() {
  const values = [
    [2,7,10,20,30,60],
    [0,1,23,45,12,53],
    [2,5,12,43,53,42]
  ]
  Logger.log(values[0][3])
}