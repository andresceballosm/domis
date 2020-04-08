import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, ScrollView, TouchableOpacity, Image, Dimensions, StyleSheet, FlatList, Alert } from 'react-native'
import { Transition} from 'react-navigation-fluid-transitions'
import { Header } from 'react-navigation'
import { ActionSetLoading } from '../../../../store/actions/ActionApp';
import { ActionGetOrderDetails, ActionPutOrder } from '../../../../store/actions/ActionOrder';
import { CardOrderDetail } from '../../../../components/CardOrderDetail';
import { ButtonRegister, ButtonBackDown } from '../../../../components/ButtonRegister';
import { ActionGetStore, ActionGetStoresById } from '../../../../store/actions/ActionStores'
import { ActionSendPushNotication } from '../../../../store/actions/ActionNotifications'

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

class OrderDetail extends Component {

    acceptOrder = (id) => {
        const order = this.props.navigation.getParam('order', '');
        console.log('order', order);
        const navigation = this.props.navigation;
        Object.assign( order, {
            status : 'approved',
        }) 
        Alert.alert(
            'Aceptar pedido',
            'Esta seguro(a) que desea aceptar su pedido.',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {   text: 'Aceptar', onPress: () =>  {
                    this.props.updateOrder(  id, order, navigation, this.props.user.uid );
                    console.log('order.owner_id',order.owner_id);
                    this.props.sendPushNotification(
                        [order.owner_id], 
                        `${order.client} aceptó la modificación del pedido!`, 
                        'Nuevo pedido 2', 
                        'MatchApp', 
                        new Date()
                    )
                }},
            ],
            {cancelable: false},
        );  
    }

    cancelOrder = (id) => {
        const order = this.props.navigation.getParam('order', '');
        const navigation = this.props.navigation;
        Object.assign( order, {
            status : 'cancelled',
        }) 

        Alert.alert(
            'Cancelar pedido',
            'Esta seguro(a) que desea cancelar su pedido.',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {   text: 'Aceptar', onPress: () => {
                    this.props.updateOrder(  id, order, navigation, this.props.user.uid )
                    this.props.sendPushNotification(
                        [order.owner_id], 
                        `Ups! ${order.client} canceló su pedido!`, 
                        'Nuevo pedido 2', 
                        'MatchApp', 
                        new Date()
                    )
                }},
            ],
            { cancelable: false },
        );       
    }

    deliveredOrder = () => {
        const id = this.props.navigation.getParam('item', '');
        const order = this.props.navigation.getParam('order', '');

        const navigation = this.props.navigation;
        Object.assign( order, {
            status : 'delivered',
        })  
        this.props.updateOrder(  id, order, navigation, this.props.user.uid )
    }

    render() {
        const item = this.props.navigation.getParam('item', '');
        const color = this.props.navigation.getParam('color', '');
        const order = this.props.navigation.getParam('order', '');
        const products = order.products;

        return (
        <View style={styles.DetailMainContainer}>
            <Transition shared={item}>
                <View style={[styles.detailTopContainer, {backgroundColor:color}]}>
                    <View style={styles.navigationHeaderContainer}>
                        <ButtonBackDown
                        navigation = { this.props.navigation}
                        imageStyle = {{ width:scaleToDimension(30), height:scaleToDimension(30) }}
                        />
                    </View>
                    <View style={styles.detailTopBottomSubContainer}>
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            marginLeft:10,
                            fontSize: scaleToDimension(18),
                        }}>Pedido #{item}</Text>
                         <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            marginLeft:10,
                            fontSize: scaleToDimension(20),
                        }}>Total: ${order.total}</Text>
                    </View>
                </View>
            </Transition>
                <ScrollView style={{flex:1}}>
                    <View style={styles.list}>
                        <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={false}
                        extraData={products}
                        data={products}
                        renderItem={({item, index}) => this.renderCardProduct(item, index)}
                        />
                    </View>
                    {  order.status === 'unapproved'  ?
                    <View style={styles.btnAction}>
                        <View style={{alignItems:'center', justifyContent:'center'}}>
                            <Text style={{textAlign:'center'}}>Nota: Su pedido ha sido modificado debido a las existencias del negocio.</Text>
                            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:15}}>
                                <ButtonRegister 
                                title="Aceptar pedido" 
                                width={150}
                                fontSize={16}
                                click={  () => this.acceptOrder(item) }                           
                                invalid={ this.props.invalid } 
                                color="black"
                                />
                                <ButtonRegister 
                                title="Cancelar pedido" 
                                fontSize={16}
                                width={150}
                                click={  () => this.cancelOrder(item) }                           
                                invalid={ this.props.invalid } 
                                color="#8f4d4e"
                                />
                            </View>
                        </View>
                    </View> : <View></View>
                    }
                    { order.status === 'approved' || order.status === 'dispatched'  ?
                    <View style={[styles.btnAction, {marginVertical:10}]}>
                        <ButtonRegister 
                        title="Ya recibí mi pedido!" 
                        fontSize={18}
                        width={230}
                        click={  () => this.deliveredOrder() }                           
                        invalid={ this.props.invalid } 
                        color="black"
                        />
                    </View> : <View></View>
                    }
                    { order.status === 'pending' || order.status === 'processing'  ?
                    <View style={styles.btnAction}>
                        <ButtonRegister 
                        title="Cancelar pedido" 
                        fontSize={14}
                        click={  () => this.cancelOrder(item, this.props.user.jwt_token, order) }                           
                        invalid={ this.props.invalid } 
                        color="black"
                        />
                    </View> : <View></View>
                    }
                </ScrollView>
        </View>
        )
    }
    renderCardProduct(item, index) { 
        return <CardOrderDetail
                key={index}
                click={(item) => { console.log(item)}} 
                item={item} product={item} index = {index}
                />
    }
}

const scaleToDimension = (size) => {
    return screenWidth * size / 375
};

// All Styles related to design...
const styles = StyleSheet.create({
    navigationHeaderContainer: {
        height: Header.HEIGHT,
        width: screenWidth,
        color: "blue",
        justifyContent: 'center',
        marginTop:12,
        alignItems:'center'
    },
    detailTopBottomSubContainer: {
        width: screenWidth - 30,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 15,
        left: 15,
        right: 15,
    },
    DetailMainContainer: {
        flex: 1,
        backgroundColor:'white'
    },
    detailTopContainer: {
        position:'relative',
        height: scaleToDimension(150),
        width: screenWidth,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius:30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 3,
        borderRadius:10
    },
    btnAction:{
        flex:1,
        alignItems:'center'
    },
    list:{
        flex:4,
        marginBottom:10
    }
})

const mapStateToProps = state => {
    console.log('state', state);
    return {
        user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
        loading: state.ReducerLoading.loading,
        details: state.ReducerOrderDetails.details,
        products: state.ReducerProducts.productsDetails
    }
};
  
  const mapDispatchToProps = dispatch => ({
    getOrderDetails: (token, id) => {
      dispatch(ActionSetLoading());
      dispatch(ActionGetOrderDetails(token, id))
    },
    updateOrder:(id, order, navigation, uid) => {
        dispatch(ActionSetLoading());
        let type = 'client';
        let data = {id, order, uid, type}
        dispatch(ActionPutOrder(data))
        navigation.goBack()
    },
    sendPushNotification:(devices, body, subtitle, path, id) => {
        dispatch(ActionSendPushNotication({devices, body, subtitle, path, id}));
    }
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
