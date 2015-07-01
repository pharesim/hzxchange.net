var genesisRS        = 'NHZ-8HAA-H88W-UVT5-DUGLV';
var password         = '';
var pubkey           = '';       
var account          = '';
var accountRS        = '';
var balance          = 0;
var depositAddresses = [];
var updating         = 0;
var balances         = [];
var hzprice          = 0;

function updateAccount() {
	sendRequest("rsConvert", {
			"account": account
		}, function(response) {
			if(!response.accountRS) {
				password = '';
				pubkey   = '';
				account  = '';
				$("#loginbox").append(
					'<span id="login_error">Login failed</span>'
				);
				setTimeout(function(){ $("#login_error").remove() }, 5000);
			} else {
				accountRS = response.accountRS;
				$("#accountrs").html(accountRS)
				$(".identified").show();
				$(".unidentified").hide();
				
				if(updating == 0) {
					updating = 1;
					setInterval(
						function(){
							updateAccount();
						},
						60000
					);
				}

				sendRequest("getAccount", {
						"account": account
					}, function(response){
						if(response.accountRS) {
							getAssets();
							setBalances(response);
							unconfirmedTransactions();
						} else {
							$("#balance").hide();
							$("#new_account").show();
							$("#pubkey").text(pubkey);
							$(".deposit").hide();
						}
					}
				);
			}
		}
	);
}

function unconfirmedTransactions() {
	sendRequest("getUnconfirmedTransactions", {
			"account": account
		}, function(response){
			console.log(response);
		}
	);
}

function setAssetBalances(response){
	if(typeof(response.unconfirmedAssetBalances) !== 'undefined') {
		balances = [];
		for (var i = 0; i < response.unconfirmedAssetBalances.length; ++i) {
			balances[response.unconfirmedAssetBalances[i].asset] = response.unconfirmedAssetBalances[i].unconfirmedBalanceQNT;
		}
		for (var asset in assets){
			if (assets.hasOwnProperty(asset) && typeof(balances[assets[asset].asset]) !== 'undefined') {
				assets[asset].balance = convertToQNTf(
					balances[assets[asset].asset],
					assets[asset].decimals
				);
				$("#"+asset+'Modal .no_sell').hide();
				$("#"+asset+'Modal .sell').show();
				$("#"+asset+'Modal .asset_balance').text(format(assets[asset].balance));
				if($("#"+asset+"Withdraw").is(":hidden")) {
					$("#"+asset+"Modal .withdrawal").show();
				}
			} else {
				nothingToSell(asset);
			}
		}
	} else {
		nothingToSell(asset);
	}
}

function nothingToSell(asset) {
	$("#"+asset+"Modal .sell").hide();
	$("#"+asset+"Modal .no_sell").show();
	$("#"+asset+"Modal .withdrawal").hide();
	$("#"+asset+"Modal .asset_balance").text('0');
}

function setBalances(response) {
	setAssetBalances(response);
	$("#new_account").hide();
	$("#balance").show();
	balance = convertToNHZ(response.unconfirmedBalanceNQT);
	$(".hzbalance").text(format(balance));
	$(".details").show();
	if(balance >= 1) {
		getDepositAddresses();
		$(".deposit").show();
		$(".no_buy").hide();
		$(".buy").show()
	} else {
		$(".deposit").hide();
		$(".no_buy").show();
		$(".buy").hide()
	}
}

function getDepositAddresses() {
	depositAddresses = [];
	var issuers = [];
	var issuerswk = [];
	var i = 0;
	for (var asset in assets) {
		if (assets.hasOwnProperty(asset)) {
			issuers[i] = assets[asset].account;
			++i;
			issuerswk[asset] = assets[asset].account;
		}
	}
	sendRequest("getAccountTransactions", {
			"account": account,
			"type": 1,
			"subtype": 0
		}, function(response) {
			for (var i = 0; i < response.transactions.length; ++i) {
				if($.inArray(response.transactions[i].sender,issuers) > -1 && response.transactions[i].attachment) {
					if(response.transactions[i].attachment.message.indexOf("Your deposit address for") == 0) {
						var asset = response.transactions[i].attachment.message.substring(25,32).trim();
						if(typeof(depositAddresses[asset]) === 'undefined') {
							var offset = 25 + asset.length + 4;
							var address = response.transactions[i].attachment.message.substring(offset);
							var cut = address.search("public key");
							if(cut > 5) {
								address = address.substring(0,cut-1);
							}
							depositAddresses[asset] = address.trim();
							$("#"+asset+"Modal .deposit").attr(
								"data-deposit",
								depositAddresses[asset]
							).text("Deposit");
						}
					}
				} else if ($.inArray(response.transactions[i].recipient,issuers) > -1) {
					for (var asset in issuerswk) {
						if(issuerswk[asset] == response.transactions[i].recipient && typeof(depositAddresses[asset]) === 'undefined') {
							depositPending(asset);
						}
					}
				}
			}
		}
	);
}

