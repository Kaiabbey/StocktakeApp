import React from 'react'

export const EditUserForm = ({editUser, cancelEdit}) => {


    return (
        <form id='editform' class="ui form generic-form">
          <h2>Edit User</h2>
          <div class="field">
              <label>Email:<i class="envelope outline icon"></i></label>
              <input type='email' id='userEmail' required></input>
          </div>
          <div class="field">
              <label>First Name:</label>
              <input type='text' minLength="2" id='userFirstname' required></input>
          </div>
          <div class="field">
              <label>Last Name:</label>
              <input type='text' minLength="2" id='userLastname' required></input>
          </div>
          <div class="field">
              <label>Role:<i class="user tag icon"></i></label>
              <input type='text' pattern="(^user$)|(^admin$)" id='userRole' data-bouncer-message="please input 'user' or 'admin'." required></input>
          </div>
          <div id='editui' class='field loginui'>
              <button type='button' class="ui button secondary" id="cancelEdit" onClick={() => cancelEdit()}>Cancel</button>
              <button type='button' class="ui button primary" value='0' id="edituserbtn" onClick={() => editUser()} >Save Changes</button>
          </div>
        </form>
    )
}

export default EditUserForm
