var express = require('express');
var router = express.Router();

const phoneModel = require('../model/phoneModel.js');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//引入multer,并设置好temp目录
const multer = require('multer');

const upload = multer({
  dest: 'C:/tmp/'
})
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017';
//引入读文件模块
const fs = require('fs');
const path = require('path');
//新增手机信息

router.post('/Insert', upload.single('src'), function (req, res) {
  //调用phoneModel中的方法
  //文件路径的读取
  if (req.file) {
    fs.readFile(req.file.path, function (err, data) {
      if (err) {
        console.log('读取文件失败');
        res.send({ code: -1, msg: '新增手机失败' });
      } else {
        var fileName = new Date().getTime() + '_' + req.file.originalname;
        var dest_file = path.resolve(__dirname, '../public/mobiles/', fileName);
        //console.log(dest_file);
        var src = '/images/fileName';
        var saveDate = req.body;
        saveDate.fileName = fileName;
        fs.writeFile(dest_file, data, function (err) {
          if (err) {
            console.log('写入失败');
            res.send({ code: -1, msg: '新增手机失败' });
          } else {
            console.log('修改成功');
            phoneModel.add(saveDate, function (err, data) {
              if (err) {
                res.render('werror', err);
              } else {
                res.redirect('/mobile-manager');
              }
            })
          }
        })
      }
    })
  } else {
    var saveDate = req.body;
    phoneModel.add(saveDate, function (err, data) {
      if (err) {
        res.render('werror', err);
      } else {
        res.redirect('/mobile-manager');
      }
    })
  }

});

//删除手机信息
router.get('/delete', function (req, res) {
  var phoneId = req.query.id;
  console.log('这是要从数据库删除的' + phoneId);
  phoneModel.deletePhone(phoneId, function (err, data) {
    if (err) {
      res.render('werror', err);
    } else {
      res.redirect('/mobile-manager');
    }
  })
})


//修改手机信息
router.post('/update', upload.single('src'), function (req, res) {
  console.log(req.body);
  if (req.fileName) {
    fs.readFile(req.file.path, function (err, data) {
      if (err) {
        console.log('读取文件失败');
        res.send({ code: -1, msg: '新增手机失败' });
      } else {
        var fileName = new Date().getTime() + '_' + req.file.originalname;
        var dest_file = path.resolve(__dirname, '../public/mobiles/', fileName);
        //console.log(dest_file);
        var src = '/images/fileName';
        var saveDate = req.body;
        saveDate.fileName = fileName;
        fs.writeFile(dest_file, data, function (err) {
          if (err) {
            console.log('写入失败');
            res.send({ code: -1, msg: '新增手机失败' });
          } else {
            console.log('修改成功');
            phoneModel.update(saveDate, function (err, data) {
              if (err) {
                res.render('werror', err);
              } else {
                res.redirect('/mobile-manager');
              }
            })
          }
        })
      }
    })
  } else {
    var saveDate = req.body;
    phoneModel.update(saveDate, function (err, data) {
      if (err) {
        res.render('werror', err);
      } else {
        res.redirect('/mobile-manager');
      }
    })
  }
})


router.get('/logout',function(req,res){
  //清楚cookie，跳转页面
  res.clearCookie('username');
  res.clearCookie('nickname');
  res.clearCookie('isAdmin');
  res.redirect('/login.html');
  res.send('<script>location.replace("/")</script>');
})

//访问品牌的数据库
router.get('/findBrand',function(req,res){
  MongoClient.connect(url,function(err,client){
    if(err){
      console.log('数据库链接失败');
      res.send({code:-1,msg:'数据库查找失败'});
    }else{
      var db=client.db('nxf');
      db.collection('brand').find().toArray(function(err,result){
        if(err){
          res.send({code:-1,msg:'数据查询失败'});
        }else{
          console.log('查询成功');
          res.send(result);

        }
        client.close();
      })

    }
  })
})
module.exports = router;