function depositPending(asset) {
	$("#"+asset+"Modal .deposit").attr(
		"data-deposit",
		"pending"
	).text("Waiting for address");
}

function getAssets(){
	for (var asset in assets) {
		if (assets.hasOwnProperty(asset)) {
			if(typeof(assets[asset].asset) !== 'undefined'){
				assets[asset] = assets[asset].asset;
			}

			sendRequest("getAsset", {
					"asset": assets[asset]
				}, function(response){
					assets[asset] = response;
				}
			);

			sendRequest("getAskOrders", {
					"asset": assets[asset].asset
				}, function(response){
					assets[asset].askOrders = response.askOrders;
				}
			);

			sendRequest("getBidOrders", {
					"asset": assets[asset].asset
				}, function(response){
					assets[asset].bidOrders = response.bidOrders;
				}
			);

			sendRequest("getTrades", {
					"asset": assets[asset].asset,
					"lastIndex": 49
				}, function(response){
					assets[asset].trades = response.trades
				}
			);
		}
	}

	processAssets();
}

function processAssets(){
	var total  = 0;
	var bids   = false;
	var asks   = false;
	var trades = false;
	for (var asset in assets) {
		if (assets.hasOwnProperty(asset)) {
			$("#"+asset+"Modal .orders_body").empty();
			total = 0;
			bids = false;
			if(typeof(assets[asset].bidOrders) !== 'undefined') {
				for (var i = 0; i < assets[asset].bidOrders.length; ++i){
					var price = convertToQNTf(assets[asset].bidOrders[i].priceNQT,8-assets[asset].decimals);
					var quantity = convertToQNTf(assets[asset].bidOrders[i].quantityQNT,assets[asset].decimals);
					var sum = calculate(quantity,price,'*');
					total = calculate(total,sum,'+');
					var string = '<tr id="orderRow'+
						assets[asset].bidOrders[i].order+'"><td class="bidprice" data-value="'+price+'" data-asset="'+asset+'">'+
						format(price)+'</td><td class="bidqnt" data-value="'+quantity+'" data-asset="'+asset+'">'+
						format(quantity)+'</td><td>'+
						format(sum)+"</td><td>"+
						format(total)+"</td><td>";
					if(assets[asset].bidOrders[i].account == account) {
						string = string+'<a href="#" title="cancel" class="btn btn-danger" id="cancelOrder'+
						assets[asset].bidOrders[i].order+'" data-order="'+
						assets[asset].bidOrders[i].order+'">X</a>';
					}
					string = string+"</td></tr>";

					$("#"+asset+"Modal .bids .orders_body").append(string);
					$("#cancelOrder"+assets[asset].bidOrders[i].order).click(function(e){
							e.preventDefault();
							if(confirm('Delete bid order for a fee of 1 HZ?')) {
								cancelOrder($(this).attr('data-order'),'Bid');
							}
						});

					if(!bids){
						bids = true;
					}
				}
			}
			if(bids){
				$("#"+asset+"Modal .no_bids").hide();
				$("#"+asset+"Modal .bids").show();
			} else {
				$("#"+asset+"Modal .no_bids").show();
				$("#"+asset+"Modal .bids").hide();
			}

			total = 0;
			asks = false;
			if(typeof(assets[asset].askOrders) !== 'undefined') {
				for (var i = 0; i < assets[asset].askOrders.length; ++i){
					var price = convertToQNTf(assets[asset].askOrders[i].priceNQT,8-assets[asset].decimals);
					var quantity = convertToQNTf(assets[asset].askOrders[i].quantityQNT,assets[asset].decimals);
					var sum = calculate(quantity,price,'*');
					total = calculate(total,sum,'+');
					var string = '<tr id="orderRow'+
						assets[asset].askOrders[i].order+'"><td class="askprice" data-value="'+price+'" data-asset="'+asset+'">'+
						format(price)+'</td><td class="askqnt" data-value="'+quantity+'" data-asset="'+asset+'">'+
						format(quantity)+'</td><td>'+
						format(sum)+"</td><td>"+
						format(total)+"</td><td>";
					if(assets[asset].askOrders[i].account == account) {
						string = string+'<a href="#" title="cancel" class="btn btn-danger" id="cancelOrder'+
						assets[asset].askOrders[i].order+'" data-order="'+
						assets[asset].askOrders[i].order+'">X</a>';
					}
					string = string+"</td></tr>";

					$("#"+asset+"Modal .asks .orders_body").append(string);
					$("#cancelOrder"+assets[asset].askOrders[i].order).click(function(e){
						e.preventDefault();
						if(confirm('Delete ask order for a fee of 1 HZ?')) {
							cancelOrder($(this).attr('data-order'),'Ask');
						}
					});

					if(!asks){
						asks = true;
					}
				}
			}

			if(asks){
				$("#"+asset+"Modal .no_asks").hide();
				$("#"+asset+"Modal .asks").show();
			} else {
				$("#"+asset+"Modal .no_asks").show();
				$("#"+asset+"Modal .asks").hide();
			}

			trades = false;
			if(typeof(assets[asset].trades) !== 'undefined') {
				for (var i = 0; i < assets[asset].trades.length; ++i){
					var price = convertToQNTf(assets[asset].trades[i].priceNQT,8-assets[asset].decimals);
					var quantity = convertToQNTf(assets[asset].trades[i].quantityQNT,assets[asset].decimals);
					var sum = calculate(quantity,price,'*');
					var string = '<tr><td>'+
						formatTimestamp(assets[asset].trades[i].timestamp)+'</td><td>'+
						format(price)+'</td><td>'+
						format(quantity)+'</td><td>'+
						format(sum)+"</td></tr>";
					$("#"+asset+"Modal .trades .orders_body").append(string);
					if(!trades){
						trades = true;
					}
				}
			}

			if(trades){
				$("#"+asset+"Modal .no_trades").hide();
				$("#"+asset+"Modal .trades").show();
			} else {
				$("#"+asset+"Modal .no_trades").show();
				$("#"+asset+"Modal .trades").hide();
			}
		}
	}
}

