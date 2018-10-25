var express=require('express');

var router = express.Router();

var brandModel=require('../model/brandModel.js');
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });


  module.exports = router;