import React from 'react';

export default function PersonalView({user}){
    const {email, verified, fName, lName, dateCreated, city, state} = user;
    return(
        <div>
            <h3>{"Email: " + email}</h3>
            <h3>{"First Name: " + fName}</h3>
            <h3>{"Last Name: " + lName}</h3>
            <h3>{"City: " + city}</h3>
            <h3>{"State: " + state}</h3>
        </div>
    )
}