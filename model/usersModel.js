//操作数据库信息

//注册登陆操作，修改删除操作，查询列表操作
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

const async = require('async')


const usersModel = {
    /**
     * @param {Object} data 注册
     * @function {Function} cb通过回调函数传递数据
     *  
     **/
    //添加
    add(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接数据库失败', err);
                cb({ code: -100, msg: '连接数据库失败' });
                return;
            };
            const db = client.db('nxf');
            //console.log(data);

            //修改data里面的isAdmin修改为is_admin
            let saveData = {
                username: data.username,
                password: data.password,
                nickname: data.nickname,
                phone: data.phone,
                is_admin: data.isAdmin
              };
            console.log(data.id_admin);
            //使用async的串行无关联
            async.series([
                function (callback) {
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
                },
                function (callback) {
                    //查询所有记录条数
                    db.collection('users').find().count(function (err, num) {
                        if (err) {
                            callback({ code: -101, msg: '查询表的所有记录条数' });
                        } else {
                            saveData._id = num + 1;
                            callback(null);
                        }
                    });
                },
                function (callback) {
                    //注册写入数据库的操作
                    db.collection('users').insertOne(saveData, function (err) {
                        if (err) {
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
    /**
     * 
     * @param {Object} data 登陆信息
     * @param {functionon} cb 
     */
    //登录
    login(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cb({ code: -100, msg: '数据库连接失败' });
            } else {
                //连接成功,去数据库查询
                const db = client.db('nxf');
                db.collection('users').find({
                    username: data.username,
                    password: data.password
                }).toArray(function (err, data) {
                    if (err) {
                        console.log('数据库查询失败')
                        cb({ code: -101, msg: '数据库查询失败' });
                        client.close();
                    } else if (data.length <= 0) {
                        //没有找到，不能登陆
                        console.log('用户不能登陆');
                        cb({ code: -102, msg: '用户名或密码不存在' });
                    } else {
                        console.log('用户可以登陆');
                        cb(null, {
                            username: data[0].username,
                            nickname: data[0].nickname,
                            isAdmin: data[0].is_admin
                        })
                    }
                    client.close();
                })
            }
        });
    },
    /**
     * 
     * @param {Object} data  页码信息和每页显示条数
     * @param {function} cb 回调寒素
     */
    getUserList(data,cb){
        //链接数据库
        MongoClient.connect(url,function(err,client){
            if(err){
                cb({code:-100,msg:'连接数数据失败'});
            }else{
                var db=client.db('nxf');
                var limitNum = parseInt(data.pageSize);
                var skipNum = data.page * data.pageSize - data.pageSize;
                async.parallel([
                    function(callback){
                        //查询所有的记录
                    db.collection('users').find().count(function(err,num){
                        if(err){
                            callback({code:-101,msg:'查询数据库失败'});
                        }else{
                            callback(null,num);
                        }
                    })
                    },
                    function(callback){
                        //查询分页的数据
                        db.collection('users').find().limit(limitNum).skip(skipNum).toArray(function(err,data){
                            if(err){
                                callback({code:-101,msg:'查询数据库失败'});
                            }else{
                                callback(null,data);
                            }
                        })
                    }
                ],function(err,results){
                    if(err){
                        cb(err);
                    }else{
                        cb(null,{
                            totalPage:Math.ceil(results[0] / data.pageSize),
                            userList:results[1],
                            page:data.page,   
                        })
                    }
                    //关闭连接
                    client.close();
                })

            }
        })
    }
}
//将对象暴露
module.exports = usersModel;