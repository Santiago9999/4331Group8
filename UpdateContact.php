<?php
	$inData = getRequestInfo();
	
	$contactid = $inData["id"];
	$firstname = $inData["firstname"];
	$lastname = $inData["lastname"];
	$phone = $inData["phone"];
	$email = $inData["email"];	

	$conn = new mysqli("localhost", "cop4331_group8", "Leineckeris#1", "cop4331_group8");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	
	$sql = "UPDATE contacts SET firstname = '$firstname', lastname = '$lastname', phone = '$phone' , email = '$email' WHERE id = $contactid  ";
	if( $conn->query($sql) === TRUE )
	{
		echo "updated";;
	}
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