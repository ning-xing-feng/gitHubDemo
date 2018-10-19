var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //判断是否登陆
  if(req.cookies.username){
    res.render('index', { title: 'Express' });
  }else{
    //跳转到登陆页面
    res.redirect('/login');
  }
});

//注册页面
router.get('/register',function(req,res){
    res.render('register');
});
router.get('/login', function(req, res) {
  console.log('登录页面进来');
  res.render('login');
})

module.exports = router;
