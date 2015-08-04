<?php
include ('./libs/getInfo.php');

$getInfo = new HZxInfo();

$assets = array(
	'btc'=>'5695508852370099719',
#	'bts'=>'15363696555198579003',
	'cann'=>'13629236810639777788',
	'dash'=>'2717092958638242662',
	'ltc'=>'15858837599855019744',
	'nxt'=>'7635404150699827277',
	'pot'=>'9846627725405192557'
);

$trustedassets = array(
	'argenbits'=>'12862026363025360400',
	'hzsphere'=>'4033048123059509069',
	'hzxchange'=>'17828408937649813496',
#	'fireandsmoke'=>'12746842454066497618',
	'altsheets'=>'8101260088962758269',
	'hzchronos'=>'14434264033002297623',
	'upstart'=>'8728095596643050008',
	'hzmmnxtt'=>'9588580913946030800'
);

$results = array();
foreach($assets as $id)
{
	$results[$id] = $getInfo->getAssetInfo($id);
}

$trusted = array();
foreach($trustedassets as $id)
{
	$trusted[$id] = $getInfo->getAssetInfo($id);
}