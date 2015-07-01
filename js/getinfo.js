function processAssetTradeModal(result,coins,coin,loadpage){
	console.log(coins);
	$.get('include/trade'+loadpage+'.html', '', function (data) { 
		$("#tradingcontainer").append('<div id="modalbox'+result.name+'">'+data+'</div>');
		$("#modalbox"+result.name+" .modal").attr('id',result.name+'Modal').attr('aria-labelledby',result.name+'Modal');
		$("#modalbox"+result.name+" h1.modal-header").text(result.name+" ("+coins[coin]+")");
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
		$.get('include/sell.html', '', function (sell) {
			$("#modalbox"+result.name+" .sellinclude").append(sell);
			$("#modalbox"+result.name+" .sellinclude span.no_sell").text('You do not have any '+result.name+' to sell');
			$("#modalbox"+result.name+" .sellinclude label.sellamount").attr('for',result.name+"sellamount");
			$("#modalbox"+result.name+" .sellinclude input.sellamount").attr('id',result.name+"sellamount").attr('data-asset',coins[coin]);
			$("#modalbox"+result.name+" .sellinclude label.sellprice").attr('for',result.name+"sellprice");
			$("#modalbox"+result.name+" .sellinclude input.sellprice").attr('id',result.name+"sellprice").attr('data-asset',coins[coin]);
			$("#modalbox"+result.name+" .sellinclude label.selltotal").attr('for',result.name+"selltotal");
			$("#modalbox"+result.name+" .sellinclude input.selltotal").attr('id',result.name+"selltotal").attr('data-asset',coins[coin]);
			$("#modalbox"+result.name+" .sellinclude input.sellsubmit").attr("data-asset",coin);
			$("#modalbox"+result.name+" .modal-body fieldset.withdraw .sellbusy").attr('id','sell'+result.name+'_loading');
		});
		$.get('include/asks.html', '', function (asks) {
			$("#modalbox"+result.name+" .asksinclude").append(asks);
			$("#modalbox"+result.name+" .asksinclude span.no_asks").text('There are no ask orders for '+result.name+' yet');
		});
		$.get('include/bids.html', '', function (bids) {
			$("#modalbox"+result.name+" .bidsinclude").append(bids);
			$("#modalbox"+result.name+" .bidsinclude span.no_bids").text('There are no bid orders for '+result.name+' yet');
		});
		$.get('include/trades.html', '', function (trades) {
			$("#modalbox"+result.name+" .tradesinclude").append(trades);
			$("#modalbox"+result.name+" .bidsinclude span.no_trades").text('There have been no trades with '+result.name+' yet');
		});
	});
}

function calculate(a,b,operator,cf){
	cf = typeof cf !== 'undefined' ? cf : 100000000;
	if(operator == '*') {
		if(cf != 1) {
			a = calculate(a,cf,'*',1);
			b = calculate(b,cf,'*',1);
			x = calculate(cf,cf,'*',1);
			y = (a * b) / x;
		} else {
			y = Math.round(a * b);
		}

		return y;
	} else if(operator == '+') {
		return (calculate(a,cf,'*') + calculate(b,cf,'*')) / cf;
	}
}

function number_format(number, decimals, dec_point, thousands_sep) {
	number = (number + '')
    .replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + (Math.round(n * k) / k)
        .toFixed(prec);
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
    .split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '')
    .length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1)
      .join('0');
  }
  return s.join(dec);
}

