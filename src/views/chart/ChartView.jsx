import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import HeaderNav from '../../components/header'

import './chart.css';

export default function ChartView() {

    const iframe = '<iframe style="border: none;border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);" width="100%" height="480" src="https://charts.mongodb.com/charts-varodrive-ptegd/embed/charts?id=94cb494e-75e5-4148-85a7-a4911d46ffec&tenant=59f93d45-c59b-42e4-92dc-f884e44733ef" />'
    return(
        <div>
            <HeaderNav fixed="top" color={"black"}/> <br/>
            <Container className="w-100 mx-auto" style={{justifyContent: "center", alignItems: "center", marginTop: "2rem"}}>
                <Row className="w-100 mx-auto">
                    <Col className="w-100 p-0 mx-auto mt-4" dangerouslySetInnerHTML={{__html: iframe}} />
                </Row>
            </Container>
        </div>
    )
}