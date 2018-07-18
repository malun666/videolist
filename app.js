const express = require('express');
const fs = require('fs');
const path = require('path');

const art_express = require('express-art-template');

const app = express();

// 设置art的模板引擎
app.engine('art', art_express);

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

app.use(express.static('public', options));

app.use('/', (req, res) => {
 fs.readdir(path.join(__dirname, '/public/video'), (err, files) => {
  let filesArray = [];
  files.forEach((item) => {
    if(item == '.DS_Store') {
      return;
    }
    filesArray.push(path.join('/video', item));
  });   
  res.render('index.art', {files: filesArray});
 });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});