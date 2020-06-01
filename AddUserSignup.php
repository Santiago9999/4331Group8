<?php
	$inData = getRequestInfo();
	
	$firstname = $inData["firstname"];
	$lastname = $inData["lastname"];
	$login = $inData["login"];
	$password = $inData["password"];	
	$hashedpass = md5($password);

	$conn = new mysqli("localhost", "cop4331_group8", "Leineckeris#1", "cop4331_group8");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{

		//checks for users with a login already used to prevent duplicates
		if($stmt = $conn->prepare("SELECT * FROM users where login=(?)"))
		{
			$stmt->bind_param("s", $login);
			$stmt->execute();

			$stmt->store_result();
			$numrows = $stmt->num_rows; //takes the row count to determine if a user already exists
	//		echo $numrows;

			$stmt->free_result();
			$stmt->close();
		}

 
		if ($numrows > 0)
		{
				$retValue = 'Account already exists';
    			sendResultInfoAsJson( $retValue );
		}	
		else 
		{	//if the row count is 0 then a user account is inserted into the database
			if($stmt = $conn->prepare("insert into users (firstname, lastname, login, password) VALUES (?,?,?,?)"))
			{
				$stmt->bind_param("ssss", $firstname, $lastname, $login, $hashedpass);
				$stmt->execute();
				$stmt->close();
			}

		
    		$retValue = 'Signed up Successfully';

    		sendResultInfoAsJson( $retValue );


		}

		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}
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
//		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	
	
?>