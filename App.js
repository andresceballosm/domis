import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import Selection from './src/Selection';
import { StackNoAuthenticated } from './src/pages/NoAuthenticated/StackNoAuthenticated';
import { LoadingSmall } from './src/components/LoadingSmall';
import { authentication } from './src/services/Firebase';
import { ActionSetSesion, ActionLogout, ActionSetSesionGoogle } from './src/store/actions/ActionsAuthentication';

class App extends Component {

  componentDidMount(){
    this.props.authentication();
  }

  render() {
    return (
      <View style={styles.Content}>
        { this.props.user ? 
          <Selection user={this.props.user}/>
          : 
          <StackNoAuthenticated /> }
        { this.props.loading === 'true' && (
          <LoadingSmall />
        )}
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