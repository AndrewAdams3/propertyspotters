import React from 'react';
import Container from 'react-bootstrap/Container';

import LineChart from 'react-linechart';
import '../../../node_modules/react-linechart/dist/styles.css';

export default function DBView({data}){

    const dates = [];
    data.forEach(db => {
        const next = new Date(db.date).toLocaleDateString()
        var found = false;
        if(dates.length >= 1){
            for(const date of dates){
                if(date.date === next){
                    date.num += 1;
                    found = true;
                    break;
                }
            }
            if(!found) dates.push({date: next, num: 1});
        } else dates.push({date: next, num: 1})
    });
    const points = dates.map((dt, i)=>{
        const d = new Date(dt.date);
        return{
            x: `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`,
            y: dt.num,
            date: d
        }
    })

    const dataPoints = [{
        color: "steelBlue",
        points: points,
    }]
    console.log("dp", dataPoints)
     return(
        <Container className="h-100 w-100" style={{overflowX: "scroll"}}>
            <LineChart 
                width={`${points.length * 100}px`}
                height={400}
                data={dataPoints}
                isDate={true}
                xLabel="Date"
                yLabel="Number"
                ticks={points.length / 2}
                yMin="0"
                interpolate="linear"
                margins={{top: 0, right: 0, bottom: 0, left: 0}}
                onPointHover={(obj) => `Date: ${new Date(obj.date).toLocaleDateString()}<br />Number: ${obj.y}`}
            />
        </Container>
    )
}