var express = require('express');
var router = express.Router();
var usersModel = require('../model/usersModel.js');

var usersModel=require('../model/usersModel.js');
/* GET home page. */
// 首页
router.get('/', function(req, res, next) {
  console.log('返回的操作是否有进来');
  // 判断用户是否已经登录，如果登录就返回首页，否则返回 登录页面
 // console.log(req);
  if (req.cookies.username) {
    // 需要将 用户登录信息，传递给页面
    res.render('index', {
      username: req.cookies.username,
      nickname: req.cookies.nickname,
      isAdmin: parseInt(req.cookies.isAdmin) ? '(管理员)' : ''
    });
    console.log( req.cookies.username);
    console.log( req.cookies.nickname);
    console.log( req.cookies.isAdmin);
  } else {
    // 跳转到登陆页面
    res.redirect('/login.html');
  }

});

//注册页面
router.get('/register.html', function(req, res) {
  res.render('register');
});

// 登录页面
router.get('/login.html', function(req, res) {
  console.log('登录页面进来');
  res.render('login');
})

//用户管理页面
router.get('/user-manager.html',function(req,res){
  //必须先判断用户是否是管理员
  if(req.cookies.username && parseInt(req.cookies.isAdmin)){
    //查询数据库
    //从前端去得两个参数
    let page=req.query.page||1;
    let pageSize=req.query.pageSize||5;


    usersModel.getUserList({
      page:page,
      pageSize:pageSize
    },function(err,data){
      if(err){
        res.render('werror',err);
      }else{
        res.render('user-manager',{
          username: req.cookies.username,
          nickname: req.cookies.nickname,
          isAdmin: parseInt(req.cookies.isAdmin) ? '(管理员)' : '',

          userList:data.userList,//从数据库获得数据
          totalPage:data.totalPage,
          page:data.page
      });
    }
  });
  }else{
    res.redirect('/login.html');
  }
})


//手机管理页面
router.get('/mobile-manager.html',function(req,res){
  if(req.cookies.username && parseInt(req.cookies.isAdmin)){
    res.render('mobile-manager');
  }else{
    res.redirect('/login.html');
  }
})
module.exports = router;
