import React from 'react';
import Container from 'react-bootstrap/Container';

import LineChart from 'react-linechart';
import '../../../node_modules/react-linechart/dist/styles.css';

export default function DBView({data}){

    const dates = [];
    const days = Math.ceil((new Date().getTime() - new Date(data[data.length-1].date).getTime()) / (1000 * 60 * 60 * 24))
    for(var i = days; i >= 0; i--) {
        var dt = new Date(data[data.length-1].date);
        dt.setTime(dt.getTime() + (i * 24 * 60 * 60 * 1000));
        dates.push({date: dt, num: 0});
    }
    data.forEach(db => {
        const next = new Date(db.date).toLocaleDateString()
        for(const date of dates){   
            if(new Date(date.date).toLocaleDateString() === next){
                date.num += 1;
                break;
            }
        }
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
     return(
        <Container className="h-100 w-100" style={{overflowX: "scroll"}}>
            <LineChart 
                width={`${points.length * 100}px`}
                height={400}
                data={dataPoints}
                isDate={true}
                xLabel="Date"
                yLabel="Number"
                ticks={days}
                yMin="0"
                interpolate="linear"
                margins={{top: 0, right: 0, bottom: 0, left: 0}}
                onPointHover={(obj) => `Date: ${new Date(obj.date).toLocaleDateString()}<br />Number: ${obj.y}`}
            />
        </Container>
    )
}