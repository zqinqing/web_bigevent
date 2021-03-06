$(function() {
    // 点击去注册账号 和 登录 时，模块的切换
    $('.loginAndRegBox').on('click', 'div a', function() {
        $(this).parent().parent().parent().hide();
        $(this).attr('class') === 'link_reg' ? $('.reg-box').show() : $('.login-box').show();
    });

    // 从 layui 中获取 form 对象
    var form = layui.form
    var layer = layui.layer

    form.verify({
        username: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
            if (/^[\S]{1,10}$/) {
                // 用户名必须是1-10位字母和数字
                return '用户名必须是1-10位字母和数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        ,
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repass: function(value, item) {
            // 通过形参拿到的时确认密码框的内容
            // 还需要拿到一次等于的判断
            let pwd = $('#form-reg [name=password]').val();
            if (value !== pwd) return '两次密码不一致!';
        }
    });

    // 监听注册表单的监听事件
    $('#form-reg').on('submit', function(event) {
        event.preventDefault(); // 阻止默认提交的行为
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form-reg [name=username]').val(),
                password: $('#form-reg [name=password]').val()
            },
            success: function(result) {
                if (result.status !== 0) return layer.msg(result.message);
                layer.msg(result.message);
                // 模拟人的点击行为
                $('.link_login').click()
            }
        })
    })

    // 监听登录表单的监听事件
    $('#form-login').on('submit', function(event) {
        event.preventDefault(); // 阻止默认提交的行为
        // console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(), // 快速获取表单中的数据
            success: function(result) {
                if (result.status !== 0) return layer.msg(result.message);
                layer.msg(result.message);
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', result.token);
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })

})

// 课程中项目接口地址： http://ajax.frontend.itheima.net/
// 项目备用接口地址： http://api-breakingnews-web.itheima.net