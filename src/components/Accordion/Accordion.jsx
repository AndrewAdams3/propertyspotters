import React, { useState } from 'react'
import PropTypes from 'prop-types'

import './Accordion.scss'
const Accordion = React.memo(({head:Head, body:Body, style}) => {
    
    const [open, setOpen] = useState(false)
    return(
        <>
            <div className="Accordion" style={style}>
                <div className="head" onClick={()=>setOpen(!open)}>
                    {Head}
                </div>
                {
                <div className="body" style={!open ? {height: "0px"} : {}}>
                    {Body}
                </div>
                }
            </div>
        </>
    )
})

Accordion.propTypes = {
    head: PropTypes.element.isRequired,
    body: PropTypes.element.isRequired,
    style: PropTypes.object
}

export default Accordion