function cancelOrder(order,type) {
	console.log(type);
	sendRequest("cancel"+type+"Order", {
			"order": order,
			"publicKey": pubkey,
			"deadline": 60,
			"feeNQT": 100000000
		}, function(response){
			console.log(response);
			var signature = signBytes(response.unsignedTransactionBytes, converters.stringToHexString(password));
			var result    = verifyAndSignTransactionBytes(response.unsignedTransactionBytes,signature,"cancel"+type+"Order",response.transactionJSON);
			var send = sendRequest("broadcastTransaction", {
				"transactionBytes": result
			}, function(response){
				$("#orderRow"+order).remove();
			});
		}
	);
}

function requestDepositAddress(asset) {
	var transaction = sendRequest("sendMessage", {
			"recipient": assets[asset].accountRS,
			"publicKey": pubkey,
			"feeNQT":    100000000,
			"deadline":  60
		}, function(response){
			var signature = signBytes(response.unsignedTransactionBytes, converters.stringToHexString(password));
			var result    = verifyAndSignTransactionBytes(response.unsignedTransactionBytes,signature,"sendMessage",response.transactionJSON);
			var send = sendRequest("broadcastTransaction", {
				"transactionBytes": result
			}, function(response){
				depositPending(asset);
			});
		}
	);
}

function calculateTotal(type,asset) {
	var amount = $("#"+type+"amount"+asset).val();
	var price  = $("#"+type+"price"+asset).val();
	var total  = 0;
	if(amount > 0 && price > 0) {
		total = amount*price;
		background = '';
		if(total > balance){
			background = 'red';
		}
		$("#"+type+"total"+asset).val(total).css("background-color",background);
	}

    return total;
}

