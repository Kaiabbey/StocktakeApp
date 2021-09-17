onload();

function toggle(){
    $('.ui.sidebar').sidebar('toggle');
};

$('#email,#firstname,#lastname,#password').keypress(function(){clearErr()});

$('#password').keyup(function(){
    var pass = document.getElementById('password');
    var regex = new RegExp('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&?])([^</>{}]){8,16}');
    if(regex.test(pass.value) == false){
        pass.style.border  = '2px solid red';
    }
    else{
        pass.style.border  = '';
    }

});

$('#email').keyup(function(){
    var pass = document.getElementById('email');
    var regex = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    if(regex.test(pass.value) == false){
        pass.style.border  = '2px solid red';
    }
    else{
        pass.style.border  = '';
    }

});

$('#firstname,#lastname').keyup(function(event){
    var regex = new RegExp('(?=.[A-Za-z])([^0-9$&+,:;=?@#|"_</>.\-^()%!`~]){2,16}');
    var name = document.getElementById(event.target.id);
    if(regex.test(name.value)){
        name.style.border = '';
    }
    else{
        name.style.border  = '2px solid red';
    }

});

$('#Logoutbtn').click(function(){
    toggle();
    clearform();
    setSection('LoginSection');
    fetch('/php/StocktakeApp/Stocktakeapi/api?action=logout');
});

$('#Stockbtn,#Homebtn,#Settingsbtn,#Scanbtn,#Adminbtn').click(function(Event){
    var target = Event.target.id.replace('btn','');
    target = target.replace('Iele','');
    console.log(target);
    setSection(target);
    toggle();
})

function ApiLogin()
{
    if(document.getElementById('email').value == '' || document.getElementById('password').value == ''){
        newErr('Empty Credentials')
    }
    else{
        clearErr();
        var spinner = document.getElementById('spinner');
        var data = new FormData();
        spinner.style.display = 'block';
        data.append('email', document.getElementById('email').value);
        data.append('password', document.getElementById('password').value);
        
        fetch('/php/StocktakeApp/Stocktakeapi/api?action=login',{method: 'post', body: data})
        .then(function(res){
                    if(res.status === 201){
                        setSection('Home');
                        getlocations();
                        clearform();
                        checkadmin();
                        currentuser();
                    }
                    else if(res.status === 400){
                        newErr('Invalid Credentials');

                    }
                    else if(res.status === 429){
                        newErr('Request Timed Out');
                        alert('Too many requests sent, connection has been disconnected');
                    }
                    else if(res.status === 402){
                        alert('invalid data');
                    }
                    spinner.style.display = 'none';
                    logdata('login',400);
                });
    }
}

