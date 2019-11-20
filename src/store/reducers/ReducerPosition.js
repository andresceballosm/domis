import CONSTANTS from '../CONSTANTS';

export const ReducerPosition = ( state = null , action) => {
    switch (action.type) {
        case CONSTANTS.SET_POSITION:
            console.log('action in reducer',action)
            return { ...state, position: action.position };
        case CONSTANTS.LOGOUT:
            return { ...state, stores: null}; 
        default:
            return state;
    }
}