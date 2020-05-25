<?php

	$inData = getRequestInfo();

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

	$conn = new mysqli("localhost", "cop4331_group8", "Leineckeris#1", "cop4331_group8");
	if($conn->connect_error)
	{
		returnWithError($conn->conect_error);
	}
	else
	{
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
				$searchContacts['id'] = $id;
				$searchContacts['firstname'] = $firstName;
				$searchContacts['lastname'] = $lastName;
				$searchContacts['email'] = $email;
				$searchContacts['phone'] = $phone;
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

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		for($i = 0; $i < count($searchResults); $i++)
		{
			if($i == count($searchResults) - 1)
			{
				header('Content-type: application/json');
				$fixed .= json_encode($searchResults[$i]);
			}
			else
			{
				header('Content-type: application/json');
				$fixed .= json_encode($searchResults[$i]);
				$fixed .= ",";
			}
		}

		$retValue = '{"results":[' . $fixed . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

	
?>