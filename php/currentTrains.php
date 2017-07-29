<?php
ini_set("display_errors", 1);
$curl_handle = curl_init();
$url ='http://reiseauskunft.bahn.de/bin/bhftafel.exe/dn?ld=9646&rt=1&input=%23' . $_GET["id"] . '&boardType=dep&time=actual&productsFilter=11111&start=yes';
curl_setopt( $curl_handle, CURLOPT_URL, $url);
curl_setopt( $curl_handle, CURLOPT_RETURNTRANSFER, true ); // Fetch the contents too
$html = curl_exec( $curl_handle ); // Execute the request
echo $html;
curl_close( $curl_handle );
?>