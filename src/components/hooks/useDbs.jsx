import React, { useEffect, useState } from 'react'
import Axios from 'axios'

export default function(socket) {
    const [dbs, setDBs] = useState([])

    useEffect(()=>{
        console.log("socket made for dbs")
        Axios.get(process.env.REACT_APP_SERVER + "/data/drivebys/all")
        .then(({ data }) => {
            setDBs(data.docs)
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

    useEffect(()=>{
        socket.on("update-db", (newDB) => {
            Axios.get(`${process.env.REACT_APP_SERVER}/data/drivebys/byId/${newDB}`).then(({data})=>{
                if(data){
                    setDBs((prevDbs) => prevDbs.map((db)=>{
                        if(db._id === data._id){
                            return {
                                ...db,
                                ...data
                            }
                        } else
                            return db;
                    }))
                }
            })
        })
        socket.on("new-db", (newDB) => {
            Axios.get(`${process.env.REACT_APP_SERVER}/data/drivebys/byId/${newDB}`).then(({data})=>{
                if(data){
                    setDBs((prevDbs) => [...prevDbs, data])
                }
            })
        })
        socket.on("delete-db", (newDB) => {
            setDBs((prevDbs)=>{
                return prevDbs.filter((db)=> db._id !== newDB )
            })
        })

    }, [socket])
    return dbs
}