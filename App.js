import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import Selection from './src/Selection';
import { StackNoAuthenticated } from './src/pages/NoAuthenticated/StackNoAuthenticated';
import { LoadingSmall } from './src/components/LoadingSmall';
import { authentication } from './src/services/Firebase';
import { ActionSetSesion, ActionLogout } from './src/store/actions/ActionsAuthentication';

class App extends Component {
  componentDidMount() {
    this.props.authentication();
  }
  render() {
    const LoadingStatus = () => {
      if (this.props.loading == 'true')
         return <LoadingSmall />      
      return null;
    }; 

    return (
      <View style={styles.Content}>
          { LoadingStatus()}
          { this.props.user ? 
            <Selection user={this.props.user}/>
            : 
            <StackNoAuthenticated /> }
      </View>
    );
  }
};

const styles = StyleSheet.create({
  Content: {
    flex: 1,
  }
});

const mapStateToProps = state => {
  return {
    user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
    loading: state.ReducerLoading.loading,
  }
};

const mapDispatchToProps = dispatch => ({
  authentication: () => {
    authentication.onAuthStateChanged((usuario) => {
      if (usuario) {
        //dispatch(ActionGetTokenNotifications(usuario._user.uid));
        console.log('usuario que inicia', usuario)
        dispatch(ActionSetSesion(usuario));
      } else {
        dispatch(ActionLogout());
      }
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);