import { reducer as form } from 'redux-form'
import { combineReducers } from 'redux'
import { ReducerSesion, ReducerTypeUser } from './ReducerSesion'
import ReducerLoading from './ReducerLoading'
import { ReducerPosition } from './ReducerPosition'
import { ReducerStores, ReducerCategories, ReducerProducts, ReducerStore, ReducerUploadImage, ReducerCategoriesApp } from './ReducerStores'
import { ReducerBasket } from './ReducerBasket'
import { ReducerOrders, ReducerOrderDetails, ReducerUser, ReducerOrdersByDate } from './ReducerOrders'
import { ReducerAddress } from './ReducerAddress'
import { ReducerNotifications, ReducerTokenNotifications } from './ReducerNotifications'

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
    ReducerUploadImage,
    ReducerOrdersByDate,
    ReducerCategoriesApp,
    ReducerNotifications,
    ReducerTokenNotifications
}));