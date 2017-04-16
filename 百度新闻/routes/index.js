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

router.get('/news', function(req, res, next) {
    res.render('index');
});
/* GET home page. */

var result="";
var h="";
//初始加载五条新闻
router.get('/getnews', function(req, res, next) {
    result="";
    pool.getConnection(function (err,con) {
        con.query('select * from `news` where `type`="精选"',function (err,rows,f) {
            if(err){
                console.log(err);
            }else {
                // res.render('index',{title:'百度新闻',list:rows});
                // res.send(rows);
                var arr=[];
                h=5;
                result=rows;
                for(var i=0;i<5;i++){
                    arr.push(rows[i]);
                }
                res.send(arr);

            }
            con.release();
        })
    })
});



//点击导航栏子标题，获得相关type，提取数据，发送五条新闻回去
router.get('/news/:fenlei', function(req, res, next) {
   var fenlei=req.params.fenlei;
   result="";
    pool.getConnection(function (err,con) {
        con.query('select * from `news` where `type`='+'"'+fenlei+'"',function (err,rows,f) {
            if(err){
              console.log(err);
            }else {
                // res.render('index',{title:'百度新闻',list:rows});
                // res.send(rows);
                var arr=[];
                h=5;
                result=rows;
                for(var i=0;i<5;i++){
                    arr.push(rows[i]);
                }
                res.send(arr);
            }
            con.release();
        })
    })


});


//滚送加载3条新闻
router.get('/downnews',function (req,res,next) {
    var arr=[];
    var num1=h;
    var num2=num1+3;
    var len=result.length;
    if(num2>len){
        num2=len;
    }
    for(var i=num1;i<num2;i++){
        arr.push(result[i]);
    }
    h+=3;
    res.send(arr);
});


//获取新闻id，加载新闻内容
router.get('/newcon/:num',function (req,res,next) {
    var num=req.params.num;
    pool.getConnection(function (err,con) {
        con.query('select `title`,`date`,`content`,`conimg`,`source` from `news` where `id`='+num,function (err,rows,f) {
            if(err){
                console.log(err);
            }else {
                console.log(rows);
                res.render('content',{list:rows[0]});
            }
            con.release();
        })
    })
});


module.exports = router;






