import * as querystring from "querystring";
import * as http from "http";
import md5 from "md5";
import {appId, key} from './private'

const errorMap:ErrorMap = {
  52000: '成功',
  52001: '请求超时'
}

type ErrorMap = {
  [key: string]: string
}

module.exports = (word: string) => {
  return new Promise((resolve) => {
    const salt = Math.random()

    if(/[A-Za-z]/.test(word[0])){}

    const query = querystring.stringify({
      q: word,
      from: 'en',
      to: 'zh',
      appid: appId,
      salt: salt,
      sign: md5(appId + word + salt + key)
    });

    const options = {
      hostname: 'api.fanyi.baidu.com',
      port: 80,
      path: '/api/trans/vip/translate?' + query,
      method: 'get',
    };

    const req = http.request(options, (res) => {
      // console.log(`STATUS: ${res.statusCode}`);
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      let resData:Buffer
      res.on('data', (chunk) => {
        resData = chunk
      });
      res.on('end', () => {
        type BaiduResult = {
          error_code?: string;
          from: string;
          to: string;
          trans_result: {
            src: string;
            dst: string;
          }[]
        }
        const object: BaiduResult = JSON.parse(resData.toString() )

        if(object.error_code) {
          resolve(errorMap[object.error_code] || object.error_code)
        } else {
          resolve(object.trans_result[0].dst)
        }
      });
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });

    // Write data to request body
    // req.write(postData);
    req.end();
  });
};