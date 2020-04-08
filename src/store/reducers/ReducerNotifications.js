import CONSTANTS from '../CONSTANTS.js';

const INITIAL_STATE = {
  tokens: undefined,
  notifications: undefined
};

const initialState = {
  token: null,
  user: null,
}
  
  export const ReducerNotifications = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case CONSTANTS.SET_TOKEN_PUSH:
        return {
          ...state,
          tokens: action.tokens,
        };
      case CONSTANTS.SET_NOTIFICATION:
        return {
          ...state,
          notifications: action.notification,
        }
      case CONSTANTS.LOGOUT:  
        return INITIAL_STATE;
      default:
        return state;
    }
  }

export const ReducerTokenNotifications = (state=initialState, action) => {
  switch (action.type) {
      case CONSTANTS.SET_TOKEN_NOTIFICATIONS:
          if(action.token.length > 0){
              return  { ...state, token: action.token };
          };
      case CONSTANTS.SET_USER_TOKEN:
          console.log('action user', action)
          if(action.token.length > 0){
              return  { ...state, user: action.user };
          };
      case CONSTANTS.LOGOUT : 
          return initialState;   
      default:
          return state;
  }
}
  