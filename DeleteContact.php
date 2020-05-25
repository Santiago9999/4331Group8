<?php

	$inData = getRequestInfo();
	
	$contactid = $inData["contactid"];

	$conn = new mysqli("localhost", "cop4331_group8", "Leineckeris#1", "cop4331_group8");

	$conn->query("DELETE FROM contacts WHERE id = $contactid");
	$conn->close();

	returnWithError("");

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	
	
?>