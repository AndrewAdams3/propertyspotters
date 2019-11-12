import PickDriver from '../PickDriver';
import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios'
import useUsers from '../hooks/useUsers'


export default function CompleteAss({close, clear, coords}){
    const Users = useUsers()
    const [driver, setDriver] = useState("")
    const [date, setDate] = useState()
    const [editDriver, setEditDriver] = useState(true)
    const [editDate, setEditDate] = useState(false);
    const dRef = useRef();

    useEffect(()=>{
        const onClick = (e) => {
            console.log("clicked")
            if (!dRef.current.contains(e.target)) {
                console.log("clicked out")
                close()
            }
        }
        window.addEventListener("click", onClick)
        return ()=> window.removeEventListener("click", onClick)
    }, [])

    const handleAssign = (e) => {
        var d = new Date(date);
        const offset = d.getTimezoneOffset() * 60 * 1000;
        const time = d.getTime() + offset;
        Axios.post(`${process.env.REACT_APP_SERVER}/data/assignments/addAreaAssignment`, {
          bounds: coords,
          driver: driver,
          date: new Date(time).toLocaleDateString()
        })
        setEditDate(false)
        clear()
        close()
    }



    const pickDate = () => {
        const select = (e) => {
            setDate(e.target.value)
        }
        return (
            <>
            <h3 style={{width: "100%", textAlign: "center"}}>Select a Date</h3>
            <input type="date" style={{width: "100%", display: "block"}} name="date" onChange={select}/>
            <input type="submit" value="&#10004;" className="date-button" onClick={handleAssign}/>
            </>
        )
    }

    const select = e => {
        setDriver(e.target.attributes.value.value);
        setEditDriver(false);
        setEditDate(true);
    };
    
    return (
        <div className="chooseDriver" ref={dRef}>
            {editDriver && <PickDriver select={select}/>}
            {editDate && pickDate()}
        </div>
    )
}