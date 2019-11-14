import { useEffect, useState } from 'react'
import Axios from 'axios'

import {useStateValue} from '../../context/State'

export default function() {
    const [{socket},] = useStateValue()
    const [tracks, setTracks] = useState([])

    useEffect(()=>{
        Axios.get(process.env.REACT_APP_SERVER + "/data/tracks")
        .then(({ data }) => {
            setTracks(data);
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

    useEffect(()=>{
        socket.on("update-track", (newTrack) => {
            Axios.get(`${process.env.REACT_APP_SERVER}/data/tracks/byId/${newTrack}`).then(({data})=>{
                if(data){
                    setTracks((prevtracks) => prevtracks.map((track)=>{
                        if(track._id === data._id){
                            return {
                                ...track,
                                ...data
                            }
                        } else
                            return track;
                    }))
                }
            })
        })
        socket.on("new-track", (newTrack) => {
            Axios.get(`${process.env.REACT_APP_SERVER}/data/tracks/byId/${newTrack}`).then(({data})=>{
                if(data){
                    setTracks((prevtracks) => [...prevtracks, data])
                }
            })
        })
        socket.on("delete-track", (newTrack) => {
            setTracks((prevtracks)=>{
                return prevtracks.filter((track)=> track._id !== newTrack )
            })
        })

    }, [socket])

    return tracks
}