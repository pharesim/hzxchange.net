<script type="text/javascript" src="/js/jquery-2.1.4.min.js"></script> 
<script type="text/javascript">
	$(".loading_hidden").hide();

	$(".showCurrency").hide();
	$(".inHZ").show();

	$("#showBTC").click(function(e){
		e.preventDefault();
		$(".showCurrency").hide();
		$(".inBTC").show();
	});

	$("#showHZ").click(function(e){
		e.preventDefault();
		$(".showCurrency").hide();
		$(".inHZ").show();
	});


	$(".identified").hide();

	$(".deposit").hide();
	$(".sell").hide();
	$(".buy").hide();
	$(".withdrawal").hide();

	$(".modal").hide();

	$("#settings").hide();
	$("#settings_link").click(function(e){
		e.preventDefault();
		$("#settings").toggle();
	});
</script>
<script src="/js/cookie.js"></script>
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
<script src="/js/select2.min.js"></script> 
<script src="/DataTables/jquery.dataTables.min.js"></script> 

<script src="/js/table-data.js"></script> 

<script src="/js/bootstrap.min.js"></script>
<script src="/js/modernizr.js"></script>
<script src="/js/perfect-scrollbar.min.js"></script>
<script src="/js/switchery.min.js"></script>
<script src="/js/classie.js"></script> 
<script src="/js/selectFx.js"></script>
<script src="/js/main.js"></script> 

<script type="text/javascript" src="/js/trading.js"></script>

<script>
	jQuery(document).ready(function() {
		TableData.init();
		Main.init();
	});
</script>
