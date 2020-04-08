import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, Dimensions, Image, Platform, ScrollView, TouchableOpacity } from 'react-native'
import SignUpForm from './forms/SignUpForm';
import { ActionSetLoading } from '../../store/actions/ActionApp';
import { ActionLogin, ActionRegisterUser } from '../../store/actions/ActionsAuthentication';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

class SignUp extends Component {
  saveUser = () => {
    const values = this.props.formSignUp.values; 
    Object.assign( values, {
      type_user : 'client',
    }) 
    this.props.registerUser(values);  
  };
    render() {
        return (
            <View style={{flex:1, backgroundColor:'black',}}>
                <TouchableOpacity onPress={()=>{ this.props.navigation.pop() }}>
                    <Image style={styles.logoBack}
                      source={require('../../../assets/icons/back-white.png')}/>
                </TouchableOpacity>
              <View style={{flex:1, alignItems:'center'}}>
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <Image style={styles.userImageContainer}
                        source={require('../../../assets/icons/logo-2.png')}/>
                        <Text style={{fontSize:30, fontFamily:'HermanoAlto Round', color:'#ffffff', paddingTop:12}}> DOMIS </Text>
                    </View>
                </View>
                <View style={styles.body}>
                    <View style={styles.viewTitle}>
                        <Text style={styles.textTitle}>Registrate!</Text>
                    </View>
                    <ScrollView>
                        <SignUpForm register={this.saveUser}/>             
                    </ScrollView>
                </View>
               </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        flex:1, 
        backgroundColor:'black',
        paddingBottom:5,
        borderBottomLeftRadius: 60,
        ...Platform.select({
          ios: {
            padding: 10,
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 3
            },
            shadowRadius: 5,
            shadowOpacity: 1.0
          },
          android: {
            elevation: 3,
          }
        })
    },
    logo:{
        flexDirection: 'row', 
        alignItems:'center', 
        justifyContent:'center',
    },
    body:{
      flex: 4,
      paddingTop:20,
      backgroundColor:'#ffffff',
      height: screenHeight / 1.2,
      width: screenWidth / 1.2,
      borderRadius: 20,
      paddingBottom:10
    },
    logoBack: {
        marginTop: 15,
        marginLeft:10,
        height: screenWidth * 40 / 375,
        width: screenWidth * 40 / 375,
        borderRadius: (screenWidth * 50 / 375) / 2,
    },
    userImageContainer: {
        marginLeft: 15,
        marginTop: 5,
        height: screenWidth * 40 / 375,
        width: screenWidth * 40 / 375,
        borderRadius: (screenWidth * 50 / 375) / 2,
    },
    textTitle: {
      fontSize:28,
      marginLeft:35,
      fontFamily:'Ubuntu-Bold'
    },
    viewTitle: {
      paddingBottom:15
    },
    textRegister:{
      fontFamily:'Ubuntu-Bold',
      color:'red'
    }
})

const mapStateToProps = state => ({
    formSignUp: state.form.SignUpForm,
});
  
const mapDispatchToProps = dispatch => ({
  registerUser: (data) => {
    console.log('mapDispatchToProps', data)
    dispatch(ActionSetLoading());
    dispatch(ActionRegisterUser(data));
  },
});
  
export default connect(mapStateToProps, mapDispatchToProps)(SignUp);