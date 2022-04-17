$(function() {
    let form = layui.form;
    let layer = layui.layer;

    form.verify({
        pass: [/^[\S]{6,8}$/, '密码必须6到12位,且不能出现空格'], // 密码必须6到12位，且不能出现空格,
        newPwd: function(value) {
            if (value === $('input[name=oldPwd]').val()) return '新密码不能与旧密码一致!'
        },
        rePwd: function(value) {
            if (value !== $('input[name=newPwd]').val()) return '两次新密码不一致!';
        }
    })

    $('form').on('submit', function(event) {
        event.preventDefault(); // 阻止默认提交事件
        console.log($('form').serialize());
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(result) {
                if (result.status !== 0) return layer.msg(result.message);
                layer.msg(result.message);
                //localStorage.removeItem('token');
                //window.parent.location.href = '/login.html';
                // reset 是js原生的方法，所以要将 $('form')后面加 [0] 转为原生的 dom对象
                $('.layui-form')[0].reset();
            }
        })
    })

})