<?php
include './includes/config.php';
include 'data.php';
?>

<!DOCTYPE html>
<!--[if IE 8]><html class="ie8" lang="en"><![endif]-->
<!--[if IE 9]><html class="ie9" lang="en"><![endif]-->
<!--[if !IE]><!-->
<html lang="en">
	<!--<![endif]-->
	<head>
		<script type="text/javascript">
			var assets = {}
		</script>
	</head>

	<body>
		<div id="app">
			<div class="app-content">

				<div id="navbar"></div>

				<div class="wrap-content" id="container" style="margin:30px;">
					<div class="container-fluid container-fullw bg-white">
						<div class="row">
							<div class="col-md-9" style="margin-bottom:30px; padding-left:30px; padding-right:30px;">
								<?php
								include './include/prices.php';
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
		<script type="text/javascript" src="/js/loadpage.js"></script>
		<script type="text/javascript" src="/js/cookie.js"></script>
		<script type="text/javascript" src="/js/hz_sign/libs/jsbn.js"></script> 
		<script type="text/javascript" src="/js/hz_sign/libs/jsbn2.js"></script> 
		<script type="text/javascript" src="/js/nhzaddress.js"></script> 
		<script type="text/javascript" src="/js/hz_sign/libs/converters.js"></script> 
		<script type="text/javascript" src="/js/hz_sign/libs/jssha256.js"></script> 
		<script type="text/javascript" src="/js/hz_sign/libs/curve25519.js"></script> 
		<script type="text/javascript" src="/js/hz_sign/libs/curve25519_.js"></script> 
		<script type="text/javascript" src="/js/hz_sign/libs/cryptojs/aes.js"></script> 
		<script type="text/javascript" src="/js/hz_sign/libs/cryptojs/sha256.js"></script> 
		<script type="text/javascript" src="/js/hz_sign/sign.js"></script> 
		<script type="text/javascript" src="/js/lib.js"></script> 
		<script type="text/javascript" src="/js/select2.min.js"></script> 
		<script type="text/javascript" src="/DataTables/jquery.dataTables.min.js"></script> 
		<script type="text/javascript" src="/js/table-data.js"></script> 
		<script type="text/javascript" src="/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="/js/modernizr.js"></script>
		<script type="text/javascript" src="/js/perfect-scrollbar.min.js"></script>
		<script type="text/javascript" src="/js/switchery.min.js"></script>
		<script type="text/javascript" src="/js/classie.js"></script> 
		<script type="text/javascript" src="/js/selectFx.js"></script>
		<script type="text/javascript" src="/js/main.js"></script> 
		<script type="text/javascript" src="/js/trading.js"></script>

		<script>
			jQuery(document).ready(function() {
				TableData.init();
				Main.init();
			});
		</script>
		<script type="text/javascript">
			hzprice = <?=$getInfo->hzprice?>;
		</script>
	</body>
</html>