function getMainRow(result,coin) {
	var change = calculate((result.last-result.twefohr),100,'*')/result.twefohr;
	var diff = calculate((result.ask-result.bid),100,'*')/result.ask;
	var string = '<tr>'+
		'<td title="'+coin+'">'+
			'<h2 class="h5style tabletext">'+result.name+'</h2>'+
		'</td>'+
		'<td style="text-align:right;">'+
			'<h2 class="h5style tabletext">'+
				'<div class="showCurrency inHZ">'+number_format(result.last,8-result.decimals)+'</div>'+
				// '<div class="showCurrency inBTC">'+result['lastBTC']+'</div>'+
			'</h2>'+
		'</td>'+
		'<td style="text-align:right;">'+
			'<h2 class="h5style tabletext">'+
				'<div class="showCurrency inHZ">'+number_format(result.bid,8-result.decimals)+'</div>'+
				// '<div class="showCurrency inBTC">'+result['bidBTC']+'</div>'+
			'</h2>'+
		'</td>'+
		'<td style="text-align:right;">'+
			'<h2 class="h5style tabletext">'+
				'<div class="showCurrency inHZ">'+number_format(result.ask,8-result.decimals)+'</div>'+
				// '<div class="showCurrency inBTC">'+result['askBTC']+'</div>'+
			'</h2>'+
		'</td>'+
		'<td style="text-align:right;">'+
			'<h2 class="h5style tabletext">'+number_format(diff,2)+'%</h2>'+
		'</td>'+
		'<td class="mobilehide" style="text-align:right;">'+
			'<h2 class="h5style tabletext">'+
				'<div class="showCurrency inHZ">'+number_format(result.high,8-result.decimals)+'</div>'+
				// '<div class="showCurrency inBTC">'+result.highBTC+'</div>'+
			'</h2>'+
		'</td>'+
		'<td class="mobilehide" style="text-align:right;">'+
			'<h2 class="h5style tabletext">'+
				'<div class="showCurrency inHZ">'+number_format(result.low,8-result.decimals)+'</div>'+
				// '<div class="showCurrency inBTC">'+result.lowBTC+'</div>'+
			'</h2>'+
		'</td>'+
		'<td class="mobilehide" style="text-align:right;">'+
			'<h2 class="h5style tabletext">'+
				'<div class="showCurrency inHZ">'+number_format(result.volume,8-result.decimals)+'</div>'+
				// '<div class="showCurrency inBTC">'+result.volumeBTC+'</div>'+
			'</h2>'+
		'</td>'+
		'<td style="text-align:right;">'+
			'<h2 class="h5style tabletext">'+number_format(change,2)+'%</h2>'+
		'</td>'+
		'<td id="'+result.name+'_actions" style="text-align:center;">'+
			'<a href="#" class="btn btn-primary h5style details" data-toggle="modal" data-target="#'+
				result.name+'Modal" style="font-weight:bold;">'+
					'<i class="ti-stats-up"></i>'+
			'</a>'+
		'</td>'+
	'</tr>';

	return string;
}

function getAssetInfo(id) {
	var secsperday = 60*60*24;
	var dayago = 0;
	sendRequest("getBlockchainStatus", {}, function(response){
			if(response.time) {
				dayago = response.time - secsperday;
			} else {
				alert('NHZ server not reachable');
			}
		}
	);
	
	var asset = null;
	sendRequest("getAsset", {"asset":id}, function(response){
			asset = response;
		}
	);

	var result = {
		'name':asset.name,
		'decimals':asset.decimals,
		'volume':0,
		'twefohr':0,
		'last':0,
		'high':0,
		'low':0,
		'ask':0,
		'bid':0
	};
		
	var bids = null;
	sendRequest("getBidOrders", {"asset":id}, function(response){
			bids = response;
		}
	);

	if(typeof(bids.bidOrders) !== 'undefined' && typeof(bids.bidOrders[0]) != 'undefined')
	{
		result['bid'] = bids.bidOrders[0].priceNQT/Math.pow(10,8-asset.decimals);
	}

	var asks = null;
	sendRequest("getAskOrders", {"asset":id}, function(response){
			asks = response;
		}
	);

	if(typeof(asks.askOrders) != 'undefined' && typeof(asks.askOrders[0]) != 'undefined')
	{
		result['ask'] = asks.askOrders[0].priceNQT/Math.pow(10,8-asset.decimals);
	}

	if(asset.numberOfTrades > 0)
	{
		var trades = null;
		sendRequest("getTrades", {"asset":id}, function(response){
				trades = response;
			}
		);
		
		for (var i = 0; i < trades.trades.length; ++i)
		{
			var qnt = trades.trades[i].quantityQNT/Math.pow(10,asset.decimals);
			var price = trades.trades[i].priceNQT/Math.pow(10,8-asset.decimals);

			if(result['last'] == 0)
			{
				result['last'] = price;
			}

			if(trades.trades[i].timestamp < dayago)
			{
				result['twefohr'] = price;
				break;
			}

			if(price > result['high'])
			{
				result['high'] = price;
			}

			if(result['low'] == 0 || price < result['low'])
			{
				result['low'] = price;
			}

			result['volume'] += qnt*price;
		}
	}

	// inBTC = ['last','high','low','ask','bid','volume'];
	// foreach(inBTC as key)
	// {
	// 	var price = 0;
	// 	var decimals = 0;
	// 	if(isset(result[key]))
	// 	{
	// 		price = result[key]*this->hzprice;
	// 		float = sprintf('%f', price);
	// 		integer = sprintf('%d', price);
	// 		if (float == integer) {
	// 			price = integer;
	// 		}
	// 		else
	// 		{
	// 			price = rtrim(float,'0');
	// 		}

	// 		decimals = strlen(substr(strrchr(price, "."), 1));
	// 		if(decimals > 8) decimals = 8;
	// 	}

	// 	result[key.'BTC'] = number_format(price,decimals);
	// }

	return result;
}