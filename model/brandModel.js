const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

const async = require('async');

// const  async = require('async');

const brandModel = {
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
                brandName: data.brandName,
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
                    db.collection('brand').find().sort({ _id: -1 }).toArray(function (err, result) {
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
                    db.collection('brand').insertOne(saveData, function (err) {
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
    //获取品牌列表信息
    getBrandList(data, cb) {

        let saveData = {
            brandName: data.brandName,
            src: data.fileName
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
                        db.collection('brand').find().count(function (err, num) {
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
                        db.collection('brand').find().limit(limitNum).skip(skipNum).toArray(function (err, data) {
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
                            brandList: results[1],
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
    //删除品牌
    delete(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cb({ code: -100, msg: '数据库链接失败' });
            } else {
                var db = client.db('nxf');
                var brandId = parseInt(data);
                console.log('这边是请求过来的要删除' + brandId);
                db.collection('brand').remove({ _id: brandId }, function (err) {
                    if (err) {
                        cb({ code: -103, msg: '数据库删除失败' });
                    } else {
                        cb(null);
                    }
                })
            }
        })
    },

    //修改品牌
    update(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cb({ code: -100, msg: '数据库链接失败' });
            } else {
                var db = client.db('nxf');
                var brandId = parseInt(data.brandId);
                console.log('这是的品牌信息要做修改' + brandId);
                console.log(data.fileName)
                db.collection('brand').updateOne({ _id: brandId }, {
                    $set: {
                        brandName: data.brandName,
                        src: data.fileName
                    }
                }, function (err) {
                    if (err) {
                        cb({ code: -104, msg: '修改品牌信息错误' });
                    } else {
                        cb(null);
                    }
                })
            }
        })
    }
}

module.exports = brandModel;