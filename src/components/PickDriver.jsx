import React, { useState, useEffect, useRef } from "react";

const capitalize = string => {
  return string[0].toUpperCase() + string.slice(1, string.length);
};

const PickDriver = React.memo(({ select, initial, style }) => {
  const selected = useRef()
  const [fresh, refresh] = useState(false);

  useEffect(()=>{
    if(selected.current)  
      select(selected.current)
  },[selected.current])

  useEffect(()=>{
    var _selected = new Map();
    if(initial.length > 0){
      initial.forEach((user)=>{
        _selected.set(user._id, { user, selected: true});
      })
      selected.current = _selected
    }
  },[initial])

  const addDriver = (user) => {
    if(selected.current.get(user._id).selected){
      selected.current.set(user._id, {user, selected: false});
    } else {
      selected.current.set(user._id, {user, selected: true})
    }
    select(selected.current)
    refresh(!fresh)
  }

  const clear = () => {
    selected.current.forEach((val, key)=>{
      selected.current.set(key, { ...val, selected: false})
    })
    select(selected.current)
    refresh(!fresh)
  }

  const checkAll = (test) => {
    var all = true
    selected.current.forEach((value)=>{
      if(!value.selected){
        all = false;
      }
    })
    return all;
  }

  const repop = () => {
    selected.current.forEach((value, key)=>{
      selected.current.set(key, {...value, selected: true})
    })
    select(selected.current)
    refresh(!fresh)
  }

  const _user = ((user) => {
    return (
      <li
      key={user._id}
      value={user._id}
      className="driverItem"
      onClick={e => {
        e.preventDefault();
        addDriver(user)
      }}
    >
      {capitalize(user.fName)}
      <img
        src={require("../config/images/plus.jpg")}
        style={{
          height: "100%",
          width: "auto",
          backgroundColor: selected.current.get(user._id).selected ? "green" : "",
          borderRadius: "50%"
        }}
        alt="+"
      />
    </li>
    )
  })

  return !!selected.current ? (
    <div style={style}>
      {!!initial.length && (
        <ul className="driverList">
          <li
            key={"sel-all"}
            className="driverItem"
            onClick={e => {
              e.preventDefault();
              checkAll("click") ? clear() : repop()
            }}
          >
            {"Select All"}
            <img
              src={require("../config/images/plus.jpg")}
              style={{
                height: "100%",
                width: "auto",
                backgroundColor: checkAll("bg") ? "green" : "",
                borderRadius: "50%"
              }}
              alt="+"
            />
          </li>
          
          {initial.map(user => {
            return (
              _user(user)
            );
          })}
        </ul>
      )}
    </div>
  ) : <h3>no users to load</h3>;
});

export default (PickDriver)