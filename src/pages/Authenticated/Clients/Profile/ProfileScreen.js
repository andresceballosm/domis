import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
    Text, 
    View, 
    TouchableOpacity, 
    Image, 
    Alert,
    SafeAreaView,
    Dimensions,
    ScrollView,
    TouchableWithoutFeedback,
    StyleSheet } from 'react-native'
import { Transition} from 'react-navigation-fluid-transitions'
import { Header } from 'react-navigation';
import { ActionLogout, ActionDeleteUser } from '../../../../store/actions/ActionsAuthentication.js';
import DeliveryForm from '../Orders/DeliveryForm'
import { ActionSetLoading } from '../../../../store/actions/ActionApp.js';
import { ButtonGeneral } from '../../../../components/ButtonRegister.js';
import { ActionSaveAddress, ActionGetAddress, ActionUpdateUser } from '../../../../store/actions/ActionOrder.js';
import { FieldSelect } from '../../../../components/Fields.js';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

class ProfileScreen extends Component {
    // static router = Navigator.router;
    static navigationOptions = {
        title: 'Profile',
        headerTintColor: '#ffffff',
        headerStyle: {
            backgroundColor: '#2F95D6',
            borderBottomColor: '#ffffff',
            borderBottomWidth: 3,
        },
        headerTitleStyle: {
            fontSize: 18,
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedTapBarIndex: 0,
            editable : false,
            address : null
        };
    }

    addAddress = () => {
        const address = this.props.form.values.address;
        const phone = this.props.form.values.phone;
        const note = this.props.form.values.note ?  this.props.form.values.note : 'Ninguna';
        const idUser = this.props.user.uid

        const newAddress = { address, phone, note };
        var adressNow = this.props.dataUser.address;
        if(adressNow === undefined){
            this.props.dataUser.address = [];
            this.props.dataUser.address.push(newAddress);
        } else {
            adressNow.push(newAddress);
        }
        const user  = this.props.dataUser;

        this.props.updateUser({user, idUser });
    }

    deleteUser = () => {
        Alert.alert(
            'Eliminar cuenta',
            'Esta seguro(a) de eliminar su cuenta, perderá todos sus datos y la comodidad de hacer perdidos a los negocios cercanos.',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {   text: 'Aceptar', onPress: () => this.props.deleteUser() },
            ],
            {cancelable: false},
        );       
    }

    onChange = ( value ) => {
        this.setState({ address:value })
    }

    render() {
        const { dataUser } = this.props;
        if(  dataUser.address && this.state.address == null ){
            this.setState({ address: dataUser.address[0]})
        }
        return (
            <SafeAreaView style={styles.mainContainer}>
                <ScrollView style={styles.mainContainer}>
                <View style={styles.topContainer}>
                    <Image style={styles.userImageContainer}
                           source={require('../../../../../assets/images/maxresdefault.jpg')}/>
                    <Text style={{marginLeft: 15, marginTop: 8, color: '#58647a'}}>
                        Hola!{"\n"}{dataUser ? dataUser.firstname : 'usuario' }
                    </Text>
                    <View style={{paddingBottom:10, paddingLeft:20}}>
                        <Text style={{
                            marginRight: 25,
                            marginTop: 30,
                            color: '#58647a',
                            fontSize: 30,
                            fontWeight: 'bold'
                        }}>
                            Mi dirección de entrega!
                        </Text>
                    </View>
                </View>  
                <View style={{flex:1, flexDirection:'row', marginBottom:10}}>
                    {/* <TouchableOpacity onPress={() => this.setState({editable : !this.state.editable})}>
                        <Image style={styles.edit}
                            source={require('../../../../../assets/icons/edit.png')}/>  
                    </TouchableOpacity>    */}
                    <TouchableOpacity 
                    style={styles.touchableAddress}
                    onPress={() => this.setState({editable : !this.state.editable})}>
                        <Image style={styles.edit}
                            source={require('../../../../../assets/icons/plus-100.png')}/>  
                    <Text style={styles.textTouchableAddress}>Agregar dirección</Text>    
                    </TouchableOpacity>   
                </View>
                { this.props.dataUser ?
                    <View style={{flex:4}}>
                        <View style={{ marginBottom:10, alignItems:'center', justifyContent:'center'}}>
                            <FieldSelect
                            data={ dataUser.address }
                            initialValue={this.state.address}
                            change={(value) => this.onChange(value)}
                            />
                        </View>
                    </View>
                    : <View></View>
                
                }
                { this.state.editable ?
                   <View style={{flex:4,marginTop:10, paddingHorizontal:20}}>         
                        <DeliveryForm 
                        //data={this.state.address} 
                        editable={this.state.editable}
                        note={false} 
                        addOrder={this.addAddress} 
                        buttonName="Guardar"/>
                    </View> : <View></View>
                }
                <View  style={[styles.bottomGridContainer, { marginTop: 50}]}>
                    <ButtonGeneral 
                    title="Cerrar sesion" 
                    click={() => this.props.closeSesion()}
                    color="#9c272c"
                    fontColor="white"
                    />
                </View>
                <View style={[styles.bottomGridContainer, {  }]}>
                    <ButtonGeneral 
                    title="Eliminar cuenta" 
                    click={() => this.deleteUser()}
                    color="white"
                    fontColor="#9c272c"
                    />
                </View>
            </ScrollView>
            </SafeAreaView>
        );
    }

    renderTapBarItem(item, index) {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    this.setState(previousIndex => {
                        return { selectedTapBarIndex: index };
                    });
                }}>
                <View style={{justifyContent: 'center', flex: 1}}>
                    <Text style={
                        {
                            marginLeft: 10,
                            marginRight: 10,
                            color: '#6471F4',
                            fontSize: 15, //this.state.selectedTapBarIndex == index ? 20 : 15,
                            fontWeight: this.state.selectedTapBarIndex == index ? 'bold' : 'normal',
                        }}>
                        {item['key']}
                    </Text>

                </View>
            </TouchableWithoutFeedback>
        );
    }

    renderGridItem(item, index) {
        return (
            <TouchableOpacity
                activeOpacity = {1}
                onPress={(event) => {
                    this.props.navigation.navigate('profileDetails', {item: item['key'], color: item['color']})
                }}>
                <Transition shared={item['key']}>
                    <View style={[styles.bottomGridItemContainer,{backgroundColor:item['color']}]}>
                        <Image style={styles.categoryImageContainer}
                            source={validateIcon(item['icon'])}/>
                        <Text style={{
                            marginLeft: 15,
                            marginRight: 10,
                            position: 'absolute',
                            bottom: 20,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 35,
                        }}>{item['key']}</Text>
                    </View>
                </Transition>
            </TouchableOpacity>
        );
    }

}

