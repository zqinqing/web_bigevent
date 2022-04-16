// 注意：每次调用 $.get() 或 $.post() 或 $.ajax()的时候，都会先调用这个 ajaxPrefilter 这个函数
$.ajaxPrefilter(function(options) {
    // 在发起真正的Ajax请求之前，统一拼接请求的路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    console.log(options.url);
})