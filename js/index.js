var s;
var page= new Vue({
    el:'#page',
    data:{
        // 提示框status
        prompt:false,
        store_name:'D记豆花甜品',
        showlogin:true,
        login:true,
        login_name:'',
        sign_name:'',
        // 注册密码
        zhucepassword:'',
        querenmima:'',
        password:'',
        prompt_text:'',
        // 显示登入层
        showlogin_container:false
    },
    methods:{
        showcontainer:function(){
            this.showlogin=!this.showlogin;
        },
        sign:function(){
            this.login=!this.login;
        },
        // 检查登录
        checkLogin:function(){
            if(this.login_name== 0 || this.login_name.match(/^\s+$/g)){
                this.promptShow('登录失败：用户名不能为空!');
                return false;
            }
            if(this.password== 0 || this.password.match(/^\s+$/g)){
                this.promptShow('登录失败：密码不能为空!');
                return false;
            }
        },
        zhuce:function(){
            if(this.sign_name== 0 || this.sign_name.match(/^\s+$/g)){
                this.promptShow('注册失败：用户名不能为空!');
                return false;
            }
            if(this.zhucepassword== 0 || this.zhucepassword.match(/^\s+$/g)){
                this.promptShow('注册失败：两次密码不相同!');
                return false;
            }
            if(this.zhucepassword!=this.querenmima){
                this.promptShow('注册失败：两次密码不相同!');
                return false;
            }
        },
        promptShow:function(text){
            clearTimeout(s);
            this.prompt=true;
            this.prompt_text=text;
            s=setTimeout(()=>this.prompt=false,1400);
        }
    }
})

var getdish = [];
$.ajax({
    type: "GET",
    url: "https://www.d1n910.cn/api/getalldish",
    success: function (data) {
        getdish=data.content;
        changecaidan();
        console.log(data);
    },
    error: function (message) {
        data = JSON.stringify(data);
        var data = eval("(" + data + ")");
        console.log('error' + data);
    }
});
//修改菜单
function changecaidan() {
    document.querySelector('.dish_list').innerHTML = '<div class="dish_list_title">菜单</div>'
    for (var i = 0; i <= getdish.length - 1; i++) {
        document.querySelector('.dish_list').innerHTML += '<div class="dishes_item"><div class="dishes_title">' + getdish[i].dishname + '</div><div class="dishes_price">￥<span>' + getdish[i].dishprice + '</span> </div> <div class="add_dish top_add" id=' + getdish[i].id + '>+</div></div>'
    }
    //绑定添加事件
    for (var i = 0; i <= document.querySelectorAll('.top_add').length - 1; i++) {
        document.querySelectorAll('.top_add')[i].onclick = function () {
            addshppingchart(this.id, this.parentNode.querySelector('.dishes_title').innerHTML, this.parentNode.querySelector('.dishes_price span').innerHTML)
        };
        console.log(document.querySelectorAll('.top_add')[i].parentNode.querySelector('.dishes_title').innerHTML)

    }
}

// 保存购物车的数组
var shoppingchart = [
]

