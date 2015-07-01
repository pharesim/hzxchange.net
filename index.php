<!DOCTYPE html>
<!--[if IE 8]><html class="ie8" lang="en"><![endif]-->
<!--[if IE 9]><html class="ie9" lang="en"><![endif]-->
<!--[if !IE]><!-->
<html lang="en">
	<!--<![endif]-->
	<head>
		<script type="text/javascript">
			var coins = {
				'btc':'5695508852370099719',
			//	'bts':'15363696555198579003',
				'cann':'13629236810639777788',
				'dash':'2717092958638242662',
				'ltc':'15858837599855019744',
				'nxt':'7635404150699827277',
				'pot':'9846627725405192557'
			};

			var trusted = {
				'argenbits':'12862026363025360400',
				'hzsphere':'4033048123059509069',
				'hzxchange':'17828408937649813496',
			//	'fireandsmoke'=>'12746842454066497618',
				'altsheets':'8101260088962758269',
				'hzchronos':'14434264033002297623',
				'upstart':'8728095596643050008'
			};

			var assets = {}
		</script>
	</head>

	<body>
		<div class="loader-wrap">
			<div class="loader">
				<div class="box-1 box"></div>
				<div class="box-2 box"></div>
				<div class="box-3 box"></div>
				<div class="box-4 box"></div>
				<div class="box-5 box"></div>
			</div>
		</div>
		
		<div id="app">
			<div class="app-content">

				<div id="navbar"></div>

				<div class="wrap-content" id="container" style="margin:30px;">
					<div class="container-fluid container-fullw bg-white">
						<div class="row">
							<div class="col-md-9" style="margin-bottom:30px; padding-left:30px; padding-right:30px;">
								<div id="tradingcontainer"></div>
								<?php
								foreach($results as $id=>$result):
									$deposit  = true;
									$withdraw = true;
									include './include/trade.php';
								endforeach;
								foreach($trusted as $id=>$result):
									$deposit  = false;
									$withdraw = false;
									include './include/trade.php';
								endforeach;
								?>

								<a href="#" id="settings_link">Settings</a>
								<div id="settings" title="Set the Horizon server to use with this application. Use your local node for maximum performance.">
									<label for="server">Server: </label>
									<input type="text" id="server" />
								</div>

								<div id="infomodal"></div>
								<div id="faqmodal"></div>
							</div>
							<div class="col-md-3" style="margin-bottom:50px; padding-left:30px; padding-right:30px;" id="sidebarcontainer"></div>
						</div>
					</div>
				</div>
			</div>

			<footer>
				<div class="footer-inner dataTables_info" style="padding-top:0px;">
					&copy;
					<span class="current-year"></span>
					<span class="text-bold text-uppercase">HZxCHANGE</span>.
					<span>All rights reserved</span> 
					<div class="pull-right" style="margin-left:30px;">
						<span class="go-top"><i class="ti-angle-up"></i></span>
					</div>
				</div>
			</footer>
		</div>

		<script type="text/javascript" src="/js/jquery-2.1.4.min.js"></script> 
		<script type="text/javascript" src="/js/getinfo.js"></script>
		<script type="text/javascript" src="/js/loadpage.js"></script>
	</body>
</html>