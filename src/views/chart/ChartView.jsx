import React, {useEffect, useState} from 'react'
import {Container, Row, Col, Card} from 'react-bootstrap'
import HeaderNav from '../../components/header'
import useDbs from '../../components/hooks/useDbs'

import './chart.scss';

export default function ChartView() {
    const iframe = '<iframe style="border: none;border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);" width="100%" height="400" src="https://charts.mongodb.com/charts-varodrive-ptegd/embed/charts?id=94cb494e-75e5-4148-85a7-a4911d46ffec&tenant=59f93d45-c59b-42e4-92dc-f884e44733ef" />'
    const Drivebys = useDbs();
    const [Sfr, setSfr] = useState(0)
    const [Mfr, setMfr] = useState(0)
    const [Com, setCom] = useState(0)
    const [Lot, setLot] = useState(0)
    const [Burned, setBurned] = useState(0)
    const [Boarded, setBoarded] = useState(0)
    const [Vacant, setVacant] = useState(0)
    const [Not_any, setNot_any] = useState(0)

    useEffect(()=>{
        if(Drivebys){
            var sfr=0, mfr=0, lot=0, com=0, none=0, l = Drivebys.length, boarded=0, vacant=0, burned=0, not_any=0;
            Drivebys.forEach((db)=>{
                if(db.type === "SFR" || db.type === "SFH") sfr++;
                else if (db.type === "MFR") mfr++;
                else if(db.type === "Lot") lot++;
                else if (db.type === "COM") com++;
                else none++;

                if(db.boarded) boarded++;
                if (db.burned) burned++;
                if(db.vacant) vacant++;
                if(!db.boarded && !db.burned && !db.vacant) not_any++
            })
            let t = l-none
            setSfr(Math.round(sfr / t * 100))
            setMfr(Math.round(mfr / t * 100))
            setCom(Math.round(com / t * 100))
            setLot(Math.round(lot / t * 100))

            setBoarded(boarded / l * 100)
            setBurned(burned / l * 100)
            setVacant(vacant / l * 100)
            setNot_any(not_any / l * 100)
        }
    }, [Drivebys])
    return (
        <div>
            <HeaderNav fixed="top" color={"black"}/> <br/>
            <Container className="w-100 mx-auto" style={{justifyContent: "center", alignItems: "center", marginTop: "2rem"}}>
                <Row className="w-100 mx-auto" style={{height: 400, marginTop: 60}}>
                    <Col className="w-100 h-100 p-0">
                        <Card className="w-100 h-100 bar-chart border p-2" style={{justifyContent: "center", alignItems: "center"}}>
                            <Card.Title>Types of Drivebys</Card.Title>
                            <ul className="bar-chart">
                                <li>
                                    <span value="Burned" title={`${Math.round(Burned * Drivebys.length / 100)}`} style={{height: `${Burned}%`, justifyContent: "center"}}>{`${Math.round(Burned)}%`}</span>
                                </li>
                                <li>
                                    <span value="Boarded" title={`${Math.round(Boarded * Drivebys.length / 100)}`} style={{height: `${Boarded}%`, justifyContent: "center"}}><p>{`${Math.round(Boarded)}%`}</p></span>
                                </li>
                                <li>
                                    <span value="Vacant" title={`${Math.round(Vacant * Drivebys.length / 100)}`} style={{height: `${Vacant}%`, justifyContent: "center"}}>{`${Math.round(Vacant)}%`}</span>
                                </li>
                                <li>
                                    <span value="None" title={`${Math.round(Not_any * Drivebys.length / 100)}`} style={{height: `${Not_any}%`, justifyContent: "center"}}>{`${Math.round(Not_any)}%`}</span>
                                </li>
                            </ul>
                        </Card>
                    </Col>
                </Row>
                <Row style={{height: 300}}>
                    <Col className="w-100 h-100" style={{ marginBottom: "1rem"}}>
                        <Card style={{ width: "100%", height: "100%" }}>
                            <div style={{height: "100%", width: "100%", display: "flex"}}>             
                                <dl>
                                    <dt className="mx-auto">Distribution of Drivebys</dt>
                                    <dd className={`percentage percentage-${Sfr}`}><span className="text">SFR</span><span className="ptext">{Sfr}%</span></dd>
                                    <dd className={`percentage percentage-${Mfr}`}><span className="text">MFR</span><span className="ptext">{Mfr}%</span></dd>
                                    <dd className={`percentage percentage-${Com}`}><span className="text">COM</span><span className="ptext">{Com}%</span></dd>
                                    <dd className={`percentage percentage-${Lot}`}><span className="text">LOT</span><span className="ptext">{Lot}%</span></dd>
                                </dl>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Card>
                    <Col className="w-100 p-0 mx-auto mt-4" dangerouslySetInnerHTML={{__html: iframe}}/>
                </Card>
            </Container>
        </div>
    )
}