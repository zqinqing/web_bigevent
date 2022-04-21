$(function() {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;

    // 定义一个查询的参数对象, 请求数据的时候需要将请求参数对象提交到服务器
    let options = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示多少条数据，默认显示2条
        cate_id: '', // 文章分类的id，可选参数
        state: '' // 文章的状态,可选值有: 已发布，草稿，可选参数
    }

    // 初始化文章里列表
    initTable();

    // 初始化文章分类
    initCate();


    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: options,
            success: function(result) {
                if (result.status !== 0) return layer.msg(result.message);
                // layer.msg(result.message);
                // console.log('文章列表数据', result);
                // console.log(template('tpl-artlist', result.data));
                $('tbody').empty().html(template('tpl-artlist', result));
                // 调用渲染分页的方法
                renderPage(result.total); // total当前数据的总条数
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(result) {
                if (result.status !== 0) return layer.msg(result.message);
                $('[name=cate_id]').html(template('tpl-cate', result));
                form.render(); // 让layui里面的seletct重新渲染 ui 结构
            }
        })
    }

    // 筛选请求
    $('#form-search').on('submit', function(event) {
        event.preventDefault();
        options.cate_id = $('[name=cate_id]').val();
        options.state = $('[name=status]').val();
        // console.log(options);
        // 初始化文章里列表
        initTable();
    })

    // 模板引擎的过滤器
    template.defaults.imports.dataFormat = function(value) {
        let time = new Date(value);
        let fullyer = time.getFullYear();
        let month = padzero(time.getMonth() + 1);
        let date = padzero(time.getDate());
        let hours = padzero(time.getHours());
        let minutes = padzero(time.getMinutes());
        let seconds = padzero(time.getSeconds());
        return `${fullyer}-${month}-${date}  ${hours}:${minutes}:${seconds}`;
    };
    // 自动补零函数
    function padzero(num) {
        return num < 10 ? '0' + num : num;
    }

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用 laypage.render 渲染
        laypage.render({
            elem: 'pageBox', // id 不需要加 #
            count: total, // 总数据条数
            limit: options.pagesize, // 每页显示几条
            curr: options.pagenum, // 默认让哪一页被选中
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 4, 6, 8, 10], // 配置分页每页展示多少条的选项卡
            // jump 分页发生切换的时候，触发 jump 回调 2、 只要调用了renderPage 就会触发 jump 属性 first就会为 true
            jump: function(obj, first) { // obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // console.log('first', first); // true 判断是否首次进入 jump 

                //首次不执行
                if (!first) {
                    //do something
                    // 给查询的对象重新赋值
                    options.pagenum = obj.curr; // 页码值，默认请求第一页的数据
                    options.pagesize = obj.limit; // 每页显示多少条数据，默认显示2条
                    // 根据最新的 options 获取对应的数据列表， 并渲染表格
                    console.log('options', options);
                    initTable(); // 初始化文章里列表
                }
            }
        })
    }

    // 给文章列表添加点击事件，监听删除按钮
    $('tbody').on('click', 'input[value="删除"]', function(event) {
        // 获取删除按钮的个数
        let len = $('input[value=删除]').length;

        let $id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + $id,
                success: function(result) {
                    if (result.status !== 0) return layer.msg(result.message);
                    layer.msg(result.message);

                    // 当数据删除完成后，需要判断当前这一页中,是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值 -1 之后，再重新调用 initTable()函数
                    if (len === 1) { // 如果 len 的值等于1代表删除完成之后页面就没有数据了
                        // 注意: 页码值最小必须是 1
                        options.pagenum = options.pagenum === 1 ? 1 : options.pagenum - 1;
                    }
                    // 初始化文章里列表
                    initTable();
                }
            })
            layer.close(index);
        })
    })

})