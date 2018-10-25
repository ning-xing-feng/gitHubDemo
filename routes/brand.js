var express = require('express');

var router = express.Router();

var brandModel = require('../model/brandModel.js');
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

//新增品牌信息

router.post('/Insert', upload.single('src'), function (req, res) {
  //调取brandModel中的方法
  if(req.file){
    fs.readFile(req.file.path, function (err, data) {
      if (err) {
        console.log('读取文件失败');
        res.send({ code: -1, msg: '新增手机失败' });
      } else {
        var fileName = new Date().getTime() + '_' + req.file.originalname;
  
        var dest_file = path.resolve(__dirname, '../public/mobiles/', fileName);
  
        var saveDate = req.body;
        saveDate.fileName = fileName;
        fs.writeFile(dest_file, data, function (err) {
          if (err) {
            console.log('写入失败');
            res.send({ code: -1, msg: '新增手机失败' });
          } else {
            console.log('修改成功');
            brandModel.add(saveDate, function (err, data) {
              if (err) {
                res.render('werror', err);
              } else {
                res.redirect('/brand-manager');
              }
            })
          }
        })
      }
    })
  }else{
    var saveDate = req.body;
    brandModel.add(saveDate, function (err, data) {
      if (err) {
        res.render('werror', err);
      } else {
        res.redirect('/brand-manager');
      }
    })
  }
  
});

//删除品牌信息
router.get('/delete',function(req,res){
  var brandId=req.query.id;
  console.log('这是要删除数据的'+brandId);

  brandModel.delete(brandId,function(err,data){
    if(err){
      res.render('werror',err);
    }else{
      res.redirect('/brand-manager');
    }
  })
});

//修改品牌信息
router.post('/update',upload.single('src'),function(req,res){
  console.log(req.body);
  
   if(req.file){
     fs.readFile(req.file.path,function(err,data){
      console.log(req.file)
       if(err){
         console.log('读取文件失败');
         res.send({code:-1,msg:'新增手机失败'});
       }else{
         var fileName=new Date().getTime()+'_'+req.file.originalname;
         var dest_file=path.resolve(__dirname,'../public/mobiles/',fileName);
         var saveDate=req.body;
         console.log(fileName);
         saveDate.fileName=fileName;
         fs.writeFile(dest_file,data,function(err){
           if(err){
             console.log('写入失败');
             res.send({code:-1,msg:'新增手机失败'});
           }else{
             console.log('修改成功');
             brandModel.update(saveDate,function(err,data){
                   if(err){
                     res.render('werror',err);
                   }else{
                     res.redirect('/brand-manager');
                   }
             })
           }
         })
       }
     })
   }else{
     var saveDate=req.body;
     brandModel.update(saveDate,function(err,data){
       if(err){
         res.render('werror',err);
       }else{
         res.redirect('/brand-manager');
       }
 })
 
 
   }
  
 })


module.exports = router;