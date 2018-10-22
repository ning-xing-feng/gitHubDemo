var express = require('express');
var router = express.Router();

const usersModel=require('../model/usersModel.js')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//注册
router.post('/register',function(req,res){
  console.log('获取传递过来的数据  post 请求的数据');
 // res.send();
  //用户名的验证
  if(!/^[A-Za-z][A-Za-z0-9]{3,11}$/.test(req.body.username)){
    res.render('werror',{code: -1, msg:'用户名必须是3-11位' });
    return;
  }
  if(!/^\w{6,18}$/.test(req.body.password)){
    res.render('werror',{code:-1,msg:'密码必须是0-9，a-z,A-Z的任意12个字符'});
    return;
  } 
  if(req.body.password!==req.body.repassword){
    res.render('werror',{code:-1,msg:'两次输入的密码不一致'});
    return;
  }  
  if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(req.body.phone)){
    res.render('werror',{code:-1,msg:'手机号格式不正确'});
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
      res.redirect('/login.html');
    }
  })
});
//d登陆
router.post('/login',function(req,res){
    //调用usermodule的loginfangfa
    usersModel.login(req.body,function(err,data){
      if(err){
        res.render('werror',err);
        }else{
          //调转到首页
          //将用户信息保存到cookie
          res.cookie('username',data.username,{
            maxAge:1000*60*60*24
          })
          res.cookie('nickname',data.nickname,{
            maxAge:1000*60*60*24
          })
          res.cookie('isAdmin',data.isAdmin,{
            maxAge:1000*60*60*24
          })
          res.redirect('/');
          console.log('当前登陆用户的信息是',data);
        }
      });
    });

  //退出登陆
  router.get('/logout',function(req,res){
    //清楚cookie，跳转页面
    res.clearCookie('username');
    res.clearCookie('nickname');
    res.clearCookie('isAdmin');
    res.redirect('/login.html');


    res.send('<script>location.replace("/")</script>');
  })
module.exports = router;
