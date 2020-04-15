import CONSTANTS from '../CONSTANTS';

const initState = {
    orders:[],
}

const initStateDetails = {
    details:[],
}

export const ReducerOrders = ( state = initState , action) => {
    switch (action.type) {
        case CONSTANTS.SET_ORDERS:
            return { ...state, orders: action.orders };
        case CONSTANTS.REDUCER_PRODUCT_ORDER:
                return { ...state, orders: action.orders };
        case CONSTANTS.ADD_PRODUCT_ORDER:
                const addedItem = state.addedItems.find(item=> item.id === action.id)
                // addedItem.quantityProduct += 1 
                // let newTotal = state.total + addedItem.price
                // return {
                //     ...state,
                //     total: newTotal,
                //     quantityProduct: state.quantityProduct + 1
                // }
                return { ...state, orders: action.orders };
        case CONSTANTS.LOGOUT:
            return initState; 
        default:
            return state;
    }
}

export const ReducerOrdersByDate = ( state = initState , action) => {
    switch (action.type) {
        case CONSTANTS.SET_ORDERS_DATE:
            return { ...state, orders: action.orders };
        case CONSTANTS.LOGOUT:
            return initState; 
        default:
            return state;
    }
}

export const ReducerOrderDetails = ( state = initStateDetails , action) => {
    switch (action.type) {
        case CONSTANTS.SET_ORDER_DETAILS:
            return { ...state, details: action.details };
        case CONSTANTS.LOGOUT:
            return initStateDetails; 
        default:
            return state;
    }
}

export const ReducerUser = ( state = null , action) => {
    switch (action.type) {
        case CONSTANTS.SET_USER:
            console.log('action', action)
            return { ...state, user: action.user };
        case CONSTANTS.LOGOUT:
            return state; 
        default:
            return state;
    }
}


