import { reducer as form } from 'redux-form'
import { combineReducers } from 'redux'
import { ReducerSesion, ReducerTypeUser } from './ReducerSesion'
import ReducerLoading from './ReducerLoading'
import { ReducerPosition } from './ReducerPosition'
import { ReducerStores, ReducerCategories, ReducerProducts, ReducerStore, ReducerUploadImage } from './ReducerStores'
import { ReducerBasket } from './ReducerBasket'
import { ReducerOrders, ReducerOrderDetails, ReducerUser } from './ReducerOrders'
import { ReducerAddress } from './ReducerAddress'

export default(reducers = combineReducers({
    form,
    ReducerSesion,
    ReducerUser,
    ReducerLoading,
    ReducerStores,
    ReducerPosition,
    ReducerCategories,
    ReducerProducts,
    ReducerBasket,
    ReducerOrders,
    ReducerOrderDetails,
    ReducerAddress,
    ReducerTypeUser,
    ReducerStore,
    ReducerUploadImage
}));