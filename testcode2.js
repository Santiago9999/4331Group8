var urlBase = 'http://4331g8.xyz/LAMPAPI';
var extension = 'php';

var userid = 0;
var firstname = "";
var lastname = "";
var contactID = [];

function addUser()
{
	userid = 0;
	firstname = document.getElementById("firstname").value;
	lastname = document.getElementById("lastname").value;
	var user = document.getElementById("login").value;
	var password = document.getElementById("password").value;
	var confirmPassword = document.getElementById("conPsw").value;
	var hash = SHA1(password);

	var jsonPayload = '{"firstname":"' + firstname + '","lastname":"' + lastname + '","login":"' + user + '","password":"' + hash + '"}';
	var url = urlBase + '/AddUserSignup.' + extension;
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{	
		if (!firstname)
		{
			document.getElementById("addresult").innerHTML = "Please enter your first name.";
			return;
		}

		if (!lastname)
		{
			document.getElementById("addresult").innerHTML = "Please enter your last name.";
			return;
		}

		if (!user)
		{
			document.getElementById("addresult").innerHTML = "Please enter your username.";
			return;
		}

		if (!password)
		{
			document.getElementById("addresult").innerHTML = "Please enter your password.";
			return;
		}

		if (!confirmPassword)
		{
			document.getElementById("addresult").innerHTML = "Please confirm your password.";
			return;
		}

		if (password != confirmPassword)
		{
			document.getElementById("addresult").innerHTML = "Password does not match.";
			return;
		}
		
		
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("addresult").innerHTML = this.responseText;
			}
		};
		
		console.log(jsonPayload);
		xhr.send(jsonPayload);
		saveCookie();
		

	}
	catch(err)
	{
		document.getElementById("addresult").innerHTML = err.message;
	}
}

function doLogin()
{
	userid = 0;
	firstname = "";
	lastname = "";

	var login = document.getElementById("login").value;
	var password = document.getElementById("password").value;
	var hash = SHA1( password );

	document.getElementById("result").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var url = urlBase + '/Login.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
	    if (!login || !password)
		{
			document.getElementById("result").innerHTML = "Please enter your Username/Password.";
			return;
		}

		xhr.send(jsonPayload);

		var jsonObject = JSON.parse( xhr.responseText );
		userid = jsonObject.id;
		
		

		if( userid < 1 )
		{
			document.getElementById("result").innerHTML = "User/Password combination incorrect";
			return;
		}

		firstname = jsonObject.firstname;
		lastname = jsonObject.lastname;
		console.log(jsonObject);

		saveCookie();

		window.location.href = "main.html";
	}
	catch(err)
	{
		document.getElementById("result").innerHTML = err.message;
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstname=" + firstname + ",lastname=" + lastname + ",userid=" + userid + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userid = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstname" )
		{
			firstname = tokens[1];
		}
		else if( tokens[0] == "lastname" )
		{
			lastname = tokens[1];
		}
		else if( tokens[0] == "userid" )
		{
			userid = parseInt( tokens[1].trim() );
		}
	}

	if( userid < 0 )
	{
		window.location.href = "login.html";
	}
	else
	{
	    var url = urlBase + '/Login.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	    var jsonObject = JSON.parse(JSON.stringify(xhr.responseText));
			console.log(jsonObject);
		document.getElementById("login").innerHTML = "Logged in as User " + firstname+ " " + lastname + ", UserID: " + userid;
	}
}

function doLogout()
{
	userid = 0;
	firstname = "";
	lastname = "";
	document.cookie = "firstname= , lastname =, userId = ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "login.html";
}

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function addContact()
{
	var firstname = document.getElementById("firstname").value;
	var lastname = document.getElementById("lastname").value;
	var phone = document.getElementById("phone").value;
	var email = document.getElementById("email").value;
	
	document.getElementById("contactResult").innerHTML = "";

	var jsonPayload = '{"userid" : "' + userid + '", "firstname" : "' + firstname + '", "lastname" : "' + lastname + '", "phone" : "' + phone + '", "email" : "' + email + '"}';
	
	var url = urlBase + '/AddContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
	    if (!firstname)
		{
			document.getElementById("contactResult").innerHTML = "Please Enter First Name.";
			return;
		}

		if (!lastname)
		{
			document.getElementById("contactResult").innerHTML = "Please Enter Last Name.";
			return;
		}

		if (!email)
		{
			document.getElementById("contactResult").innerHTML = "Please Enter Email.";
			return;
		}

		if (!validateEmail(email))
		{
			document.getElementById("contactResult").innerHTML = "Invalid Email";
			return;
		}
		
		if (!phone)
		{
			document.getElementById("contactResult").innerHTML = "Please Enter Phone Number.";
			return;
		}

		if (!(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone)))
		{
			document.getElementById("contactResult").innerHTML = "Invalid Phone Number.";
			return;
		}
		
		xhr.send(jsonPayload);
				
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactResult").innerHTML = this.responseText;
			}
		};

	}
	catch(err)
	{
		document.getElementById("contactResult").innerHTML = err.message;
	}

}

