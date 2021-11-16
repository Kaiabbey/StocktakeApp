if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }

const api = "http://localhost:80/StocktakeApp/StocktakeAPI/index";

//const api = "/StocktakeAPI/index.php";


 
onLoad();

function toggle(){
    $('.ui.sidebar').sidebar('toggle');
}


$('#email,#firstname,#lastname,#password').keypress(function(){clearErr()});

$('#adminSideBar').click(function(){toggle()});

// $('#password').keyup(function(){
//     let pass = document.getElementById('password');
//     let regex = new RegExp('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&?])([^</>{}]){8,16}');
//     if(regex.test(pass.value) === false){
//         pass.style.border  = '2px solid red';
//     }
//     else{
//         pass.style.border  = '';
//     }

// });

// $('#email').keyup(function(){
//     let pass = document.getElementById('email');
//     let regex = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
//     if(regex.test(pass.value) === false){
//         pass.style.border  = '2px solid red';
//     }
//     else{
//         pass.style.border  = '';
//     }

// });

// $('#firstname,#lastname').keyup(function(event){
//     let regex = new RegExp('(?=.[A-Za-z])([^0-9$&+,:;=?@#|"_</>.\-^()%!`~]){2,16}');
//     let name = document.getElementById(event.target.id);
//     if(regex.test(name.value)){
//         name.style.border = '';
//     }
//     else{
//         name.style.border  = '2px solid red';
//     }

// });


//Form Validation Using Bouncer this only does ui based validation when someone logs in it's always sent to the API then the API does it's own validation
var validate = new Bouncer('form', {

	// Classes & IDs
	fieldClass: 'error', // Applied to fields with errors
	errorClass: 'error-message', // Applied to the error message for invalid fields
	fieldPrefix: 'bouncer-field_', // If a field doesn't have a name or ID, one is generated with this prefix
	errorPrefix: 'bouncer-error_', // Prefix used for error message IDs

	// Patterns
	// Validation patterns for specific input types
	patterns: {
		email: /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/,
		url: /^(?:(?:https?|HTTPS?|ftp|FTP):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/,
		number: /[-+]?[0-9]*[.,]?[0-9]+/,
		color: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
		date: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/,
		time: /(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9])/,
		month: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2]))/
	},

	// Message Settings
	messageAfterField: true, // If true, displays error message below field. If false, displays it above.
	messageCustom: 'data-bouncer-message', // The data attribute to use for customer error messages
	messageTarget: 'data-bouncer-target', // The data attribute to pass in a custom selector for the field error location

	// Error messages by error type
	messages: {
		missingValue: {
			checkbox: 'This field is required.',
			radio: 'Please select a value.',
			select: 'Please select a value.',
			'select-multiple': 'Please select at least one value.',
			default: 'Please fill out this field.'
		},
		patternMismatch: {
			email: 'Please enter a valid email address.',
			url: 'Please enter a URL.',
			number: 'Please enter a number',
			color: 'Please match the following format: #rrggbb',
			date: 'Please use the YYYY-MM-DD format',
			time: 'Please use the 24-hour time format. Ex. 23:00',
			month: 'Please use the YYYY-MM format',
			default: 'Please match the requested format.'
		},
		outOfRange: {
			over: 'Please select a value that is no more than {max}.',
			under: 'Please select a value that is no less than {min}.'
		},
		wrongLength: {
			over: 'Please shorten this text to no more than {maxLength} characters. You are currently using {length} characters.',
			under: 'Please lengthen this text to {minLength} characters or more. You are currently using {length} characters.'
		}
	},

	// Form Submission
	disableSubmit: false, // If true, native form submission is suppressed even when form validates

	// Custom Events
	emitEvents: true // If true, emits custom events

});


function logOutBtn(){
    toggle();
    logOut();
}

function btnSection(id){
    let target = id.replace('btn','');
    console.log(target);
    setSection(target);
    toggle();
}


function logOut(){
    localStorage.setItem('LoggedIn', false);
    clearForm();
    setSection('LoginSection');
    fetch(api+'?action=logout',{credentials: 'include'});
}