const scaleToDimension = (size) => {
    return screenWidth * size / 375
};


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    topContainer: {
        backgroundColor: 'white'

    },
    navigationHeaderContainer: {
        height: Header.HEIGHT,
        width: screenWidth,
        color: "blue",
        justifyContent: 'center'
    },
    bottomContainer: {
        alignItems: 'center',
        // height: screenHeight/2,
        backgroundColor: 'transparent'
    },
    userImageContainer: {
        marginLeft: 15,
        marginTop: 5,
        height: screenWidth * 50 / 375,
        width: screenWidth * 50 / 375,
        backgroundColor: 'lightgrey',
        borderRadius: (screenWidth * 50 / 375) / 2,
    },
    categoryImageContainer: {
        marginLeft: 15,
        marginTop: 5,
        height: 50,
        width: 50,
    },
    edit:{
        height:30,
        width:30,
        marginLeft:15
    },
    topSearchContainer: {
        height: screenWidth * 40 / 375,
        marginLeft: 15,
        marginTop: 15,
        marginBottom: 10,
        width: screenWidth - 30,
        backgroundColor: '#D2D7F3',
        flexDirection: 'row',
        borderRadius: 3,
    },
    bottomContainer: {
        alignItems: 'center',
        // height: screenHeight/2,
        backgroundColor: 'transparent'
    },
    bottomTabBarContainer: {
        height: 50.0,
        width: screenWidth,
        backgroundColor: 'transparent',
        flexDirection: 'column'
    },
    bottomGridContainer: {
        marginLeft: 5,
        width: screenWidth,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems:'center'
    },
    bottomGridItemContainer: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        width: screenWidth * 300 / 375,
        height: screenHeight / 2 - 70,
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 15
    },
    touchableAddress: {
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    textTouchableAddress:{
        fontSize:16, 
        marginLeft:5
    }
});


const mapStateToProps = state => {
    return {
      user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
      dataUser: state.ReducerUser && state.ReducerUser.user ? state.ReducerUser.user : false,
      loading: state.ReducerLoading.loading,
      form: state.form.DeliveryForm,
    }
  };
  
  const mapDispatchToProps = dispatch => ({
    closeSesion: () => {
      dispatch(ActionLogout());
    },
    deleteUser:() => {
        dispatch(ActionSetLoading());
        dispatch(ActionDeleteUser())
    },
    updateUser:(user) => {
        dispatch(ActionSetLoading());
        dispatch(ActionUpdateUser(user))
    },
    // getAddress:(token, id) => {
    //     dispatch(ActionSetLoading());
    //     dispatch(ActionGetAddress(token, id))
    // },
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
