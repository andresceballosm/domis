import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, 
    View, 
    Alert, 
    Dimensions, 
    FlatList, 
    Image, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity } from 'react-native'
import { Transition} from 'react-navigation-fluid-transitions'
import { Header } from 'react-navigation';
import { CardBasket } from '../../../../components/CardBasket';
import DeliveryForm from './DeliveryForm'
import { ActionRemoveProductBasket, 
    ActionReducerProductBasket, 
    ActionAddQuantityProductBasket, 
    ActionCreateOrder } from '../../../../store/actions/ActionStores';
import { showAlertError } from '../../../../components/Alerts';
import { ActionSetLoading } from '../../../../store/actions/ActionApp';
import { ActionGetUser, ActionUpdateUser } from '../../../../store/actions/ActionOrder';
import { ButtonBackDown, ButtonRegister } from '../../../../components/ButtonRegister';
import moment from "moment";
import 'moment/locale/es'
import { ActionSendPushNotication } from '../../../../store/actions/ActionNotifications';
import geohash from "ngeohash";
import Address from '../../../../components/Address';
import Geocoder from 'react-native-geocoding';

let screenWidth = Dimensions.get('window').width;

class BasketScreen extends Component {
    state = {
        address : null,
        detail: '',
        visibleAddress : false,
        addressLocation : ''
    }

    componentDidMount(){
        this.props.getUser(this.props.user.uid);
        try {
            console.log('this.props.dataUser',this.props.dataUser)
            if(  this.props.dataUser.address.length > 0 && this.state.address == null ){
                console.log('entraaa')
                this.setState({ 
                    address: this.props.dataUser.address[0].address, 
                    detail:  this.props.dataUser.address[0].detail
                })
            }
        } catch (error) {
          console.log(error)  
        }
    };

    componentWillReceiveProps(newProps){
        if(newProps.dataUser !== this.props.dataUser){
            console.log('componentWillReceiveProps')
            try {
                if(newProps.dataUser.address.length > 0){
                    this.setState({address : newProps.dataUser.address[0].address});
                }
            } catch (error) {
                
            }
        }
    };

    addQuantity = (idProduct) => {
        this.props.addQuantity(idProduct)
    };

    reduceQuantity = (idProduct) => {
        this.props.reduceQuantity(idProduct)
    }

    deleteProduct = (idProduct) => {
        this.props.deleteProduct(idProduct)
    }

