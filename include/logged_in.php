<fieldset>
	<legend>
		<h2 class="h5style tabletext" style="margin-top:5px; font-size:0.8em;">
			<span id="accountrs"></span>
		</h2>
	</legend>
	<img src="/img/busy.gif" id="login_loading" class="loading_hidden" />
	<div id="loggedin_content">
		<div id="balance">
			<table width="100%" border="0">
				<tr>
					<td style="text-align:center;">
						<h2 class="h5style tabletext" style="margin-top:5px; font-size:0.9em;">
							Your current balance is <span class="hzbalance"></span> HZ
						</h2>
						<?php include './include/logout_button.php'; ?>
					</td>
				</tr>
			</table>
		</div>
		<div id="new_account">
			<table width="100%" border="0">
				<tr>
					<td style="text-align:center;">
						<h2 class="h5style tabletext" style="margin-top:5px; font-size:0.8em;">
							Please visit
							<a href="https://faucet.horizonplatform.io" target="_blank">
								HZ Faucet
							</a>
							to make your first transaction. Your public key is:
							<span id="pubkey"></span>
						</h2>
						<?php include './include/logout_button.php'; ?>
					</td>
				</tr>
			</table>
		</div>
	</div>
</fieldset>