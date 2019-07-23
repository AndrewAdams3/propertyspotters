import React, {Fragment, useState, useEffect, useRef, memo} from 'react';
import Axios from 'axios';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

const TimeSheetView = ({data, user}) => {
    const MSperH = (60 * 60 * 1000);
    const [Times, setTimes] = useState(data);
    const [Total, setTotal] = useState((data.reduce((total, curr) => { return total + curr.totalTime }, 0) / MSperH).toFixed(3))
    const [SDate, setSDate] = useState(new Date(data[data.length-1].startTime));
    const [EDate, setEDate] = useState(new Date(data[0].startTime));
    const didMount = useRef(false);


    useEffect(()=>{
        if(didMount.current){
            Axios.get(`${process.env.REACT_APP_SERVER}/data/times/byId/${user._id}/${SDate}/${EDate}`)
                .then(({data})=> {
                    if(data){ 
                        setTimes(data);
                        setTotal((data.reduce((total, curr) => { return total + curr.totalTime }, 0) / MSperH).toFixed(3))
                    }
                })
        } else didMount.current = true;
    }, [SDate, EDate]);
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
                <th>In Location</th>
                <th>Out Location</th>
            </tr>
            </thead>
            <tbody>
            {Times.map((time, index)=> {
                return(
                    <tr key={index}>
                        <td>{new Date(time.startTime).toLocaleDateString()}</td>
                        <td>{new Date(time.startTime).toLocaleString()}</td>
                        <td>{new Date(time.endTime).toLocaleString()}</td>
                        <td>{(time.totalTime / MSperH).toFixed(3)}</td>
                        <td>{time.startLocation}</td>
                        <td>{time.endLocation}</td>
                    </tr>
                )
            })}
            </tbody>
        </Table>
    </Fragment>
    )
  }

  export default (TimeSheetView);