import React from "react";

let Context = React.createContext();

let initialState = {
  field: {
      name: "",
      value: "",
      bool: false,
  },
  show: false,
  db: {}
};

let reducer = (state, action) => {
  switch (action.type) {
    case "field":
      return{
            ...state,
            field: action.value
        }
    case "db":
      return{
        ...state,
        db: action.value
      } 
    case "show":
      return { ...state, show: action.value };
    case "reset":
      return initialState
  }
};

function ContextProvider(props) {
  let [state, dispatch] = React.useReducer(reducer, initialState);
  let value = { state, dispatch };
  return (
    <Context.Provider value={value}>{props.children}</Context.Provider>
  );
}

let ContextConsumer = Context.Consumer;

export { Context, ContextProvider, ContextConsumer };

