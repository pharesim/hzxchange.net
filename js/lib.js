function convertToNQT(currency) {
	currency = String(currency);

	var parts = currency.split(".");

	var amount = parts[0];

	//no fractional part
	if (parts.length == 1) {
		var fraction = "00000000";
	} else if (parts.length == 2) {
		if (parts[1].length <= 8) {
			var fraction = parts[1];
		} else {
			var fraction = parts[1].substring(0, 8);
		}
	} else {
		throw "Invalid input";
	}

	for (var i = fraction.length; i < 8; i++) {
		fraction += "0";
	}

	var result = amount + "" + fraction;

	//in case there's a comma or something else in there.. at this point there should only be numbers
	if (!/^\d+$/.test(result)) {
		throw "Invalid input.";
	}

	//remove leading zeroes
	result = result.replace(/^0+/, "");

	if (result === "") {
		result = "0";
	}

	return result;
}

convertToNHZ = function(amount, returnAsObject) {
	var negative = "";
	var afterComma = "";

	if (typeof amount != "object") {
		amount = new BigInteger(String(amount));
	}

	var fractionalPart = amount.mod(new BigInteger("100000000")).toString(); //.replace(/0+$/, ""); //todo: check if equal to zero first

	amount = amount.divide(new BigInteger("100000000"));

	if (amount.compareTo(BigInteger.ZERO) < 0) {
		amount = amount.abs();
		negative = "-";
	}

	if (fractionalPart && fractionalPart != "0") {
		afterComma = ".";

		for (var i = fractionalPart.length; i < 8; i++) {
			afterComma += "0";
		}

		afterComma += fractionalPart.replace(/0+$/, "");
	}

	amount = amount.toString();

	if (returnAsObject) {
		return {
			"negative": negative,
			"amount": amount,
			"afterComma": afterComma
		};
	} else {
		return negative + amount + afterComma;
	}
}

function getAccountId(secretPhrase) {
	return getAccountIdFromPublicKey(getPublicKey(converters.stringToHexString(secretPhrase)));
}

function getAccountIdFromPublicKey(publicKey, RSFormat) {
	var hex = converters.hexStringToByteArray(publicKey);

	_hash.init();
	_hash.update(hex);

	var account = _hash.getBytes();

	account = converters.byteArrayToHexString(account);

	var slice = (converters.hexStringToByteArray(account)).slice(0, 8);

	var accountId = converters.byteArrayToBigInteger(slice,0).toString();

	if (RSFormat) {
		var address = new NhzAddress();

		if (address.set(accountId)) {
			return address.toString();
		} else {
			return "";
		}
	} else {
		return accountId;
	}
}

function generatePublicKey(secretPhrase) {
	return getPublicKey(converters.stringToHexString(secretPhrase));
}

function getPublicKey(secretPhrase, isAccountNumber) {
	var secretPhraseBytes = converters.hexStringToByteArray(secretPhrase);
	var digest = simpleHash(secretPhraseBytes);
	return converters.byteArrayToHexString(curve25519.keygen(digest).p);
}

function calculateOrderTotalNQT(quantityQNT, priceNQT) {
	if (typeof quantityQNT != "object") {
		quantityQNT = new BigInteger(String(quantityQNT));
	}

	if (typeof priceNQT != "object") {
		priceNQT = new BigInteger(String(priceNQT));
	}

	var orderTotal = quantityQNT.multiply(priceNQT);

	return orderTotal.toString();
}

function convertToQNTf(quantity, decimals) {
	quantity = String(quantity);

	if (quantity.length < decimals) {
		for (var i = quantity.length; i < decimals; i++) {
			quantity = "0" + quantity;
		}
	}

	var afterComma = "";

	if (decimals) {
		afterComma = "." + quantity.substring(quantity.length - decimals);
		quantity = quantity.substring(0, quantity.length - decimals);

		if (!quantity) {
			quantity = "0";
		}

		afterComma = afterComma.replace(/0+$/, "");

		if (afterComma == ".") {
			afterComma = "";
		}
	}

	return quantity + afterComma;
}

function convertToQNT(quantity, decimals) {
	quantity = String(quantity);

	var parts = quantity.split(".");

	var qnt = parts[0];

	//no fractional part
	if (parts.length == 1) {
		if (decimals) {
			for (var i = 0; i < decimals; i++) {
				qnt += "0";
			}
		}
	} else if (parts.length == 2) {
		var fraction = parts[1];
		if (fraction.length > decimals) {
			throw "error_fraction_decimals";
		} else if (fraction.length < decimals) {
			for (var i = fraction.length; i < decimals; i++) {
				fraction += "0";
			}
		}
		qnt += fraction;
	} else {
		throw "error_invalid_input";
	}

	//in case there's a comma or something else in there.. at this point there should only be numbers
	if (!/^\d+$/.test(qnt)) {
		throw "error_invalid_input_numbers";
	}

	//remove leading zeroes
	return qnt.replace(/^0+/, "");
}

function format(params) {
	if (typeof params != "object") {
		var amount = String(params).split(".");
		var negative = amount[0].charAt(0) == "-" ? "-" : "";
		if (negative) {
			amount[0] = amount[0].substring(1);
		}
		params = {
			"amount": amount[0],
			"negative": negative,
			"afterComma": amount[1]
		};
	}

	var amount = String(params.amount);

	var digits = amount.split("").reverse();
	var formattedAmount = "";

	for (var i = 0; i < digits.length; i++) {
		if (i > 0 && i % 3 == 0) {
			formattedAmount = "'" + formattedAmount;
		}
		formattedAmount = digits[i] + formattedAmount;
	}

	var output = (params.negative ? params.negative : "") + formattedAmount;

	if(params.afterComma != '0' && typeof(params.afterComma) !== 'undefined') {
		output = output + '.' + params.afterComma;
	}

	return output;
}