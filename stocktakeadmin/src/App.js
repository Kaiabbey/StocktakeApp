import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import Users from './components/Users';
import EditUserForm from './components/EditUserForm';

function App() {

  const [users, setUsers] = useState([]);

  const api ='http://localhost:80/StocktakeApp/StocktakeAPI/index';

  //const api ='/StocktakeAPI/index.php';
  
  useEffect(() => {
    alluser();
  }, []);

  const alluser = () => {
    axios.get(api+'?action=alluser', {withCredentials:true}).then(
      (response)=>{
        setUsers(response.data);
        console.log(response.data); 
      })
  }

  const viewUser = (user) => {
    //brings up form to show full user data for editing
    document.getElementById('allUsers').style.display = 'none';
    document.getElementById('userFirstname').value = user.firstname;
    document.getElementById('userLastname').value = user.lastname;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('edituser').style.display = 'block';
    document.getElementById('edituserbtn').setAttribute('value', user.user_id);
  };

  const deleteUser = (id) => {
    let url = api+'?action=deleteuser&user_id=' + id;
    let spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    fetch(url,{credentials: 'include'})
    .then(function(res){
        if(res.status === 201){
            alluser();
            alert('User deleted');
         }
         else{
            alert('User not deleted');
         }
         spinner.style.display = 'none';
    });
  };

  const editUser  = () => {
    const id = document.getElementById('edituserbtn').value;
    console.log("the user you're editing is : "+ id);
    //a function to edit a user will need to check if admin if user_id doesnt equal logged in user
    let data = new FormData();
    data.append('email', document.getElementById('userEmail').value);
    data.append('firstname', document.getElementById('userFirstname').value);
    data.append('lastname', document.getElementById('userLastname').value);
    data.append('role', document.getElementById('userRole').value);
    let url = api+'?action=edituser&user_id=' + id;
    let spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    fetch(url,{method: 'post', body: data, credentials: 'include'})
    .then(function(res){
        alluser();
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

  const cancelEdit = () => {
    document.getElementById('edituser').style.display = 'none';
    document.getElementById('userFirstname').value = '';
    document.getElementById('userLastname').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userRole').value = '';
    document.getElementById('allUsers').style.display = 'block';
    document.getElementById('editheader').style.display = 'flex';
}

// to do!!! make the edit form have a button that edits the user currently viewed
  return (
    <div className="App">
      <div id='editheader' class="flex">
        <h2 class='ui header'>
          <i class="house user icon">
            <div class='content'>Admin</div>
          </i>
        </h2>
        <button class="ui button" id="adminSideBar">
          <i class="bars icon"></i>
        </button>  
      </div>
      <div id='allUsers'>
        <Users users={users}
               viewUser={viewUser}
               deleteUser={deleteUser}
        />
      </div>
      <div class="edit-user" id='edituser'>
        <EditUserForm
            editUser = {editUser}
            cancelEdit = {cancelEdit}

        />
      </div>
    </div>
  );
}

export default App;
