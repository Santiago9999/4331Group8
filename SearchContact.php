 <?php

 	// Adpted from Professor Leinecker's searchColor endpoint.

	$inData = getRequestInfo();

	// Created 2 empty array for later use: searchResults and searchContacts
	$searchResults = [];
	$searchContacts = [];
	$search = $inData["search"];
	$userId = $inData["userid"];
	$id = 0;
	$firstName = "";
	$lastName = "";
	$email = "";
	$phone = "";
	$fixed = "";

	// Checks for connection to database
	$conn = new mysqli("localhost", "cop4331_group8", "Leineckeris#1", "cop4331_group8");
	if($conn->connect_error)
	{
		returnWithError($conn->conect_error);
	}
	else
	{
		// SQL code that will check for where with the correct User the firstname or lastname have a partial match.
		$sql = "SELECT* from contacts WHERE userid= $userId and (firstname like '%$search%' or lastname like '%$search%')";
		$result = $conn->query($sql);
		if($result ->num_rows > 0)
		{
			while($row = $result->fetch_assoc())
			{
				$id = $row["id"];
				$firstName = $row["firstname"];
				$lastName = $row["lastname"];
				$email = $row["email"];
				$phone = $row["phone"];

			// 	Add the information for each contact into one array.
				$searchContacts['id'] = $id;
				$searchContacts['firstname'] = $firstName;
				$searchContacts['lastname'] = $lastName;
				$searchContacts['email'] = $email;
				$searchContacts['phone'] = $phone;
			//  Push said array into SearchResults, which is will now store all the contacts, with their
			//  specific information.
				array_push($searchResults, $searchContacts);
			}
			returnWithInfo( $searchResults );
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

	// Early stage of what I eventually implemented in returnWithInfo
	function sendResultInfoAsJsonCorrect( $obj )
	{
		for($i = 0; $i < count($obj); $i++)
		{
			if($i == count($obj) - 1)
			{
				header('Content-type: application/json');
				echo json_encode($obj[$i]);
			}
			else
			{
				header('Content-type: application/json');
				echo json_encode($obj[$i]);
				echo ",";
			}
		}
	}

	// Still returns just as professor Leinecker's original does. No change.
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	// Still returns just as professor Leinecker's original does. No change.
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	// Drastic change to this function
	function returnWithInfo( $searchResults )
	{
		// Checking the # of contacts using the count command in order to loop.
		for($i = 0; $i < count($searchResults); $i++)
		{
			// This makes sure that the last contact being added does not have a 
			// comma afterward so that the JSON payload will be in the correct format.
			if($i == count($searchResults) - 1)
			{
				header('Content-type: application/json');
				// Encodes the individual contact array.
				$fixed .= json_encode($searchResults[$i]);
			}
			// Makes every one except for the last contact to have a comma after,
			// fits the syntax for JSON Array.
			else
			{
				header('Content-type: application/json');
				// Encodes the individual contact array
				$fixed .= json_encode($searchResults[$i]);
				$fixed .= ",";
			}
		}

		$retValue = '{"results":[' . $fixed . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

	
?>