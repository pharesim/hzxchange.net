<fieldset>
	<legend>Trade history</legend>
	<div class="no_trades">
		There've been no trades for
		<?=$result['name']?>
		yet
	</div>
	<div class="table-responsive" style="overflow-y: auto; max-height: 250px;">
		<table class="table table-striped table-bordered table-hover table-full-width trades">
			<thead>
				<tr>
					<th>Time</th>
					<th>Price</th>
					<th><?=$result['name']?></th>
					<th>HZ</th>
				</tr>
			</thead>
			<tbody class="orders_body">
			</tbody>
		</table>
	</div>
</fieldset>