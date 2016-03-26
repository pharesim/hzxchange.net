function sendRequest(requestType, data, callback, async) {
	if (requestType == undefined) {
		return;
	}

	if ($.isFunction(data)) {
		async = callback;
		callback = data;
		data = {};
	} else {
		data = data || {};
	}

	$.each(data, function(key, val) {
		if (key != "secretPhrase") {
			if (typeof val == "string") {
				data[key] = $.trim(val);
			}
		}
	});

	//convert NHZ to NQT...
	try {
		var nhzFields = ["feeNHZ", "amountNHZ", "priceNHZ", "refundNHZ", "discountNHZ"];

		for (var i = 0; i < nhzFields.length; i++) {
			var nhzField = nhzFields[i];
			var field = nhzField.replace("NHZ", "");

			if (nhzField in data) {
				data[field + "NQT"] = convertToNQT(data[nhzField]);
				delete data[nhzField];
			}
		}
	} catch (err) {
		if (callback) {
			callback({
				"errorCode": 1,
				"errorDescription": err + " (Field: " + field + ")"
			});
		}

		return;
	}

	if (!data.recipientPublicKey) {
		delete data.recipientPublicKey;
	}
	if (!data.referencedTransactionFullHash) {
		delete data.referencedTransactionFullHash;
	}

	//gets account id from passphrase client side, used only for login.
	if (requestType == "getAccountId") {
		var accountId = getAccountId(data.secretPhrase);

		var nhzAddress = new NhzAddress();

		if (nhzAddress.set(accountId)) {
			var accountRS = nhzAddress.toString();
		} else {
			var accountRS = "";
		}

		if (callback) {
			callback({
				"account": accountId,
				"accountRS": accountRS
			});
		}
		return;
	}

	processAjaxRequest(requestType, data, callback, async);
}

function processAjaxRequest(requestType, data, callback, async) {
	if (data["_extra"]) {
		var extra = data["_extra"];
		delete data["_extra"];
	} else {
		var extra = null;
	}

	var type = "POST";
	var url = server + "/nhz?requestType=" + requestType;
	var secretPhrase = "";

	// publicKey    = generatePublicKey(secretPhrase);

	$.support.cors = true;

	var ajaxCall = $.ajax;

	// if (data.querystring) {
	// 	type = "POST";
	// }

	ajaxCall({
		url: url,
		crossDomain: true,
		dataType: "json",
		type: type,
		timeout: 30000,
		async: false,
		shouldRetry: undefined,
		data: data
	}).done(function(response, status, xhr) {
		if (typeof data == "object" && "recipient" in data) {
			if (/^NHZ\-/i.test(data.recipient)) {
				data.recipientRS = data.recipient;

				var address = new NhzAddress();

				if (address.set(data.recipient)) {
					data.recipient = address.account_id();
				}
			} else {
				var address = new NhzAddress();

				if (address.set(data.recipient)) {
					data.recipientRS = address.toString();
				}
			}
		}
		if (secretPhrase && response.unsignedTransactionBytes && !response.errorCode && !response.error) {
			var publicKey = generatePublicKey(secretPhrase);
			var signature = signBytes(response.unsignedTransactionBytes, converters.stringToHexString(secretPhrase));

			var payload = verifyAndSignTransactionBytes(response.unsignedTransactionBytes, signature, requestType, data);

			if (!payload) {
				if (callback) {
					callback({
						"errorCode": 1,
						"errorDescription": "error_signature_verification_server"
					}, data);
				} else {
					$.growl("error_signature_verification_server", {
						"type": "danger"
					});
				}
				return;
			} else {
				if (callback) {
					if (extra) {
						data["_extra"] = extra;
					}

					broadcastTransactionBytes(payload, callback, response, data);
				} else {
					broadcastTransactionBytes(payload, null, response, data);
				}
			}
		}

		if(callback) {
			callback(response);
		}
		$("#server").css('background-color','white');
	}).fail(function(xhr, textStatus, error) {
		$("#server").css('background-color','red');
	});
}