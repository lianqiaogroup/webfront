require(['jquery', 'swiper-3.4.0.jquery.min','widget'], function ($, Swiper){
    // 回到顶部
    $(".m-goToTop").click(function(event) {
        $(window).scrollTop(0);
    });

    // 轮播图
    var h = $(window).height();
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        prevButton:'.swiper-button-prev',
        nextButton:'.swiper-button-next',
        pagination: '.swiper-pagination',
        paginationType: 'custom',
        paginationCustomRender: function(swiper, current, total) {
            var text = "";
            for (var i = 1; i <= total; i++) {
                if (current == i) {
                    text += "<span class='redicon'></span>";
                } else {
                    text += "<span class='whiteicon'></span>";
                }
            }
            return text;
        }
    });

    $('[render=format]').html(moneyFormat($('[render=format]').html()));

    // 初始化选择
    var hClass = 'active';
    var combos = $('#combo .ui-col');
    if(combos.length == 1){
        combos.eq(0).addClass(hClass);
        $('[name="combo_id"]').val(combos.eq(0).attr('data-id'));
    }
    // 选择产品
    combos.click(function(event) {
        /* Act on the event */
        $(this).addClass(hClass).siblings().removeClass(hClass);
        $('[name="combo_id"]').val($(this).attr('data-id'));
        var com_show = $(this).attr('data-id');
        $('.combos').hide();
        $('#combo_'+ com_show).show();
        refresh_price();
        singleCombo();
    });

    refresh_price();
    singleCombo();
    // 属性都选第一个
    var attrs = $('.product_attr');
        attrs.each(function(){
            var obj = $(this).find('span');
            if(obj.length == 1){
                obj.eq(0).addClass('active');
                var id = obj.attr('data-id');
                $(this).attr('data-id', id);
            }
            if($('#combo .ui-col').length != 0){
                if($('.combos').eq(0).find('.active').length == $('.combos').eq(0).find('.product_attr').length){
                    $('#combo .ui-col').eq(0).addClass('active');
                    $('[name="combo_id"]').val($('#combo .ui-col').eq(0).attr('data-id'));
                }
            }
        });
        // 选择事件
        attrs.on('click', 'span', function(){
            var self = $(this);
            var id = self.attr('data-id');
            self.addClass('active').siblings().removeClass('active');
            self.parents('.product_attr').attr('data-id', id);
            var src = self.attr('data-img');
            if( src ){ $('#attrimg').attr('src', src); }
            var data_index = self.attr('dats-combo');
            $('#combo').find('.ui-col[data-id="'+ data_index +'"]').addClass('active');
            if($('#combo .ui-col').length != 0){
                $('[name="combo_id"]').val(data_index);
            }
        });
    //
    $('[btn-act-buy]').click(function(){
        postcheckGuige();
    });
    // $('#inquiry').click(function(){
    //     var url = '/order_quality.php';
    //     window.location.href = url;
    // })
})
//套餐是否可选数量
function singleCombo(){
    var single_c =  $('.ui-col.active').attr('single_c');
    if(parseInt(single_c) == 1){
        $('#num').val(1);
        $('#num').parents('.ui-row').hide();
    }else{
        $('#num').parents('.ui-row').show();
    }
}
// 提交表单
function postcheckGuige() {
    var url = "/checkout.php?";

    // 数量
    var count = parseInt($('input#num').val()) || 1;
    url = url + "count="+count;

    // 产品ID
    var comb_id = $('[name="combo_id"]').val();
    url = url + "&combo_id="+comb_id;
    var product_id = $('[name="product_id"]').val();
    url = url + "&product_id="+product_id;
    var dom = $('#combo_'+comb_id).find('.product_attr');

    /* Act on the event */
    if( dom.length > 0 ){
        var prototype = [];
        
        dom.each(function(){
            var groupId = $(this).attr('data-group');
            var prototypeId = $(this).attr('data-id');
            var goodsid = $(this).attr('data-goods');
            if( parseInt(prototypeId)>0 ){
                if(goodsid){
                    prototype.push(goodsid+"-"+groupId+"-"+prototypeId);
                }else{
                    prototype.push(groupId+"-"+prototypeId);
                }
            }
        });
        if( prototype.length < dom.length ){
            alert($('.options-layer').attr('data-error'));
            return false;
        }
        url = url + "&proto="+prototype.join('|');
    }   
    // 跳转
    window.location.href = url;
    return false;
}

// 刷新价格
function refresh_price() {
    var priceDom = $('[render=price]');
    var totalDom = $('[render=total]');
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('input[name="combo_id"],input[name=\'product_id\'], #act, input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
           if(json.ret)
           {
              priceDom.html(moneyFormat(json.price));
              totalDom.html(moneyFormat(json.total));
           }
           else{
               alert(json.msg)
           }
        },
        error: function(xhr, ajaxOptions, thrownError) {
        }
    });
}

function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
    refresh_price(); 
}
function minnumber(){
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        refresh_price();
    }
}
function inputnumber(){
    var number=parseInt($('#num').val());
    if(isNaN(number)||number < 1){
        $('#num').val('1');
        refresh_price();
    }else if(number > 1){
        $('#num').val(number);
    }
    refresh_price();
}

function moneyFormat(input) {
    var number = new Number(input);
    var str = number.toString();
    var newstr = str.replace(/\d{1,3}(?=(\d{3})+$)/g,function(s){
        return s+','
    });
    return newstr;
}
var fbqstatus = {
    AddToCart: 0,
    InitiateCheckout: 0
};
var region_code = $("#regionCode").val();
//泰国加入fb三个事件；
if (region_code == 'THA' || region_code == 'Rp') {
    //fb加入购物车事件
    $('.btn').on('click', function () {
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
    });

    function judge() {
        if (fbqstatus.InitiateCheckout == 0) {
            fbq('track', 'InitiateCheckout');
            fbqstatus.InitiateCheckout++;
        };
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
    }
    //fb发起结账事件
    var list = $('#combo .ui-col');
    list.on("click",function(){
        judge();
    });
    var itemOne = $(".combos:first span");
    itemOne.on("click",function(){
        judge();
    });
    var itemTwo = $("#combo_0 span");
    itemTwo.on("click",function(){
        judge();
    })
};