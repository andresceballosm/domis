import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, 
        View, 
        StyleSheet, 
        Dimensions, 
        Image, 
        Platform, 
        TouchableOpacity, 
        Modal,
        Alert,
        ScrollView } from 'react-native'
import SignInForm from './forms/SignInForm';
import { ActionSetLoading } from '../../store/actions/ActionApp';
import { ActionLogin, ActionLoginWithGoogle, ActionRecoverPassword } from '../../store/actions/ActionsAuthentication';
import { ButtonGoogle, ButtonGeneral } from '../../components/ButtonRegister';
import { InputFloat } from '../../components/Fields';
import firebase from 'react-native-firebase';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      email: ''
    };
  }
  userLogin= () => {
    const values = this.props.formSignIn.values; 
    this.props.login(values);
  }
  googleLogin = () => {
    this.props.loginWithGoogle()
  }

  forgotPassword = () => {
    this.setState({ visibleModal : true})
  } 

  sendRecoverPassword = () => {
    Alert.alert(
      'Recuperar contraseña',
      `${'Seguro(a) que es su correo' + ' ' + this.state.email }`,
      [
          {
              text: 'Cancelar',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
          },
          {   text: 'Aceptar', onPress: () => { 
            this.props.recoverPassword(this.state.email);
            this.setState({ visibleModal : false }) 
          }},
      ],
      {cancelable: false},
  );    
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
            <View style={{flexDirection:'row'}}>
              <View style={{flex:2}}>
                <Text style={styles.textTitle}>Hola</Text>
                <Text style={styles.textTitle}>Inicia sesión!</Text>
              </View>
              <View style={{ flex:1, alignItems:'flex-end', marginRight:15 }}>
                <ButtonGoogle  click={()=> this.googleLogin()}/>
              </View>
            </View>
            <View style={{ marginHorizontal:20 }}>
              <SignInForm login={this.userLogin} forgotPassword={this.forgotPassword}/>             
            </View>
          </View> 
          <View style={styles.viewRegister}>
            <Text>No estas registrado? </Text>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate('SignUp')}>
              <Text style={styles.textRegister}> Registrarme</Text>
            </TouchableOpacity>
          </View>
          <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleModal}>
              <View style={styles.modalBackground}>
                  <TouchableOpacity
                  style={{flex:1, alignItems:'flex-end', marginTop:30}}
                  onPress={()=> this.setState({ visibleModal : false })}> 
                      <Image 
                      style={styles.userImageContainer1}
                      source={require('../../../assets/icons/down.png')}/>
                  </TouchableOpacity>
                  <View style={styles.bodyModal}>
                    <View>
                      <Text style={styles.titleColor}>Olvidó</Text>
                      <Text style={styles.titleColor}>su contraseña?</Text>
                    </View>
                    <View  style={[styles.bottomGridContainer, { marginTop: 50}]}>
                      <InputFloat 
                      name= "email" 
                      style= {{color:'white'}}
                      label= "Correo electrónico" 
                      keyboardType= "email-address" 
                      onChange= { (email) => this.setState({email : email})}
                      ph="Ingrese su correo electrónico registrado" />
                    </View>
                    <View style={{ marginTop:30 }}>
                      <ButtonGeneral 
                      title="Recuperar" 
                      click={() => this.sendRecoverPassword()}
                      color="#9c272c"
                      fontColor="white"
                      />
                    </View>
                  </View>
              </View>
          </Modal>
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
        flex:3, 
        backgroundColor:'black',
        height:150,
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
            elevation: 3,
          }
        })
    },
    body:{
      flex: 2,
      paddingTop:15
    },
    viewRegister:{
      flex:1,
      paddingTop: scaleToDimension(18),
      flexDirection:'row',
      justifyContent:'center',
    },
    titleColor:{
      fontSize:30,
      color:'white',
      fontFamily:'Ubuntu-Bold'
    },
    userImageContainer: {
        marginLeft: 15,
        marginTop: 5,
        height: screenWidth * 40 / 375,
        width: screenWidth * 40 / 375,
        borderRadius: (screenWidth * 50 / 375) / 2,
    },
    textTitle: {
      fontSize:25,
      marginLeft:35,
      fontFamily:'Ubuntu-Bold'
    },
    textRegister:{
      fontFamily:'Ubuntu-Bold',
      color:'red'
    },
    modalBackground: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(52, 52, 52, 1)',
      height:200
    },
    bodyModal:{
        flex:5,
        alignItems:'center'
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
  loginWithGoogle:() => {
    dispatch(ActionSetLoading());
    dispatch(ActionLoginWithGoogle())
  },
  recoverPassword:(email) => {
    dispatch(ActionRecoverPassword(email));
  }
});
  
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);