function submitOrder(asset,type) {
	var amount = $("#"+type+"amount"+asset).val();
	var price  = $("#"+type+"price"+asset).val();
	var total  = amount * price;
	if(type == 'buy') {
		ordertype = 'Bid';
	} else if(type == 'sell') {
		ordertype = 'Ask';
	}
	sendRequest("place"+ordertype+"Order", {
		"asset":       assets[asset].asset,
		"priceNQT":    convertToQNT(price,8-assets[asset].decimals),
		"quantityQNT": convertToQNT(amount,assets[asset].decimals),
		"publicKey":   pubkey,
		"feeNQT":      100000000,
		"deadline":    60
	}, function(response) {
		var signature = signBytes(response.unsignedTransactionBytes, converters.stringToHexString(password));
		var result    = verifyAndSignTransactionBytes(response.unsignedTransactionBytes,signature,"place"+ordertype+"Order",response.transactionJSON);
		var send = sendRequest("broadcastTransaction", {
			"transactionBytes": result
		}, function(res){
			if(typeof(res.errorDescription) === 'undefined') {
				alert("Order placed, give it some time to show up on the blockchain.");
			} else {
				alert('Error: '+res.errorDescription);
			}
		});
	});
}

function withdraw(asset,amount,address) {
	sendRequest("transferAsset", {
		"asset":       assets[asset].asset,
		"recipient":   assets[asset].account,
		"quantityQNT": convertToQNT(amount,assets[asset].decimals),
		"publicKey":   pubkey,
		"feeNQT":      100000000,
		"deadline":    60,
		"message":     address
	}, function(response) {
		var signature = signBytes(response.unsignedTransactionBytes, converters.stringToHexString(password));
		var result    = verifyAndSignTransactionBytes(response.unsignedTransactionBytes,signature,"transferAsset",response.transactionJSON);
		var send = sendRequest("broadcastTransaction", {
			"transactionBytes": result
		}, function(res){
			if(typeof(res.errorDescription) === 'undefined') {
				alert("Your withdrawal will be processed soon.");
				updateAccount();
				$("#"+asset+"Withdraw").hide();
			} else {
				alert('Error: '+res.errorDescription);
			}
		});
	});
}

function formatTimestamp(timestamp, date_only) {
		if (typeof timestamp == "object") {
			var date = timestamp;
		} else {
		var date = new Date(Date.UTC(2014, 02, 22, 22, 22, 22, 0) + timestamp * 1000);
		}

		if (!isNaN(date) && typeof(date.getFullYear) == 'function') {
			var d = date.getDate();
			var dd = d < 10 ? '0' + d : d;
			var M = date.getMonth() + 1;
			var MM = M < 10 ? '0' + M : M;
			var yyyy = date.getFullYear();
			var yy = new String(yyyy).substring(2);

			var format = 'M/d/yyyy';

			var res = format
				.replace(/dd/g, dd)
				.replace(/d/g, d)
				.replace(/MM/g, MM)
				.replace(/M/g, M)
				.replace(/yyyy/g, yyyy)
				.replace(/yy/g, yy);

			if (!date_only) {
				var hours = date.getHours();
				var originalHours = hours;
				var minutes = date.getMinutes();
				var seconds = date.getSeconds();

				if (hours < 10) {
					hours = "0" + hours;
				}
				if (minutes < 10) {
					minutes = "0" + minutes;
				}
				if (seconds < 10) {
					seconds = "0" + seconds;
				}
				res += " " + hours + ":" + minutes + ":" + seconds;
			}

			return res;
		} else {
			return date.toLocaleString();
		}
	}