function ApiRegister(){
    clearErr()
    console.log("reg start");
    var data = new FormData();
    data.append('password', document.getElementById('password').value);
    data.append('email', document.getElementById('email').value);
    data.append('firstname', document.getElementById('firstname').value);
    data.append('lastname', document.getElementById('lastname').value);
    clearform();
    fetch('/php/StocktakeApp/Stocktakeapi/api?action=register',{method: 'post', body: data})
    .then(function(res){
                console.log('post resp');
                if(res.status === 201){
                    LoginUiSwap('loginui');
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
            }).catch(newErr('Failed Fetch'));
    
}


function LoginUiSwap(ui){
    clearErr();
    clearform();
    document.getElementById('registerui').style.display = 'none';
    document.getElementById('loginui').style.display = 'none';
    document.getElementById(ui).style.display = 'block';

    if(document.getElementById('registerui').style.display == 'block'){
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

function onload(){
    setSection("LoginSection");
    fetch('/php/StocktakeApp/Stocktakeapi/api?action=isloggedin')
    .then(function(res){
        if(res.status === 201){
            setSection('Home');
            checkadmin();
            currentuser();
            getlocations();
        }
        else if(res.status === 429){
            setSection('LoginSection');
            newErr('Request Timed Out');
            alert('Too many requests sent, connection has been disconnected');
        }
    })
}

function clearform(){
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
    if(open == 'Scan'){
        startscanner();
    }
}

function checkadmin(){
    fetch('/php/StocktakeApp/Stocktakeapi/api?action=checkadmin')
    .then(function(res){
        if(res.status === 201){
           document.getElementById('Adminbtn').style.display = 'block';
           alluser();
        }
        else{
            document.getElementById('Adminbtn').style.display = 'none'; 
        }
    })
}

function currentuser(){
    fetch('/php/StocktakeApp/Stocktakeapi/api?action=currentuser')
    .then(response => response.json())
     .then(data => {
         console.log(data);
         document.getElementById('currentName').innerHTML = data.firstname +" "+ data.lastname;
         document.getElementById('currentRole').innerHTML = data.role;
         document.getElementById('currentDate').innerHTML = data.datecreated;
         document.getElementById('currentEmail').innerHTML = data.email;
        });
}

function alluser(){
    fetch('/php/StocktakeApp/Stocktakeapi/api?action=alluser')
    .then(response => response.json())
     .then(data => {
         console.log(data);
         document.getElementById('allUsers').innerHTML = '';
         data.forEach(d => {
            document.getElementById('allUsers').innerHTML += 
            `<div class="userlist">
                <div class="flex" style="justify-content:flex-start;">
                    <h3 style="margin-right:10px;">Name:</h3>
                    <div>` + d.firstname +" "+ d.lastname +`</div>
                </div>
                <div class="flex" style="justify-content:flex-start;">
                    <h3 style="margin-right:10px;">Email:</h3>
                    <div>` + d.email + `</div>
                </div>
                <button type='button' class="ui button" onclick="ViewUser('`+d.user_id+`')">Edit</button>
                <button type='button' class="ui red button" onclick="DeleteUser('`+d.user_id+`')">Delete</button>
            </div>`;
         });
        });
}

function ViewUser(id){
    document.getElementById('allUsers').style.display = 'none';
    document.getElementById('editheader').style.display = 'none';
    var url = '/php/StocktakeApp/Stocktakeapi/api?action=viewuser&user_id=' + id;
    fetch(url)
    .then(response => response.json())
     .then(data => {
        console.log(data);
        document.getElementById('edituser').style.display = 'block';
        document.getElementById('userFirstname').value = data.firstname;
        document.getElementById('userLastname').value = data.lastname;
        document.getElementById('userEmail').value = data.email;
        document.getElementById('userRole').value = data.role;
        document.getElementById('editui'). innerHTML += `<button type='button' class="ui button primary" onclick="EditUser(`+id+`)">Save Changes</button>`;
     });
}

function DeleteUser(id){
    var url = '/php/StocktakeApp/Stocktakeapi/api?action=deleteuser&user_id=' + id;
    fetch(url)
    .then(function(res){
        if(res.status === 201){
            checkadmin();
            alert('User deleted');
         }
         else{
            alert('User not deleted');
         }
    });
}

function locationform(){
    document.getElementById('locationform').style.display = 'block';
    document.getElementById('stockitems').style.display = 'none';

}

function addlocation(){ 
    var locationname = document.getElementById('LocationName').value;
    var url = '/php/StocktakeApp/Stocktakeapi/api?action=addlocation&locationname=' +locationname;
    fetch(url)
    .then(function(res){
        if(res.status === 201){
            alert('location added');
        }
        else{
            alert('location not added');
        }
        getlocations();
        canceladdlocation();
    })
}

function getlocations(){
    fetch('/php/StocktakeApp/Stocktakeapi/api?action=getlocations')
    .then(response => response.json())
     .then(data => {
        document.getElementById('stockitems').innerHTML = '<div class="StockItem" onclick="locationform()"><h2 class="ui center aligned header" style="margin-top: 1.5vh;">Add New Location</h2></div>';
        console.log(data);
        data.forEach(d => {
            document.getElementById('stockitems').innerHTML += `<div class="StockItem" onclick="GetLocationStock(`+d.location_id+`)"><h2 class="ui center aligned header" style="margin-top: 1.5vh;">`+d.location_name+`</h2></div>`;
        });

     });
}

function canceladdlocation(){
    document.getElementById('locationform').style.display = 'none';
    document.getElementById('stockitems').style.display = 'block';
    document.getElementById('LocationName').value = '';
}

function GetLocationStock(location){
    var url = '/php/StocktakeApp/Stocktakeapi/api?action=getlocationstock&location='+ location;
    fetch(url)
        .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    attributes = JSON.parse(data[i].attributes);
                    for (const [key, value] of Object.entries(attributes)) {
                        console.log(`${key}: ${value}`);
                      }
                    console.log(attributes);
                    document.getElementById('locationstock').innerHTML +=  
                    `<div class="StockItem">
                        <h2 class="ui center aligned header" style="margin-top: 1.5vh;">`
                        + attributes.name+": "+data[i].stock_amount+
                        `</h2>
                    </div>`           
                }
                document.getElementById('locationstock').innerHTML += `<button type='button' class="ui button center aligned" style="width:80vw;margin:10vw;" onclick="leavelocation()">Back</button>`;
                document.getElementById('stockitems').style.display = 'none';
                document.getElementById('locationstock').style.display = 'block';
                document.getElementById('stocksidebar').style.display = 'none';
                console.log(data);
            });
}

function leavelocation(){
    document.getElementById('locationstock').innerHTML = '';
    document.getElementById('stockitems').style.display = 'block';
    document.getElementById('locationstock').style.display = 'none';
    document.getElementById('stocksidebar').style.display = 'block';
}

function EditUser(id){
//a function to edit a user will need to check if admin if user_id doesnt equal logged in user
    console.log(id);
    var data = new FormData();
    data.append('email', document.getElementById('userEmail').value);
    data.append('firstname', document.getElementById('userFirstname').value);
    data.append('lastname', document.getElementById('userLastname').value);
    data.append('role', document.getElementById('userRole').value);
    var url = '/php/StocktakeApp/Stocktakeapi/api?action=edituser&id=' + id;
    fetch(url,{method: 'post', body: data})
    .then(function(res){
        checkadmin();
        CancelEdit();
        if(res.status === 201){
            alert('user edited');
         }
         else{
            alert('Edit failed');
         }
    });
}

function CancelEdit(){
    document.getElementById('edituser').style.display = 'none';
    document.getElementById('editui'). innerHTML = `<button type='button' class="ui button secondary" onclick="CancelEdit()">Cancel</button>`;
    document.getElementById('userFirstname').value = '';
    document.getElementById('userLastname').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userRole').value = '';
    document.getElementById('allUsers').style.display = 'block';
    document.getElementById('editheader').style.display = 'block';
}



//section for scanning

function startscanner(){
    var video = document.querySelector("#videoElement");

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
