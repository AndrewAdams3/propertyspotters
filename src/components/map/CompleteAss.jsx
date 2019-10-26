import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios'
import useUsers from '../hooks/useUsers'

const capitalize = (string) => {
    return string[0].toUpperCase() + string.slice(1,string.length);
}

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

    const pickDriver = () => {

        const select = (e) => {
            setDriver(e.target.attributes.value.value);
            setEditDriver(false);
            setEditDate(true);
        }
        return (
            <>
            <h3 style={{width: "100%", textAlign: "center"}}>Choose Driver</h3>
            { Users && 
            <ul className="driverList">
                {Users.map((user)=>{
                return (
                    <li key={user._id} value={user._id} className="driverItem" onClick={(e)=> {e.preventDefault(); select(e);}}>
                    {capitalize(user.fName)}
                    <img src={require("../../config/images/plus.jpg")} style={{height: "100%", width: "auto"}} alt="+"/>
                    </li>
                )
                })}
            </ul>
            }
            </>
        )
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
    return (
        <div className="chooseDriver" ref={dRef}>
            {editDriver && pickDriver()}
            {editDate && pickDate()}
        </div>
    )
}