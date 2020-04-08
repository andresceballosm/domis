import { takeEvery, put, call } from 'redux-saga/effects';
import { dataBase } from '../../services/Firebase';
import CONSTANTS from '../CONSTANTS';
import { ActionSetTokenNotifications } from '../actions/ActionNotifications';
import { POST } from '../../services/Calls';
import config from '../../config/config';
import { ActionStopLoading } from '../actions/ActionApp';

const qs = require('querystring');

const getData = ref => 
    ref.get().then(data => data);    

const deleteToken = (id) => 
    dataBase.collection('token_notifications').doc(id).delete().then(success => success);  

const addToken = (data) => 
    dataBase.collection('token_notifications').doc().set({'token': data.token.toString(), 'user': data.userId})

const sendPushNotifications = async data =>
    await POST(`/sendnotification`, {
      baseUrl: `${config.baseUrlNotifications}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify(data)
    })
    .then(response => response)
    .catch(error => error.response);

    

function* sagasGeTokenNotifications( data ) {
    const { id } = data;
    try {
        const tokenRef = yield dataBase.collection('token_notifications').where("user", "==", id);
        const token = yield call(getData, tokenRef);
        if(token && token._docs !== []){
            yield put(ActionSetTokenNotifications(token._docs))
        } 
    } catch (error) {
        console.log(error);
        yield put(ActionStopLoading());
    }
};

function* sagasGetUserToken( data ) {
    const { token, userId } = data;
    try {
        const userRef = yield dataBase.collection('token_notifications').where("token", "==", token);
        const user = yield call(getData, userRef);
        const tokenRef = yield dataBase.collection('token_notifications').where("user", "==", userId);
        const tokenData = yield call(getData, tokenRef);
        if(tokenData._docs.length === 0 || user._docs[0]._data.user !== userId ){
            const id = user._docs[0]._ref._documentPath._parts[1];
            yield call(deleteToken, id); 
            yield call(addToken, {token, userId}); 
        }
    } catch (error) {
        console.log(error);
        yield put(ActionStopLoading());
    }
};

function* sagasDeleteUserToken( data ) {
    const { tokens } = data;
    try {
        for (let i = 0; i < tokens.length; i++) {
            let id = tokens[i]._ref._documentPath._parts[1];
            yield call(deleteToken, id); 
        }
    } catch (error) {
        console.log(error);
        yield put(ActionStopLoading());
    }
};

function* sagasSendPushNotifications( response ) {
    console.log('response', response);
    const { devices, body, path, id } = response.data;
    var tokens = '';
    try {
        for (let i = 0; i < devices.length; i++) {
            const tokenRef = yield dataBase.collection('token_notifications')
                            .where("user", "==", devices[i]);
            const getTokens = yield call( getData, tokenRef );
            tokens = getTokens._docs;
            console.log('tokens', tokens);
        }
        console.log('tokens', tokens);
        if(tokens !== '') {
            let device = [];
                tokens.forEach(token => {
                    device.push(token._data.token)   
                });
            console.log('device', device);
            yield call(sendPushNotifications, { device, body, path, id});
        }
    } catch (error) {
        console.log(error);
        yield put(ActionStopLoading());
    }
};
    
export const sagaNotifications = [
    //take every listening to the dispatch
    takeEvery(CONSTANTS.GET_TOKEN_NOTIFICATIONS, sagasGeTokenNotifications),
    takeEvery(CONSTANTS.GET_USER_TOKEN, sagasGetUserToken),
    takeEvery(CONSTANTS.DELETE_USER_TOKEN, sagasDeleteUserToken),
    takeEvery(CONSTANTS.SEND_PUSH_NOTIFICATION, sagasSendPushNotifications)
];