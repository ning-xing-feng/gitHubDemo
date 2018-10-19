//操作数据库信息

//注册登陆操作，修改删除操作，查询列表操作
const MongoClient = require('mongodb').MongoClient;

const url='mongodb://127.0.0.1:27017';

MongoClient.connect(url,function(err,client){
    if(err) throw err;
    const db=client.db('nxf');

    db.collection('users').insertOne()
})