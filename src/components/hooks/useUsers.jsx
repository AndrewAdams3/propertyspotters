import { useEffect, useState } from 'react'
import Axios from 'axios'

import {useStateValue} from '../../context/State'

export default function() {
    const [{socket},] = useStateValue()
    const [users, setUsers] = useState([])

    useEffect(()=>{
        Axios.get(process.env.REACT_APP_SERVER + "/data/users")
        .then(({ data }) => {
            setUsers(data);
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

    useEffect(()=>{
        socket.on("update-user", (newUser) => {
            Axios.get(`${process.env.REACT_APP_SERVER}/data/users/byId/${newUser}`).then(({data})=>{
                if(data){
                    setUsers((prevUsers) => prevUsers.map((user)=>{
                        if(user._id === data._id){
                            return {
                                ...user,
                                ...data
                            }
                        } else
                            return user;
                    }))
                }
            })
        })
        socket.on("new-user", (newUser) => {
            Axios.get(`${process.env.REACT_APP_SERVER}/data/users/byId/${newUser}`).then(({data})=>{
                if(data){
                    setUsers((prevUsers) => [...prevUsers, data])
                }
            })
        })
        socket.on("delete-user", (newUser) => {
            setUsers((prevUsers)=>{
                return prevUsers.filter((user)=> user._id !== newUser )
            })
        })

    }, [socket])

    return users
}