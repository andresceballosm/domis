import { call, takeEvery, put } from 'redux-saga/effects';
import CONSTANTS from '../CONSTANTS';
import { ActionStopLoading } from '../actions/ActionApp';
import { ActionLogin } from '../actions/ActionsAuthentication';
import { POST, GET, GETSIMPLE, PUT } from '../../services/Calls';
import { ActionSetOrders, ActionSetOrderDetails, ActionSetAddress, ActionGetOrders, ActionSetUser, ActionGetUser, ActionGetOrdersStore, ActionSetOrdersByDate } from '../actions/ActionOrder';
import { ActionDataProductsOrderDetails } from '../actions/ActionStores';
import { showAlertError, showAlertSuccess } from '../../utils/Alerts';
import { dataBase } from '../../services/Firebase';

const getOrders = (ref) => 
  ref.get().then(orders => orders);

const updateOrder = (values) => 
  dataBase.collection('orders').doc(`${values.id}`).update(values.order)
  .then(success => success);

const getOrdersStore = (values) => 
    POST( values, CONSTANTS.API_ORDERS_STORE)

const getOrderDetails = ( values ) =>
    GET( values, CONSTANTS.API_GET_ORDER_DETAILS)

const getAddress = ( values ) =>
    GET( values, CONSTANTS.API_GET_ADDRESS)

const getProduct = (values) => 
    GET( values, CONSTANTS.API_GET_PRODUCT)

const updateUser = (values) => 
  dataBase.collection('users').doc(`${values.idUser}`).update(values.user)
  .then(success => success);

const getUser = ref => 
  ref.get().then(user => user);

  function* GetOrders(data) {
    try {
      const ref = dataBase.collection('orders').where("user_id", "==", data.user_id);
      const orders = yield call(getOrders, ref);
      yield put(ActionSetOrders(orders._docs))
      yield put(ActionStopLoading());
    } catch (error) {
      console.log('error in order' ,error)
      
      yield put(ActionStopLoading());
    }
  }

  function* GetUser(values) {
    try {
        const { id } = values;
        ref= dataBase.collection('users').doc(id)
        const user = yield call(getUser, ref);
        yield put(ActionSetUser(user._data))
        yield put(ActionStopLoading());
    } catch (error) {
      console.log('error in order' ,error)
      
      yield put(ActionStopLoading());
    }
  }

  function* GetOrdersStoreByDate(data){
    try {
      const ref = dataBase.collection('orders').where("store_id", "==", data.store_id)
                                                .where("created_at", "==", data.date)
      const orders = yield call(getOrders, ref);
      yield put(ActionSetOrdersByDate(orders._docs))
      yield put(ActionStopLoading());
    } catch (error) {
      console.log('error in order' ,error)
      yield put(ActionStopLoading());
    }
  }

  function* GetOrdersStore(data) {
    try {
      const ref = dataBase.collection('orders').where("store_id", "==", data.store_id)
      const orders = yield call(getOrders, ref);
      yield put(ActionSetOrders(orders._docs))
      yield put(ActionStopLoading());
    } catch (error) {
      console.log('error in order' ,error)
      yield put(ActionStopLoading());
    }
  }

  function* UpdateOrder(values) {
    try {
      const { type, uid } = values.data;
      yield call(updateOrder, values.data);
      if(type === 'store'){
        yield put(ActionGetOrdersStore(uid))
      } else {
        yield put(ActionGetOrders(uid))
      }
      yield put(ActionStopLoading());
      // yield call(updateOrder, data);

      // yield put(ActionGetOrders(user_id))
      // yield put(ActionStopLoading());
      // if( status === 'cancelled' ){
      //   showAlertSuccess('Pedido cancelado con exito.' )
      // } else if( status ==='processing' ){
      //   showAlertSuccess('Pedido aceptado con exito!, nuevo estado de pedido EN PROCESO.' )
      // } else if(status === 'deliv'){

      // }
    } catch (error) {
      console.log('error in order' ,error)
      yield put(ActionStopLoading());
    }
  }

  function* GetOrderDetails(values) {
    const { token, id } = values;
    try {
        const details = yield call(getOrderDetails, { token, id });
        yield put(ActionSetOrderDetails(details))
        //Get products in orderDetail
        if(details){
          var products = [];
          for (let i = 0; i < details.length; i++) {
            const id = details[i].product_id;
            const product = yield call(getProduct, { token, id }); 
            products.push(product);  
          }
          yield put(ActionDataProductsOrderDetails(products));
        }
        yield put(ActionStopLoading());
    } catch (error) {
      console.log('error in order' ,error)
      showAlertError(error)
      yield put(ActionStopLoading());
    }
  }

  function* UpdateUser(values) {
    try {
      const { user } = values;
      yield call(updateUser, user);

      yield put(ActionGetUser(user.idUser));
      showAlertSuccess('Se ha guardado su dirección de manera exitosa')
      yield put(ActionStopLoading());
    } catch (error) {
      console.log('error in order' ,error)
      showAlertError('Se ha producido un error')
      yield put(ActionStopLoading());
    }
  }

  function* GetAddress(values) {
    const { token, id } = values;
    try {
        const address = yield call(getAddress, { token, id });
        yield put(ActionSetAddress(address))
        yield put(ActionStopLoading());
    } catch (error) {
      console.log('error in order' ,error)
      showAlertError('Se ha producido un error')
      yield put(ActionStopLoading());
    }
  }

  export const sagaOrders = [
    //take every listening to the dispatch
    takeEvery(CONSTANTS.GET_ORDERS, GetOrders),
    takeEvery(CONSTANTS.GET_ORDER_DETAILS, GetOrderDetails),
    takeEvery(CONSTANTS.UPDATE_USER, UpdateUser),
    takeEvery(CONSTANTS.GET_ADDRESS, GetAddress),
    takeEvery(CONSTANTS.PUT_ORDER, UpdateOrder),
    takeEvery(CONSTANTS.GET_ORDERS_STORE , GetOrdersStore),
    takeEvery(CONSTANTS.GET_ORDERS_STORE_DATE , GetOrdersStoreByDate),
    takeEvery(CONSTANTS.GET_USER, GetUser )
  ]