//注册登陆操作，修改删除操作，查询列表操作
//注册登陆操作，修改删除操作，查询列表操作
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

const async = require('async');

const phoneModel={
  getUserList(data, cb){
          //链接数据库
    MongoClient.connect(url, function (err, client) {
        if (err) {
            cb({ code: -100, msg: '连接数数据失败' });
        } else {
            var db = client.db('nxf');
            var limitNum = parseInt(data.pageSize);
            var skipNum = data.page * data.pageSize - data.pageSize;
            var serarch = data.serarch;
            async.parallel([
                function (callback) {
                    //查询所有的记录
                    db.collection('users').find().count(function (err, num) {
                        if (err) {
                            callback({ code: -101, msg: '查询数据库失败' });
                        } else {
                            callback(null, num);
                        }
                    })
                },
                function (callback) {
                    //查询分页的数据
                    db.collection('users').find().limit(limitNum).skip(skipNum).toArray(function (err, data) {
                        if (err) {
                            callback({ code: -101, msg: '查询数据库失败' });
                        } else {
                            callback(null, data);
                        }
                    })
                }
            ], function (err, results) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, {
                        totalPage: Math.ceil(results[0] / data.pageSize),
                        userList: results[1],
                        page: data.page,
                    })
                }
                //关闭连接
                client.close();
            })

        }
    })
  }
}
  //获取用户列表
 module.exports = phoneModel;