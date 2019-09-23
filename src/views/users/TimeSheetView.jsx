import React, { Fragment, useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

import './users.css';

const TimeSheetView = ({data, user, refresh}) => {
    const MSperH = (60 * 60 * 1000);
    const [Times, setTimes] = useState(data);
    const [Total, setTotal] = useState((data.reduce((total, curr) => { return total + curr.totalTime }, 0) / MSperH).toFixed(3))
    const [SDate, setSDate] = useState(new Date());
    const [EDate, setEDate] = useState(new Date());
    const didMount = useRef(false);

    const edit = require('../../config/images/edit.png');

    useEffect(()=>{
        if(didMount.current){
            Axios.get(`${process.env.REACT_APP_SERVER}/data/times/byId/${user._id}/${SDate}/${EDate}`)
                .then(({data})=> {
                    if(data){ 
                        setTimes(data);
                        if(data.length){
                            setSDate(new Date(data[data.length-1].startTime));
                            setEDate(new Date(data[0]))
                        }
                        setTotal((data.reduce((total, curr) => { return total + curr.totalTime }, 0) / MSperH).toFixed(3))
                    }
                })
        } else didMount.current = true;
    }, [SDate, EDate]);

    const TimeRow = ({time, index}) => {
        const [hover, setHover] = useState("none")
        const [toEdit, setEdit] = useState("none")
        const [date, setDate] = useState()
        const [newTime, setTime] = useState()
        const [place, setPlace] = useState("");
        const [err, setErr] = useState("")

        const handlePress = async (e, field) => {
            e.preventDefault();
            switch(field){
                case 'st':
                    if(date && newTime){
                        setErr("")
                        let d = new Date(date);
                        let dt = new Date(`${d.getMonth()+1}/${d.getDate()+1}/${d.getFullYear()},${newTime}`).getTime()
                        await Axios.put(`${process.env.REACT_APP_SERVER}/data/times/update-time/start`, {
                            id: time._id,
                            startTime: dt,
                        });
                        setEdit("")
                        let newTimes = Times
                        newTimes[index].startTime = dt;
                        setTimes(newTimes);
                        refresh()
                    } else setErr("please provide time and date to submit");
                    break;
                case 'et':
                    if(date && newTime){
                        setErr("")
                        let d = new Date(date);
                        let dt = new Date(`${d.getMonth()+1}/${d.getDate()+1}/${d.getFullYear()},${newTime}`).getTime()
                        await Axios.put(`${process.env.REACT_APP_SERVER}/data/times/update-time/end`, {
                            id: time._id,
                            endTime: dt,
                        });
                        console.log('req sent');
                        setEdit("")
                        let newTimes = Times
                        newTimes[index].endTime = dt;
                        setTimes(newTimes);
                        refresh()
                    } else setErr("please provide time and date to submit");
                    break;
                default:
                    break;
            }
        }
        return(
        <tr>
            <td>
                <span>{new Date(time.startTime).toLocaleDateString()}</span>
            </td>
            <td style={{position: "relative"}} onMouseEnter={()=>setHover("st")} onMouseLeave={()=>setHover("")}>
                <span>{new Date(time.startTime).toLocaleString()}</span>
                <img src={edit} alt="edit" className="edit-icon" style={{display: hover==='st' ? "flex" : "none"}} onClick={()=>setEdit(toEdit === 'st' ? "none" : 'st')}/>
                { toEdit==='st' && <>
                    <input type="date" style={{width: "100%", display: "block"}} name="date" onChange={(e)=>setDate(e.target.value)}/>
                    <input type="time" name="appt" style={{width: "65%"}} onChange={(e)=>setTime(e.target.value)}/>
                    <input type="submit" value="&#10004;" style={{width: "35%"}} onClick={(e)=>handlePress(e, "st")}/> 
                    <span style={{display: err.length ? "block" : "none", color: "red", fontSize: 10, textAlign: "center"}}>{err}</span></>
                }
            </td>
            <td style={{position: "relative"}} onMouseEnter={()=>setHover('et')} onMouseLeave={()=>setHover("")}>
                <span>{new Date(time.endTime).toLocaleString()}</span>
                <img src={edit} alt="edit" className="edit-icon" style={{display: hover==='et' ? "flex" : "none"}} onClick={()=>setEdit(toEdit === 'et' ? "none" : 'et')}/>
                { toEdit==='et' && <>
                    <input type="date" style={{width: "100%", display: "block"}} name="date" onChange={(e)=>setDate(e.target.value)}/>
                    <input type="time" name="appt" style={{width: "65%"}} onChange={(e)=>setTime(e.target.value)}/>
                    <input type="submit" value="&#10004;" style={{width: "35%"}} onClick={(e)=>handlePress(e, "et")}/> </>
                }
            </td>
            <td>
                <span>{(time.totalTime / MSperH).toFixed(3)}</span>
            </td>
            <td style={{position: "relative", maxWidth: "15vw"}} onMouseEnter={()=>setHover(`${index}-sl`)} onMouseLeave={()=>setHover("")}>
                <span>{time.startLocation}</span>
                {/* <img src={edit} alt="edit" className="edit-icon" style={{display: hover===`${index}-sl` ? "flex" : "none"}}/> */}
            </td>
            <td style={{position: "relative", maxWidth: "15vw"}} onMouseEnter={()=>setHover(`${index}-el`)} onMouseLeave={()=>setHover("")}>
                <span>{time.endLocation}</span>
                {/* <img src={edit} alt="edit" className="edit-icon" style={{display: hover===`${index}-el` ? "flex" : "none"}}/> */}
            </td>
        </tr>
        )
    }
    return (
    <Fragment>
        <div style={{flexDirection: "column"}}>
            <h3 className="mx-auto" style={{position: "absolute"}}>Start:</h3>
            <Form.Control className="w-50 mx-auto" type="date" placeholder="date" onChange={(e)=>setSDate(new Date(e.target.value))}/><br/>
            <h3 className="mx-auto" style={{position: "absolute"}}>End:</h3>
            <Form.Control className="w-50 mx-auto" type="date" placeholder="date" onChange={(e)=>setEDate(new Date(e.target.value))}/>
            <h3 className="mx-auto timeHeadText w-100 mt-3">Total Hours: {Total}</h3>
        </div>
        <Table striped hover responsive>
            <thead>
            <tr>
                <th>Date</th>
                <th>Clock in</th>
                <th>Clock out</th>
                <th>Total Time</th>
                <th>Start Location</th>
                <th>End Location</th>
            </tr>
            </thead>
            <tbody>
            {Times.map((time, index)=> {
                return(
                    <TimeRow time={time} index={index} key={index}/>
                )
            })}
            </tbody>
        </Table>
    </Fragment>
    )
  }

  export default (TimeSheetView);