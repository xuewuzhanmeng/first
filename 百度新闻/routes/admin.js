/**
 * Created by zzz on 2017/3/30.
 */
var express = require('express');
var router = express.Router();
var mysql=require('mysql');
var pool = mysql.createPool({
    connectionLimit:10,
    host           :'localhost',
    user           :'root',
    password       :'root',
    database       :'mydb',
    port           :8889
});

/* GET administrator page. */
router.get('/', function(req, res, next) {
    res.render('admin');
});


var result=""; //创建全局空变量，准备接受数组
//获得所有新闻列表
router.post('/getNewlist',function (req,res,next) {
    pool.getConnection(function (err,con) {
        con.query('select  `id`,`title`,`date` from `news`',function (error,rows,f) {
            if(err){
                console.log(err);
            }else {
                // res.send(rows);
                //传十条新闻列表过去，同时传送数组的长度
                var arr=[];
                var len=rows.length;
                result=rows;
                for(var i=0;i<10;i++){
                    arr.push(rows[i]);
                }
                res.send({n:len,list:arr});

            }
            con.release();
        })
    })
});
//点击分页，传送相应新闻列表
router.post('/getpage',function (req,res,next) {
    var num=req.body.num;
    var num1=(num-1)*10;
    var num2=num*10;
    var len=result.length;
    var arr=[];
    if(num2>len){  //如果最大数大于数组的长度，则取数组的长度
        num2=len;
    }
    for(var i=num1;i<num2;i++){
        arr.push(result[i]);
    }
    res.send(arr);
});



//点击编辑后，获得该条新闻的数据
router.post('/change',function (req,res,next) {
    var num=req.body.num;
    pool.getConnection(function (err,con) {
        con.query('select * from `news` where `id`='+num,function (err,rows,f) {
            if(err){
                console.log(err);
            }else {
                console.log(rows);
                res.send(rows[0]);
            }
            con.release();
        })
    })
});

//删除新闻
router.post('/del',function (req,res,next) {
    var num=req.body.num;
    pool.getConnection(function (err,con) {
        con.query('delete from `news` where `id`='+num,function (err,rows,f) {
            if(err){
                console.log(err);
            }else{
                res.send({status:'ok',message:'删除成功'});
            }
            con.release();
        })
    })
});

//创建新闻
router.post('/create',function (req,res,next) {
    var title=req.body.title;
    var date=req.body.date;
    var content=req.body.content;
    var image=req.body.imgurl;
    var conimg=req.body.conurl;
    var type=req.body.type;
    var source=req.body.source;
    result="";
    pool.getConnection(function (err,con) {
        con.query('insert into `news`(`title`,`date`,`content`,`imurl`,`conimg`,`type`,`source`) values (?,?,?,?,?,?,?)',[title,date,content,image,conimg,type,source],function (err,rows,f) {
            if(err){
                console.log(err);
            }else {
                pool.getConnection(function (error,connection) {
                    connection.query('select  `id`,`title`,`date` from `news`',function (error,rows,f) {
                        if(error){
                            console.log(error);
                        }else {
                            //创建新闻成功后，重新获取数据，传送十条新闻过去
                            var arr=[];
                            var len=Math.ceil(rows.length/10);
                            result=rows;
                            for(var i=0;i<10;i++){
                                arr.push(rows[i]);
                            }
                            res.send({n:len,list:arr});
                        }
                        connection.release();
                    })
                })
            }
            con.release();
        });
    })
});

//修改新闻
router.post('/update',function (req,res,next) {
    var num=req.body.getId;
    var title=req.body.title;
    var date=req.body.date;
    var content=req.body.content;
    var image=req.body.imgurl;
    var conimg=req.body.conurl;
    var type=req.body.type;
    var source=req.body.source;
    pool.getConnection(function (err,con) {
        con.query('UPDATE `news` SET `title`=?,`date`=?,`content`=?,`imurl`=?,`conimg`=?,`type`=?,`source`=? WHERE `id`='+num,[title,date,content,image,conimg,type,source],function (err,rows,f) {
            if(err){
                console.log(err);
            }else {
                res.send({status:'ok',message:'发布成功'});
            }
            con.release();
        });
    })
});


module.exports = router;
