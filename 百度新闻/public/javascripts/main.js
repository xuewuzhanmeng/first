/**
 * Created by zzz on 2017/4/11.
 */

require.config({
    // baseUrl 是require寻找模块的基准文件夹
    baseUrl:'./javascripts',
    // paths 是给模块设置别名或者排他容错的地方
    paths:{
        jquery:'./jquery-3.1.1'
        // jquery:['','./libs/jquery-3.1.1']   //如果别名后是一个数组，会依次使用里面的文件，如果第一个可以使用，第二个不会启用；如第一个损坏，则使用第二个；
    }
});




require(['split'],function (Split) {
    $(function () {
        $.ajax({
            url:'/admin/getNewlist',
            type:'post',
            success:function (data) {
                $.each(data.list,function (index,element) {
                    getnews(element);
                })
                //根据新闻数量动态添加li标签
                var sp=new Split({ma:data.n,perpage:10,container:'#split'});
            },
            error:function (err) {
                console.log(err);
            }
        })
        //点击分页，获取新闻列表

    })



});

















