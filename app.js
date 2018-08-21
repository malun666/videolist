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
  extensions: [
    'htm', 'html'
  ],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

app.use(express.static('public', options));



app.use('/listarry', (req, res) => {
  // return res.json({age: 1});
  fs.readdir(path.join(__dirname, '/public/video'), (err, files) => {
    let data = files.map((item) => {
      return getItemData(item,'/public/video');

      // if (item == '.DS_Store') {
      //   return;
      // }

      // if(fs.statSync(item).isDirectory()) {

      // }
      // filesArray.push(path.join('/video', item));
      
    });
    res.json(data.filter(item => item));
  })
});

function getItemData(item, purl, pId = -1) {
  if (item == '.DS_Store') {
    return null;
  }
  let id = Date.now();
  if(fs.statSync(path.join(__dirname,purl, item)).isDirectory()) {
    // fs.readdirSync()
    // getItemData(, id)
    let dirFiles = fs.readdirSync(path.join(__dirname,purl, item));
    let childFiles = dirFiles.map(child => {
      return getItemData(child, purl + '/' + item, id);
    });

    return {
      isFile: false,
      id,
      name: item,
      text: path.join(purl.replace('/public', ''), item),
      children: childFiles.filter(item => item),
      title: item
    }
  }
  return {
    name: item,
    text: path.join(purl.replace('/public', ''), item),
    id: id,
    isFile: true,
    title: item,
    pId
  }
}

app.use('/', (req, res) => {
  res.render('index.art');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
