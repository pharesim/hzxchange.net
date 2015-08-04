<fieldset>
	<legend>Bids</legend>
	<div class="no_bids">
		There are no bid orders for
		<?=$result['name']?>
		yet
	</div>
	<div class="table-responsive" style="overflow-y: auto; max-height: 250px;">
		<table class="table table-striped table-bordered table-hover table-full-width bids" border="1">
			<thead>
				<tr>
					<th>Price</th>
					<th><?=$result['name']?></th>
					<th>HZ</th>
					<th>Sum(HZ)</th>
					<th></th>
				</tr>
			</thead>
			<tbody class="orders_body">
			</tbody>
		</table>
	</div>
</fieldset>