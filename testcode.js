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
		document.getElementById("login").innerHTML = "Logged in as UserID " + firstname + lastname + userid;
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
	var name = document.getElementById("fullName").value;
	var number = document.getElementById("Phonenumber").value;
	var email = document.getElementById("Email").value;
	if (name == "")
	{
		name = document.getElementById("name").innerHTML;
	}
	if (number == "")
	{
		number = document.getElementById("number").innerHTML;
	}
	if (email == "")
	{
		email = document.getElementById("emailDisp").innerHTML;
	}

	// document.getElementById("name").innerHTML = name;
	// document.getElementById("number").innerHTML = number;
	// document.getElementById("emailDisp").innerHTML = email;

	var jsonPayload = '{"Name" : "' + name + '","PhoneNumber" : "' + number + '","id" : "' + id + '","Email" : "' + email + '"}';
	var url = urlBase + '/EditContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("editResult").innerHTML = "Contact has been Updated";
				var jsonObject = JSON.parse( xhr.responseText );

				if(jsonObject.results != undefined)
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					var arr = (jsonObject.results[i]).split(" ");
					var len = arr.length;
					name = "";
					number = arr[len - 3];
					email = arr[len - 2];
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


}

function editButton(id)
{
	var jsonPayload = '{"id" : "' + id + '"}';
	var url = urlBase + '/EditSearch.' + extension;

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
}

function edit(id)
{
	localStorage["id"] = id;
	window.location.href = "edit.html";
}

function deleteButton(id, num2)
{
	var text = document.getElementById("results").rows[num2].cells[0].innerHTML;
	var prompt = confirm("Are you sure you want to delete " + text);
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
			document.getElementById("contactSearchResult").innerHTML = err.message;
		}
	}
}

/*function searchContact()
{

	var srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	if(!srch)
		srch="";
	var contactList = "<table name='results' id='results'>";

	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userid + '}';
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
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
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
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

} */

function searchContacts() {
	var search = document.getElementById("searchText").value;

	document.getElementById("searchResult").innerHTML = "";
	
	search ="new";
	userid = 137;

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
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("searchResult").innerHTML = "Contact List";
				
				var jsonObject = JSON.parse(JSON.stringify(xhr.responseText));
				
				List += "<th>firstname</th><th>lastname</th><th>phone</th><th>email</th>"
				
	
				if(jsonObject.searchResults != undefined)
				{
				for( var i=0; i<jsonObject.searchResults.length; i++ )
				{
					List += "<tr>";
					var k = 0;
					for (var j = 0; j < 5; j++)
					{
						List += "<td>";
						while (jsonObject.searchResults[i].charAt(k) != " ")
						{
							List += jsonObject.searchResults[i].charAt(k);
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
}

function buttonString(id , num)
{
	var editId = "editButton";
	var deleteId = "delete" + num;
	var editText = "editText" + num;
	var editButton = "<button type='button' id='editButton' class='buttons2' onclick='edit(" + id + ")'> <ion-icon name='create'></ion-icon> </button>"; // added icon and style
	var editBar = "<span id='" + editText + "' class = 'edit'></span>"
	var deleteButton = "<button type='button' id='deleteButton' class='buttons2' onclick='deleteButton(" + id + ", " + ((num > 1)?((num - 1) * 4): (num * 4)) + ")'> <ion-icon name='trash'></ion-icon> </button><br />"; //added icon and style
	return "&emsp;</td><td>" + editButton + "</td><td>" + editBar + "</td><td>" + deleteButton + "</td>";
}