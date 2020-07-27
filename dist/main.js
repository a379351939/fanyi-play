"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var querystring = __importStar(require("querystring"));
var http = __importStar(require("http"));
var md5_1 = __importDefault(require("md5"));
var private_1 = require("./private");
var errorMap = {
    52000: '成功',
    52001: '请求超时'
};
module.exports = function (word) {
    return new Promise(function (resolve) {
        var salt = Math.random();
        if (/[A-Za-z]/.test(word[0])) { }
        var query = querystring.stringify({
            q: word,
            from: 'en',
            to: 'zh',
            appid: private_1.appId,
            salt: salt,
            sign: md5_1.default(private_1.appId + word + salt + private_1.key)
        });
        var options = {
            hostname: 'api.fanyi.baidu.com',
            port: 80,
            path: '/api/trans/vip/translate?' + query,
            method: 'get',
        };
        var req = http.request(options, function (res) {
            // console.log(`STATUS: ${res.statusCode}`);
            // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            var resData;
            res.on('data', function (chunk) {
                resData = chunk;
            });
            res.on('end', function () {
                var object = JSON.parse(resData.toString());
                if (object.error_code) {
                    resolve(errorMap[object.error_code] || object.error_code);
                }
                else {
                    resolve(object.trans_result[0].dst);
                }
            });
        });
        req.on('error', function (e) {
            console.error("problem with request: " + e.message);
        });
        // Write data to request body
        // req.write(postData);
        req.end();
    });
};
