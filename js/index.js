//绑定添加事件
for (var i = 0; i <= document.querySelectorAll('.top_add').length - 1; i++) {

    document.querySelectorAll('.top_add')[i].onclick = function () {
        addshppingchart(this.parentNode.querySelector('.dishes_title').innerHTML, this.parentNode.querySelector('.dishes_price span').innerHTML)
    };
    console.log(document.querySelectorAll('.top_add')[i].parentNode.querySelector('.dishes_title').innerHTML)

}
// 保存购物车的数组
var shoppingchart = [
]

function addshppingchart(dishname, dishprice) {
    var shoppingchartlength = shoppingchart.length;
    console.log(shoppingchartlength);
    if (shoppingchartlength == 0 && dishprice != 0) {
        shoppingchart[0] = {
            id: 0,
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
            id: shoppingchartlength,
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
        document.querySelector('.button img').setAttribute('src', './images/haveadd.png');
        xianshigouwuche();
        tijiaodingdan();
    } else {
        document.querySelector('.buttonhave').onclick = null;
        document.querySelector('.tijiao_dingdan_canclick').onclick = null;
        setTimeout(function () {
            document.querySelector('.button').className = 'button';
            document.querySelector('.tijiao_dingdan').className = 'tijiao_dingdan';
            document.querySelector('.button img').setAttribute('src', './images/gouwuche.png');
        }, 10);
        // 取消绑定    
    }
}
// 绑定删除的方法
function adddelate() {
    for (var i = 0; i <= document.querySelectorAll('.delate_dish').length - 1; i++) {
        document.querySelectorAll('.delate_dish')[i].onclick = function () {
            addshppingchart(this.parentNode.querySelector('.editdish_title').innerHTML, 0)
        }
    }
}
//购物车绑定添加方法
function gouwuchetianjia(){
    for (var i = 0; i <= document.querySelectorAll('.gouwu_dish').length - 1; i++) {
        document.querySelectorAll('.gouwu_dish')[i].onclick = function () {
            addshppingchart(this.parentNode.querySelector('.editdish_title').innerHTML, 1)
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
        alert('提交成功！');
        shoppingchart = [];
        changeshopping();
        yingcanggouuche();
        window.location="./showdindan.html"
        return false;
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