function apiLogin(){
    if(document.getElementById('email').value === '' || document.getElementById('password').value === ''){
        newErr('Empty Credentials');
    }
    else{
        clearErr();
        let data = new FormData();
        let spinner = document.getElementById('spinner');
        spinner.style.display = 'block';
        data.append('email', document.getElementById('email').value);
        data.append('password', document.getElementById('password').value);
        
        fetch(api+'?action=login',{method: 'post', body: data, credentials: 'include'})
        .then(function(res){
            if(res.status === 201){
                setSection('Home');
                getLocations();
                clearForm();
                checkAdmin();
                currentUser();
                getStockObjects()
                localStorage.setItem('LoggedIn', true);
            }
            else if(res.status === 400){
                newErr('Invalid Credentials');
                localStorage.setItem('LoggedIn', false);
            }
            else if(res.status === 429){
                newErr('Request Timed Out');
                alert('Too many requests sent, connection has been disconnected');
                localStorage.setItem('LoggedIn', false);
            }
            else if(res.status === 406){
                newErr("invalid password or email format");
                localStorage.setItem('LoggedIn', false);
            }
            spinner.style.display = 'none';
        });
    }
}

function apiRegister(){
    clearErr()
    console.log("reg start");
    let data = new FormData();
    data.append('password', document.getElementById('password').value);
    data.append('email', document.getElementById('email').value);
    data.append('firstname', document.getElementById('firstname').value);
    data.append('lastname', document.getElementById('lastname').value);
    clearForm();
    let spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    fetch(api+'?action=register',{method: 'post', body: data, credentials: 'include'})
    .then(function(res){
        console.log('post resp');
        if(res.status === 201){
            loginUiSwap('loginui');
        }
        else if(res.status === 400){
            newErr("Email Taken");
        }
        else if(res.status === 401){
            newErr('Empty Credentials');
        }
        else if(res.status === 500){
            newErr('Internal server Error');
        }
        else if(res.status === 429){
            newErr('Request Timed Out');
            alert('Too many requests sent, connection has been disconnected');
        }
        else if(res.status === 406){
            newErr('invalid user details');
        }
        spinner.style.display = 'none';
    }).catch(newErr('Failed Fetch'));
    
}


function loginUiSwap(ui){
    clearErr();
    clearForm();
    document.getElementById('registerui').style.display = 'none';
    document.getElementById('loginui').style.display = 'none';
    document.getElementById(ui).style.display = 'block';

    if(document.getElementById('registerui').style.display === 'block'){
        document.getElementById('firstnameinput').style.display = 'block';
        document.getElementById('lastnameinput').style.display = 'block';
        document.getElementById('LoginHeader').innerHTML = 'Register';
    }
    else{
        document.getElementById('firstnameinput').style.display = 'none';
        document.getElementById('lastnameinput').style.display = 'none';
        document.getElementById('LoginHeader').innerHTML = 'Login';
    }

}

function onLoad(){
    setSection("LoginSection");
    if(!isStayLoggedIn()){
        logOut();
    }
    stayLoggedIn(localStorage.getItem("staylogged"));
    changeTheme(localStorage.getItem('Theme'));
    if(localStorage.getItem('LoggedIn') === 'true'){
        setSection('Home');
        checkAdmin();
        currentUser();
        getLocations();
        getStockObjects();
    }
    else{
        fetch(api+'?action=isloggedin',{credentials: 'include'})
        .then(function(res){
            if(res.status === 201){
                setSection('Home');
                console.log('YELLLLLLLLLLLLLLLLLLLLLLll');
                checkAdmin();
                currentUser();
                getLocations();
                getStockObjects();
            }
            else if(res.status === 429){
                setSection('LoginSection');
                newErr('Request Timed Out');
                alert('Too many requests sent, connection has been disconnected');
            }
        })
    }
}

function clearForm(){
    document.getElementById('password').value = '';
    document.getElementById('email').value = '';
    document.getElementById('firstname').value = '';
    document.getElementById('lastname').value = '';
    
}

