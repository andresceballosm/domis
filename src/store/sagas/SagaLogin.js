import { call, takeEvery, put } from 'redux-saga/effects';
import {AsyncStorage} from 'react-native';
import { authentication } from '../../services/Firebase';
import CONSTANTS from '../CONSTANTS';
import { ActionStopLoading } from '../actions/ActionApp';
import { POST, DELETE } from '../../services/Calls';
import { showAlertError, showAlertSuccess } from '../../utils/Alerts';
import { ActionSetSesion, ActionSesion, ActionGetSesion, ActionLogout } from '../actions/ActionsAuthentication';

const loginInFirebase = ({ email, password }) =>
  authentication.signInWithEmailAndPassword(email, password).then(success => success);

const delete_user = (user) => {
  console.log('user que leg', user)
  return user.delete().then(success => success);
}


const getToken = () =>
  AsyncStorage.getItem('userToken')
  .then((response) => response)

function* Login(values) {
  try {
    const login = yield call(loginInFirebase, values.data);
    yield put(ActionSetSesion(login.user));
    yield put(ActionStopLoading());
  } catch (error) {
    console.log(error)
    showAlertError('Error en la autenticación')
    yield put(ActionStopLoading());
  }
}

function* SetSesion(values) {
  try {
    const string = JSON.stringify(values.user)
    AsyncStorage.setItem('userToken', string)
    yield put(ActionGetSesion())
  } catch (error) {
    console.log(error)
  }
}

function* GetSesion() {
  try {
    const token = yield call(getToken)
    const user = JSON.parse(token)
    yield put(ActionSesion(user));
    yield put(ActionStopLoading());
  } catch (error) {
    console.log(error)
    showAlertError(error)
    yield put(ActionStopLoading());
  }
}

function* DeleteUser(){
  try {
    var user = authentication.currentUser;
    yield call(delete_user, user)
    yield put(ActionLogout())
    yield put(ActionStopLoading());
    showAlertSuccess('Su cuenta se ha eliminado de manera exitosa!')
  } catch (error) {
    console.log(error)
    yield put(ActionStopLoading());
    showAlertError('Se ha presentado un error, es posible que necesite cerrar sesión y volver a ingresar para proceder a eliminar su cuenta.')
  }
}

export const sagaLogin = [
  //take every listening to the dispatch
  takeEvery(CONSTANTS.LOGIN, Login),
  takeEvery(CONSTANTS.SET_SESION, SetSesion),
  takeEvery(CONSTANTS.GET_SESION, GetSesion),
  takeEvery(CONSTANTS.DELETE_USER, DeleteUser)  
]

