<div class="modal fade" id="<?=$result['name']?>Modal" tabindex="-1" role="dialog" aria-labelledby="<?=$result['name']?>Modal" aria-hidden="true">
	<div class="modal-dialog  modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<h1 class="modal-header" style="display: inline; font-weight:bold;">
					<?=$result['name']?>
					(
					<?=$id?>
					)
				</h1>
				<?php if($deposit): ?>
					<a href="#" class="btn btn-wide btn-primary h5style deposit identified" data-asset="<?=$result['name']?>" data-deposit="false">
						Get deposit address
					</a>
					<img src="/img/busy.gif" class="loading_hidden deposit_loading" />
				<?php endif; ?>
				<?php if($withdraw): ?>
					<a href="#" class="btn btn-wide btn-primary h5style withdrawal" data-asset="<?=$result['name']?>">
						Withdraw
					</a>
				<?php endif; ?>
			</div>
			<div class="modal-body">
				<div class="container-fluid well">
					<?php include './include/warning.php' ?>
					<div class="row">
						<div class="col-md-12">
							<fieldset class="loading_hidden" id="<?=$result['name']?>Withdraw">
								<legend>Withdraw</legend>
								Your balance: <span class="asset_balance"></span>
								<?=$result['name']?>
								<form role="form">
									<div class="form-group">
										<label for="<?=$result['name']?>withdrawamount">
											Amount
										</label>
										<div class="input-group">
											<input id="<?=$result['name']?>withdrawamount" type="text" class="form-control" />
											<span class="input-group-addon withdrawmax" data-asset="<?=$result['name']?>">
												MAX
											</span>
										</div>
									</div>
									<div class="form-group">
										<label for="<?=$result['name']?>withdrawaddress">
											Address
										</label>
										<input id="<?=$result['name']?>withdrawaddress" type="text" class="form-control" />
									</div>
									<input type="submit" value="Cancel" class="btn btn-default withdrawcancelbutton" data-asset="<?=$result['name']?>" />
									<input type="submit" value="Withdraw" class="btn btn-default withdrawbutton" data-asset="<?=$result['name']?>" />
									<img src="/img/busy.gif" class="loading_hidden" id="<?=$result['name']?>withdraw_loading" />
								</form>
							</fieldset>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<?php include './include/buy.php' ?>
						</div>
						<div class="col-md-6">
							<?php include './include/sell.php' ?>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<?php include './include/asks.php' ?>
						</div>
						<div class="col-md-6">
							<?php include './include/bids.php' ?>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<?php include './include/trades.php' ?>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">
					Close
				</button>
			</div>
		</div>
	</div>
</div>