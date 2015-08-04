<fieldset class="identified">
	<legend>Buy</legend>
	<div class="no_buy">
		You do not have HZ to buy anything
	</div>
	<div class="buy">
		Your balance: <span class="hzbalance"></span> HZ
		<form role="form">
			<div class="form-group">
				<label for="buyamount<?=$result['name']?>">Amount </label>
				<div class="input-group">
					<input id="buyamount<?=$result['name']?>" type="text" class="form-control buyamount" data-asset="<?=$result['name']?>" />
					<span class="input-group-addon">
						<?=$result['name']?>
					</span>
				</div>
			</div>
			<div class="form-group">
				<label for="buyprice<?=$result['name']?>">Unit price </label>
				<div class="input-group">
					<input id="buyprice<?=$result['name']?>" type="text" class="form-control buyprice" data-asset="<?=$result['name']?>" />
					<span class="input-group-addon">HZ</span>
				</div>
			</div>
			<div class="form-group">
				<label for="buytotal<?=$result['name']?>">Total </label>
				<div class="input-group">
					<input id="buytotal<?=$result['name']?>" type="text" class="form-control buytotal" data-asset="<?=$result['name']?>" readonly />
					<span class="input-group-addon">HZ</span>
				</div>
			</div>
			<input type="submit" class="btn btn-default order_button" data-asset="<?=$result['name']?>" data-type="buy" value="Buy" />
			<img src="/img/busy.gif" id="buy<?=$result['name']?>_loading" class="loading_hidden" />
		</form>
	</div>
</fieldset>