function addshppingchart(dishid, dishname, dishprice) {
    var shoppingchartlength = shoppingchart.length;
    console.log(shoppingchartlength);
    if (shoppingchartlength == 0 && dishprice != 0) {
        shoppingchart[0] = {
            id: dishid,
            name: dishname,
            price: dishprice,
            numberofcopies: 1
        }

        changeshopping();
        return false;
    } else {
        for (var i = 0; i <= shoppingchartlength - 1; i++) {

            console.log(shoppingchart[i].name + ' ' + dishname);
            if (shoppingchart[i].name == dishname) {
                if (parseFloat(dishprice) > 0) {
                    shoppingchart[i].numberofcopies++;
                    changeshopping();
                    return false;

                } else {
                    shoppingchart[i].numberofcopies--;
                    if (shoppingchart[i].numberofcopies == 0) {
                        shoppingchart.splice(i, 1);
                    }
                    changeshopping();
                    return false;

                }
            }
        }
        shoppingchart[shoppingchartlength] = {
            id: dishid,
            name: dishname,
            price: dishprice,
            numberofcopies: 1
        }
        changeshopping();
    }


}
var newtimeout;
// 修改购物车
function changeshopping() {
    clearTimeout(newtimeout);
    if (shoppingchart.length != 0) {
        changegouwuche(1);
        document.querySelector('.dish_number').className = 'dish_number dish_number_show dish_number_show bounce animated';
        newtimeout = setTimeout(function () {
            document.querySelector('.dish_number').className = 'dish_number dish_number_show';
        }, 800)
    } else {
        changegouwuche(0);
        document.querySelector('.dish_number').className = 'dish_number';
        yingcanggouuche();
    }
    document.querySelector('.editdish_list').innerHTML = '';
    var allfenshu = 0;
    var allmoney = 0;
    for (var i = 0; i <= shoppingchart.length - 1; i++) {
        allfenshu += parseInt(shoppingchart[i].numberofcopies);
        allmoney = allmoney + shoppingchart[i].price * shoppingchart[i].numberofcopies;
        document.querySelector('.editdish_list').innerHTML += '<div class="editdish_item"><div class="editdish_title">' + shoppingchart[i].name + '</div><div class="editdish_price">￥<span>' + (shoppingchart[i].price * shoppingchart[i].numberofcopies).toFixed(2) + '</span></div><div class="delate_dish">-</div><div class="editdish_number"><span>' + shoppingchart[i].numberofcopies + '</span>份</div><div class="add_dish gouwu_dish">+</div></div>'
    }
    document.querySelector('.dish_number').innerHTML = allfenshu;
    document.querySelector('.total_price span').innerHTML = allmoney.toFixed(2);
    if (allmoney == 0) {
        document.querySelector('.total_price').className = 'total_price';
    } else {
        document.querySelector('.total_price').className = 'total_price total_price_more';
    }
    if (shoppingchart.length != 0) {
        changegouwuche(1);
    } else {
        changegouwuche(0);
    }
    adddelate();
    gouwuchetianjia();
}
//修改购物车样式
function changegouwuche(status) {
    if (status) {
        document.querySelector('.button').className = 'button buttonhave';
        document.querySelector('.tijiao_dingdan').className = 'tijiao_dingdan tijiao_dingdan_canclick';
        document.querySelector('.button img').setAttribute('src', '../static/dingcan/images/haveadd.png');
        xianshigouwuche();
        tijiaodingdan();
    } else {
        document.querySelector('.buttonhave').onclick = null;
        document.querySelector('.tijiao_dingdan_canclick').onclick = null;
        setTimeout(function () {
            document.querySelector('.button').className = 'button';
            document.querySelector('.tijiao_dingdan').className = 'tijiao_dingdan';
            document.querySelector('.button img').setAttribute('src', '../static/dingcan/images/gouwuche.png');
        }, 10);
        // 取消绑定    
    }
}
// 绑定删除的方法
function adddelate() {
    for (var i = 0; i <= document.querySelectorAll('.delate_dish').length - 1; i++) {
        document.querySelectorAll('.delate_dish')[i].onclick = function () {
            addshppingchart(-1, this.parentNode.querySelector('.editdish_title').innerHTML, 0)
        }
    }
}
//购物车绑定添加方法
function gouwuchetianjia() {
    for (var i = 0; i <= document.querySelectorAll('.gouwu_dish').length - 1; i++) {
        document.querySelectorAll('.gouwu_dish')[i].onclick = function () {
            addshppingchart(-1, this.parentNode.querySelector('.editdish_title').innerHTML, 1)
        }
    }
}
//显示购物车
function xianshigouwuche() {
    document.querySelector('.buttonhave').onclick = function () {
        document.querySelector('.editdish_list_container').className = 'editdish_list_container editdish_list_containershow'
        setTimeout(function () {
            document.querySelector('.editdish_list_container').className = 'editdish_list_container editdish_list_containershow editdish_list_bg'
            setTimeout(function () {
                document.querySelector('.editdish_list').className = 'editdish_list editdish_list_show'
            }, 10)
        }, 10)

        return false;
    }
}
//提交订单
function tijiaodingdan() {
    document.querySelector('.tijiao_dingdan_canclick').onclick = function () {
        zuowei = prompt("提交订单之前，请输入你的桌号:", "带走");
        if (zuowei == null) {
            alert("你取消了订单上传");
        } else {
            
        
        
        var dingdancontent = '';
        for (var i = 0; i <= shoppingchart.length - 1; i++) {
            dingdancontent += shoppingchart[i].id + '_' + shoppingchart[i].numberofcopies + '#'
        }
        var senddata = new Object();
        senddata.dingdancontent = dingdancontent;
        senddata.zuowei=zuowei;
        saveData = JSON.stringify(senddata);
        console.log(saveData);
        $.ajax({
            type: "POST",
            url: "https://www.d1n910.cn/api/createdingcan",
            contentType: "application/json;charset=utf-8",
            data: saveData,
            dataType: "json",
            success: function (data) {
                alert('提交成功！');
                shoppingchart = [];
                changeshopping();
                yingcanggouuche();
                window.location = "./dingdan?id=" + data.id;
                return false;
                
            },
            error: function (message) {
                console.log(message);
            }
        });

    }
    }
}
// 取消点击dish冒泡
document.querySelector('.editdish_list').onclick = function (e) {
    cancellmaopao(e);
}
// 取消点击购物车冒泡
document.querySelector('.editdish_list_container_title').onclick = function (e) {
    cancellmaopao(e);
}
//隐藏购物车
function yingcanggouuche() {
    document.querySelector('.editdish_list').className = 'editdish_list'
    document.querySelector('.editdish_list_container').className = 'editdish_list_container'
}
// 绑定隐藏购物车
document.querySelector('.editdish_list_container').onclick = function () {
    yingcanggouuche();
}
//清空购物车
document.querySelector('.editdish_list_container_title span').onclick = function () {
    shoppingchart = [];
    changeshopping();
    yingcanggouuche();
}
//取消冒泡事件
function cancellmaopao(e) {
    if (e && e.stopPropagation) {
        //W3C取消冒泡事件
        e.stopPropagation();
    } else {
        //IE取消冒泡事件
        window.event.cancelBubble = true;
    }
}