function editPage(id)
{
    window.location.href = "edit.html";
	var firstname = document.getElementById("firstname").value;
	var lastname = document.getElementById("lastname").value;
	var phone = document.getElementById("phone").value;
	var email = document.getElementById("email").value;
	if (firstname == "")
	{
		firstname = document.getElementById("firstname").innerHTML;
	}
	if (lastname == "")
	{
		firstname = document.getElementById("lastname").innerHTML;
	}
	if (phone == "")
	{
		phone = document.getElementById("phone").innerHTML;
	}
	else if (!(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone)))
		{
			document.getElementById("contactResult").innerHTML = "Invalid Phone Number.";
			return;
		}
	if (email == "")
	{
		email = document.getElementById("email").innerHTML;
	}
	else if (!validateEmail(email))
	{
			document.getElementById("editResult").innerHTML = "Invalid Email";
			return;
	}

	// document.getElementById("name").innerHTML = name;
	// document.getElementById("number").innerHTML = number;
	// document.getElementById("emailDisp").innerHTML = email;

	var jsonPayload = '{"id" : "' + id + '","firstname" : "' + firstname + '","lastname" : "' + lastname + '","phone" : "' + phone + '","email" : "' + email + '"}';
	var url = urlBase + '/UpdateContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("editResult").innerHTML = "Contact has been updated";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}


}

/*function editButton(id)
{
	var jsonPayload = '{"id" : "' + id + '"}';
	var url = urlBase + '/UpdateContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse( xhr.responseText );

				if(jsonObject.results != undefined)
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					var arr = (jsonObject.results[i]).split(" ");
					var len = arr.length;
					var name = "";
					var number = arr[len - 3];
					var email = arr[len - 2];
					if(len == 5)
					{
						name += arr[0] + " " + arr[1];
					}
					else
					{
						name += arr[0];
					}
					document.getElementById("name").innerHTML = name;
					document.getElementById("number").innerHTML = number;
					document.getElementById("emailDisp").innerHTML = email;
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}
}*/

/*function edit(id)
{
	localStorage["id"] = id;
	window.location.href = "edit.html";
}*/

function deleteButton(id, num2)
{
	var prompt = confirm("Delete contact?");
	if(prompt)
	{
		var jsonPayload = '{"id" : "' + id + '"}';
		var url = urlBase + '/DeleteContact.' + extension;

		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.send(jsonPayload);
			location.reload();
		}
		catch(err)
		{
			document.getElementById("contactResult").innerHTML = err.message;
		}
	}
}

/*function searchContacts()
{

	var srch = document.getElementById("searchText").value;
	document.getElementById("searchResult").innerHTML = "";

	if(!srch)
		srch="";
	var contactList = "<table name='results' id='results'>";

	var jsonPayload = '{"search" : "' + srch + '","userid" : ' + userid + '}';
	var url = urlBase + '/SearchContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("searchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				
				var jObject = JSON.parse(JSON.stringify(xhr.responseText));

						console.log(jObject);
						
				if(jsonObject.results != undefined)
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					var arr = (jsonObject.results[i]).split(" ");
					var len = arr.length;
					contactList += "<tr><td>" + arr[0]
					var j = 1;
					while (j < len - 3)
					{
						contactList += " " + arr[j];
						j++;
					}
					contactList += "</td></tr><tr><td>Phone:&emsp;" + arr[len - 3];
					contactList += "</td></tr><tr><td>Email:&emsp;" + arr[len - 2];
					contactList += "</td><td>" + buttonString(arr[len - 1], i) + "</tr><tr><td><br></td></tr>";
				}
				contactList += "</table>";
				document.getElementById("searchTable").innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}

}*/

