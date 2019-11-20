import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, 
        View, 
        StyleSheet, 
        Dimensions, 
        Image, 
        Platform, 
        TouchableOpacity, 
        KeyboardAvoidingView,
        ScrollView } from 'react-native'
import SignInForm from './forms/SignInForm';
import { ActionSetLoading } from '../../store/actions/ActionApp';
import { ActionLogin } from '../../store/actions/ActionsAuthentication';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

class SignIn extends Component {
  userLogin= () => {
    const values = this.props.formSignIn.values; 
    this.props.login(values);
  }
  render() {  
    return (
      <View style={{flex:1}}>
        <ScrollView>
          <View style={styles.header}>
              <Image style={styles.userImageContainer}
                  source={require('../../../assets/icons/logo-2.png')}/>
              <Text style={{fontSize:30, fontFamily:'HermanoAlto Round', color:'#ffffff', paddingTop:12}}> DOMIS </Text>
          </View>
            <View style={styles.body} behavior="padding">
              <View style={styles.viewTitle}>
                <Text style={styles.textTitle}>Hola</Text>
                <Text style={styles.textTitle}>Inicia sesión!</Text>
              </View>
              <View style={{marginHorizontal:20}}>
                <SignInForm login={this.userLogin}/>
              </View>
            </View> 
            <View style={styles.viewRegister}>
              <Text>No estas registrado? </Text>
              <TouchableOpacity onPress={()=> this.props.navigation.navigate('SignUp')}>
                <Text style={styles.textRegister}> Registrarme</Text>
              </TouchableOpacity>
            </View>
        </ScrollView>
      </View>
    )
  }
}

const scaleToDimension = (size) => {
  return screenHeight * size / 375
};

const styles = StyleSheet.create({
    header: {
        flex:4, 
        backgroundColor:'black',
        height:170,
        marginBottom:5,
        flexDirection: 'row', 
        alignItems:'center', 
        justifyContent:'center',
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
            elevation: 20,
          }
        })
    },
    body:{
      flex: 3,
      paddingTop:20
    },
    viewRegister:{
      flex:1,
      paddingTop: scaleToDimension(20),
      flexDirection:'row',
      justifyContent:'center',
    },
    userImageContainer: {
        marginLeft: 15,
        marginTop: 5,
        height: screenWidth * 40 / 375,
        width: screenWidth * 40 / 375,
        borderRadius: (screenWidth * 50 / 375) / 2,
    },
    textTitle: {
      fontSize:30,
      marginLeft:35,
      fontFamily:'Ubuntu-Bold'
    },
    viewTitle: {
      paddingBottom:scaleToDimension(10)
    },
    textRegister:{
      fontFamily:'Ubuntu-Bold',
      color:'red'
    }
})

const mapStateToProps = state => {
  return{
    formSignIn: state.form.SignInForm,
  }
};
  
const mapDispatchToProps = dispatch => ({
  login: (data) => {
    dispatch(ActionSetLoading());
    dispatch(ActionLogin(data));
  },
});
  
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);