    addOrder = () => {
        if(this.props.basket.addedItems.length > 0){
            const store_id =  this.props.navigation.getParam('idStore', '');
            const stores = this.props.stores.stores;
            var store_name = '';
            var owner_id = '';
            for (let i = 0; i < stores.length; i++) {
                const id = stores[i]._ref._documentPath._parts[1];
                if(id === store_id){
                    store_name = stores[i]._data.name;
                    owner_id = stores[i]._data.owner_id
                }
            }
            const user_id = this.props.user.uid;
            moment.locale('en');
            const created_at = moment().format('l');
            const time = moment().format('LT');
            const total = this.props.basket.total;
            const status = 'pending';
            const products = this.props.basket.addedItems;
            const address = this.props.dataUser.address[0].address;
            const detail = this.props.dataUser.address[0].detail
            const phone = this.props.dataUser.address[0].phone;
            const client = this.props.dataUser.firstname + ' ' + this.props.dataUser.lastname;
            Alert.alert(
                'Realizar pedido',
                'Esta seguro(a) de realizar su pedido.',
                [
                    {
                        text: 'Cancelar',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {   text: 'Aceptar', onPress: () => {
                        this.props.addOrder({
                            store_id,
                            store_name,
                            client, total,
                            status,
                            products,
                            address,
                            phone,
                            detail,
                            user_id,
                            owner_id, 
                            created_at, 
                            time
                        }, this.props.navigation)
                        this.props.sendPushNotification(
                            [owner_id], 
                            'Tienes un nuevo pedido!', 
                            'Nuevo pedido 2', 
                            'MatchApp', 
                            new Date()
                        )
                    } },
                ],
                {cancelable: false},
            );
        } else {
            showAlertError('No hay productos en la cesta aún!')
        }
    }

    onChange = ( value ) => {
        this.setState({ address:value })
    };

    addAddress = (address,phone,detail) => {
        console.log('this.props.position',this.props.position)
        const { latitude, longitude } = this.props.position.position;
        const idUser = this.props.user.uid;
        const hash = geohash.encode(latitude, longitude);
        const newAddress = { address, phone, detail, geohash : hash };
        var adressNow = this.props.dataUser.address;
        console.log('adressNow',adressNow);
        if(adressNow === undefined){
            this.props.dataUser.address = [];
            this.props.dataUser.address.push(newAddress);
        } else {
            adressNow.push(newAddress);
        }
        const user  = this.props.dataUser;
        this.setState({ visibleAddress:false })
        this.props.updateUser({user, idUser });
    };

    updateAddressPosition = ( address ) => {
        const idUser = this.props.user.uid
        this.setState({ visibleAddress:false })
        this.props.dataUser.address = address;
        const user  = this.props.dataUser;
        this.props.updateUser({user, idUser });
    };

    getAddress = (lat,lng) => { 
        Geocoder.init("AIzaSyACPfd5eBKP1GI1XDrLMB_Sm_eGD_VRC7Y", {language : "es"});
        Geocoder.from(lat,lng)
        .then(json => {
            console.log('json', json);
        		var addressComponent = json.results[0].address_components[1].long_name + ' # ' + json.results[0].address_components[0].long_name;
                this.setState({addressLocation : addressComponent})
                console.log('addressComponent',addressComponent);
        })
        .catch(error => console.warn(error));
    }

    showModalAddress = () => {
        const { latitude, longitude } = this.props.position.position;;
        this.getAddress(latitude, longitude)
        this.setState({visibleAddress : !this.state.visibleAddress})
    }

    render() {
        const { basket, dataUser, position } = this.props;
        console.log('this.props.dataUser', dataUser);
        console.log('position',position)
        return (
            <View style={{flex:1, backgroundColor:'white'}}>
                <Transition style={{flex:1}} shared={'basket'}>
                    <View style={[styles.detailTopContainer]}>
                        <View style={styles.detailTopBottomSubContainer}>
                            <Text style={styles.titleHeader}>Cesta</Text> 
                            { this.state.address ? 
                            <View>
                                <Text style={{color:'white', marginLeft:10}}>{this.state.address}</Text>                  
                                <Text style={{color:'white', marginLeft:10}}>{this.state.detail}</Text>    
                            </View>     
                            : 
                            <TouchableOpacity 
                            style={styles.touchableAddress}
                            onPress={() => this.showModalAddress()}>
                                <Text style={{color:'white', marginLeft:10}}>Agregar dirección</Text>  
                                <Image style={styles.edit}
                                source={require('../../../../../assets/icons/down-white.png')}/>   
                            </TouchableOpacity>
                            }  
                            <Address 
                            dataUser={this.props.dataUser}
                            addressLocation={this.state.addressLocation}
                            addAddress={(address,phone,detail) => this.addAddress(address,phone,detail)} 
                            updateAddressPosition={(address) => this.updateAddressPosition(address)}
                            close={() => this.setState({ visibleAddress:false })}
                            visibleAddress={this.state.visibleAddress} />        
                        </View>
                        <View style={styles.navigationHeaderContainer}>
                            <ButtonBackDown 
                            navigation = { this.props.navigation}
                            imageStyle = {{ width:scaleToDimension(30), height:scaleToDimension(30) }}
                            />
                        </View>
                    </View>
                </Transition>
                <View style={{flex:3}}>
                    { basket.addedItems ?
                    <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={false}
                    data={basket.addedItems}
                    extraData={basket}
                    renderItem={({item, index}) => this.renderProductsCard(item, index)}
                    /> :
                    <View style={{alignItems:'center', justifyContent:'center',marginTop:20}}>
                        <Text>No hay productos en la cesta.</Text>
                    </View>
                    }
                </View>     
                <View style={{ flex:2.5, paddingHorizontal:30, paddingTop:15, marginBottom:10}}>
                    <ScrollView>
                        <Text style={styles.titleFooter}>Información de pago</Text>
                        <View style={{ flex:1, flexDirection:'row', marginTop:25}}>
                            <View style={{flex:1}}>
                                <Text style={styles.subtitleHeader}>Costo</Text>
                            </View>
                            <View style={{flex:1, alignItems:'flex-end'}}>
                                <Text style={styles.subtitleHeaderl}> $ {basket.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                            </View>
                        </View>
                        <View style={{ flex:1, flexDirection:'row', marginBottom:3}}>
                            <View style={{flex:1}}>
                                <Text style={styles.subtitleHeader}>Servicio</Text>
                            </View>
                            <View style={{flex:2.5, alignItems:'flex-end'}}>
                                <Text style={styles.subtitleHeaderl}> $ 500</Text>
                            </View>
                        </View>
                        <View style={{ flex:1, flexDirection:'row', marginBottom:3}}>
                            <View style={{flex:1}}>
                                <Text style={styles.subtitleHeaderl}>Total</Text>
                            </View>
                            <View style={{flex:2.5, alignItems:'flex-end'}}>
                                <Text style={styles.subtitleHeaderl}> $ {(basket.total + 500).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                            </View>
                        </View>
                        <View style={{ flex:1, flexDirection:'row', marginBottom:3, marginTop:3}}>
                            <View style={{flex:1}}>
                                <Text style={styles.subtitleHeader}>Medio de pago</Text>
                            </View>
                            <View style={{flex:1, alignItems:'flex-end'}}>
                                <Text style={styles.subtitleHeaderl}> Efectivo</Text>
                            </View>
                        </View>
                        <Text style={{fontSize:10}}>*Proximamente pagos con tarjeta de crédito y débito.</Text>
                    </ScrollView>          
                </View>  
                { !this.state.address && (
                    <Text style={{fontSize:10, textAlign:'center', color:"#9c272c"}}>
                        *Debe agregar una dirección para poder hacer su pedido.
                    </Text>
                    )}    
                <View style={{flex:.5, paddingHorizontal:20, alignItems:'center', marginBottom:15, paddingTop:5}}>     
                    <ButtonRegister 
                    title="Pedir" 
                    invalid={!this.state.address}
                    click={ this.addOrder }                            
                    color="black"/>    
                </View>      
               
            </View>
        )
    }

    renderProductsCard(item, index) {
        return <CardBasket 
                enabled = { true }
                clickAdd= {(product) => { this.addQuantity(product)}} 
                clickReduce= {(product) => { this.reduceQuantity(product)}} 
                deleteProduct= {(product) => { this.deleteProduct(product)}}
                item={item} index = {index}/>
    }
}

const scaleToDimension = (size) => {
    return screenWidth * size / 375
};

const styles = StyleSheet.create({
    DetailMainContainer: {
        flex: 1,
        backgroundColor:'#ffffff'
    },
    detailTopContainer: {
        flexDirection:'row',
        backgroundColor:'black',
        height: scaleToDimension(100),
        width: screenWidth,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius:20,
    }, 
    body:{
        height: scaleToDimension(240),
        width: screenWidth,
        backgroundColor:'white',
        paddingBottom:10,
    },
    footer:{
        height: scaleToDimension(250),
        width: screenWidth,
        backgroundColor:'white',
        paddingHorizontal:15,
        borderTopWidth:.5
    },  
    viewTitleFooter:{
       marginBottom:10
    },
    titleFooter:{
        fontSize:20,
        fontFamily:'Ubuntu-Bold',
        textAlign:'center'
    },  
    navigationHeaderContainer: {
        flex:1,
        color: "blue",
        justifyContent: 'center',
        alignItems:'center',
    },
    detailTopBottomSubContainer: {
        flex:3,
        justifyContent:'flex-end',
        backgroundColor: 'transparent',
        padding:10
    },
    titleHeader:{
        fontFamily:'Ubuntu-Bold',
        color: 'white', 
        fontSize: scaleToDimension(24),
        marginLeft:10
    },
    subtitleHeader:{
        fontSize: scaleToDimension(15),
    },
    subtitleHeaderl:{
        fontFamily:'Ubuntu-Bold',
        fontSize: scaleToDimension(15),
    },
    totalText:{
        fontFamily:'Ubuntu-Bold',
        color: 'white', 
        fontSize: scaleToDimension(25),
        marginLeft:10
    },
    textRegister:{
        fontFamily:'Ubuntu-Bold',
        color:'red'
    },
    button: {
        height: scaleToDimension(70),
        alignItems:'center',
        justifyContent:'center',
        paddingBottom:15
    },
    touchableAddress: {
        marginTop:5,
        flexDirection:'row',
        alignItems:'center',
    },
    textTouchableAddress:{
        color: '#58647a',
        fontSize:12, 
        marginLeft:5
    },
    edit:{
        height:15,
        width:15,
        marginLeft:5
    },
})

const mapStateToProps = state => {
    return {
        user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
        dataUser: state.ReducerUser && state.ReducerUser.user ? state.ReducerUser.user : false,
        loading: state.ReducerLoading.loading,
        categories: state.ReducerCategories,
        position: state.ReducerPosition,
        stores: state.ReducerStores,
        dataProducts: state.ReducerProducts,
        basket: state.ReducerBasket,
        form: state.form.DeliveryForm,
    }
};
  
  const mapDispatchToProps = dispatch => ({
    addQuantity: (idProduct ) => {
      dispatch(ActionAddQuantityProductBasket(idProduct))
    },
    reduceQuantity:(idProduct ) => {
        dispatch(ActionReducerProductBasket(idProduct))
    },
    deleteProduct:(idProduct ) => {
        dispatch(ActionRemoveProductBasket(idProduct))
    },
    addOrder:(order, navigation) => {
        dispatch(ActionSetLoading());
        dispatch(ActionCreateOrder({order,navigation}))
    },
    getUser:(id) => {
        dispatch(ActionSetLoading());
        dispatch(ActionGetUser(id))
    },
    sendPushNotification:(devices, body, subtitle, path, id) => {
        dispatch(ActionSendPushNotication({devices, body, subtitle, path, id}));
    },
    updateUser:(user) => {
        dispatch(ActionSetLoading());
        dispatch(ActionUpdateUser(user))
    },
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(BasketScreen);