/*function searchContacts() {
	var search = document.getElementById("searchText").value;

	document.getElementById("searchResult").innerHTML = "";
	

	var jsonPayload = '{"search" : "' + search + '", "userid" : "' + userid + '"}';
	var url = urlBase + '/SearchContact.' + extension;
	var List = "";

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		/*xhr.send(jsonPayload);
		var jsonObject = JSON.parse( xhr.responseText );
		var rows = "";
		
		for (var i = 0; i < jsonObject.results.length; i++)
		{
			var result = jsonObject.results[i];
			var contactFirstName = result.split(' ')[0];
			var contactLastName = result.split(' ')[1];
			var contactPhoneNumber = result.split(' ')[2];
			var contactEmail = result.split(' ')[3];
			userId[i] = result.replace(/\D/g, '');

			rows += "<td>" + contactFirstName + "</td><td>" + contactLastName + "</td><td>" + contactPhoneNumber + "</td><td>" + contactEmail + "</td>";
			$(rows).appendTo("#list tbody");
		}*/
	/*	xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("searchResult").innerHTML = "Contact List";
				
				var jObject = JSON.parse(xhr.responseText);
				var jsonObject = JSON.parse(JSON.stringify(xhr.responseText));
			//			console.log(jsonObject);
				
				List += "<th>firstname</th><th>lastname</th><th>phone</th><th>email</th>"
				console.log(jObject.results);
	
				if(jObject.results != undefined)
				{
				for( var i=0; i<jObject.results.length; i++ )
				{
				    console.log(jObject.results[i]);
					List += "<tr>";
					var k = 0;
					for (var j = 0; j < 5; j++)
					{
						List += "<td>";
						while (jObject.results[i].charAt(k) != " ")
						{
							List += jObject.results[i].charAt(k);
							k++;
						}
						List += "</td>";
						k++;
					}
					List += "</tr>";
				}
				}
				
				document.getElementById("searchTable").innerHTML = List;
			}
		};
		xhr.send(jsonPayload);

		
	}
	catch (err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
}*/

function searchContacts() 
{
	var search = document.getElementById("searchText").value;
//	document.getElementById("searchTable").innerHTML = "";

	document.getElementById("searchResult").innerHTML = "";
//	document.getElementById("result").innerHTML = "";


	

	var jsonPayload = '{"search" : "' + search + '", "userid" : "' + userid + '"}';
	var url = urlBase + '/SearchContact.' + extension;
	var List = "";

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try
	{
	    
	xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("searchResult").innerHTML = "Contact List";
				
				var jObject = JSON.parse(xhr.responseText);
				var jsonObject = JSON.parse(JSON.stringify(xhr.responseText));
			//			console.log(jsonObject);
			
		//	List += "<th>firstname</th><th>lastname</th><th>phone</th><th>email</th>"
				
			//	console.log(jObject.results);
	
				if(jObject.results != undefined)
				{
				for( var i=0; i<jObject.results.length; i++ )
				{
				  //  console.log(jObject.results[i]);
					List += "<tr>";
					var k = 0;
						List += "<td>";
						for (k = 0; k < 5; k++)
						{
						  //  console.log(jObject.results[i]);
						    switch (k)
						    {
						        case (0):
						        List += "</td></tr><tr><td>First Name:&emsp;" + jObject.results[i].firstname;
						        break;
						        case (1):
						        List += "</td></tr><tr><td>Last Name:&emsp;" + jObject.results[i].lastname;
						        break;
						        case (2):
						        List += "</td></tr><tr><td>Phone:&emsp;" + jObject.results[i].phone;
						        break;
						        case (3):
						        List += "</td></tr><tr><td>Email:&emsp;" + jObject.results[i].email;
						        break;
						        case (4):
						        List += "</td><td>" + buttonString(jObject.results[i].id) + "</tr><tr><td><br></td></tr>";
						        break;
						    }
						}
						
	//				List += "</tr><tr><td><br></td></tr>";
				}
				}
				
				document.getElementById("searchTable").innerHTML = List;
			}
		};
		xhr.send(jsonPayload);
}
		

	catch (err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
}
			    	
				
				


function buttonString(id , num)
{
	var editId = "editButton";
	var deleteId = "delete" + num;
	var editText = "editText" + num;
	var editButton = "<button type='button' id='editButton' class='fa fa-bars' onclick='editPage(" + id + ")'></button>";
	var editBar = "<span id='" + editText + "' class = 'edit'></span>"
	var deleteButton = "<button type='button' id='deleteButton' class='fa fa-trash'onclick='deleteButton(" + id + ")'></button><br />";
	return "&emsp;</td><td>" + editButton + "</td><td>" + editBar + "</td><td>" + deleteButton + "</td>";
}