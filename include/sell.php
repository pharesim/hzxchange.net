<fieldset class="identified">
	<legend>Sell</legend>
	<div class="no_sell">
		You do not have any
		<?=$result['name']?>
		to sell
	</div>
	<div class="sell">
		Your balance:
		<span class="asset_balance"></span>
		<?=$result['name']?>
		<form role="form">
			<div class="form-group">
				<label for="sellamount<?=$result['name']?>">Amount </label>
				<div class="input-group">
					<input id="sellamount<?=$result['name']?>" type="text" class="form-control sellamount" data-asset="<?=$result['name']?>" />
					<span class="input-group-addon"><?=$result['name']?></span>
				</div>
			</div>
			<div class="form-group">
				<label for="sellprice<?=$result['name']?>">Unit price </label>
				<div class="input-group">
					<input id="sellprice<?=$result['name']?>" type="text" class="form-control sellprice" data-asset="<?=$result['name']?>" />
					<span class="input-group-addon">HZ</span>
				</div>
			</div>
			<div class="form-group">
				<label for="selltotal<?=$result['name']?>">Total </label>
				<div class="input-group">
					<input id="selltotal<?=$result['name']?>" type="text" class="form-control selltotal" data-asset="<?=$result['name']?>" readonly/>
					<span class="input-group-addon">HZ</span>
				</div>
			</div>
			<input type="submit" class="btn btn-default order_button" data-asset="<?=$result['name']?>" data-type="sell" value="Sell" />
			<img src="/img/busy.gif" id="sell<?=$result['name']?>_loading" class="loading_hidden" />
		</form>
	</div>
</fieldset>