var xmlhttp = new XMLHttpRequest();
var login_URL = 'https://www.bestpaopao.cn/manager/user/login.do';
var select_date_status_URL = 'https://www.bestpaopao.cn/manager/order/select_date_status.do';
var order_detail_URL = 'https://www.bestpaopao.cn/manager/order/detail.do';
var change_status_URL = 'https://www.bestpaopao.cn/manager/order/change_status.do';

let order_status;  //订单状态
let loginContent = {};  //登录返回的列表
let change_status_content = {};  // 改变状态返回的列表
let select_date_status_content = {};  //按照时间和状态来查询得到的列表
let order_detail_content = {};  //按照订单id来查询到的订单信息
let change_status; // 点击之后的状态
let change_id;  // 点击选中的id
let data1 = [];  //临时数据
let data = {};  //显示数据


/*
 测试post类型的Ajax请求
 1. 创建一个xmlhttpRequest对象
 2. 设置回调监听
 3. 打开一个连接
    接受两个参数：1. httpMethod   2. httpUrl
 4. 设置请求头
    通知浏览器请求体的相关设置
 5. 发请求
    参数: 具体发送的值
 */
function createXMLHttp() {
    var xmlhttp;
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
}
function show(){

    window.event.preventDefault();
    var order_type = document.getElementById("order_type").value;
    var order_area = document.getElementById("order_area").value;
    var order_status_id = document.getElementById("order_status").value;
    var order_number = document.getElementById("order_number").value;
    var order_phone = document.getElementById("order_phone").value;
    var date_year = document.getElementById("date_year").value;
    var date_month = document.getElementById("date_month").value;
    var date_day = document.getElementById("date_day").value;

    if (order_status_id == "已下单") {
        order_status = 10;
    } else if (order_status_id == "已接单") {
        order_status = 20;
    } else {
        order_status = 30;
    }
    var date = date_year + "-" +  date_month + "-" + date_day;
    var end_date_day = parseInt(date_day) + 1;
    var endDate = date_year + "-" + date_month + "-" + end_date_day;
    console.log(end_date_day);
    console.log("order_type=" + order_type + "order_area=" + order_area + "order_status=" + order_status + "order_date=" + date);

    if (order_number != "" && order_phone != "") {
        console.log( "order_number=" + order_number);
    }

   // 1. 创建一个xmlhttpRequest对象
   var xmlLoginHttp = createXMLHttp();
   var select_date_status_Http = createXMLHttp();
   var order_detail_Http = createXMLHttp();
   var change_status_Http = createXMLHttp();

    console.log("执行了登录操作")
    // 2. 设置回调监听
    xmlLoginHttp.onreadystatechange = function () {

        if (4 === xmlLoginHttp.readyState && 200 === xmlLoginHttp.status) {
            //局部刷新
            // console.log(xmlLoginHttp.responseText);
            loginContent = JSON.parse(xmlLoginHttp.responseText);

            console.log(loginContent);
            
        }
    };

    // 3. 打开一个连接
    xmlLoginHttp.open('POST', login_URL);

    // 4. 设置请求头
    xmlLoginHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlLoginHttp.setRequestHeader('Access-Control-Allow-Headers', '*');
  
    // 5. 发送
    xmlLoginHttp.send('username=test&password=test'); //请求体body，用&分隔。引用：req.body.name
    
    
    /**
     * 规避异步请求
     * 登陆之后
     */
    setTimeout(function() {

        if (loginContent.code == 0) {

            alert("登录成功")

            /**
             * 按照时间和状态来查询订单
             */

             console.log(order_number == "");
    
            if (order_number == "") {

                console.log("执行了默认查询")
                select_date_status_Http.onreadystatechange = function () {
    
                    if (4 === select_date_status_Http.readyState && 200 === select_date_status_Http.status) {
                        // console.log(select_date_status_Http.responseText);
        
                        select_date_status_content = JSON.parse(select_date_status_Http.responseText);
                        
                        console.log(select_date_status_content);

                        if (select_date_status_content.data.length == 0) {
                            alert("没有订单，请刷新")
                        } else {

                            console.log("bfkjabfjakfa" + select_date_status_content.data.length);

                            for (var i=0;i<select_date_status_content.data.length;i++) {

                                var content_data = {};  //重新创建一个新的对象
                                console.log("---------"  +select_date_status_content.data[i].shipping);

                                content_data.createTime = select_date_status_content.data[i].createTime;
                                content_data.orderNo = select_date_status_content.data[i].orderItemVoList[0].orderNo;
                                content_data.address = select_date_status_content.data[i].orderItemVoList[0].pack.address;
                                content_data.code = select_date_status_content.data[i].orderItemVoList[0].pack.code;
                                content_data.name = select_date_status_content.data[i].orderItemVoList[0].pack.name;
                                content_data.receiverAddress =
                                    select_date_status_content.data[i].shipping.receiverLargeArea +
                                    select_date_status_content.data[i].shipping.receiverMediumArea +
                                    select_date_status_content.data[i].shipping.receiverDoor;
                                content_data.receiverMobile = select_date_status_content.data[i].shipping['receiverMobile'];
                                content_data.exceptTime = select_date_status_content.data[i].orderItemVoList[0].pack.exceptTime;
                                content_data.orderCount = select_date_status_content.data[i].orderCount;


                                if (select_date_status_content.data[i].status == 10) {
                                    content_data.status = "已下单";
                                } else if (select_date_status_content.data[i].status == 20) {
                                    content_data.status = "已接单";
                                } else {
                                    content_data.status = "已签收";
                                }

                                content_data.modify_status = content_data.status;
                                
                                data1[i] = content_data;
                                // console.log(JSON.stringify(content_data));
                            }

                            console.log("data1：")
                            console.log(data1);

                            data = data1;

                        }

                        
                    }
                }
        
                select_date_status_Http.open('POST', select_date_status_URL);
        
                select_date_status_Http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
                console.log("begin= "+ date + "&end=" + endDate + "&status=" + order_status);

                select_date_status_Http.send('begin=' + date + '&end=' + endDate + '&status=' + order_status);


            } else {

                /**
                 * 按照订单id来查询订单
                 */
    
                console.log("执行了条件查询");
                order_detail_Http.onreadystatechange = function () {
    
                    if (4 === order_detail_Http.readyState && 200 === order_detail_Http.status) {
                        // console.log(order_detail_Http.responseText);

                        console.log(JSON.parse(order_detail_Http.responseText));    
    
                        order_detail_content = JSON.parse(order_detail_Http.responseText);


                        let content_data = {}; //data中单个的数据

                        content_data.createTime = order_detail_content.data.createTime;
                        content_data.orderNo = order_detail_content.data.orderNo;
                        content_data.address = order_detail_content.data.orderItemVoList[0].pack.address;
                        content_data.code = order_detail_content.data.orderItemVoList[0].pack.code;
                        content_data.name = order_detail_content.data.orderItemVoList[0].pack.name;
                        content_data.receiverAddress =
                            order_detail_content.data.shipping['receiverLargeArea'] +
                            order_detail_content.data.shipping['receiverMediumArea'] +
                            order_detail_content.data.shipping['receiverDoor'];
                        content_data.receiverMobile = order_detail_content.data.shipping['receiverMobile'];
                        content_data.exceptTime = order_detail_content.data.orderItemVoList[0].pack.exceptTime;
                        content_data.orderCount = order_detail_content.data.orderCount;


                        if (order_detail_content.data.status == 10) {
                            content_data.status = "已下单";
                        } else if (order_detail_content.data.status == 20) {
                            content_data.status = "已接单";
                        } else {
                            content_data.status = "已签收";
                        }

                        content_data.modify_status = content_data.status;

                        data1[0] = content_data;

                        console.log(data1);

                        data = data1;

                        
                    } else {
                        alert("没有该订单，请重新刷新")
                    }
                }
    
                order_detail_Http.open('POST', order_detail_URL);
    
                order_detail_Http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
                console.log("order_number=" + order_number);
                order_detail_Http.send('orderNo=' + order_number);
            }

            
        } else {
            alert("请先登录");
        }
    }, 1000)
    

    

    /**
    * 规避异步数据请求风险
    */
    setTimeout(function () {

        console.log("开始打印数据")
        console.log(data);
        console.log("开始将data数据处理");
        var Data = json_change(data);  //将json转换为二维数组
        console.log(Data);

        // console.log(data[0][10]);
        // 循环数据进行输出
        var content = document.getElementsByClassName("consult_middle_content")[0];
        var content_ul = document.getElementsByClassName("order")[0];
        console.log(Data[0]);
        var num = Data[0].length - 1;
        var array_li = new Array();
        var array_ul = new Array();
        var btn = [];   //每条查询中的按钮

        var child=check_child(content.childNodes);
        for (i = 1; i < child.length; i++) {
            content.removeChild(child[i]);
        }

        for (y = 0; y < Data.length; y++) {
            array_ul[y] = document.createElement("ul");
            for (i = 0; i < num; i++) {    //对数据进行循环输出
                array_li[i] = document.createElement("li");
                array_li[i].innerHTML = Data[y][i];
                // if (i == 1 || i == 4 || i == 8) {
                //     array_li[i].style["width"] = 7 + "%";
                // }
                array_ul[y].appendChild(array_li[i]);
            }

            array_ul[y].className = "order";

            //生命一个数组保存按钮所改变的三个值
            var state = ["已下单", "已接单", "已签收"];

            //添加按钮
            btn[y] = document.createElement("input");
            btn[y].style.display = "inline-block";
            btn[y].type = "button";
            btn[y].value = Data[y][num - 1];
            btn[y].className = "btn_modify";

            array_ul[y].appendChild(btn[y]);
            content.appendChild(array_ul[y]);

            //点击事件发生
            (function (a) {
                btn[y].onclick = function () {
                    //查询当前订单状态
                    var now_state = Data[a][num - 1];   //目前订单状态 
                    console.log("目前的订单状态" + now_state);
                    var index_state = -1;                   //目前订单状态下标
                    for (var i = 0; i < state.length; i++) {
                        if (state[i] == now_state) {
                            index_state = i;
                        }
                    }

                    if (index_state == state.length - 1) {     //当目前订单状态下标已经到达末尾
                        index_state = -1;
                    }

                    btn[a].value = state[index_state + 1];   //同步按钮中数据
                    Data[a][num - 1] = state[index_state + 1];  //同步Data中数据
                    for (var item in data) {                  //同步data中数据
                        if (item == a) {
                            for (var i in data[item]) {
                                if (i == "state") {
                                    data[item][i] = state[index_state + 1];
                                }
                            }
                        }
                    }
                    content.getElementsByTagName("ul")[a + 1].getElementsByTagName("li")[num - 1].innerHTML = state[index_state + 1];   //同步显示列表中数据

                    change_id = Data[a][1];
                    console.log("点击的订单id：" + change_id);
  
                    if (state[index_state + 1] == "已下单") {
                        change_status = 10;
                    } else if (state[index_state + 1] == "已接单") {
                        change_status = 20;
                    } else {
                        change_status = 30;
                    }
                    console.log("点击之后的订单状态" + state[index_state + 1] + change_status);


                    console.log("开始进行更改订单状态")
                    // 2. 设置回调监听
                    change_status_Http.onreadystatechange = function () {

                        if (4 === change_status_Http.readyState && 200 === change_status_Http.status) {
                            //局部刷新
                            // console.log(xmlLoginHttp.responseText);
                            change_status_content = JSON.parse(change_status_Http.responseText);

                            console.log(change_status_content);

                            if (change_status_content.code == 0) {
                                alert("更新状态成功，请刷新")
                            } else 
                                alert("更新失败，请重试")

                        }
                    };

                    // 3. 打开一个连接
                    change_status_Http.open('POST', change_status_URL);

                    // 4. 设置请求头
                    change_status_Http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                    // 5. 发送
                    change_status_Http.send('orderNo=' + change_id + '&status=' + change_status); //请求体body，用&分隔。引用：req.body.name
                }


            })(y);

        }
    }, 2000)
    

}

