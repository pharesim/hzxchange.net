<header class="navbar navbar-default navbar-static-top">
	<div class="container-fluid">
		<div class="navbar-header">
			<img src="assets/images/hzx_logo.png" alt="HZxCHANGE - Safe, decentralized crypto trading."/>
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navlogin" aria-expanded="false">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
		</div>
		<div class="navbar-collapse collapse" id="navlogin">
			<ul class="nav navbar-right" style="width:400px;">
				<li style="width:400px;">
					<div id="loginbox" class="unidentified">
						<?php include './include/loginbox.php' ?>
					</div>
					<div class="identified">
						<?php include './include/logged_in.php' ?>
					</div>
				</li>
			</ul>
		</div>
	</div>
</header>