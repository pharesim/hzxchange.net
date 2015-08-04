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
jQuery.ajaxSetup({ async: true });

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