//动态增加select日期选项
window.onload=function(){
    var width_page=document.body.clientWidth;
    var date=document.getElementsByClassName("content1")[5]
    var years=date.getElementsByTagName("select")[0];   //年
    var months=date.getElementsByTagName("select")[1];     //月
    var days=date.getElementsByTagName("select")[2];        //日

    //年份显示
    for(var i=2018;i<2030;i++){
        years.options.add(new Option(i,i));
    }
    //设置2018为默认项目
    years.options[0].selected = true; 

    //月份显示
    for(var i=1;i<13;i++){
        months.options.add(new Option(i,i));
    }
    //设置默认月份为一月份
    months.options[8].selected=true;   

    //天数显示
    for(var i=1;i<32;i++){
        days.options.add(new Option(i,i));
    }

    //设置默认天为一号
    days.options[2].selected=true;
}

//将json数据转换成数组格式
function json_change(jsonData){
    var data = [];   //即将要转化的数组
    var length1 = 0;    //[][]中的第一个长度
    var length2 = 0;    //[][]中的第二的个长度
    for(var item in jsonData){
        var temp = jsonData[item];   
        data[length1] = [];    //声明二维数组
        for(var i in temp){
            if(i == "address"){
                data[length1][2] = temp[i];
            }else if(i == "code"){
                data[length1][3] = temp[i];
            }else if(i == "createTime"){
                data[length1][0] = temp[i];
            }else if(i == "exceptTime"){
                data[length1][7] = temp[i];
            }else if(i == "modify_status"){
                data[length1][10] = temp[i];
            }else if(i == "name"){
                data[length1][4] = temp[i];
            }else if(i == "orderCount"){
                data[length1][8] = temp[i];
            }else if(i == "orderNo"){
                data[length1][1] = temp[i];
            }else if(i == "receiverMobile"){
                data[length1][6] = temp[i];
            }else if(i == "receiverAddress"){
                data[length1][5] = temp[i];
            }else if(i == "status"){
                data[length1][9] = temp[i];
            }
            // data[length1][length2] = temp[i];
            // length2++;
        }
        length2 = 0;
        length1++;
    }
    return data;
}

//获取json格式长度
function getJsonLength(jsonData){
    var length = 0;
    for(var item in jsonData){
        length++;
    }
    return length;
}

//对子节点进行筛选,去除换行和空格
function check_child(childsArray){
    var array = []; //创建一个新数组
    for(var i=0;i<childsArray.length;i++){
        if(childsArray[i].nodeType ===1){
            array.push(childsArray[i]);
        }
    }
    return array;
}


