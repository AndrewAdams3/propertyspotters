import React from 'react';

export default function DBView({data, user}){

    return(
        <div>
            {data.map((db, i)=>db._id)}
            Testing
        </div>
    )
}