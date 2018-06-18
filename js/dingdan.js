

// 修改订单列表
function changedingdan() {
    var locationhref = window.location.href;
    var locid=locationhref.split('?')[1].split('=')[1];
    $.ajax({
        type: "GET",
        url: "/api/searchusrdish?id="+locid,
        success: function (data) {
            var getdata=data.returnproducts[0];
            console.log(data);
            var dingdanhref = getdata.dishcontent.split('#');
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
        
            document.querySelector('.editdish_list_show').innerHTML = '';
            var allmoney=0;
            for (var i = 0; i <= dingdanneirong.length - 1; i++) {
                for (var j = 0; j <= getdish.length-1; j++) {
                    if (parseInt(dingdanneirong[i].dishid) == parseInt(getdish[j].id)) {
                        allmoney+=parseInt(dingdanneirong[i].numberofcopies) * parseFloat(+getdish[j].dishprice);
                        document.querySelector('.editdish_list_show').innerHTML += '<div class="editdish_item"><div class="editdish_title">' + getdish[j].dishname + '</div><div class="editdish_price">￥<span>' + parseInt(dingdanneirong[i].numberofcopies) * parseFloat(+getdish[j].dishprice) + '</span></div><div class="editdish_number"><span>' + dingdanneirong[i].numberofcopies + '</span>份</div></div>'
                    }
                }
            }
            document.querySelector('.allprice span').innerHTML=allmoney;
            document.querySelector('.createtime').innerHTML='创建时间：'+getdata.time;
            document.querySelector('.haomacontainer div').innerHTML=getdata.zuowei;
        },
        error: function (message) {
            data = JSON.stringify(data);
            var data = eval("(" + data + ")");
            console.log('error' + data);
        }
    });


}
var getdish = [];
$.ajax({
    type: "GET",
    url: "/api/getalldish",
    success: function (data) {
        getdish=data.content;
        changedingdan();
        console.log(data);
    },
    error: function (message) {
        data = JSON.stringify(data);
        var data = eval("(" + data + ")");
        console.log('error' + data);
    }
});


console.log(window.location.href)