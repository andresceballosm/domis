import { authentication, dataBase } from '../../services/Firebase';
import { call, takeEvery, put } from 'redux-saga/effects';
import CONSTANTS from '../CONSTANTS';
import { ActionStopLoading } from '../actions/ActionApp';
import { ActionLogin } from '../actions/ActionsAuthentication';
import { showAlertError } from '../../utils/Alerts';
import { showAlertSuccess } from '../../components/Alerts';

const registerInFirebase = values =>
  authentication
  .createUserWithEmailAndPassword(values.email, values.password)
  .then(success => success);

const registerUserInDataBase = ({ uid, firstname, lastname, email }) => 
  dataBase.collection('users').doc(`${uid}`).set({
    firstname,
    lastname,
    email,
    type_user:'client'
  })

function* RegisterUser(values) {
  try {
    const { firstname, lastname } = values.data;
    const register = yield call(registerInFirebase, values.data);
    const { email, uid } = register.user._user;
    yield call(registerUserInDataBase, { uid, firstname, lastname, email });
    yield put(ActionLogin(values.data));
    showAlertSuccess('Registro exitoso!')
    yield put(ActionStopLoading());
  } catch (error) {
    showAlertError(error)
    yield put(ActionStopLoading());
  }
}

export const sagaRigister = [
  //take every listening to the dispatch
  takeEvery(CONSTANTS.REGISTER_USER, RegisterUser) 
]

