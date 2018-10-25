//注册登陆操作，修改删除操作，查询列表操作
//注册登陆操作，修改删除操作，查询列表操作
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

const async = require('async');

 const phoneModel={
    /**
     * 
     * @param {Object} data 
     * @param {function} cb 
     */
//添加到列表
add(data, cb) {
    MongoClient.connect(url, function (err, client) {
        if (err) {
            console.log('连接数据库失败', err);
            cb({ code: -100, msg: '连接数据库失败' });
            return;
        };
        const db = client.db('nxf');

        let saveData = {
            phonename: data.phonename,
            branchType: data.branchType,
            newPrice: data.newPrice,
            newTwoprice: data.newTwoprice,
            src: data.fileName
        };
        //使用async的串行无关联
        async.series([
/*             function (callback) {
                //查询是否已注册
                db.collection('users').find({ username: saveData.username }).count(function (err, num) {
                    console.log(num);
                    if (err) {
                        callback({ code: -101, msg: '查询是否已注册失败' });
                    } else if (num !== 0) {
                        console.log('用户已经存在');
                        callback({ code: -102, msg: '用户已存在' });
                    } else {
                        console.log('当前用户可以注册');
                        callback(null);
                    }
                });
            }, */
            function (callback) {
                db.collection('phone').find().sort({ _id: -1 }).toArray(function (err, result) {
                    if (err) {
                        callback({ code: '错误状态为：-101', msg: '查询记录失败' });
                    } else {
                        if (result == '') {
                            saveData._id = 1;
                        } else {
                            //result是一个数组，当前获取的是倒序后排第一的id
                            var num = result[0]._id;
                            console.log(result[0]._id);
                            num++;
                            saveData._id = num;
                        }
                        callback(null);
                    }
                });
            },

            function (callback) {
                //注册写入数据库的操作
                db.collection('phone').insertOne(saveData, function (err) {
                    console.log(saveData);
                    if (err) {
                        console.log(err);
                        callback({ code: -101, msg: '写入数据库失败' });
                    } else {
                        callback(null);
                    }
                });
            }
        ], function (err, results) {
            if (err) {
                console.log('上面的操作出现了问题', err);
                cb(err);
            } else {
                cb(null);
            }
            client.close();
        });
    });
},
    //获取手机列表信息
  getPhoneList(data, cb){

    let saveData = {
        phonename: data.phonename,
        branchType: data.branchType,
        newPrice: data.newPrice,
    }; 
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
                    db.collection('phone').find().count(function (err, num) {
                        if (err) {
                            callback({ code: -101, msg: '查询数据库失败' });
                        } else {
                            // saveData._id = data[data.length - 1]._id + 1;
                            callback(null, num);
                        }
                    })
                },
                function (callback) {
                    //查询分页的数据
                    db.collection('phone').find().limit(limitNum).skip(skipNum).toArray(function (err, data) {
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
                        phoneList: results[1],
                        //  phoneList._id=data[data.length - 1]._id + 1,
                        page: data.page,
                    })
                }
                //关闭连接
                client.close();
            })

        }
    })
  },

  //新增手机信息
  /**
   *     * @param {Object} 新增的数据信息
   * @param {function} 回调函数 
   */
   Insert(data,cb){
    MongoClient.connect(url,function(err,client){
        if(err){
          console.log('连接数据库失败');
        }else{
          var db=client.db('nxf');
          var saveDate=req.body;
          saveDate.fileName=fileName;
          db.collection('phone').insertOne(saveDate,function(err){
           // console.log(saveDate);
            if(err){
              console.log('插入数据失败');
              res.send({code:-1,msg:'新增手机失败'});
            }else{
              console.log('插入数据库成功');
              res.send({code:0,msg:'新增数据成功'});
            }
            client.close();
          })
        }
      })
  },
  //删除
  deletePhone(data,cb){
      MongoClient.connect(url,function(err,client){
          if(err){
              cb({code:-100,msg:'数据库连接失败'});
          }else{
              var db=client.db('nxf');
              var phoneId=parseInt(data);
              console.log('有毒的'+data);
              db.collection('phone').remove({_id:phoneId},function(err){
                  if(err){
                      cb({code:-103,msg:'删除数据库失败'});
                  }else{
                      cb(null);
                  }
              })
          }
      })
  },
//修改手机信息
 update(data,cb){
     console.log(data);
     MongoClient.connect(url,function(err,client){
         if(err){
            cb({code:-100,msg:'数据库连接失败'});
         }else{
             var db=client.db('nxf');
             var phoneId=parseInt(data.phoneId);
            // var imgSrc='/mobiles/data.src';
            console.log('这里的手机数据要做修改'+phoneId);
            console.log(data.fileName)
            var src=data.fileName;
            db.collection('phone').updateOne({_id:phoneId}, {
                $set: {
                    phonename:data.phonename,
                    branchType:data.branchType,
                    newPrice:data.newPrice,
                    newTwoprice:data.newTwoprice,
                    src:data.fileName
                }
            },function(err){
                if(err){
                    cb({code:-104,msg:'修改信息错误'});
                }else{
                    cb(null);
                }
            })
         }
     })
 }
}
  //获取用户列表
 module.exports = phoneModel;