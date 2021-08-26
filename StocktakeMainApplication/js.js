onload();

function toggle(){
    $('.ui.sidebar').sidebar('toggle');
};

$('#email,#firstname,#lastname,#password').keypress(function(){clearErr()});

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
                        clearform();
                    }
                    else if(res.status === 400){
                        newErr('Invalid Credentials');

                    }
                    else if(res.status === 429){
                        newErr('Request Timed Out');
                        alert('Too many requests sent, connection has been disconnected');
                    }
                    spinner.style.display = 'none';
                    checkadmin();
                    currentuser();
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
         data.forEach(d => {
            document.getElementById('allUsers').innerHTML += 
            `<div>
                <h3>Name:</h3>
                <div>` + d.firstname + d.lastname +`</div>
                <h3>Email:</h3>
                <div>` + d.email + `</div>
                <button type='button' class="ui button" onclick="ViewUser('`+d.user_id+`')">Edit</button>
            </div>`;
         });
        });
}

function ViewUser(id){
    document.getElementById('allUsers').style.display = 'none';
    document.getElementById('editheader').style.display = 'none';
    var url = '/php/StocktakeApp/Stocktakeapi/api?action=edituser&user_id=' + id;
    fetch(url)
    .then(response => response.json())
     .then(data => {
        console.log(data);
        document.getElementById('edituser').style.display = 'block';
        document.getElementById('userFirstname').value = data.firstname;
        document.getElementById('userLastname').value = data.lastname;
        document.getElementById('userEmail').value = data.email;
        document.getElementById('userRole').value = data.role;
     });
}

function EditUser(){

}



