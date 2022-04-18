$(function() {
    let layer = layui.layer;
    let form = layui.form;

    // 调用获取文章分类的列表
    initArtCateList();

    let addIndex = null;
    // 为新增类别添加点击事件
    $('#addCate').on('click', function(event) {
        addIndex = layer.open({
            type: 1, // 1 表示页面层
            area: ['500px', '250px'], // 宽高
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        });
        // $('form').serialize();
    })

    // 为新增表单添加表单校验
    form.verify({})

    // 通过代理的形式，为表单 #form-add 添加表单 submit事件 提交事件
    $('body').on('submit', '#form-add', function(event) {
        event.preventDefault(); // 阻止默认提交事件
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(result) {
                if (result.status !== 0) return layer.msg(result.message);
                initArtCateList(); // 重新渲染文章分类的列表
                layer.msg(result.message);
                layer.close(addIndex); // 根据索引,关闭对应的弹出层
            }
        })
    })


    let indexEdit = null;
    // 为文章列表添加编辑按钮点击事件
    $('tbody').on('click', 'input[value=编辑]', function(event) {
        // 展示修改的弹出层
        indexEdit = layer.open({
            type: 1, // 1表示页面层
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        });

        // 获取Id 值
        let $id = $(this).parent().attr('data-id');

        // 根据Id请求具体的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + $id,
            success: function(result) {
                if (result.status !== 0) return layer.msg(result.message);
                console.log(result, 'result');
                form.val('form-edit', result.data); // layui 的快速填充表单
            }
        });
    })

    // 为修改文章 表单添加提交事件
    $('body').on('submit', '#form-edit', function(event) {
        event.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(result) {
                if (result.status !== 0) return layer.msg(result.message);
                initArtCateList(); // 重新渲染文章分类的列表
                layer.msg(result.message);
                layer.close(indexEdit);
            }
        })
    })

    // 为删除按钮添加点击事件
    $('tbody').on('click', 'input[value=删除]', function(event) {
        let $id = $(this).parent().attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + $id,
                success: function(result) {
                    if (result.status !== 0) return layer.msg(result.message);
                    initArtCateList(); // 重新渲染文章分类的列表
                    layer.msg(result.message);
                    layer.close(index); //根据索引关闭当前对话框
                }
            })
        })

    })

});
// 获取文章分类的列表
function initArtCateList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(result) {
            if (result.status !== 0) return console.log('获取文章列表失败!');
            console.log(result.data);
            $('tbody').empty().html(template('tpl-table', result));
        }
    })
}