import CONSTANTS from '../CONSTANTS';

export const ActionLogin = data => ({
    type: CONSTANTS.LOGIN,
    data
});

export const ActionLoginWithGoogle = () => ({
    type: CONSTANTS.LOGIN_WITH_GOOGLE,
});

export const ActionRegisterUser = data => ({
    type: CONSTANTS.REGISTER_USER,
    data
});

export const ActionRecoverPassword = (email) => ({
    type: CONSTANTS.RECOVER_PASSWORD,
    email
})

export const ActionSesion = (user) => ({
    type: CONSTANTS.SESION,
    user
});

export const ActionSetSesion = (user) => ({
    type: CONSTANTS.SET_SESION,
    user
});

export const ActionSetSesionGoogle = (user) => ({
    type: CONSTANTS.SET_SESION_GOOGLE,
    user
});

export const ActionGetSesion = (user) => ({
    type: CONSTANTS.GET_SESION,
    user
});

export const ActionLogout = () => ({
    type: CONSTANTS.LOGOUT,
});

export const ActionDeleteUser = () => {
    return{
        type: CONSTANTS.DELETE_USER,
    }
};

export const ActionTypeUSer = typeUser => ({
    type: CONSTANTS.TYPE_USER,
    typeUser
});

