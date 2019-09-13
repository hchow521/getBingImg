/*
  Module getBingImg
*/
const http = require('http'),
querystring = require('querystring'),
cheerio = require('cheerio');
/*
* @param {Number} idx - 偏移量
* @param {Number} n - 长度
* */


function getBingImg (idx=0, n=1) {
  return new Promise ((resolve, reject) => {
    const params = {
      format: 'hp',
      idx,//偏移量/天
      n,//长度
      nc: Date.now(),
      pid: 'hp',
      FORM: 'BEHPTB',
      ensearch:1,
      quiz:1,
      og:1,
      IG: 'E579B19540FA4A7E98106D3A99997D6E',
      IID: 'SERP.1050'
    },
    postData = querystring.stringify(params),
    options = {
      hostname: 'cn.bing.com',
      path: '/HPImageArchive.aspx?' + postData,
      method: 'GET',
      encoding: null,
      headers: {
        'Host': 'cn.bing.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:68.0) Gecko/20100101 Firefox/68.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
        // 'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': 1,
        'Cache-Control': 'max-age=0',
        'TE': 'Trailers'
      }
    },
    req = http.request(options, (res) => {
      let resData = '';
      console.log(`状态码: ${res.statusCode}`);
      // console.log(`响应头: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        // console.log(`响应主体: ${chunk}`);
        resData += chunk;
      });
      res.on('end', () => {
        console.log('响应结束');
        if (resData == '') return console.log('响应主体为空？');

        let $ = cheerio.load(resData);//读取html
        let jsonStr = $('.json').text().trim();//获取.json元素内容
        let json = JSON.parse(jsonStr) || '';

        if (json && json.images) {
          if (json.images.length === 0) {
            console.error({
              error: '请求资源为空',
              data: json.images
            });
          }
          resolve(json.images);
        } else{
          reject(new Error({
            message: 'dom not found or JSON format error',
            data: resData
          }));
        }

      });
    });

    req.on('error', (e) => {
      //请求失败
      reject(e);
    });

    // 写入数据到请求主体(get不需要)
    //req.write(postData);
    req.end();
  });
}

module.exports = getBingImg;