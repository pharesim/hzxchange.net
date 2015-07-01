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

function getMainRow(result,coin) {
	var change = (result.last-result.twefohr)*100/result.twefohr;
	var diff = (result.ask-result.bid)*100/result.ask;
	var string = '<tr>'+
		'<td title="'+coin+'">'+
			'<h2 class="h5style tabletext">'+result.name+'</h2>'+
		'</td>'+
		'<td style="text-align:right;">'+
			'<h2 class="h5style tabletext">'+
				'<div class="showCurrency inHZ">'+result.last+'</div>'+
				// '<div class="showCurrency inBTC">'+result['lastBTC']+'</div>'+
			'</h2>'+
		'</td>'+
		'<td style="text-align:right;">'+
			'<h2 class="h5style tabletext">'+
				'<div class="showCurrency inHZ">'+result.bid+'</div>'+
				// '<div class="showCurrency inBTC">'+result['bidBTC']+'</div>'+
			'</h2>'+
		'</td>'+
		'<td style="text-align:right;">'+
			'<h2 class="h5style tabletext">'+
				'<div class="showCurrency inHZ">'+result.ask+'</div>'+
				// '<div class="showCurrency inBTC">'+result['askBTC']+'</div>'+
			'</h2>'+
		'</td>'+
		'<td style="text-align:right;">'+
			'<h2 class="h5style tabletext">'+diff+'%</h2>'+
		'</td>'+
		'<td class="mobilehide" style="text-align:right;">'+
			'<h2 class="h5style tabletext">'+
				'<div class="showCurrency inHZ">'+result.high+'</div>'+
				// '<div class="showCurrency inBTC">'+result.highBTC+'</div>'+
			'</h2>'+
		'</td>'+
		'<td class="mobilehide" style="text-align:right;">'+
			'<h2 class="h5style tabletext">'+
				'<div class="showCurrency inHZ">'+result.low+'</div>'+
				// '<div class="showCurrency inBTC">'+result.lowBTC+'</div>'+
			'</h2>'+
		'</td>'+
		'<td class="mobilehide" style="text-align:right;">'+
			'<h2 class="h5style tabletext">'+
				'<div class="showCurrency inHZ">'+result.volume+'</div>'+
				// '<div class="showCurrency inBTC">'+result.volumeBTC+'</div>'+
			'</h2>'+
		'</td>'+
		'<td style="text-align:right;">'+
			'<h2 class="h5style tabletext">'+change+'%</h2>'+
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