import { all, fork, put, take } from 'redux-saga/effects'
import { sagaLogin } from './SagaLogin'
import { sagaRigister } from './sagaRegister'
import { sagaStores } from './sagaStores'
import { sagaOrders } from './sagaOrders'
import { sagaNotifications } from './SagaNotifications'
import { dataBase } from '../../services/Firebase';

export default function* rootSaga() {    
    yield all([
      ...sagaLogin,
      ...sagaRigister,
      ...sagaStores,
      ...sagaOrders,
      ...sagaNotifications
    ])
};