function clearErr(){
    document.getElementById('login_err').style.display = 'none';
    document.getElementById('loginform').style.border = '';
}

function newErr(response){
    document.getElementById('loginform').style.border = '1.5px solid red';
    document.getElementById('login_err').style.display = 'block';
    document.getElementById('login_err').innerHTML = response;
}

function setSection(open){
    document.getElementById('Home').style.display = 'none';
    document.getElementById('Stock').style.display = 'none';
    document.getElementById('Scan').style.display = 'none';
    document.getElementById('Settings').style.display = 'none';
    document.getElementById('LoginSection').style.display = 'none';
    document.getElementById('Admin').style.display = 'none';
    document.getElementById('Help').style.display = 'none';
    document.getElementById(open).style.display = 'block';
}


function checkAdmin(){
    fetch(api+'?action=checkadmin',{credentials: 'include'})
    .then(function(res){
        if(res.status === 201){
           document.getElementById('Adminbtn').style.display = 'block';
           //allUser();
        }
        else{
            document.getElementById('Adminbtn').style.display = 'none'; 
        }
    })
}

function currentUser(){
    fetch(api+'?action=currentuser',{credentials: 'include'})
    .then(response => response.json())
    .then(data => {
        localStorage.setItem("currentUser", JSON.stringify(data));
        console.log(data);
        document.getElementById('currentName').innerHTML = data.firstname +" "+ data.lastname;
        document.getElementById('currentRole').innerHTML = data.role;
        document.getElementById('currentDate').innerHTML = data.datecreated;
        document.getElementById('currentEmail').innerHTML = data.email;
    }).catch(() => {
        data = JSON.parse(localStorage.getItem("currentUser"));
        console.log(data);
        document.getElementById('currentName').innerHTML = data.firstname +" "+ data.lastname;
        document.getElementById('currentRole').innerHTML = data.role;
        document.getElementById('currentDate').innerHTML = data.datecreated;
        document.getElementById('currentEmail').innerHTML = data.email;
    });
}

function viewUser(id){
    document.getElementById('allUsers').style.display = 'none';
    document.getElementById('editheader').style.display = 'none';
    let spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    let url = api+'?action=viewuser&user_id=' + id;
    fetch(url,{credentials: 'include'})
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById('edituser').style.display = 'block';
        document.getElementById('userFirstname').value = data.firstname;
        document.getElementById('userLastname').value = data.lastname;
        document.getElementById('userEmail').value = data.email;
        document.getElementById('userRole').value = data.role;
        document.getElementById('editui'). innerHTML += `<button type='button' class="ui button primary" onclick="editUser(`+id+`)">Save Changes</button>`;
        spinner.style.display = 'none';
     });
}

function locationForm(){
    document.getElementById('locationform').style.display = 'block';
    document.getElementById('stockitems').style.display = 'none';

}

function addLocation(){ 
    let locationname = document.getElementById('LocationName').value;
    let url = api+'?action=addlocation&locationname=' +locationname;
    let spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    fetch(url,{credentials: 'include'})
    .then(function(res){
        if(res.status === 201){
            alert('location added');
        }
        else{
            alert('location not added');
        }
        spinner.style.display = 'none';
        getLocations();
        cancelAddLocation();
    })
}

function getLocations(){
    fetch(api+'?action=getlocations',{credentials: 'include'})
    .then(response => response.json())
    .then(data => {
        const setTheme = localStorage.getItem('Theme');
        let theme = setTheme === "DarkMode" ? "Stock-Item-dark" : "Stock-Item";
        document.getElementById('stockitems').innerHTML = '<div class='+theme+' onclick="locationForm()"><h2 class="ui center aligned header" style="margin-top: 1.7vh;">Add New Location</h2></div>';
        document.getElementById("locationDropdown").innerHTML = '';
        console.log(data);
        data.forEach(d => {
            document.getElementById('stockitems').innerHTML += `<div class=`+theme+` onclick="getLocationStock(`+d.location_id+`)"><h2 class="ui center aligned header" style="margin-top: 1.7vh;">`+d.location_name+`</h2></div>`;
            document.getElementById('locationDropdown').innerHTML += `<option value="${d.location_id}">${d.location_name}</option>`
        });
    });
}

