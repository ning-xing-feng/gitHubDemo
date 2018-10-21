var express = require('express');
var router = express.Router();
var usersModel = require('../model/usersModel.js');
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

module.exports = router;
