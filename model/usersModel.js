//操作数据库信息

//注册登陆操作，修改删除操作，查询列表操作
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

const async=require('async')


const usersModel={
/**
 * @param {Object} data 注册
 * @function {Function} cb通过回调函数传递数据
 *  
 **/
    //添加
    add(data,cb){
        MongoClient.connect(url,function(err,client){
            if(err){
                console.log('连接数据库失败',err);
                cb({code : -100,msg : '连接数据库失败'});
                return;
            };
            const db=client.db('nxf');
            //console.log(data);
             
            //修改data里面的isAdmin修改为is_admin
            let saveData={
                username:data.username,
                password:data.password,
                phone:data.iphone,
                id_admin:data.isAdmin
            };
            console.log(saveData);
    //使用async的串行无关联

    async.series([
        function(callback){
            //查询是否已注册
            db.collection('users').find({username:saveData.username}).count(function(err,num){
                if(err){
                    callback({code:-101,msg:'查询是否已注册失败'});
                }else if(num!==0){
                    console.log('用户已经存在');
                    callback({code:-102,msg:'用户已存在'});
                }else{
                    console.log('当前用户可以注册');
                    callback(null);
                }
            });
        },
        function(callback){
            //查询所有记录条数
            db.collection('users').find().count(function(err,num){
                if(err){
                    callback({code:-101,msg:'查询表的所有记录条数'});
                }else{
                    saveData._id=num+1;
                }
            });
        },
        function(callback){
            //注册写入数据库的操作
            db.collection('users').insertOne(saveData,function(err){
                if(err){
                    callback({code:-101,msg:'写入数据库失败'});
                }else{
                    callback(null);
                }
            });
        }
    ],function(err,results){
        if(err){
            console.log('上面的操作出现了问题',err);
            cb(err);
        }else{
            cb(null);
        }
        client.close();
    });
    })
 }  

//将对象暴露
module.exports = usersModel;