//操作数据库信息

//注册登陆操作，修改删除操作，查询列表操作
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

/**
 * @param {Object} data 注册
 * @function {Function} cb通过回调函数传递数据
 *  
 **/

const usersModel={
    //添加
    add(data,cb){
        MongoClient.connect(url,function(err,client){
            if(err) throw err;
            const db=client.db('nxf');
            //console.log(data);
             
            //修改data里面的isAdmin修改为is_admin
            let data={
                username:data.username,
                password:data.password,
                phone:data.iphone,
                id_admin:data.isAdmin
            };
           
            //查看用户是否已经注册
            db.collection('users').find(username:data.username).count(function(err,num){
                if(err) throw err;
                if(num==0){
                    //如果num==0，表示可以注册，然后执行id自增
                    db.collection('users').find().count(function(err,num){
                        if(err) throw err;
                        data._id=num+1;
        
                        db.collection('users').insertOne(data,function(err){
                            if(err) throw err;
                            cb(null);
                            client.close();
                        });
                    });
                }else{
                    cb(new Error('已经注册过了'));
                }
            })
        });
    }
}
//将对象暴露
module.exports = usersModel;