$(document).ready(function() {
	$(".orders_body").on('click', '.askprice', function(e){
		e.preventDefault();
		var value = $(this).attr("data-value");
		var asset = $(this).attr("data-asset");
		$("#buyprice"+asset).val(value);
		calculateTotal('buy',asset);
	});
	$(".orders_body").on('click', '.askqnt', function(e){
		e.preventDefault();
		var value = $(this).attr("data-value");
		var asset = $(this).attr("data-asset");
		$("#buyamount"+asset).val(value);
		calculateTotal('buy',asset);
	});
	$(".orders_body").on('click', '.bidprice', function(e){
		e.preventDefault();
		var value = $(this).attr("data-value");
		var asset = $(this).attr("data-asset");
		$("#sellprice"+asset).val(value);
		calculateTotal('sell',asset);
	});
	$(".orders_body").on('click', '.bidqnt', function(e){
		e.preventDefault();
		var value = $(this).attr("data-value");
		var asset = $(this).attr("data-asset");
		$("#sellamount"+asset).val(value);
		calculateTotal('sell',asset);
	});
	$(".buyprice, .buyamount").change(function(e){
		var asset = $(this).attr("data-asset");
		calculateTotal('buy',asset);
	});
	$(".sellprice, .sellamount").change(function(e){
		var asset = $(this).attr("data-asset");
		calculateTotal('sell',asset);
	});
	$(".order_button").click(function(e){
		e.preventDefault();
		var type   = $(this).attr("data-type");
		var asset  = $(this).attr("data-asset");
		$(this).hide();
		$("#"+type+asset+"_loading").show();
		var amount = $("#"+type+"amount"+asset).val();
		var total  = calculateTotal(type,asset);
		if(total > 0) {
			if((type == 'buy' && total + 1 <= balance) || (type == 'sell' && amount <= assets[asset].balance && balance >= 1)) {
				submitOrder(asset,type);
				updateAccount();
			} else {
				alert('Not enough funds.');
			}
		}
		$("#"+type+asset+"_loading").hide();
		$(this).show();
	});

	$("#login_button").click(function(e){
		e.preventDefault();
		$("#loggedin_content").hide();
		$("#login_loading").show();
		password = $("#passphrase_field").val();
		pubkey   = generatePublicKey(password);
		account  = getAccountId(password);
		updateAccount();
		$("#loggedin_content").show();	
		$("#login_loading").hide();
	});

	$(".logout").click(function(e){
		e.preventDefault();
		$("#loggedin_content").hide();
		$("#login_loading").show();
		location.reload();
	});

	$(".deposit").click(function(e){
		e.preventDefault();
		$(this).hide();
		$(".deposit_loading").show();
		var addr = $(this).attr("data-deposit");
		if(addr == "false") {
			if(balance >= 1) {
				if(confirm('You do not have a deposit address for '+$(this).attr("data-asset")+' yet. Request one (costs 1 HZ)?')){
					requestDepositAddress($(this).attr("data-asset"));
				}
			} else {
				alert("You cannot request a deposit address because you don't have any HZ. Visit the faucet at https://faucet.horizonplatform.io and try again");
			}
		} else if (addr == "pending") {
			alert('Deposit address for '+$(this).attr("data-asset")+' requested, please check back in a couple of minutes');
		} else {
			alert('Your deposit address for '+$(this).attr("data-asset")+' is '+addr);
		}
		$(this).show();
		$(".deposit_loading").hide();
	});

	$(".withdrawal").click(function(e){
		e.preventDefault();
		var asset = $(this).attr("data-asset");
		$(this).hide();
		$("#"+asset+"Withdraw").toggle();
	});
	$(".withdrawcancelbutton").click(function(e){
		e.preventDefault();
		var asset = $(this).attr("data-asset");
		$("#"+asset+"Modal .withdrawal").show();
		$("#"+asset+"Withdraw").hide();
	});
	$(".withdrawmax").click(function(e){
		e.preventDefault();
		var asset = $(this).attr("data-asset");
		$("#"+asset+"withdrawamount").val(assets[asset].balance);
	});
	$(".withdrawbutton").click(function(e){
		e.preventDefault();
		$(this).hide();
		var asset   = $(this).attr("data-asset");
		$("#"+asset+"withdraw_loading").show();
		var address = $("#"+asset+"withdrawaddress").val();
		if(confirm("Please verify the withdrawal address: "+address)) {
			withdraw(asset,$("#"+asset+"withdrawamount").val(),address);
		}
		$("#"+asset+"withdraw_loading").hide();
		$(this).show();
	});

	$("#server").val(server);
	$("#server").change(function(){
		server = $("#server").val();
	});
});