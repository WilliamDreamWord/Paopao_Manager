/**
 * 登录接口URL
 */
var login_URL = 'https://www.bestpaopao.cn/manager/user/login.do';  

/**
 * 登录返回的数据
 */
var loginContent = {};


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

/**
 * 点击触发登录事件
 */
function login() { 

    // 1. 创建一个xmlhttpRequest对象
    var xmlLoginHttp = createXMLHttp();
    
    var username = document.getElementById("username").value.trim();
    var pass = document.getElementById("password").value.trim();
    var Remember = document.getElementById('remember');

    if (username == "") {
 
        alert("请输入用户名");
 
    } else if (pass  == "") {
 
        alert("请输入密码");
 
    } else {

        // 2. 设置回调监听
        xmlLoginHttp.onreadystatechange = function () {


            if (4 == xmlLoginHttp.readyState && xmlLoginHttp.status == 200) {

                //局部刷新
                loginContent = JSON.parse(xmlLoginHttp.responseText);

                if (loginContent.code == 0) {
                    console.log("登录成功")
                    window.location.href = "../index/index.html";
                } else {
                    alert("请输入正确的用户名和密码");
                }
            }


        };

        // 3. 打开一个连接
        xmlLoginHttp.open('POST', login_URL);

        // 4. 设置请求头
        xmlLoginHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        // 5. 发送
        xmlLoginHttp.send('username=' + username + '&password=' + pass); //请求体body，用&分隔。引用：req.body.name

    }
}
    


//     //页面初始化时，如果帐号密码cookie存在则填充
//     if (getCookie('username') && getCookie('pass')) {
//         username = getCookie('username');
//         pass = getCookie('pass');
//         Remember.checked = true;
//     }

//     if(remember.checked){ 
//         setCookie('username', document.getElementById("username").value, 7); //保存帐号到cookie，有效期7天
//         setCookie('pass', document.getElementById("password").value, 7); //保存密码到cookie，有效期7天
//     }

//     //复选框勾选状态发生改变时，如果未勾选则清除cookie
//     Remember.onchange = function () {
//         if (!this.checked) {
//             delCookie('username');
//             delCookie('pass');
//         }
//     };
 
// }

// 去除多余空格
String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

// //设置cookie
// function setCookie(name, value, day) {
//     var date = new Date();
//     date.setDate(date.getDate() + day);
//     document.cookie = name + '=' + value + ';expires=' + date;
// };

// //获取cookie
// function getCookie(name) {
//     var reg = RegExp(name + '=([^;]+)');
//     var arr = document.cookie.match(reg);
//     if (arr) {
//         return arr[1];
//     } else {
//         return '';
//     }
// };

// //删除cookie
// function delCookie(name) {
//     setCookie(name, null, -1);
// };





