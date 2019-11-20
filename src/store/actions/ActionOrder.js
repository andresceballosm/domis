import CONSTANTS from '../CONSTANTS';

export const ActionGetOrders = (user_id) => ({
    type: CONSTANTS.GET_ORDERS,
    user_id
})

export const ActionGetOrdersStore = (store_id) => ({
    type: CONSTANTS.GET_ORDERS_STORE,
    store_id
})

export const ActionSetOrders = (orders) => ({
    type: CONSTANTS.SET_ORDERS,
    orders
})

export const ActionGetOrderDetails = (token, id) => ({
    type: CONSTANTS.GET_ORDER_DETAILS,
    token, id
})

export const ActionSetOrderDetails = (details) => ({
    type: CONSTANTS.SET_ORDER_DETAILS,
    details
})

export const ActionUpdateUser = (user) => ({
    type: CONSTANTS.UPDATE_USER,
    user
})

export const ActionGetAddress = (token, id) => ({
    type: CONSTANTS.GET_ADDRESS,
    token, id
})

export const ActionSetAddress = (address) => ({
    type: CONSTANTS.SET_ADDRESS,
    address
})

export const ActionPutOrder = (data) => ({
    type: CONSTANTS.PUT_ORDER,
    data
})

export const ActionGetUser = ( id) => ({
    type: CONSTANTS.GET_USER,
    id
})

export const ActionSetUser  = (user) => ({
    type: CONSTANTS.SET_USER,
    user
})

export const ActionAddQuantityProductOrder = (id,orderId) => ({
    type: CONSTANTS.ADD_PRODUCT_ORDER,
    id,orderId
})

export const ActionReducerProductOrder = (id,orderId) => ({
    type: CONSTANTS.REDUCER_PRODUCT_ORDER,
    id,orderId
})