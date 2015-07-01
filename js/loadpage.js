for (var coin in coins)
{
	var result = getAssetInfo(coins[coin]);
	assets[result.name] = coins[coin];
	$("#sample_1 tbody").append(getMainRow(result,coins[coin]));
	processAssetTradeModal(result,coins,coin,'coin');
}

for (var trust in trusted)
{
	var result = getAssetInfo(trusted[trust]);
	assets[result.name] = trusted[trust];
	$("#sample_2 tbody").append(getMainRow(result,trusted[trust]));
	processAssetTradeModal(result,trusted,trust,'asset');
}

var warning = '<div class="row">'+
	'<div class="alert alert-warning unidentified col-md-12" role="alert">'+
		'You need to log into your Horizon account to trade on hzxchange.net<br  />'+
		'Transactions are signed in your browser using javascript, the passphrase is never sent to a remote server.<br />'+
		'You can also use the'+
		'<a href="https://account.horizonplatform.io" target="_blank">'+
			'Horizon wallet'+
		'</a>'+
		'to deposit, trade and withdraw the asset.'+
	'</div>'+
'</div>';
$(".warningbox").prepend(warning);

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