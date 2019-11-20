import CONSTANTS from '../CONSTANTS.js';

export default ReducerLoading = (state = { loading: false }, action) => {
    switch (action.type) {
        case CONSTANTS.SET_LOADING:
            return { loading: 'true' };
        case CONSTANTS.STOP_LOADING:
            return { loading: 'false' };   
        default:
            return state;
    }
}