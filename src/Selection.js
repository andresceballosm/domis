import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { StackNoAuthenticated } from './pages/NoAuthenticated/StackNoAuthenticated';
import { TabBarClients } from './pages/Authenticated/Clients/Routes/ClientsRoutes';
import { TabBarStores } from './pages/Authenticated/Stores/Routes/StoresRoutes';
import { dataBase } from './services/Firebase';
import { ActionSetLoading, ActionStopLoading } from './store/actions/ActionApp';
import { ActionTypeUSer } from './store/actions/ActionsAuthentication';
import { pushNotifications } from './services';
import { ActionGetTokenNotifications, ActionDeleteUserToken, ActionSetNotifications } from './store/actions/ActionNotifications';

class Selection extends Component {

  componentDidMount() {
    const { user, getTokensUser, token, deleteTokens, dateUser } = this.props;
    this.props.getTypeUser(user.uid);
    console.log('dateUser',dateUser)
    pushNotifications.checkPermission(
      user.uid, 
      getTokensUser, 
      token, 
      deleteTokens
    )
    pushNotifications.notificationListener(this.props.setNotifications);
    pushNotifications.notificationOpenBackListener()
    pushNotifications.notificationOpenedListener(this.props.setNotifications);
  }

  componentWillUnmount(){
    pushNotifications.notificationListener(this.props.setNotifications);
    pushNotifications.notificationOpenedListener(this.props.setNotifications);
  }

  validateUser = () => {
    switch (this.props.type_user) {
      case 'client':
        return <TabBarClients /> 
      case 'owner':
        return <TabBarStores />
      default:
        return <StackNoAuthenticated />
    }
  }

  render(){
    return (
      <View style={styles.container}>
        { this.props.type_user ? this.validateUser() : <StackNoAuthenticated/> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = state => {
  console.log('state', state);
  return {
    user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
    dateUser: state.ReducerUser && state.ReducerUser.user ? state.ReducerUser.user : false,
    loading: state.ReducerLoading.loading,
    type_user:state.ReducerTypeUser,
    token: state.ReducerTokenNotifications.token
  }
};

const mapDispatchToProps = dispatch => ({
  getTypeUser: (uid) => {
    var userRef = dataBase.collection('users').doc(uid);
    userRef.get().then((data) => {
        dispatch(ActionSetLoading());
        if(data.exists){
          dispatch(ActionTypeUSer(data._data.type_user))
          dispatch(ActionStopLoading());
        } else {
          dispatch(ActionStopLoading());
        }
    })
  },
  getTokensUser:(id) => {
    dispatch(ActionSetLoading());
    dispatch(ActionGetTokenNotifications(id))
    dispatch(ActionStopLoading());
  },
  deleteTokens:(tokens) => {
      dispatch(ActionSetLoading());
      dispatch(ActionDeleteUserToken(tokens))
      dispatch(ActionStopLoading());
  },
  setNotifications : () => {
    dispatch(ActionSetNotifications())
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Selection);