function cancelAddLocation(){
    document.getElementById('locationform').style.display = 'none';
    document.getElementById('stockitems').style.display = 'block';
    document.getElementById('LocationName').value = '';
}

function getLocationStock(location){
    let url = api+'?action=getlocationstock&locationid='+ location;
    let spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    fetch(url,{credentials: 'include'})
    .then(response => response.json())
    .then(data => {
        const setTheme = localStorage.getItem('Theme');
        let theme = setTheme === "DarkMode" ? "Stock-Item-dark" : "Stock-Item";
        for (let i = 0; i < data.length; i++) {
            attributes = JSON.parse(data[i].attributes);
            for (const [key, value] of Object.entries(attributes)) {
                console.log(`${key}: ${value}`);
            }
            console.log(attributes);
            document.getElementById('locationstock').innerHTML +=  
            `<div class=`+theme+`>
                <h2 class="ui center aligned header" style="margin-top: 1.5vh;">`
                + attributes.name+": "+data[i].stock_amount+
                `</h2>
            </div>`           
        }
        document.getElementById('locationstock').innerHTML += `<button type='button' class="ui button center aligned" style="width:80vw;margin:10vw;" onclick="leaveLocation()">Back</button>`;
        document.getElementById('stockitems').style.display = 'none';
        document.getElementById('locationstock').style.display = 'block';
        document.getElementById('stocksidebar').style.display = 'none';
        spinner.style.display = 'none';
        console.log(data);
    });
}

function leaveLocation(){
    document.getElementById('locationstock').innerHTML = '';
    document.getElementById('stockitems').style.display = 'block';
    document.getElementById('locationstock').style.display = 'none';
    document.getElementById('stocksidebar').style.display = 'block';
}

function changeTheme(id){
    if(id !=="LightMode" && id !== "DarkMode"){
        id = "LightMode";
    }
    localStorage.setItem('Theme', id);
    document.getElementById("LightMode").className = "ui button";
    document.getElementById("DarkMode").className = "ui button";
    document.getElementById(id).className = "ui positive button";
    if(id === "DarkMode"){
        document.getElementById("pusher").className = "pusher pusher-dark-style";
        document.getElementById("body").className = "body-dark pushable";
        document.getElementById("loginform").className = "ui form generic-form-dark";
        document.getElementById("editform").className = "ui form generic-form-dark";
        document.getElementById("locationform").className = "ui form location-form-dark";
        document.getElementById("newStockObjectForm").className = "ui form add-stock-form-dark";
    }
    else if(id === "LightMode"){
        document.getElementById("pusher").className = "pusher pusher-style";
        document.getElementById("body").className = "body pushable";
        document.getElementById("loginform").className = "ui form generic-form";
        document.getElementById("editform").className = "ui form generic-form";
        document.getElementById("locationform").className = "ui form location-form";
        document.getElementById("newStockObjectForm").className = "ui form add-stock-form";
    }
    getLocations();

}

function stayLoggedIn(id = '0'){
    if(id !=="StayLog" && id !== "NoLog"){
        id = "StayLog";
    }
    localStorage.setItem('staylogged', id);
    document.getElementById("StayLog").className = "ui button";
    document.getElementById("NoLog").className = "ui button";
    document.getElementById(id).className = "ui positive button";
}

function isStayLoggedIn(){
    let logged = localStorage.getItem('staylogged');
    if(logged === ''){
        stayLoggedIn('StayLog');
        logged = 'StayLog';
    }
    document.getElementById("StayLog").className = "ui button";
    document.getElementById("NoLog").className = "ui button";
    document.getElementById(logged).className = "ui positive button";
    if(logged === "StayLog"){
        return true;
    }
    else{
        return false;
    }
}



//section for scanning


