$(function() {
    let layer = layui.layer;
    let form = layui.form;
    // form.render(); // 让layui里面的seletct重新渲染 ui 结构
    initCate(); // 加载文章分类

    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 当上传图片被触发时
    $('#coverFile').on('change', function(event) {
        // 1、拿到用户选择的文件
        var file = event.target.files[0];
        // 判断用户是否选择了文件，如果没有选择，不再执行下面的代码
        if (event.target.files.length === 0) return;
        // 2、根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        // 3、先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image.cropper('destroy').attr('src', newImgURL).cropper(options);
    });

    // 定义文章的状态
    let art_status = '已发布';
    // 如果点击的是存为草稿，那么就重新赋值文章的发布状态
    $('#btnSace2').on('click', function() {
        art_status = '草稿';
    })

    // 监听页面的 表单提交事件
    $('body').on('submit', '.layui-form', function(event) {
        event.preventDefault(); // 阻止默认提交事件
        console.log($(this)[0]);
        // 基于form 表单 快速创建 formDate 对象
        let fd = new FormData($(this)[0]);

        // 向 formData 对象中追加 新的值
        // 存储文章的发布状态
        fd.append('state', art_status);

        // 4. 将裁剪后的图片， 输出为文件
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作

            // 向裁剪区域的图片 追加近 formData 对象中.
            fd.append('cover_img', blob);
        });

        // 检测 formData 的数据
        fd.forEach((index, item) => {
            console.log(item, index);
        });

        // 发布文章的方法
        publishArticle(fd);
    });


    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(result) {
                if (result.status !== 0) return layer.msg(result.message);
                $('select[name=cate_id]').empty().html(template('tpl-cateId', result))
                form.render(); // 重新让layui渲染页面的 select 下拉选择框
            }
        })
    }

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd, // 如果是向服务器提交的是 FormData 格式的数据,
            // 必须添加以下两个配置,不然此次请求就会失败
            contentType: false,
            processData: false,
            success: function(result) {
                if (result.status !== 0) return layer.msg(result.message);
                console.log(result.message);
                // 发布文章成功后，跳转到文章列表页面
                window.parent.highlight('文章列表')
                location.href = '/article/art_list.html'
            }
        })
    }
})