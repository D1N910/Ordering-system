var getdata = [];
var getdish = [];
var getdish;
searchall();
function searchall() {
    $.ajax({
        type: "GET",
        url: "/api/searchalldish" + window.location.search,
        success: function (data) {
            console.log(data);
            getdata = data.returnproducts;
            for (var i = 0; i < getdata.length - 1; i++) {
                for (var j = 0; j < getdata.length - i - 1; j++) {
                    if (parseInt(getdata[j].id) < parseInt(getdata[j + 1].id)) {
                        var swap = getdata[j];
                        getdata[j] = getdata[j + 1];
                        getdata[j + 1] = swap;
                    }
                }
            }
            adddingdan(getdata);
        },
        error: function (message) {
            data = JSON.stringify(data);
            var data = eval("(" + data + ")");
            console.log('error' + data);
        }
    });
}
setInterval(function () {
    searchall();
}, 60000)
// 获取所有的菜单
$.ajax({
    type: "GET",
    url: "/api/getalldish",
    success: function (data) {
        getdish = data.content;
        console.log(data);
    },
    error: function (message) {
        data = JSON.stringify(data);
        var data = eval("(" + data + ")");
        console.log('error' + data);
    }
});


function adddingdan(data) {
    console.log(data);
    document.querySelector('.dish_list').innerHTML = '<div class="dish_list_title"><div class="dingdan_id">订单编号</div><div class="zuohao">座号</div><div class="dingdantime">下单时间</div><div class="xiangqing">详情</div></div>';
    for (var i = 0; i <= data.length - 1; i++) {
        if(data[i].ifdone==0){
            var done='';
        }else{
            var done='down';
        }
        document.querySelector('.dish_list').innerHTML += '<div class="dingdan_item '+done+'"><div class="dingdan_id">#<span>' + data[i].id + '</span></div><div class="zuohao">' + data[i].zuowei + '</div><div class="dingdantime">' + data[i].time + '</div><div class="show" setsid="' + data[i].dishcontent + '">⬆️</div></div><div class="allcandan"></div>'
    }
    for (var i = 0; i <= document.querySelectorAll('.show').length - 1; i++) {
        document.querySelectorAll('.show')[i].onclick = function () {
            var that = this;
            console.log(this.getAttribute('setsid'));
            if (this.className == 'show') {
                this.className = 'show onshow';
                this.parentNode.nextSibling.className = 'allcandan showallcandan';

                var dingdanhref = this.getAttribute('setsid').split('#');


                var dingdanneirong = [];
                var dingdan = function (id, number) {
                    this.dishid = id;
                    this.numberofcopies = number;
                }
                for (var i = 0; i <= dingdanhref.length - 1; i++) {
                    if (dingdanhref[i] != '') {
                        dingdanneirong[i] = new dingdan(dingdanhref[i].split('_')[0], dingdanhref[i].split('_')[1])
                    }
                }

                // ddd
                for (var i = 0; i <= dingdanneirong.length - 1; i++) {
                    for (var j = 0; j <= getdish.length - 1; j++) {
                        if (parseInt(dingdanneirong[i].dishid) == parseInt(getdish[j].id)) {
                            that.parentNode.nextSibling.innerHTML += '<div class="allcandan_item"><div class="allcandan__title">' + getdish[j].dishname + '</div><div class="allcandan__number"><span>' + dingdanneirong[i].numberofcopies + '</span>份</div></div>'
                        }
                    }

                }
                if(window.location.search.split('userId=')[1]==7){
                    that.parentNode.nextSibling.innerHTML += '<div class="usernameandwancheng"><div>--></div><div>完成<input type="checkbox"></div></div>';
                    console.log(that.parentNode);
                    if(that.parentNode.className=='dingdan_item down'){
                        that.parentNode.nextSibling.getElementsByTagName('input')[0].checked=true;
                    }
                    that.parentNode.nextSibling.getElementsByTagName('input')[0].onclick=function(e){
                        console.log(this.checked);
                        if(this.checked){
                            this.parentNode.parentNode.parentNode.previousSibling.className='dingdan_item down';
                        }else{
                            this.parentNode.parentNode.parentNode.previousSibling.className='dingdan_item';
                        }
                        var _this=this;
                        $.ajax({
                            type: "POST",
                            url: "/api/changedish",
                            data:{
                                dishId:_this.parentNode.parentNode.parentNode.previousSibling.getElementsByTagName('span')[0].innerHTML,
                                done:_this.checked
                            },
                            success: function (data) {
                                console.log(data);
                            },
                            error: function (message) {
                                data = JSON.stringify(data);
                                var data = eval("(" + data + ")");
                                console.log('error' + data);
                            }
                        });
                    }
                }
            } else {
                this.className = 'show';
                this.parentNode.nextSibling.className = 'allcandan';
                this.parentNode.nextSibling.innerHTML = '';
            }
            console.log(this.parentNode.nextSibling)
        }
    }

}