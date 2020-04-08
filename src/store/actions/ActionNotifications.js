import CONSTANTS from '../CONSTANTS';

export const saveTokenPush = (fcmToken, userId) => ({
    type: CONSTANTS.SAVE_TOKEN_PUSH,
    fcmToken, userId
});

export const ActionSetNotifications = notification => ({
    type: CONSTANTS.SET_NOTIFICATION,
    notification
});

export const ActionGetTokenNotifications = (id) => ({
    type: CONSTANTS.GET_TOKEN_NOTIFICATIONS,
    id
});

export const ActionSetTokenNotifications = (token) => ({
    type: CONSTANTS.SET_TOKEN_NOTIFICATIONS,
    token
});

export const ActionGetUserToken = (token,userId) => ({
    type: CONSTANTS.GET_USER_TOKEN,
    token, userId
})

export const ActionDeleteUserToken = (tokens) => ({
    type: CONSTANTS.DELETE_USER_TOKEN,
    tokens
})

export const ActionSetUserToken = (user) => ({
    type: CONSTANTS.SET_USER_TOKEN,
    user
})

export const ActionSendPushNotication = (data) => ({
    type: CONSTANTS.SEND_PUSH_NOTIFICATION,
    data
})
