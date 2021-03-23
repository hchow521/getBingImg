const http = require('http'),
  querystring = require('querystring'),
  url = require('url');


// idx[0-7]
http.createServer(async (req, res) => {
  let {
    idx,
    n
  } = url.parse(req.url, true).query
  const data = await getImgs(idx, n)
  res.setHeader("content-type", "image/jpeg")
  res.write(data);
  res.end()
}).listen(3000)

// 接口获取图片列表
function getImgs(idx = 0, n = 1) {
  return new Promise((resolve, reject) => {
    const params = {
        FORM: "BEHPTB",
        IG: "3697997C96B64AF4910614CA51A2CC0A",
        IID: "SERP.1050",
        ensearch: "1",
        format: "hp",
        idx,
        mkt: "zh-CN",
        n,
        nc: Date.now(),
        og: "1",
        pid: "hp",
        quiz: "1"
      },
      data = querystring.stringify(params),
      options = {
        hostname: 'cn.bing.com',
        path: '/HPImageArchive.aspx?' + data,
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
      req = http.request(options, res => {
        let resData = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          resData += chunk;
        });
        res.on('end', async () => {
          // console.log(resData);
          if (resData) {
            try {
              // dom字符串截取json数据
              const json = resData.match(/\<div class\=\"json\"\>+(.|\s)*?\<\/div\>/g)[0],
                data = JSON.parse(json.replace(/(\<div class\=\"json\"\>)|(\<\/div\>)/g, '')),
                path = data.images[0].url,
                img = await getImg(path)
              resolve(img)
            } catch (e) {
              reject(e)
            }
          } else {
            reject('res为空')
          }
        })
      });

    //请求失败
    req.on('error', (e) => {
      reject(e)
    });
    // 写入数据到请求主体(get不需要)
    //req.write(postData);
    req.end();
  })
}

// 客户端请求图片
function getImg(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'cn.bing.com',
      path,
      method: 'GET',
      // responseType: 'blob',
      headers: {
        'Host': 'cn.bing.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:68.0) Gecko/20100101 Firefox/68.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': 1,
        'Cache-Control': 'max-age=0',
        'TE': 'Trailers'
      }
    }, res => {
      let resData;
      // res.setEncoding('utf8');
      res.on('data', (chunk) => {
        if (resData) {
          resData = Buffer.concat([resData, Buffer.from(chunk)])
        } else {
          resData = Buffer.from(chunk)
        }
      });
      res.on('end', () => {
        resolve(resData)
      })
    })
    req.on('error', e => {
      reject(e)
    })
    req.end()
  })
}
