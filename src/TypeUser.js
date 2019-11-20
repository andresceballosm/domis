// import liraries
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { dataBase } from '../Store/Services/Firebase';
import { ActionTypeUSer } from '../Store/Actions/ActionTypeUser';
import { ActionGetDataClub } from '../Store/Actions/ActionGetDataClub';
import { ActionSetLoading, ActionStopLoading } from '../Store/Actions/ActionApp';
import { AdminRoutes } from './Authenticated/Admin/Routes/AdminRoutes';
import { PlayerRoutes } from './Authenticated/Players/Routes/PlayerRoutes';
import { StackNoAuthenticated } from './NoAuthenticated/StackNoAuthenticated';
import { ActionGetDataPlayers } from '../Store/Actions/ActionDataPlayers';
import { LoadingSmall } from './Utils/LoadingSmall';

// create a component
class TypeUSer extends Component {
  componentDidMount() {
    this.props.getTypeUser(this.props.userUid);
  }

  validateUser = (screenProps) => {
    switch (this.props.typeUser) {
      case 'admin':
        return <AdminRoutes screenProps={ screenProps } />
      case 'player':
        return <PlayerRoutes />
      default:
        return <StackNoAuthenticated />
    }
  }

  validateLoading = () => {
    if(this.props.loading === 'true'){
      return <LoadingSmall />
    } else {
      return <StackNoAuthenticated />
    }
  }

  render() {
    let image = new Object({urlImage:this.props.urlImage,typeUser:this.props.typeUser, clubname:this.props.dataClub.data});
    let screenProps = {...this.props.setting, ...image};
    return (
        <View style={styles.container} >
          { this.props.typeUser &&  this.props.dataClub.load ? this.validateUser(screenProps) : this.validateLoading() }
        </View> 
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = state => {   
    console.log('state in typeUser',state)
    return {
      userUid: state.ReducerSesion._user.uid,
      loading: state.app.loading,
      typeUser: state.ReducerTypeUser,
      setting: state.ReducerSettingClub,
      urlImage: state.ReducerGetUrlImage,
      dataClub: state.ReducerDataClub,
    }
};

const mapDispatchToProps = dispatch => ({
  getTypeUser: (uid) => {
    var userRef = dataBase.collection('users').doc(uid);
    userRef.get().then((data) => {
        dispatch(ActionSetLoading());
        if(data.exists){
          if(data._data.type === 'admin'){
            dispatch(ActionGetDataClub(uid));
          } else {
            dispatch(ActionGetDataPlayers(uid))
          }
          dispatch(ActionTypeUSer(data._data.type))
        } else {
          dispatch(ActionStopLoading());
        }
    })
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TypeUSer);

