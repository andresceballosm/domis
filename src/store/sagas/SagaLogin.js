import { call, takeEvery, put } from 'redux-saga/effects';
import {AsyncStorage} from 'react-native';
import { authentication, dataBase } from '../../services/Firebase';
import CONSTANTS from '../CONSTANTS';
import { ActionStopLoading } from '../actions/ActionApp';
import { showAlertError, showAlertSuccess } from '../../utils/Alerts';
import { ActionSetSesion, ActionSesion, ActionGetSesion, ActionLogout, ActionSetSesionGoogle, ActionTypeUSer } from '../actions/ActionsAuthentication';
import { GoogleSignin } from '@react-native-community/google-signin';
import firebase from 'react-native-firebase'
import { ActionSetUser } from '../actions/ActionOrder';

const loginInFirebase = ({ email, password }) =>
  authentication.signInWithEmailAndPassword(email, password).then(success => success);

const loginGoogle = (credential) =>
  authentication.signInWithCredential(credential).then(success => success);

const recover = ( email ) => 
  authentication.sendPasswordResetEmail(email).then(success => success);

const loginSiginGoogle = () =>  
  GoogleSignin.signIn().then(success => success); 

const getFirebase = (ref) =>
  ref.get().then(success => success); 

const delete_user = (user) => {
  return user.delete().then(success => success);
}

const registerUserInDataBase = ({ id, firstname, lastname, email , photo}) => 
  dataBase.collection('users').doc(`${id}`).set({
    firstname, 
    lastname,
    email,
    photo,
    type_user:'client'
  })

const getToken = () =>
  AsyncStorage.getItem('userToken')
  .then((response) => response)

function* Login(values) {
  try {
    const login = yield call(loginInFirebase, values.data);
    console.log('login', login);
    yield put(ActionSetSesionGoogle(login.user));
    yield put(ActionStopLoading());
  } catch (error) {
    console.log(error)
    showAlertError('Error en la autenticación')
    yield put(ActionStopLoading());
  }
}

function validatePhoto(user) {
  return user['photo'] ? user['photo'] : null;
}

function* LoginWithGoogle() {
  try {
    GoogleSignin.configure({
      //scopes: ['https://www.googleapis.com/auth/'],  what API you want to access on behalf of the user, default is email and profile
      webClientId: '225916954305-g7f5d8hob0hoq68820gphomgj816556t.apps.googleusercontent.com', // '225916954305-uhm8st15ltjbka670vo4m97c3jhdtuv0.apps.googleusercontent.com',
    });
    const data = yield call(loginSiginGoogle);
    console.log('data with google', data);
    const isCurrentUser = firebase.auth().currentUser;
    console.log('isCurrentUser',isCurrentUser)
    if(isCurrentUser === null) {
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
      const login = yield call(loginGoogle, credential);
      const { email, givenName, familyName, photo } = data.user;
      const { uid } = login.user._user;
      let id = uid;
      let firstname = givenName;
      let lastname = familyName;

      const userRef = dataBase.collection('users').doc(id);
      const userExist = yield call(getFirebase, userRef);
      console.log('userExist???',userExist)
      if(!userExist.exists){
        console.log('entraaa a crear user')
        yield call(registerUserInDataBase, { id, firstname, lastname, email, photo });
      }
    }
    let user = data.user;
    let id = data.user.id;
    Object.assign( user, {
      uid : id,
    }) 
    yield put(ActionSetSesionGoogle(data.user));
    const string = JSON.stringify(data.user)
    AsyncStorage.setItem('userToken', string)
    
    const userRef = dataBase.collection('users').doc(id);
    const typeUser = yield call(getFirebase, userRef);
    // if(typeUser){
    //   yield put(ActionTypeUSer(typeUser._data.type_user));
    //   yield put(ActionSetUser(typeUser._data))
    // }
    yield put(ActionStopLoading());
  } catch (error) {
    console.log(error)
    showAlertError('Error en la autenticación')
    yield put(ActionStopLoading());
  }
}


// function* LoginWithGoogle() {
//   try {
//     GoogleSignin.configure({
//       //scopes: ['https://www.googleapis.com/auth/'],  what API you want to access on behalf of the user, default is email and profile
//       webClientId: '225916954305-g7f5d8hob0hoq68820gphomgj816556t.apps.googleusercontent.com', // '225916954305-uhm8st15ltjbka670vo4m97c3jhdtuv0.apps.googleusercontent.com',
//     });
//     // const data = yield call(loginSiginGoogle);
//     // console.log('data with google', data);
//     // const isCurrentUser = firebase.auth().currentUser;
//     // console.log('isCurrentUser',isCurrentUser)

//     const data = yield call(loginSiginGoogle);
//     const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
//     const isCurrentUser = firebase.auth().currentUser;
//     console.log('isCurrentUser',isCurrentUser)
//     const login = yield call(loginGoogle, credential);
//     console.log('login==', login);
//     yield put(ActionSetSesionGoogle(login.user._user));

//     if(isCurrentUser === null) {
//       const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
//       yield call(loginGoogle, credential);
//       const { email, id, givenName, familyName, photo } = data.user;
//       console.log('id', id)
//       let firstname = givenName;
//       let lastname = familyName;
//       yield call(registerUserInDataBase, { id, firstname, lastname, email, photo });
//     }

//     // yield put(ActionSetSesionGoogle(data.user));
//     // const string = JSON.stringify(data.user)
//     // AsyncStorage.setItem('userToken', string)
    
//     const userRef = dataBase.collection('users').doc(login.user._user.uid);
//     const typeUser = yield call(getFirebase, userRef);
//     console.log('type')
//     if(typeUser){
//       yield put(ActionTypeUSer(typeUser._data.type_user));
//       yield put(ActionSetUser(typeUser._data))
//     }
//     yield put(ActionStopLoading());
//   } catch (error) {
//     console.log(error)
//     showAlertError('Error en la autenticación')
//     yield put(ActionStopLoading());
//   }
// }

function* SetSesion(values) {
  try {
    const string = JSON.stringify(values.user)
    AsyncStorage.setItem('userToken', string)
    yield put(ActionGetSesion())
  } catch (error) {
    console.log(error)
  }
}

function* RecoverPassword(value) {
  try {
    const { email } = value;
    yield call(recover, email);
    showAlertSuccess('Se ha enviado un email a su cuenta de correo electrónico para recuperar la contraseña.')
  } catch (error) {
    console.log('eror', error);
  }
}

function* GetSesion() {
  try {
    const token = yield call(getToken);
    const user = JSON.parse(token);
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
  takeEvery(CONSTANTS.DELETE_USER, DeleteUser), 
  takeEvery(CONSTANTS.LOGIN_WITH_GOOGLE, LoginWithGoogle),
  takeEvery(CONSTANTS.RECOVER_PASSWORD, RecoverPassword) 
]

