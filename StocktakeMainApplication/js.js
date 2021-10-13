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
 
onLoad();

function toggle(){
    $('.ui.sidebar').sidebar('toggle');
}

$('#email,#firstname,#lastname,#password').keypress(function(){clearErr()});

$('#password').keyup(function(){
    let pass = document.getElementById('password');
    let regex = new RegExp('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&?])([^</>{}]){8,16}');
    if(regex.test(pass.value) === false){
        pass.style.border  = '2px solid red';
    }
    else{
        pass.style.border  = '';
    }

});

$('#email').keyup(function(){
    let pass = document.getElementById('email');
    let regex = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    if(regex.test(pass.value) === false){
        pass.style.border  = '2px solid red';
    }
    else{
        pass.style.border  = '';
    }

});

$('#firstname,#lastname').keyup(function(event){
    let regex = new RegExp('(?=.[A-Za-z])([^0-9$&+,:;=?@#|"_</>.\-^()%!`~]){2,16}');
    let name = document.getElementById(event.target.id);
    if(regex.test(name.value)){
        name.style.border = '';
    }
    else{
        name.style.border  = '2px solid red';
    }

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
    fetch('../Stocktakeapi/api?action=logout');
}

function apiLogin(){
    if(document.getElementById('email').value === '' || document.getElementById('password').value === ''){
        newErr('Empty Credentials')
    }
    else{
        clearErr();
        let data = new FormData();
        let spinner = document.getElementById('spinner');
        spinner.style.display = 'block';
        data.append('email', document.getElementById('email').value);
        data.append('password', document.getElementById('password').value);
        
        fetch('../Stocktakeapi/api?action=login',{method: 'post', body: data})
        .then(function(res){
            if(res.status === 201){
                setSection('Home');
                getLocations();
                clearForm();
                checkAdmin();
                currentUser();
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
            else if(res.status === 402){
                alert('invalid data');
                localStorage.setItem('LoggedIn', false);
            }
            spinner.style.display = 'none';
        });
    }
}

function ApiRegister(){
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
    fetch('../Stocktakeapi/api?action=register',{method: 'post', body: data})
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
        else if(res.status === 402){
            newErr('invalid data');
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
    }
    else{
        fetch('../Stocktakeapi/api?action=isloggedin')
        .then(function(res){
            if(res.status === 201){
                setSection('Home');
                checkAdmin();
                currentUser();
                getLocations();
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
    document.getElementById(open).style.display = 'block';
    if(open === 'Scan'){
        startScanner();
    }
}

function checkAdmin(){
    fetch('../Stocktakeapi/api?action=checkadmin')
    .then(function(res){
        if(res.status === 201){
           document.getElementById('Adminbtn').style.display = 'block';
           allUser();
        }
        else{
            document.getElementById('Adminbtn').style.display = 'none'; 
        }
    })
}

function currentUser(){
    fetch('../Stocktakeapi/api?action=currentuser')
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

function allUser(){
    let spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    fetch('../Stocktakeapi/api?action=alluser')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById('allUsers').innerHTML = '';
        data.forEach(d => {
        document.getElementById('allUsers').innerHTML += 
        `<div class="user-list">
            <div class="flex" style="justify-content:flex-start;">
                <h3 style="margin-right:10px;">Name:</h3>
                <div>` + d.firstname +" "+ d.lastname +`</div>
            </div>
            <div class="flex" style="justify-content:flex-start;">
                <h3 style="margin-right:10px;">Email:</h3>
                <div>` + d.email + `</div>
            </div>
            <button type='button' class="ui button" onclick="viewUser('`+d.user_id+`')">Edit</button>
            <button type='button' class="ui red button" onclick="deleteUser('`+d.user_id+`')">Delete</button>
        </div>`;
        });
        spinner.style.display = 'none';
    });
}

function viewUser(id){
    document.getElementById('allUsers').style.display = 'none';
    document.getElementById('editheader').style.display = 'none';
    let spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    let url = '../Stocktakeapi/api?action=viewuser&user_id=' + id;
    fetch(url)
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

function deleteUser(id){
    let url = '../Stocktakeapi/api?action=deleteuser&user_id=' + id;
    let spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    fetch(url)
    .then(function(res){
        if(res.status === 201){
            checkAdmin();
            alert('User deleted');
         }
         else{
            alert('User not deleted');
         }
         spinner.style.display = 'none';
    });
}

function locationForm(){
    document.getElementById('locationform').style.display = 'block';
    document.getElementById('stockitems').style.display = 'none';

}

function addLocation(){ 
    let locationname = document.getElementById('LocationName').value;
    let url = '../Stocktakeapi/api?action=addlocation&locationname=' +locationname;
    let spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    fetch(url)
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
    fetch('../Stocktakeapi/api?action=getlocations')
    .then(response => response.json())
    .then(data => {
        const setTheme = localStorage.getItem('Theme');
        let theme = setTheme === "DarkMode" ? "Stock-Item-dark" : "Stock-Item";
        document.getElementById('stockitems').innerHTML = '<div class='+theme+' onclick="locationForm()"><h2 class="ui center aligned header" style="margin-top: 1.7vh;">Add New Location</h2></div>';
        console.log(data);
        data.forEach(d => {
            document.getElementById('stockitems').innerHTML += `<div class=`+theme+` onclick="getLocationStock(`+d.location_id+`)"><h2 class="ui center aligned header" style="margin-top: 1.7vh;">`+d.location_name+`</h2></div>`;
        });
    });
}

function cancelAddLocation(){
    document.getElementById('locationform').style.display = 'none';
    document.getElementById('stockitems').style.display = 'block';
    document.getElementById('LocationName').value = '';
}

function getLocationStock(location){
    let url = '../Stocktakeapi/api?action=getlocationstock&locationid='+ location;
    let spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    fetch(url)
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

function editUser(id){
//a function to edit a user will need to check if admin if user_id doesnt equal logged in user
    console.log(id);
    let data = new FormData();
    data.append('email', document.getElementById('userEmail').value);
    data.append('firstname', document.getElementById('userFirstname').value);
    data.append('lastname', document.getElementById('userLastname').value);
    data.append('role', document.getElementById('userRole').value);
    let url = '../Stocktakeapi/api?action=edituser&id=' + id;
    let spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    fetch(url,{method: 'post', body: data})
    .then(function(res){
        checkAdmin();
        cancelEdit();
        if(res.status === 201){
            alert('user edited');
        }
        else{
            alert('Edit failed');
        }
        spinner.style.display = 'none';
    });
}

function cancelEdit(){
    document.getElementById('edituser').style.display = 'none';
    document.getElementById('editui'). innerHTML = `<button type='button' class="ui button secondary" onclick="cancelEdit()">Cancel</button>`;
    document.getElementById('userFirstname').value = '';
    document.getElementById('userLastname').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userRole').value = '';
    document.getElementById('allUsers').style.display = 'block';
    document.getElementById('editheader').style.display = 'flex';
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
    }
    else if(id === "LightMode"){
        document.getElementById("pusher").className = "pusher pusher-style";
        document.getElementById("body").className = "body pushable";
        document.getElementById("loginform").className = "ui form generic-form";
        document.getElementById("editform").className = "ui form generic-form";
        document.getElementById("locationform").className = "ui form location-form";

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

function startScanner(){
    let video = document.querySelector("#videoElement");

    if (navigator.mediaDevices.getUserMedia){
        h = window.innerHeight;
        w = window.innerWidth;
        console.log('Height:'+h+' Width:'+w)
        navigator.mediaDevices.getUserMedia({ video: {height:h, width:w} })
            .then(function (stream) {
            video.srcObject = stream;
            })
            .catch(function (err0r) {
            console.log("Something went wrong!");
            });
    }
}


// Plain one:
//const barcodedetector = new BarcodeDetector();


// let barcodeDetector = new BarcodeDetector();
// // Assuming |theImage| is e.g. a &lt;img> content, or a Blob.

// barcodeDetector.detect(theImage)
// .then(detectedCodes => {
//   for (const barcode of detectedCodes) {
//     console.log(' Barcode ${barcode.rawValue}' +
//         ' @ (${barcode.boundingBox.x}, ${barcode.boundingBox.y}) with size' +
//         ' ${barcode.boundingBox.width}x${barcode.boundingBox.height}');
//   }
// }).catch(() => {
//   console.error("Barcode Detection failed, boo.");
// })
