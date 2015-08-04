<h1 class="mainTitle" style="font-weight:bold; margin-bottom:10px; margin-top:0px; text-align:center;">
	SAFE, DECENTRALIZED CRYPTO TRADING
</h1>

<div class="showCurrency inHZ">
	<h2 style="font-size:1.2em; font-weight:bold; text-align:center;">
		PRICES CURRENTLY SHOWN IN HZ
	</h2>
</div>
<div class="showCurrency inBTC">
	<h2 style="font-size:1.2em; font-weight:bold; text-align:center;">
		PRICES CURRENTLY SHOWN IN BTC
	</h2>
</div>
<div>
	<h2 style="font-size:1em; font-weight:bold; text-align:center; margin-bottom:20px;">
		SHOW PRICES IN <a href="#" id="showHZ">HZ</a> / <a href="#" id="showBTC">BTC</a>
	</h2>
</div>

<div class="tabbable">
	<ul id="myTab2" class="nav nav-tabs nav-justified">
		<li class="active">
			<a href="#myTab2_example1" data-toggle="tab">
				<h2 style="font-size:1.2em; font-weight:bold;padding-top:10px;">
					CRYPTOCURRENCIES
				</h2>
			</a>
		</li>
		<li>
			<a href="#myTab2_example2" data-toggle="tab">
				<h2 style="font-size:1.2em; font-weight:bold; padding-top:10px;">
					TRUSTED ASSETS
				</h2>
			</a>
		</li>
	</ul>

	<div class="tab-content">
		<div class="tab-pane fade in active" id="myTab2_example1">
			<div class="table-responsive">
				<table class="table table-striped table-bordered table-hover table-full-width" id="sample_1">
					<thead>
						<tr>
							<th class="thstyle">
								<h2 class="h5style" style="font-weight:bold;">
									NAME
								</h2>
							</th>
							<th class="thstyle">
								<h2 class="h5style" style="font-weight:bold;">
									LAST TRADE
								</h2>
							</th>
							<th class="thstyle">
								<h2 class="h5style" style="font-weight:bold;">
									BID
								</h2>
							</th>
							<th class="thstyle">
								<h2 class="h5style" style="font-weight:bold;">
									ASK
								</h2>
							</th>
							<th class="thstyle">
								<h2 class="h5style" style="font-weight:bold;">
									SPREAD
								</h5>
							</th>
							<th class="thstyle mobilehide">
								<h2 class="h5style" style="font-weight:bold;">
									HIGH
								</h2>
							</th>
							<th class="thstyle mobilehide">
								<h2 class="h5style" style="font-weight:bold;">
									LOW
								</h2>
							</th>
							<th class="thstyle mobilehide">
								<h2 class="h5style" style="font-weight:bold;">
									VOL.
								</h2>
							</th>
							<th class="thstyle">
								<h2 class="h5style" style="font-weight:bold;">
									CHANGE
								</h2>
							</th>
							<th class="no-sort"></th>
						</tr>
					</thead>
					<tbody>
					<?php foreach($results as $id=>$result): ?>
						<tr>
							<td title="<?=$id?>">
								<script type="text/javascript">
									assets.<?=$result['name']?> = "<?=$id?>";
								</script>
								<h2 class="h5style tabletext">
									<?=$result['name']?>
								</h2>
							</td>
							<td style="text-align:right;">
								<h2 class="h5style tabletext">
									<div class="showCurrency inHZ">
										<?=number_format($result['last'],strlen(substr(strrchr($result['last'], "."), 1)))?>
									</div>
									<div class="showCurrency inBTC">
										<?=$result['lastBTC']?>
									</div>
								</h2>
							</td>
							<td style="text-align:right;">
								<h2 class="h5style tabletext">
									<div class="showCurrency inHZ">
										<?=number_format($result['bid'],strlen(substr(strrchr($result['bid'], "."), 1)))?>
									</div>
									<div class="showCurrency inBTC">
										<?=$result['bidBTC']?>
									</div>
								</h2>
							</td>
							<td style="text-align:right;">
								<h2 class="h5style tabletext">
									<div class="showCurrency inHZ">
										<?=number_format($result['ask'],strlen(substr(strrchr($result['ask'], "."), 1)))?>
									</div>
									<div class="showCurrency inBTC">
										<?=$result['askBTC']?>
									</div>
								</h2>
							</td>
							<td style="text-align:right;">
								<h2 class="h5style tabletext">
									<?php
									$spread = ($result['ask']-$result['bid'])*100/$result['ask'];
									echo round($spread,2);
									?>
									%
								</h2>
							</td>
							<td class="mobilehide" style="text-align:right;">
								<h2 class="h5style tabletext">
									<div class="showCurrency inHZ">
										<?=number_format($result['high'],strlen(substr(strrchr($result['high'], "."), 1)))?>
									</div>
									<div class="showCurrency inBTC">
										<?=$result['highBTC']?>
									</div>
								</h2>
							</td>
							<td class="mobilehide" style="text-align:right;">
								<h2 class="h5style tabletext">
									<div class="showCurrency inHZ">
										<?=number_format($result['low'],strlen(substr(strrchr($result['low'], "."), 1)))?>
									</div>
									<div class="showCurrency inBTC">
										<?=$result['lowBTC']?>
									</div>
								</h2>
							</td>
							<td class="mobilehide" style="text-align:right;">
								<h2 class="h5style tabletext">
									<div class="showCurrency inHZ">
										<?=number_format($result['volume'],strlen(substr(strrchr($result['volume'], "."), 1)))?>
									</div>
									<div class="showCurrency inBTC">
										<?=$result['volumeBTC']?>
									</div>
								</h2>
							</td>
							<td style="text-align:right;">
								<h2 class="h5style tabletext">
									<?php
									$change = ($result['last']-$result['24hr'])*100/$result['24hr'];
									echo round($change,2);
									?>
									%
								</h2>
							</td>
							<td id="<?=$result['name']?>_actions" style="text-align:center;">
								<a href="#" class="btn btn-primary h5style details" data-toggle="modal" data-target="#<?=$result['name']?>Modal" style="font-weight:bold;">
									<i class="ti-stats-up"></i>
								</a>
							</td>
						</tr>
					<?php endforeach; ?>
					</tbody>
				</table>
			</div>
		</div>

		<div class="tab-pane fade" id="myTab2_example2">
			<div class="table-responsive">
				<table id="sample_2" class="table table-striped table-bordered table-hover table-full-width">
					<thead>
						<tr>
							<th>
								<h2 class="h5style" style="font-weight:bold;">
									NAME
								</h2>
							</th>
							<th>
								<h2 class="h5style" style="font-weight:bold;">
									LAST TRADE
								</h2>
							</th>
							<th class="thstyle">
								<h2 class="h5style" style="font-weight:bold;">
									BID
								</h2>
							</th>
							<th class="thstyle">
								<h2 class="h5style" style="font-weight:bold;">
									ASK
								</h2>
							</th>
							<th>
								<h2 class="h5style" style="font-weight:bold;">
									SPREAD
								</h2>
							</th>
							<th class="thstyle mobilehide">
								<h2 class="h5style" style="font-weight:bold;">
									HIGH
								</h2>
							</th>
							<th class="thstyle mobilehide">
								<h2 class="h5style" style="font-weight:bold;">
									LOW
								</h2>
							</th>
							<th class="mobilehide">
								<h2 class="h5style" style="font-weight:bold;">
									VOL.
								</h2>
							</th>
							<th class="thstyle">
								<h2 class="h5style" style="font-weight:bold;">
									CHANGE
								</h2>
							</th>
							<th class="no-sort"></th>
						</tr>
					</thead>
					<tbody>
					<?php foreach($trusted as $id=>$result): ?>
						<tr>
							<td title="<?=$id?>">
								<script type="text/javascript">
									assets.<?=$result['name']?> = "<?=$id?>";
								</script>
								<h2 class="h5style tabletext">
									<?=$result['name']?>
								</h2>
							</td>
							<td style="text-align:right;">
								<h2 class="h5style tabletext">
									<div class="showCurrency inHZ">
										<?=number_format($result['last'],strlen(substr(strrchr($result['last'], "."), 1)))?>
									</div>
									<div class="showCurrency inBTC">
										<?=$result['lastBTC']?>
									</div>
								</h2>
							</td>
							<td style="text-align:right;">
								<h2 class="h5style tabletext">
									<div class="showCurrency inHZ">
										<?=number_format($result['bid'],strlen(substr(strrchr($result['bid'], "."), 1)))?>
									</div>
									<div class="showCurrency inBTC">
										<?=$result['bidBTC']?>
									</div>
								</h2>
							</td>
							<td style="text-align:right;">
								<h2 class="h5style tabletext">
									<div class="showCurrency inHZ">
										<?=number_format($result['ask'],strlen(substr(strrchr($result['ask'], "."), 1)))?>
									</div>
									<div class="showCurrency inBTC">
										<?=$result['askBTC']?>
									</div>
								</h2>
							</td>
							<td style="text-align:right;">
								<h2 class="h5style tabletext">
									<?php
									$spread = ($result['ask']-$result['bid'])*100/$result['ask'];
									echo round($spread,2);
									?>
									%
								</h2>
							</td>
							<td class="mobilehide" style="text-align:right;">
								<h2 class="h5style tabletext">
									<div class="showCurrency inHZ">
										<?=number_format($result['high'],strlen(substr(strrchr($result['high'], "."), 1)))?>
									</div>
									<div class="showCurrency inBTC">
										<?=$result['highBTC']?>
									</div>
								</h2>
							</td>
							<td class="mobilehide" style="text-align:right;">
								<h2 class="h5style tabletext">
									<div class="showCurrency inHZ">
										<?=number_format($result['low'],strlen(substr(strrchr($result['low'], "."), 1)))?>
									</div>
									<div class="showCurrency inBTC">
										<?=$result['lowBTC']?>
									</div>
								</h2>
							</td>
							<td class="mobilehide" style="text-align:right;">
								<h2 class="h5style tabletext">
									<div class="showCurrency inHZ">
										<?=number_format($result['volume'],strlen(substr(strrchr($result['volume'], "."), 1)))?>
									</div>
									<div class="showCurrency inBTC">
										<?=$result['volumeBTC']?>
									</div>
								</h2>
							</td>
							<td style="text-align:right;">
								<h2 class="h5style tabletext">
									<?php
									$change = ($result['last']-$result['24hr'])*100/$result['24hr'];
									echo round($change,2);
									?>
									%
								</h2>
							</td>
							<td id="<?=$result['name']?>_actions" style="text-align:center;">
								<a href="#" class="btn btn-primary h5style details" data-toggle="modal" data-target="#<?=$result['name']?>Modal" style="font-weight:bold;">
									<i class="ti-stats-up"></i>
								</a>
							</td>
						</tr>
					<?php endforeach; ?>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

