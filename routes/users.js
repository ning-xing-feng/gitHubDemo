var express = require('express');
var router = express.Router();

const usersModel=require('../model/usersModel.js')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',function(req,res){
  console.log('获取传递过来的数据  post 请求的数据');
  console.log(req.body);
 // res.send();
  //用户名的验证
  if(!/^\w{5,10}$/.test(req.body.username)){
    res.render('werror',{code: -1, msg:'用户名必须是5-10位' });
    return;
  } 
  
  //操作数据库
/*   usersModel.add(req.body,function(err){
    if(err) throw err;
    //注册成功，跳到登陆页面
    res.render('login');
  }); */
  //res.send();
  usersModel.add(req.body,function(err){
    if(err){
      //将错误信息渲染到页面
      res.render('werror',err);
    }else{
      //注册成功，跳转到登陆
      res.render('login');
    }
  })





});

module.exports = router;
