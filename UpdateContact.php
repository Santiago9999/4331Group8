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
	
	//prepared statement for upddating the contact with info from the json
	if($stmt = $conn->prepare("UPDATE contacts SET firstname = ?, lastname = ?, phone = ?, email = ? WHERE id = ?"))
	{
		$stmt->bind_param("ssssi",$firstname,$lastname,$phone,$email,$contactid);
		$stmt->execute();
		$stmt->close();
		echo "updated";;
	}

	
	
	//returnWithError("");
	
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