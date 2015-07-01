verifyAndSignTransactionBytes = function(transactionBytes, signature, requestType, data) {

	var transaction = {};

	var byteArray = converters.hexStringToByteArray(transactionBytes);

	transaction.type = byteArray[0];

	transaction.version = (byteArray[1] & 0xF0) >> 4;
	transaction.subtype = byteArray[1] & 0x0F;

	transaction.timestamp = String(converters.byteArrayToSignedInt32(byteArray, 2));
	transaction.deadline = String(converters.byteArrayToSignedShort(byteArray, 6));
	transaction.publicKey = converters.byteArrayToHexString(byteArray.slice(8, 40));
	transaction.recipient = String(converters.byteArrayToBigInteger(byteArray, 40));
	transaction.amountNQT = String(converters.byteArrayToBigInteger(byteArray, 48));
	transaction.feeNQT = String(converters.byteArrayToBigInteger(byteArray, 56));

	var refHash = byteArray.slice(64, 96);
	transaction.referencedTransactionFullHash = converters.byteArrayToHexString(refHash);
	if (transaction.referencedTransactionFullHash == "0000000000000000000000000000000000000000000000000000000000000000") {
		transaction.referencedTransactionFullHash = "";
	}
	//transaction.referencedTransactionId = converters.byteArrayToBigInteger([refHash[7], refHash[6], refHash[5], refHash[4], refHash[3], refHash[2], refHash[1], refHash[0]], 0);

	transaction.flags = 0;

	if (transaction.version > 0) {
		transaction.flags = converters.byteArrayToSignedInt32(byteArray, 160);
		transaction.ecBlockHeight = String(converters.byteArrayToSignedInt32(byteArray, 164));
		transaction.ecBlockId = String(converters.byteArrayToBigInteger(byteArray, 168));
	}

	if (!("amountNQT" in data)) {
		data.amountNQT = "0";
	}

	if (!("recipient" in data)) {
		data.recipient = "13675701959091502344"; //nhz mainnet
		data.recipientRS = "NHZ-8HAA-H88W-UVT5-DUGLV"; //nhz mainnet
	}

	if (transaction.amountNQT !== data.amountNQT || transaction.feeNQT !== data.feeNQT) {
		return false;
	}

	if ("referencedTransactionFullHash" in data) {
		if (transaction.referencedTransactionFullHash !== data.referencedTransactionFullHash) {
			return false;
		}
	} else if (transaction.referencedTransactionFullHash !== "") {
		return false;
	}

	if (transaction.version > 0) {
		//has empty attachment, so no attachmentVersion byte...
		if (requestType == "sendMoney" || requestType == "sendMessage") {
			var pos = 176;
		} else {
			var pos = 177;
		}
	} else {
		var pos = 160;
	}

	switch (requestType) {
		case "sendMoney":
			if (transaction.type !== 0 || transaction.subtype !== 0) {
				return false;
			}
			break;
		case "sendMessage":
			if (transaction.type !== 1 || transaction.subtype !== 0) {
				return false;
			}

			break;
		case "setAlias":
			if (transaction.type !== 1 || transaction.subtype !== 1) {
				return false;
			}

			var aliasLength = parseInt(byteArray[pos], 10);

			pos++;

			transaction.aliasName = converters.byteArrayToString(byteArray, pos, aliasLength);

			pos += aliasLength;

			var uriLength = converters.byteArrayToSignedShort(byteArray, pos);

			pos += 2;

			transaction.aliasURI = converters.byteArrayToString(byteArray, pos, uriLength);

			pos += uriLength;

			if (transaction.aliasName !== data.aliasName || transaction.aliasURI !== data.aliasURI) {
				return false;
			}
			break;
		case "createPoll":
			if (transaction.type !== 1 || transaction.subtype !== 2) {
				return false;
			}

			var nameLength = converters.byteArrayToSignedShort(byteArray, pos);

			pos += 2;

			transaction.name = converters.byteArrayToString(byteArray, pos, nameLength);

			pos += nameLength;

			var descriptionLength = converters.byteArrayToSignedShort(byteArray, pos);

			pos += 2;

			transaction.description = converters.byteArrayToString(byteArray, pos, descriptionLength);

			pos += descriptionLength;

			var nr_options = byteArray[pos];

			pos++;

			for (var i = 0; i < nr_options; i++) {
				var optionLength = converters.byteArrayToSignedShort(byteArray, pos);

				pos += 2;

				transaction["option" + i] = converters.byteArrayToString(byteArray, pos, optionLength);

				pos += optionLength;
			}

			transaction.minNumberOfOptions = String(byteArray[pos]);

			pos++;

			transaction.maxNumberOfOptions = String(byteArray[pos]);

			pos++;

			transaction.optionsAreBinary = String(byteArray[pos]);

			pos++;

			if (transaction.name !== data.name || transaction.description !== data.description || transaction.minNumberOfOptions !== data.minNumberOfOptions || transaction.maxNumberOfOptions !== data.maxNumberOfOptions || transaction.optionsAreBinary !== data.optionsAreBinary) {
				return false;
			}

			for (var i = 0; i < nr_options; i++) {
				if (transaction["option" + i] !== data["option" + i]) {
					return false;
				}
			}

			if (("option" + i) in data) {
				return false;
			}

			break;
		case "castVote":
			if (transaction.type !== 1 || transaction.subtype !== 3) {
				return false;
			}

			transaction.poll = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			var voteLength = byteArray[pos];

			pos++;

			transaction.votes = [];

			for (var i = 0; i < voteLength; i++) {
				transaction.votes.push(byteArray[pos]);

				pos++;
			}

			return false;

			break;
		case "hubAnnouncement":
			if (transaction.type !== 1 || transaction.subtype != 4) {
				return false;
			}

			var minFeePerByte = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			var numberOfUris = parseInt(byteArray[pos], 10);

			pos++;

			var uris = [];

			for (var i = 0; i < numberOfUris; i++) {
				var uriLength = parseInt(byteArray[pos], 10);

				pos++;

				uris[i] = converters.byteArrayToString(byteArray, pos, uriLength);

				pos += uriLength;
			}

			//do validation

			return false;

			break;
		case "setAccountInfo":
			if (transaction.type !== 1 || transaction.subtype != 5) {
				return false;
			}

			var nameLength = parseInt(byteArray[pos], 10);

			pos++;

			transaction.name = converters.byteArrayToString(byteArray, pos, nameLength);

			pos += nameLength;

			var descriptionLength = converters.byteArrayToSignedShort(byteArray, pos);

			pos += 2;

			transaction.description = converters.byteArrayToString(byteArray, pos, descriptionLength);

			pos += descriptionLength;

			if (transaction.name !== data.name || transaction.description !== data.description) {
				return false;
			}

			break;
		case "sellAlias":
			if (transaction.type !== 1 || transaction.subtype !== 6) {
				return false;
			}

			var aliasLength = parseInt(byteArray[pos], 10);

			pos++;

			transaction.alias = converters.byteArrayToString(byteArray, pos, aliasLength);

			pos += aliasLength;

			transaction.priceNQT = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			if (transaction.alias !== data.aliasName || transaction.priceNQT !== data.priceNQT) {
				return false;
			}

			break;
		case "buyAlias":
			if (transaction.type !== 1 && transaction.subtype !== 7) {
				return false;
			}

			var aliasLength = parseInt(byteArray[pos], 10);

			pos++;

			transaction.alias = converters.byteArrayToString(byteArray, pos, aliasLength);

			pos += aliasLength;

			if (transaction.alias !== data.aliasName) {
				return false;
			}

			break;
		case "issueAsset":
			if (transaction.type !== 2 || transaction.subtype !== 0) {
				return false;
			}

			var nameLength = byteArray[pos];

			pos++;

			transaction.name = converters.byteArrayToString(byteArray, pos, nameLength);

			pos += nameLength;

			var descriptionLength = converters.byteArrayToSignedShort(byteArray, pos);

			pos += 2;

			transaction.description = converters.byteArrayToString(byteArray, pos, descriptionLength);

			pos += descriptionLength;

			transaction.quantityQNT = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			transaction.decimals = String(byteArray[pos]);

			pos++;

			if (transaction.name !== data.name || transaction.description !== data.description || transaction.quantityQNT !== data.quantityQNT || transaction.decimals !== data.decimals) {
				return false;
			}

			break;
		case "transferAsset":
			if (transaction.type !== 2 || transaction.subtype !== 1) {
				return false;
			}

			transaction.asset = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			transaction.quantityQNT = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;
			break;
		case "placeAskOrder":
		case "placeBidOrder":
			if (transaction.type !== 2) {
				return false;
			} else if (requestType == "placeAskOrder" && transaction.subtype !== 2) {
				return false;
			} else if (requestType == "placeBidOrder" && transaction.subtype !== 3) {
				return false;
			}

			transaction.asset = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			transaction.quantityQNT = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			transaction.priceNQT = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			break;
		case "cancelAskOrder":
		case "cancelBidOrder":
			if (transaction.type !== 2) {
				return false;
			} else if (requestType == "cancelAskOrder" && transaction.subtype !== 4) {
				return false;
			} else if (requestType == "cancelBidOrder" && transaction.subtype !== 5) {
				return false;
			}

			transaction.order = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			break;
		case "dgsListing":
			if (transaction.type !== 3 && transaction.subtype != 0) {
				return false;
			}

			var nameLength = converters.byteArrayToSignedShort(byteArray, pos);

			pos += 2;

			transaction.name = converters.byteArrayToString(byteArray, pos, nameLength);

			pos += nameLength;

			var descriptionLength = converters.byteArrayToSignedShort(byteArray, pos);

			pos += 2;

			transaction.description = converters.byteArrayToString(byteArray, pos, descriptionLength);

			pos += descriptionLength;

			var tagsLength = converters.byteArrayToSignedShort(byteArray, pos);

			pos += 2;

			transaction.tags = converters.byteArrayToString(byteArray, pos, tagsLength);

			pos += tagsLength;

			transaction.quantity = String(converters.byteArrayToSignedInt32(byteArray, pos));

			pos += 4;

			transaction.priceNQT = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			if (transaction.name !== data.name || transaction.description !== data.description || transaction.tags !== data.tags || transaction.quantity !== data.quantity || transaction.priceNQT !== data.priceNQT) {
				return false;
			}

			break;
		case "dgsDelisting":
			if (transaction.type !== 3 && transaction.subtype !== 1) {
				return false;
			}

			transaction.goods = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			if (transaction.goods !== data.goods) {
				return false;
			}

			break;
		case "dgsPriceChange":
			if (transaction.type !== 3 && transaction.subtype !== 2) {
				return false;
			}

			transaction.goods = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			transaction.priceNQT = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			if (transaction.goods !== data.goods || transaction.priceNQT !== data.priceNQT) {
				return false;
			}

			break;
		case "dgsQuantityChange":
			if (transaction.type !== 3 && transaction.subtype !== 3) {
				return false;
			}

			transaction.goods = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			transaction.deltaQuantity = String(converters.byteArrayToSignedInt32(byteArray, pos));

			pos += 4;

			if (transaction.goods !== data.goods || transaction.deltaQuantity !== data.deltaQuantity) {
				return false;
			}

			break;
		case "dgsPurchase":
			if (transaction.type !== 3 && transaction.subtype !== 4) {
				return false;
			}

			transaction.goods = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			transaction.quantity = String(converters.byteArrayToSignedInt32(byteArray, pos));

			pos += 4;

			transaction.priceNQT = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			transaction.deliveryDeadlineTimestamp = String(converters.byteArrayToSignedInt32(byteArray, pos));

			pos += 4;

			if (transaction.goods !== data.goods || transaction.quantity !== data.quantity || transaction.priceNQT !== data.priceNQT || transaction.deliveryDeadlineTimestamp !== data.deliveryDeadlineTimestamp) {
				return false;
			}

			break;
		case "dgsDelivery":
			if (transaction.type !== 3 && transaction.subtype !== 5) {
				return false;
			}

			transaction.purchase = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			var encryptedGoodsLength = converters.byteArrayToSignedShort(byteArray, pos);

			var goodsLength = converters.byteArrayToSignedInt32(byteArray, pos);

			transaction.goodsIsText = goodsLength < 0; // ugly hack??

			if (goodsLength < 0) {
				goodsLength &= 2147483647;
			}

			pos += 4;

			transaction.goodsData = converters.byteArrayToHexString(byteArray.slice(pos, pos + encryptedGoodsLength));

			pos += encryptedGoodsLength;

			transaction.goodsNonce = converters.byteArrayToHexString(byteArray.slice(pos, pos + 32));

			pos += 32;

			transaction.discountNQT = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			var goodsIsText = (transaction.goodsIsText ? "true" : "false");

			if (goodsIsText != data.goodsIsText) {
				return false;
			}

			if (transaction.purchase !== data.purchase || transaction.goodsData !== data.goodsData || transaction.goodsNonce !== data.goodsNonce || transaction.discountNQT !== data.discountNQT) {
				return false;
			}

			break;
		case "dgsFeedback":
			if (transaction.type !== 3 && transaction.subtype !== 6) {
				return false;
			}

			transaction.purchase = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			if (transaction.purchase !== data.purchase) {
				return false;
			}

			break;
		case "dgsRefund":
			if (transaction.type !== 3 && transaction.subtype !== 7) {
				return false;
			}

			transaction.purchase = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			transaction.refundNQT = String(converters.byteArrayToBigInteger(byteArray, pos));

			pos += 8;

			if (transaction.purchase !== data.purchase || transaction.refundNQT !== data.refundNQT) {
				return false;
			}

			break;
		case "leaseBalance":
			if (transaction.type !== 4 && transaction.subtype !== 0) {
				return false;
			}

			transaction.period = String(converters.byteArrayToSignedShort(byteArray, pos));

			pos += 2;

			if (transaction.period !== data.period) {
				return false;
			}

			break;
		default:
			//invalid requestType..
			return false;
	}

	if (1) {
		var position = 1;


	position <<= 1;
	
	//encrypted note
	if ((transaction.flags & position) != 0) {
		var attachmentVersion = byteArray[pos];

		pos++;

		var encryptedMessageLength = converters.byteArrayToSignedInt32(byteArray, pos);

		transaction.messageToEncryptIsText = encryptedMessageLength < 0;

		if (encryptedMessageLength < 0) {
			encryptedMessageLength &= 2147483647;
		}

		pos += 4;

		transaction.encryptedMessageData = converters.byteArrayToHexString(byteArray.slice(pos, pos + encryptedMessageLength));

		pos += encryptedMessageLength;

		transaction.encryptedMessageNonce = converters.byteArrayToHexString(byteArray.slice(pos, pos + 32));

		pos += 32;

		var messageToEncryptIsText = (transaction.messageToEncryptIsText ? "true" : "false");

		if (messageToEncryptIsText != data.messageToEncryptIsText) {
			return false;
		}

		if (transaction.encryptedMessageData !== data.encryptedMessageData || transaction.encryptedMessageNonce !== data.encryptedMessageNonce) {
			return false;
		}
	} else if (data.encryptedMessageData) {
		return false;
	}

	position <<= 1;

	if ((transaction.flags & position) != 0) {
		var attachmentVersion = byteArray[pos];

		pos++;

		var recipientPublicKey = converters.byteArrayToHexString(byteArray.slice(pos, pos + 32));

		if (recipientPublicKey != data.recipientPublicKey) {
			return false;
		}
		pos += 32;
	} else if (data.recipientPublicKey) {
		return false;
	}

	position <<= 1;

	if ((transaction.flags & position) != 0) {
		var attachmentVersion = byteArray[pos];

		pos++;

		var encryptedToSelfMessageLength = converters.byteArrayToSignedInt32(byteArray, pos);

		transaction.messageToEncryptToSelfIsText = encryptedToSelfMessageLength < 0;

		if (encryptedToSelfMessageLength < 0) {
			encryptedToSelfMessageLength &= 2147483647;
		}

		pos += 4;

		transaction.encryptToSelfMessageData = converters.byteArrayToHexString(byteArray.slice(pos, pos + encryptedToSelfMessageLength));

		pos += encryptedToSelfMessageLength;

		transaction.encryptToSelfMessageNonce = converters.byteArrayToHexString(byteArray.slice(pos, pos + 32));

		pos += 32;

		var messageToEncryptToSelfIsText = (transaction.messageToEncryptToSelfIsText ? "true" : "false");

		if (messageToEncryptToSelfIsText != data.messageToEncryptToSelfIsText) {
			return false;
		}

			if (transaction.encryptToSelfMessageData !== data.encryptToSelfMessageData || transaction.encryptToSelfMessageNonce !== data.encryptToSelfMessageNonce) {
				return false;
			}
		} else if (data.encryptToSelfMessageData) {
			return false;
		}
	}

	return transactionBytes.substr(0, 192) + signature + transactionBytes.substr(320);
}

signBytes = function(message, secretPhrase) {
	var messageBytes = converters.hexStringToByteArray(message);
	var secretPhraseBytes = converters.hexStringToByteArray(secretPhrase);

	var digest = simpleHash(secretPhraseBytes);
	var s = curve25519.keygen(digest).s;

	var m = simpleHash(messageBytes);

	_hash.init();
	_hash.update(m);
	_hash.update(s);
	var x = _hash.getBytes();

	var y = curve25519.keygen(x).p;

	_hash.init();
	_hash.update(m);
	_hash.update(y);
	var h = _hash.getBytes();

	var v = curve25519.sign(h, x, s);

	return converters.byteArrayToHexString(v.concat(h));
}

var _hash = {
	init: SHA256_init,
	update: SHA256_write,
	getBytes: SHA256_finalize
};

simpleHash = function(message) {
	_hash.init();
	_hash.update(message);
	return _hash.getBytes();
}