function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code scanned = ${decodedText}`, decodedResult);
    html5QrcodeScanner.clear();
    document.getElementById('ScanHeader').style.display = 'none';
    document.getElementById('qr-reader').style.display = 'none';
    fetch(api+'?action=checkbarcode&barcode='+decodedText,{credentials: 'include'})
    .then(function(res){
        if(res.status === 204){
            document.getElementById('addOrRemoveStock').style.display = 'block';
            document.getElementById('barcodeHeader').innerHTML = "Barcode: "+ decodedText;
            document.getElementById('barcodeHeader').value = decodedText;
        }
        else if(res.status === 201){
            document.getElementById('barcodeNumber').innerHTML = decodedText;
            document.getElementById('barcodeNumber').value = decodedText;
            document.getElementById("newStockObjectForm").style.display = 'block';
        }
        else if(res.status === 429){
            newErr('Request Timed Out');
            alert('Too many requests sent, connection has been disconnected');
        }
    });
}



var html5QrcodeScanner = new Html5QrcodeScanner(
	"qr-reader", {facingMode: 'enviroment'},{ fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);


// functions for adding new objects to the database

//is called once the user fills out the new item form and submits it
function addNewItem(){
    let stockItemName = document.getElementById('StockItemName').value;
    let barcode = document.getElementById('barcodeNumber').value
    let data = new FormData();
    let attributes = '{"name":"' + stockItemName +'",';
    let attributeArray = document.getElementsByClassName('attribute');
    for (let i = 0; i < attributeArray.length; i++) {
        const element = attributeArray[i];
        if(i == attributeArray.length - 1){
            var attribute = '"'+element.children[2].value +'":"'+ element.children[4].value+'"';
        }
        else{
            var attribute = '"'+element.children[2].value +'":"'+ element.children[4].value +'",';
        }
        attributes = attributes + attribute;


    }
    attributes += "}";
    console.log(JSON.parse(attributes));
    data.append('barcode', barcode);
    data.append('attributes', attributes);
    fetch(api+'?action=new_stock_object',{method: 'post', body: data, credentials: 'include'})
        .then(function(res){
            if(res.status === 201){
                cancelAddNewItem();
                alert('item added!')
            }
            else if(res.status === 400){
                alert('failed to add item');
            }
            else if(res.status === 429){
                newErr('Request Timed Out');
                alert('Too many requests sent, connection has been disconnected');
            }
            else if(res.status === 406){
                newErr("invalid attribute data");
            }
        });
}


//is called when user wants to return to to scanning barcodes
function cancelAddNewItem(){
    document.getElementById('ScanHeader').style.display = 'flex';
    document.getElementById('qr-reader').style.display = 'block';
    document.getElementById("newStockObjectForm").style.display = 'none';
    document.getElementById('StockItemName').value = '';
    document.getElementById('newAttributes').innerHTML = '';
    html5QrcodeScanner.render(onScanSuccess);
}

function cancelUpdateStock(){
    document.getElementById('ScanHeader').style.display = 'flex';
    document.getElementById('qr-reader').style.display = 'block';
    document.getElementById('addOrRemoveStock').style.display = 'none';
    document.getElementById('barcodeHeader').innerHTML = "";
    document.getElementById('barcodeHeader').value = "";
    html5QrcodeScanner.render(onScanSuccess);
}

//when user is in edit or add new item form it adds extra attributes to the items
function addNewAttribute(id){
    let attributes = document.getElementById(id);
    let node = document.createElement("DIV");
    node.className = 'attribute'
    let newAttribute = `
        <h2 style='margin-top:15px'>New Attribute</h2>
        <h4>Attribute Name</h4>
        <input type='text' minlength="2" required>
        <h4>Attribute Value</h4>
        <input type='text' minlength="2" required>`;
    node.innerHTML = newAttribute;
    attributes.appendChild(node);
}


//creates a list of the user already made stock objects
function getStockObjects(){
    fetch(api+'?action=getstockobjects',{credentials: 'include'})
    .then(response => response.json())
    .then(data => {
        const setTheme = localStorage.getItem('Theme');
        let theme = setTheme === "DarkMode" ? "Stock-Item-dark" : "Stock-Item";
        document.getElementById('HomeStockObjects').innerHTML = '';
        console.log(data);

        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            const attributes = JSON.parse(data[i].attributes);
            document.getElementById('HomeStockObjects').innerHTML += 
            `<div class="`+theme+`" onclick="viewObjectData(`+element.barcode+`)">
                <h2 class="ui center aligned header" style="margin-top: 1.7vh;">`+attributes.name+`</h2>
            </div>`;
        }
    });
}

// gets data of single object
// function getObjectData(barcode){

//     fetch(api+'?action=getstockobject&barcode='+barcode,{credentials: 'include'})
//     .then(response => response.json())
//     .then(data => {
//         return JSON.parse(data[0].attributes);
//     });

// }



//populates viewing element with existing object data
async function viewObjectData(barcode){
    let editbuttons = document.getElementById('editItemButtons');
    let node = document.createElement("DIV");
    let newButton = `
    <button type="button" class="ui red button" onclick="deleteItem(${barcode})">
    Delete
    </button>`;
    node.innerHTML = newButton;
    editbuttons.appendChild(node);
    fetch(api+'?action=getstockobject&barcode='+barcode,{credentials: 'include'})
    .then(response => response.json())
    .then(data => {
        document.getElementById('HomeStockObjects').style.display = 'none';
        document.getElementById('editStockObjectForm').style.display = 'block';
        let attributes = JSON.parse(data[0].attributes);
        let newAttributes = document.getElementById('EditAttributes');
        for (const [key, value] of Object.entries(attributes)) {
            console.log(`${key}: ${value}`);
            let node = document.createElement("DIV");
            node.className = 'attribute';
            let newAttribute = `
            <h2 style="margin-top:10px">${key}: ${value}</h2>`;
            node.innerHTML = newAttribute;
            newAttributes.appendChild(node);
            //<input type='text' minlength="2" value="${value}" required> html for Editing
        }
    });
}



//cancels editing of object
function cancelEditItem(){
    document.getElementById('HomeStockObjects').style.display = 'block';
    document.getElementById('editStockObjectForm').style.display = 'none';
    document.getElementById('editItemButtons').innerHTML = `<button type="button" class="ui secondary button" onclick="cancelEditItem()">cancel</button>`;
    document.getElementById('EditAttributes').innerHTML = '';
}

// function editItem(){

// }

function deleteItem(barcode){
    fetch(api+'?action=deletestockobject&barcode='+barcode,{credentials: 'include'})
    .then(function(res){
        if(res.status === 201){
            cancelEditItem();
            getStockObjects();
            alert('item Deleted!')
        }
        else if(res.status === 401){
            alert('failed to delete item');
        }
        else if(res.status === 429){
            newErr('Request Timed Out');
            alert('Too many requests sent, connection has been disconnected');
        }
        else if(res.status === 406){
            newErr("invalid barcode!");
        }
    });
}

function plusOne(){
    document.getElementById('stockCountUpdater').value = parseInt(document.getElementById('stockCountUpdater').value) + 1;
}

function minusOne(){
    let counter = document.getElementById('stockCountUpdater').value;
    if(counter > 0){
        document.getElementById('stockCountUpdater').value = parseInt(document.getElementById('stockCountUpdater').value) - 1;
    }    
}

function changeStock(sign){
    let locationId = document.getElementById("locationDropdown").value;
    let amount = parseInt(document.getElementById('stockCountUpdater').value);
    let barcode = document.getElementById('barcodeHeader').value;
    console.log(barcode);
    fetch(api+'?action=changeStock&barcode='+barcode+'&amount='+amount+'&sign='+sign+'&locationid='+locationId,{credentials: 'include'})
    .then(function(res){
        document.getElementById('stockCountUpdater').value = 0;
        if(res.status === 201){
            alert('Item Changed!');
        }
        else if(res.status === 401){
            alert('failed to change item');
        }
        else if(res.status === 429){
            newErr('Request Timed Out');
        }
        else if(res.status === 406){
            alert("invalid barcode or negative amount");
        }
        cancelUpdateStock();
    });
}

