<?php
	$inData = getRequestInfo();
	
	$userId = $inData["userid"];
	$firstname = $inData["firstname"];
	$lastname = $inData["lastname"];
	$phone = $inData["phone"];
	$email = $inData["email"];	

	$conn = new mysqli("localhost", "cop4331_group8", "Leineckeris#1", "cop4331_group8");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		//prepared statement for adding contact
		if($stmt = $conn->prepare("insert into contacts (userid,firstname, lastname, phone, email) VALUES (?,?,?,?,?)"))
		{
			$stmt->bind_param("issss", $userId, $firstname, $lastname, $phone, $email);

			$stmt->execute();
			$stmt->close();
		}
	    $retValue = 'Contact Added';
	    //message for when contact is added
	    sendResultInfoAsJson( $retValue );


		$conn->close();
	}
	
//	returnWithError("");
	
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