/*
* require module function getBingImg
* @author Hanson Chow <hchow521@163.com>
*/
const getBingImg = require("./request");

//定义存储文件路径并引入
// const fs = require('fs'),
// filePath = './getData.json',
// jsonFile = require(filePath),

const bingURL = 'https://www.bing.com';

/*
  默认请求今日美图
  getBingImg([idx = 0(偏移量)][, n = 1(数量)])
*/
getBingImg().then(res => {
  //  full imgURL
  console.log(bingURL + res[0].url);
  /*
    你可以写入文件
  */

// !jsonFile.images ? jsonFile.images = [] :
//   Promise.all(//遍历图片是否存在
//     jsonFile.images.map(localImage => {
//       return new Promise((resolve,reject) => {
//         if (localImage.startdate === res[0].startdate) reject(new Error('资源已存在'));
//         resolve();
//       });
//     })
//   ).then(() => {
//     jsonFile.images = [ ...jsonFile.images, ...res];
//     fs.writeFile(filePath, JSON.stringify(jsonFile), function(err) {
//       if (err) {
//         throw err;
//       }
//     });
//   }).catch(err => {
//     console.log(err);
//   })
})