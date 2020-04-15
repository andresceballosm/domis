import React, { Component, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { StyleSheet, View, Platform, StatusBar } from 'react-native';
import Selection from './src/Selection';
import { StackNoAuthenticated } from './src/pages/NoAuthenticated/StackNoAuthenticated';
import { LoadingSmall } from './src/components/LoadingSmall';
import { authentication } from './src/services/Firebase';
import { ActionLogout, ActionSetSesionGoogle } from './src/store/actions/ActionsAuthentication';


class App extends Component {
  componentDidMount(){
    SplashScreen.hide();
    this.props.authentication();
  }

  render() {

    // useEffect(() => {
    //   SplashScreen.hide();
    // }, []);

    return (
      <Fragment>
        { Platform.OS === 'ios' && <StatusBar barStyle="dark-content" /> }
        <View style={styles.Content}>
          { this.props.user ? 
            <Selection user={this.props.user}/>
            : 
            <StackNoAuthenticated /> }
          { this.props.loading && (
            <LoadingSmall />
          )}
        </View>
      </Fragment>
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
      console.log('usuario', usuario)
      if (usuario) {
        dispatch(ActionSetSesionGoogle(usuario));
      } else {
        dispatch(ActionLogout());
      }
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);