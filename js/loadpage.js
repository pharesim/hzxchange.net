jQuery.ajaxSetup({ async: false });
$.get('include/head.html', '', function (data) { $("head").append(data); });
$.get('include/navbar.html', '', function (data) { $("#navbar").append(data); });
$.get('include/loginbox.html', '', function (data) { $("#loginbox").append(data); });
$.get('include/logged_in.html', '', function (data) { $("#logoutbox").append(data); });
$.get('include/logout_button.html', '', function (data) { $(".logoutbutton").append(data); });
$.get('include/sidebar.html', '', function (data) { $("#sidebarcontainer").append(data); });
$.get('include/faq.html', '', function (data) { $("#faqmodal").append(data); });
$.get('include/info.html', '', function (data) { $("#infomodal").append(data); });
$.get('include/news.html', '', function (data) { $("#news").append(data); });
$.get('include/javascript.html', '', function (data) { $("body").append(data); });
$.get('include/prices.html', '', function (data) { $("#tradingcontainer").append(data); });
jQuery.ajaxSetup({ async: true });

for (var coin in coins)
{
	var result = getAssetInfo(coins[coin]);
	assets[result.name] = coins[coin];
	$("#sample_1 tbody").append(getMainRow(result,coins[coin]));
	$.get('include/tradecoin.html', '', function (data) { 
		$("#tradingcontainer").append('<div id="modalbox'+result.name+'">'+data+'</div>');
		$("#modalbox"+result.name+" .modal").attr('id',result.name+'Modal').attr('aria-labelledby',result.name+'Modal');
		$("#modalbox"+result.name+" .modal-header").text(result.name+" ("+coins[coin]+")");
		$("#modalbox"+result.name+" a.deposit, a.withdrawal").attr("data-asset",coin);
		$("#modalbox"+result.name+" .asset_name").text(result.name);
		$("#modalbox"+result.name+" .modal-body fieldset.withdraw").attr('id',result.name+"Withdraw");
		$("#modalbox"+result.name+" .modal-body fieldset.withdraw label.withdrawamount").attr('for',result.name+"withdrawamount");
		$("#modalbox"+result.name+" .modal-body fieldset.withdraw input.withdrawamount").attr('id',result.name+"withdrawamount");
		$("#modalbox"+result.name+" .modal-body fieldset.withdraw span.withdrawmax,.withdrawcancelbutton,.withdrawbutton").attr('data-asset',coins[coin]);
		$("#modalbox"+result.name+" .modal-body fieldset.withdraw label.withdrawaddress").attr('for',result.name+"withdrawaddress");
		$("#modalbox"+result.name+" .modal-body fieldset.withdraw input.withdrawaddress").attr('id',result.name+"withdrawaddress");
		$("#modalbox"+result.name+" .modal-body fieldset.withdraw .withdrawbusy").attr('id',result.name+'withdraw_loading');
		$.get('include/buy.html', '', function (buy) {
			$("#modalbox"+result.name+" .buyinclude").append(buy);
			$("#modalbox"+result.name+" .buyinclude label.buyamount").attr('for',result.name+"buyamount");
			$("#modalbox"+result.name+" .buyinclude input.buyamount").attr('id',result.name+"buyamount").attr('data-asset',coins[coin]);
			$("#modalbox"+result.name+" .buyinclude label.buyprice").attr('for',result.name+"buyprice");
			$("#modalbox"+result.name+" .buyinclude input.buyprice").attr('id',result.name+"buyprice").attr('data-asset',coins[coin]);
			$("#modalbox"+result.name+" .buyinclude label.buytotal").attr('for',result.name+"buytotal");
			$("#modalbox"+result.name+" .buyinclude input.buytotal").attr('id',result.name+"buytotal").attr('data-asset',coins[coin]);
			$("#modalbox"+result.name+" .buyinclude input.buysubmit").attr("data-asset",coin);
			$("#modalbox"+result.name+" .modal-body fieldset.withdraw .buybusy").attr('id','buy'+result.name+'_loading');
		});
	});
}

for (var trust in trusted)
{
	var result = getAssetInfo(trusted[trust]);
	assets[result.name] = trusted[trust];
	$("#sample_2 tbody").append(getMainRow(result,trusted[trust]));
	// $.get('include/tradeasset.html', '', function (data) { $("#tradingcontainer").append('<div id="modalbox'+trust+'">'+data+'</div>'); });
}

$.get('include/warning.html', '', function (data) { $(".warningbox").prepend(data); });

$(".loading_hidden").hide();

$(".showCurrency").hide();
$(".inHZ").show();

$("#showBTC").click(function(e){
	e.preventDefault();
	$(".showCurrency").hide();
	$(".inBTC").show();
});

$("#showHZ").click(function(e){
	e.preventDefault();
	$(".showCurrency").hide();
	$(".inHZ").show();
});


$(".identified").hide();

$(".deposit").hide();
$(".sell").hide();
$(".buy").hide();
$(".withdrawal").hide();

$(".modal").hide();

$("#settings").hide();
$("#settings_link").click(function(e){
	e.preventDefault();
	$("#settings").toggle();
});

$(".loader-wrap").fadeOut("slow");