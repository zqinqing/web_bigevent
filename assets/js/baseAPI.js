// 注意：每次调用 $.get() 或 $.post() 或 $.ajax()的时候，都会先调用这个 ajaxPrefilter 这个函数
$.ajaxPrefilter(function(options) {
    // 在发起真正的Ajax请求之前，统一拼接请求的路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    // console.log(options.url);

    // 先进行判断，只有需要权限的请求接口 才进行请求头的设置
    if (options.url.indexOf('/my/') !== -1) {
        // 统一为又权限的接口，设置headers请求头
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }

    // 全局统一挂载 complete 回调函数
    // // 无论成功或者失败，最终都会调用此 complete 函数
    options.complete = function(result) {
        // 在complete 回调函数中,可以使用result.responseJSON 拿到服务器响应回来的数据
        // console.log(result.responseJSON);
        if (result.responseJSON.status === 1 && result.responseJSON.message === '身份认证失败！') {
            // 1、强制清空token
            localStorage.removeItem('token');
            // 2、强制跳转到 login.html 登录页面
            location.href = '/login.html';
        }
    }
})