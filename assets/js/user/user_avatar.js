$(function() {
    let layer = layui.layer;

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比 正方形
        aspectRatio: 1,
        // 纵横比 长方形
        // aspectRatio: 4 / 3,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 上传文件按钮绑定触发事件
    $('#avatar').on('change', function(event) {
        // 1、拿到用户选择的文件
        // console.log(this.files[0]);
        // console.log(event.target.files);
        let file = event.target.files[0];
        if (file.length === 0) return layer.msg('请选择照片');
        // 2、根据选择的文件，创建一个对应的 URL 地址：
        let newImgUrl = URL.createObjectURL(file);
        console.log(newImgUrl);
        // 3、先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image.cropper('destroy').attr('src', newImgUrl).cropper(options);
    })

    // 上传文件绑定点击事件
    $('#submit').on('click', function(event) {
        // 4、 将裁剪后的图片，输出为 base64 格式的字符串
        var dataURL = $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            }).toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            // 调用接口，上传文件
            // console.log(dataURL);

        // 上传base64格式的图片
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(result) {
                if (result.status !== 0) return layer.msg(result.message);
                layer.msg(result.message);
                window.parent.getUserInfo();
            }
        })
    })
})