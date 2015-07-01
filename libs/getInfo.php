<?php
class HZxInfo
{

	public $hzprice = 0;

	public function __construct()
	{
		require_once ('./libs/nhz/nhz.php');
		$this->nhz = new NHZ();

		$hzprice = file_get_contents(
			'https://bittrex.com/api/v1.1/public/getticker/?market=BTC-HZ'
		);
		$this->hzprice = json_decode($hzprice)->result->Last;
	}

	
}