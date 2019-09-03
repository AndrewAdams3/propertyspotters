import React, {useEffect, useState} from 'react'
import {Container, Row, Col, Card} from 'react-bootstrap'
import HeaderNav from '../../components/header'
import { useStateValue } from '../../context/State';

import './chart.css';
import './chart.scss';

export default function ChartView() {
    const iframe = '<iframe style="border: none;border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);" width="100%" height="400" src="https://charts.mongodb.com/charts-varodrive-ptegd/embed/charts?id=94cb494e-75e5-4148-85a7-a4911d46ffec&tenant=59f93d45-c59b-42e4-92dc-f884e44733ef" />'
    const [{Drivebys},] = useStateValue();
    const [Sfr, setSfr] = useState(0)
    const [Mfr, setMfr] = useState(0)
    const [Com, setCom] = useState(0)
    const [Lot, setLot] = useState(0)

    useEffect(()=>{
        if(Drivebys){
            var sfr=0, mfr=0, lot=0, com=0, none=0, l = Drivebys.length;
            Drivebys.forEach((db)=>{
                if(db.type === "SFR" || db.type === "SFH") sfr++;
                else if (db.type === "MFR") mfr++;
                else if(db.type === "Lot") lot++;
                else if (db.type === "COM") com++;
                else none++;
            })
            let t = l-none
            setSfr(Math.round(sfr / t * 100))
            setMfr(Math.round(mfr / t * 100))
            setCom(Math.round(com / t * 100))
            setLot(Math.round(lot / t * 100))
            console.log(Sfr, Mfr, Com, Lot)
        }
    }, [Drivebys])
    return (
        <div>
            <HeaderNav fixed="top" color={"black"}/> <br/>
            <Container className="w-100 mx-auto" style={{justifyContent: "center", alignItems: "center", marginTop: "2rem"}}>
                <Row className="w-100 mx-auto">
                    <Col className="w-100 p-0 mx-auto mt-4" dangerouslySetInnerHTML={{__html: iframe}}/>
                </Row>
                <Row>
                    <Col className="w-100" style={{height: 300, marginBottom: "1rem"}}>
                        <Card style={{ width: "100%", height: "100%" }}>
                            <div style={{height: "100%", width: "100%", display: "flex"}}>             
                                <dl>
                                    <dt className="mx-auto">Distribution of Drivebys</dt>
                                    <dd class={`percentage percentage-${Sfr}`}><span class="text">SFR</span><span className="ptext">{Sfr}%</span></dd>
                                    <dd class={`percentage percentage-${Mfr}`}><span class="text">MFR</span><span className="ptext">{Mfr}%</span></dd>
                                    <dd class={`percentage percentage-${Com}`}><span class="text">COM</span><span className="ptext">{Com}%</span></dd>
                                    <dd class={`percentage percentage-${Lot}`}><span class="text">LOT</span><span className="ptext">{Lot}%</span></dd>
                                </dl>
                                {/* <div style={{flexDirection: "row"}}>
                                    <h3>Boarded</h3>
                                    <div style={{width: "30%", backgroundColor: "green"}}>true</div> 
                                    <div style={{width: "30%", backgroundColor: "red"}}>false</div>
                                </div> */}
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}