import CONSTANTS from '../CONSTANTS';
import { authentication } from '../../services/Firebase';

export const ReducerSesion = ( state = null , action) => {
    switch (action.type) {
        case CONSTANTS.SESION:
            return { ...state, user: action.user };
        case CONSTANTS.LOGOUT:
                authentication.signOut().then(function() {
                // Sign-out successful.
                }, function(error) {
                // An error happened.
                });
            return { ...state, user: null };
        default:
            return state;
    }
}

export const ReducerTypeUser = (state=null, action) => {
    switch (action.type) {
        case CONSTANTS.TYPE_USER:
            return action.typeUser; 
        default:
            return state;
    }
}