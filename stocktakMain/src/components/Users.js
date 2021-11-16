import React from 'react'

export const Users = ({users, viewUser, deleteUser}) => {
 

    return (
        <>
            {
            users.map((user)=>
            <div class="user-list">
            <div class="flex user-panel">
                <h3>Name:</h3>
                <div>{user.firstname} {user.lastname}</div>
            </div>
            <div class="flex user-panel">
                <h3>Email:</h3>
                <div>{user.email}</div>
            </div>
                <button type='button' class="ui button" onClick={() => viewUser(user)}>Edit</button>
                <button type='button' class="ui red button" onClick={() => deleteUser(user.user_id)}>Delete</button>
            </div>
            )}
        </>
    )
}

export default Users
