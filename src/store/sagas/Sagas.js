import { all } from 'redux-saga/effects'
import { sagaLogin } from './SagaLogin'
import { sagaRigister } from './sagaRegister'
import { sagaStores } from './sagaStores'
import { sagaOrders } from './sagaOrders'

export default function* rootSaga() {    
    yield all([
      ...sagaLogin,
      ...sagaRigister,
      ...sagaStores,
      ...sagaOrders
    ])
};