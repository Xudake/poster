posterArr = [
    'http://placekitten.com/1300/1800',
    'http://placekitten.com/g/1200/1800',
    'http://placekitten.com/g/1100/1800'
]

var vm = new Vue({
    el: '.main',
    data: {
        picUrl: '',
        posterUrl: '',
        showBtn: true
    },
    created: function(){
        var that = this;

        this.posterUrl = posterArr[0];
        this.$nextTick(function(){
            var mySwiper = new Swiper('.swiper-container', {
                direction: 'horizontal', // 垂直切换选项
                loop: true, // 循环模式选项

                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',
                },

                // 如果需要前进后退按钮
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },

                // 如果需要滚动条
                scrollbar: {
                    el: '.swiper-scrollbar',
                },

                on: {
                    slideChangeTransitionEnd: function () {
                        // alert(this.activeIndex);
                        that.posterUrl = posterArr[this.realIndex];
                    },
                },
            })
        })
        
    },
    methods: {
        showPoster: function(){
            domToCanvas("人生自古谁无死，留取丹心照汗青");
        },

        reShowPoster: function(){
            this.showBtn = true;
            removeAllChild();
        }
    }
})

function removeAllChild() {
    $('.img-box').empty();
}

function domToCanvas(text) {
    var qrw = document.getElementById("qrcode1").offsetWidth;
    var qrh = document.getElementById("qrcode1").offsetHeight;
    $("#qrcode1").qrcode({
        width: qrw,
        height: qrw,
        typeNumber: -1,//计算模式
        correctLevel: 1,//二维码纠错级别
        background: "#ffffff",//背景颜色
        foreground: "#000000",  //二维码颜色
        text: utf16to8(text), //任意内容
    });
    var box = $('.poster')[0];
    var rongqi = $('.img-box')[0];
    setTimeout(function(){
        var opts = {useCORS: true};

        var shareContent = box;//需要截图的包裹的（原生的）DOM 对象
        var width = shareContent.offsetWidth; //获取dom 宽度
        var height = shareContent.offsetHeight; //获取dom 高度
        var canvas = document.createElement("canvas"); //创建一个canvas节点
        var scale = 4; //定义任意放大倍数 支持小数
        canvas.width = width * scale; //定义canvas 宽度 * 缩放
        canvas.height = height * scale; //定义canvas高度 *缩放
        canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
        var opts = {
            scale: scale, // 添加的scale 参数
            canvas: canvas, //自定义 canvas
            // logging: true, //日志开关，便于查看html2canvas的内部执行流程
            width: width, //dom 原始宽度
            height: height,
            useCORS: true, // 【重要】开启跨域配置
            allowTaint: false
        };
        html2canvas(shareContent, opts).then(function (canvas) {

            var context = canvas.getContext('2d');
            // 【重要】关闭抗锯齿
            context.mozImageSmoothingEnabled = false;
            context.webkitImageSmoothingEnabled = false;
            context.msImageSmoothingEnabled = false;
            context.imageSmoothingEnabled = false;
            // 【重要】默认转化的格式为png,也可设置为其他格式
            var img = Canvas2Image.convertToJPEG(canvas, canvas.width/scale, canvas.height/scale);

            vm.showBtn = false;
            rongqi.appendChild(img);

            $(img).css({
                "width": canvas.width / scale + "px",
                "height": canvas.height / scale + "px",
            }).addClass('f-full');

        });
    },0)
}

// 支持中文
function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}  