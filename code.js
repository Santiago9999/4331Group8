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
		
	//	console.log(jsonPayload);
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
		document.getElementById("login").innerHTML = "Logged in as user: " + firstname+ " " + lastname + ", UserID: " + userid;
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

		else if (!validateEmail(email))
		{
			document.getElementById("contactResult").innerHTML = "Invalid Email";
			return;
		}
		
		if (!phone)
		{
			document.getElementById("contactResult").innerHTML = "Please Enter Phone Number.";
			return;
		}

		else if (!(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone)))
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
				location.reload();
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
	var firstname = document.getElementById("firstname").value;
	var lastname = document.getElementById("lastname").value;
	var phone = document.getElementById("phone").value;
	var email = document.getElementById("email").value;
//	console.log(firstname);
//	console.log(lastname);
//	console.log(phone);
//	console.log(email);

//	id = "137";
//		console.log(id);
	
	if (firstname == "")
	{
		document.getElementById("editResult").innerHTML = "Please Enter First Name.";
			return;
	}
	if (lastname == "")
	{
		document.getElementById("editResult").innerHTML = "Please Enter Last Name.";
			return;
	}
	if (phone == "")
	{
		document.getElementById("editResult").innerHTML = "Please Enter Phone Number.";
			return;
	}

    else if (!(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone)))
		{
			document.getElementById("editResult").innerHTML = "Invalid Phone Number.";
			return;
		}
	if (email == "")
	{
		document.getElementById("editResult").innerHTML = "Please Enter Email.";
			return;
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
		//		window.location.href = "main.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}


}



function edit(id)
{
	localStorage["id"] = id;
	window.location.href = "edit.html";
}

function deleteButton(id, num2)
{
	var prompt = confirm("Are you sure you want to delete this contact?");
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
						      //       console.log(jObject.results[i]);
						        List += "</td><td>" + buttonString(jObject.results[i].id, i) + "</tr><tr><td><br></td></tr>";
						        break;
						    }
						}
						
	//				List += "</tr><tr><td><br></td></tr>";
				}
				}
				
				document.getElementById("searchTable").innerHTML = List;
				document.getElementById("resultBox").show();
			}
		};
		xhr.send(jsonPayload);
}
		

	catch (err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
}
			    	
				
				


function buttonString(id, num)
{
	var editId = "editButton";
	var deleteId = "delete" + num;
	var editText = "editText" + num;
	var editButton = "<button type='button' id='editButton' style='color:black; background-color:#cfa91f; opacity:0.8; width:100%; text-align:left' class='fa fa-bars' onclick='edit(" + id + ")'></button>";
	var editBar = "<span id='" + editText + "' class = 'edit'></span>"
	var deleteButton = "<button type='button' id='deleteButton' style='color:black; background-color:#f24e51; width:100%' class='fa fa-trash'onclick='deleteButton(" + id + ")'></button><br />";
	return "&emsp;</td><td>" + editButton + "</td><td>" + editBar + "</td><td>" + deleteButton + "</td>";
}