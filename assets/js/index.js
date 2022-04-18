$(function() {
    let layer = layui.layer;
    // 获取用户信息
    getUserInfo();

    // 退出功能
    $('#logout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('是否确定退出?', { icon: 3, title: '提示' }, function(index) {
            // 1、清空本地储存的token
            localStorage.removeItem('token');
            // 2、跳转到登录页
            location.href = '/login.html';
            // 3、关闭confirm弹窗
            layer.close(index);
        });
    })
});

// 获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(result) {
            if (result.status !== 0) return layer.msg(result.message);
            // console.log(result);
            // 渲染用户的头像
            renderAvatar(result.data)
        },
        error: function(result) {

        },
        // // 无论成功或者失败，最终都会调用此 complete 函数
        // complete: function(result) {
        //     // 在complete 回调函数中,可以使用result.responseJSON 拿到服务器响应回来的数据
        //     console.log(result.responseJSON);
        //     if (result.responseJSON.status === 1 && result.responseJSON.message === '身份认证失败！') {
        //         // 1、强制清空token
        //         localStorage.removeItem('token');
        //         // 2、强制跳转到 login.html 登录页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1、获取文本的名称
    let name = user.nickname || user.username;
    // 2、设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3、按需渲染用户的头像
    console.log($('.layui-nav-img'));
    if (user.user_pic !== null) {
        // 渲染图片文本
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide();
        $('.text-avatar').text(name[0].toUpperCase()).show();
    }
}

function highlight(kw) {
    $('dd').removeClass('layui-this')
    $(`dd:contains('${kw}')`).addClass('layui-this')
}