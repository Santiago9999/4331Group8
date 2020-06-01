<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstname = "";
	$lastname = "";
	$login = $inData["login"];
	$hashedpass = md5($inData["password"]); //hashes password 
	$numrows = 0;

	$conn = new mysqli("localhost", "cop4331_group8", "Leineckeris#1", "cop4331_group8");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		//gets the user info from the database if a match is made
		if($stmt = $conn->prepare("SELECT id,firstname,lastname FROM users where login=? and password=?"))
		{
			$stmt->bind_param("ss", $login, $hashedpass);
			$stmt->execute();
			$stmt->bind_result($id, $firstname, $lastname);
			$stmt->store_result();
			$stmt->fetch();
			$numrows = $stmt->num_rows;
	//		$stmt->free_result();
			$stmt->close();
		}
		//if it finds data it returns with the info else no records found
		if ($numrows > 0)
		{	
			returnWithInfo($firstname, $lastname, $id );
		}
		else
		{
			returnWithError( "No Records Found" );
		}
		$conn->close();
	}
	
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
		$retValue = '{"id":0,"firstname":"","lastname":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstname, $lastname, $id )
	{
		$retValue = '{"id":' . $id . ',"firstname":"' . $firstname . '","lastname":"' . $lastname . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>