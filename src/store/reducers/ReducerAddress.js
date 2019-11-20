import CONSTANTS from '../CONSTANTS';

const initState = {
    address:[],
}

export const ReducerAddress = ( state = initState , action) => {
    switch (action.type) {
        case CONSTANTS.SET_ADDRESS:
            return { ...state, address: action.address };
        case CONSTANTS.LOGOUT:
            return initState; 
        default:
            return state;
    }
}