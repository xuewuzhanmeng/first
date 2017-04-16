/**
 * Created by zzz on 2017/4/11.
 */
define(['jquery'],function ($) {
    function Split(opt) {
        this.author='hu';
        this.version='1.0';
        this.init(opt);
    }
    Split.prototype={
        init:function (opt) {
            this.render(opt);
            this.bind(opt);
        },
        render:function (opt) {
            var ma = opt.ma;
            var perpage=opt.perpage;
            var total=Math.ceil(ma/perpage);

            for(var i=1;i<=total;i++){
                var li=$("<li></li>");
                $("<a href='#'></a>").text(i).addClass("ye").appendTo(li);
                $(opt.container).append(li);
            }
        },
        bind:function (opt) {

            var nnn=1;
            $(opt.container).on('click','li',function () {
                var num=1;
                num=parseInt($(this).find("a").html());
                if(num==nnn){
                    return false;
                }

                $(opt.container).find("li a").css({"background-color":"#fff","color":"#23527c"});
                $(opt.container).find("li:eq("+(num-1)+") a").css({"background-color":"#2c6ffc","color":"white"});
                $.ajax({
                    url:'/admin/getpage',
                    type:'post',
                    data:{num:num},
                    success:function (data) {
                        nnn=parseInt(num);
                        $("tbody").empty();
                        $.each(data,function (index,element) {
                            getnews(element);
                        })
                    },
                    error:function (err) {
                        console.log(err);
                    }
                })
                return false;
            })
        }
    }

















    return Split;
});
