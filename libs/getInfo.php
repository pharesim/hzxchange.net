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

	function getAssetInfo($id) {
		$info = $this->nhz->getBlockchainStatus();
		$secsperday = 60*60*24;
		$dayago = $info->time - $secsperday;

		$asset = $this->nhz->getAsset(array('asset'=>$id));
		$result = array(
			'name'=>$asset->name,
			'volume'=>0,
			'24hr'=>0,
			'last'=>0,
			'high'=>0,
			'low'=>0,
			'ask'=>0,
			'bid'=>0
		);

		$bids = $this->nhz->getBidOrders(array('asset'=>$id));
		if(isset($bids->bidOrders[0]))
		{
			$result['bid'] = $bids->bidOrders[0]->priceNQT/pow(10,8-$asset->decimals);
		}

		$asks = $this->nhz->getAskOrders(array('asset'=>$id));
		if(isset($asks->askOrders[0]))
		{
			$result['ask'] = $asks->askOrders[0]->priceNQT/pow(10,8-$asset->decimals);
		}

		$result['volume'] = 0;
		if($asset->numberOfTrades > 0)
		{
			$trades = $this->nhz->getTrades(array('asset'=>$id));
			foreach($trades->trades as $trade)
			{
				$qnt = $trade->quantityQNT/pow(10,$asset->decimals);
				$price = $trade->priceNQT/pow(10,8-$asset->decimals);

				if($result['last'] == 0)
				{
					$result['last'] = $price;
				}

				if($trade->timestamp < $dayago)
				{
					$result['24hr'] = $price;
					break;
				}

				if($price > $result['high'])
				{
					$result['high'] = $price;
				}

				if($result['low'] == 0 || $price < $result['low'])
				{
					$result['low'] = $price;
				}

				$result['volume'] += $qnt*$price;
			}
		}

		$inBTC = array('last','high','low','ask','bid','volume');
		foreach($inBTC as $key)
		{
			$price = 0;
			$decimals = 0;
			if(isset($result[$key]))
			{
				$price = $result[$key]*$this->hzprice;
				$float = sprintf('%f', $price);
				$integer = sprintf('%d', $price);
				if ($float == $integer) {
					$price = $integer;
				}
				else
				{
					$price = rtrim($float,'0');
				}

				$decimals = strlen(substr(strrchr($price, "."), 1));
				if($decimals > 8) $decimals = 8;
			}

			$result[$key.'BTC'] = number_format($price,$decimals);
		}
		return $result;
	}
}