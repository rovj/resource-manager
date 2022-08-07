import React from 'react'

const initialState = {

}

function Reducer(state={initialState},action) {
    let newState;
    switch(action.type){
        case "ADD":
            newState = {...state};
            newState[action.payload.id] = action.payload.resource;
            return newState;
        case "UPDATE":
            newState = {...state};
            newState[action.payload.id] = action.payload.resource;
            return newState;
        default:
            return state;
    }
}

export default Reducer