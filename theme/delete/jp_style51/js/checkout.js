require(['jquery','widget'],function($, Swiper){
$(document).ready(function(){
    // 赋值数量
    var count = Cjs.url.getParamByName('count');
    $("#mun").val(count);
    $('.product_numtext').html("   ×"+count);
    // 产品
    var combo_id = Cjs.url.getParamByName('combo_id');
    $("input[name=combo_id]").val(combo_id);
    var product_id = Cjs.url.getParamByName('product_id');
    $("input[name=product_id]").val(product_id);
    //获取套餐
    var combokey = '.combosid_'+combo_id.toString();
    //console.log(combokey);
    $(combokey).show();
    //$(combokey).show();
    // 获取属性
    var shuxing = Cjs.url.getParamByName('proto') || "";
    var shuxingArr = shuxing.split('|');
    var str = [];
    if( shuxing ){
        //console.log(combo_id);
        if(parseInt(combo_id) != 0){
            shuxingArr.map(function(elem, index) {
                var obj = elem.split('-');
                var goodsid = obj[0]
                var group = obj[1];
                var value = obj[2]; 
                str.push('<input type="hidden" name="attr['+ obj[0]+'-'+ obj[1] +']" value="'+ obj[2] +'">');
                $('[optionsGroup]').siblings("[goodid='"+goodsid+"'][group='"+group+"'][attrid='"+value+"']").show();
                    //domgroup.find('[data-id='+value+']').show();
            });
        }else{
            shuxingArr.map(function(elem, index) {
                var obj = elem.split('-');
                //var goodsid = obj[0]
                var group = obj[0];
                var value = obj[1];
                str.push('<input type="hidden" name="attr['+obj[0] +']" value="'+ obj[1] +'">');
                $('[optionskey]').siblings("[group='"+group+"'][attrid='"+value+"']").show();
                //console.log($('[optionskey]').siblings("[group='"+group+"'][attrid='"+value+"']"))
            });
        }
    }

    //
    $('input[name=payment_type]').eq(0).next().addClass('check');
    $('input[name=payment_type]').eq(0).prop('checked', true);

    $('#form').append(str.join(''));
    // 刷新价格
    refresh_price();

    //付款方式
    $('input[name="payment_type"]').eq(0).parent('label').addClass('check');
    $('input[name="payment_type"]').eq(0).attr('checked', true);
    if($('input[name="payment_type"]').eq(0).val() == 4){
        $('#ocean-div').fadeIn();
    }else{
        $('#ocean-div').fadeOut();
    }
    $('input[name="payment_type"]').change(function () {
        var val=$('input:radio[name="payment_type"]:checked').val();
        if(val == 4){
            $('#ocean-div').fadeIn();
        }else{
            $('#ocean-div').fadeOut();
        }
        $('.cell label').removeClass('check');
        $('.cell label[rel="'+ val +'"]').addClass('check');
    })

});
window.widget.repeatOrder.init();
window.widget.repeatOrder.getproattr();
window.widget.smsvalid && window.widget.smsvalid.init();//短信验证
})

function refresh_price() {
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('input[name=combo_id],input[name=\'product_id\'], #act, input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
           if(json.ret){
                $('combprice').html(json.price);
                $("#price").html(json.total);
                $("input[name='price']").val(json.total);
           }
           else{
               alert(json.msg)
           }
        },
        error: function(xhr, ajaxOptions, thrownError) {
        }
    });
}
// var _region = $("#_region").val();
// function postcheck(){
//     // credit card
//     var pay_type = $("input[name='payment_type']:checked").val();
//     if(pay_type ==4){
//         if(!document.getElementById("card_number").value||!document.getElementById("card_month").value||!document.getElementById("card_year").value||!document.getElementById("card_secureCode").value){
//             var error =  document.getElementById("error").value
//             alert(error);
//             return false;
//         }
//         var code  =  document.getElementById("code").value ;
//         var opcseForm = opcse.encryptForm("form", code);
//         opcseForm.handleSubmit();
//     }
//     return true;
// }
$('input:radio[name="payment_type"]').change(function () {
    var val=$('input:radio[name="payment_type"]:checked').val();
    $('.cell label').removeClass('check');
    $('.cell label').eq(val).addClass('check');
})
if(($('select[name="province"]').val()) == 15){
    $('#province').css('width','45%');
}
$('.back').on('click',function(){
    history.go(-1);
})