$(function() {
    let form = layui.form;
    let layer = layui.layer;

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(result) {
                if (result.status !== 0) return layer.msg(result.message);
                // $('form input[name=username]').val(result.data.username);
                // form.val()给表单赋值
                //formUserInfo 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                form.val('info', result.data);
            }
        })
    }
    initUserInfo();

    // 表单校验规则
    form.verify({
        nickname: function(value) {
            if (value.length > 6) return '昵称长度必须在 1 ~ 6 个字符之间!' //layer.msg('')
        }
    });

    // 修改信息
    $('form').on('submit', function(event) {
        event.preventDefault(); // 阻止默认提交的行为
        // JQ快速获取元素的值
        // console.log();
        //获取表单区域所有值
        // console.log(data1);
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(result) {
                if (result.status !== 0) return layer.msg(result.message);
                layer.msg(result.message);
                // 调用父页面的方法，重心渲染用户的头像和用户的信息
                window.parent.getUserInfo();
                // console.log(window.parent.getUserInfo());
                // var parentId = parent.document.querySelector('#logout');
                // console.log(parentId);
            }
        })
    })

    // 重置按钮
    $('#reset').on('click', function(event) {
        event.preventDefault(); // 阻止默认重置的行为
        initUserInfo(); // 再次获取元素
    })
})