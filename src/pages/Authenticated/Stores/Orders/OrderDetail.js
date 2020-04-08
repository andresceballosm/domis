import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, TouchableOpacity, Image, Dimensions, StyleSheet, FlatList, Alert } from 'react-native'
import { Transition} from 'react-navigation-fluid-transitions'
import { Header } from 'react-navigation'
import { ActionSetLoading } from '../../../../store/actions/ActionApp';
import { ActionGetOrderDetails, ActionPutOrder, ActionReducerProductOrder, ActionAddQuantityProductOrder } from '../../../../store/actions/ActionOrder';
import { CardOrderDetail } from '../../../../components/CardOrderDetail';
import { ButtonRegister } from '../../../../components/ButtonRegister';
import StepIndicator from 'react-native-step-indicator';
import { CardBasket } from '../../../../components/CardBasket'
import { showAlertError } from '../../../../components/Alerts'
import { ActionSendPushNotication } from '../../../../store/actions/ActionNotifications'

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

const labels = ["Pendiente","En proceso", "Por aprobar", "Aprobado", "Despachado","Entregado", "Cancelado"];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#28c996',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#28c996',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#28c996',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#28c996',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#28c996',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 9,
  currentStepLabelColor: '#28c996'
}
var productsOrigin= [];
class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            invalid:true,
            products: [],
            total: 0,
            changes:[],
        }
      }

    componentDidMount(){
        let order = this.props.navigation.getParam('order', '');
        let allProducts = order.products;
        let total = order.total;
        this.setState({ products : allProducts, total : total })
    }

    areChanges = () => {
        let products = this.state.products;
        let changes = this.state.changes;
        let areChanges = false;
        products.forEach(product => {
            let productExist = changes.filter(change => change.id === product.id);
            if(productExist){
                for (let i = 0; i < productExist.length; i++) {
                    if( parseInt(productExist[i].quantityOrigin) !== parseInt(product.quantityProduct) ){
                        console.log('entraa')
                        areChanges = true;
                    }
                }
            }
        });

        return areChanges;
    }

    registerChangeOrder = ( idProduct, product) => {
        var newChanges = this.state.changes;

        if(newChanges.length > 0 ) {
            //Se verifica que el producto ya no haya ingresado al listado de productos
            //modificados
            let productExist = newChanges.filter(product => product.id === idProduct);
            if(productExist.length === 0){
                newChanges.push(
                    { 
                    'id' : idProduct,
                    'quantityOrigin' : product.quantityProduct
                    }
                )
            };   
        } else {
            newChanges.push(
                { 
                'id' : idProduct,
                'quantityOrigin' : product.quantityProduct
                }
            )
        }

        return newChanges;
    }

    addQuantity = (idProduct) => {
        let products = this.state.products;
        let total = this.state.total;
        var changes;

        products.forEach(product => {
            if(product.id === idProduct ){
                changes = this.registerChangeOrder(idProduct,product);
                product.quantityProduct = product.quantityProduct + 1;
                total = total + product.price;
            }
        });
        this.setState({ products : products, total : total , changes :  changes })
    }

    reduceQuantity = (idProduct) => {
        let products = this.state.products;
        let total = this.state.total;
        var changes;

        products.forEach(product => {
            if(product.id === idProduct ){
                changes = this.registerChangeOrder(idProduct,product);
                product.quantityProduct = product.quantityProduct - 1;
                total = total - product.price;
            }
        });
        this.setState({ products : products, total : total , changes :  changes })
    }

    deleteProduct = (idProduct) => {
        // let products = this.state.products.filter(product => product.id !== idProduct);
        // this.setState({products : products})
        showAlertError('No es posible eliminar el producto, si es necesario iguale la cantidad del prodcuto a 0')
    }

    cancelOrder = () => {
        const order = this.props.navigation.getParam('order', '');
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
                    this.sendOrder('cancelled')
                }},
            ],
            {cancelable: false},
        );       
    }

    acceptOrder = () => {
        const order = this.props.navigation.getParam('order', '');
        Alert.alert(
            'Aceptar pedido',
            'Esta seguro(a) que desea aceptar este pedido.',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {   text: 'Aceptar', onPress: () =>  { 
                    console.log('order aceptada', order);
                    // this.props.sendPushNotification(
                    //     [order.user_id], 
                    //     `${order.store_name} esta procesando tú pedido.`, 
                    //     'Nuevo pedido 2', 
                    //     'MatchApp', 
                    //     new Date()
                    // ) 
                    this.sendOrder('accepted')
                }},
            ],
            {cancelable: false},
        );  
    }

    areObjEquals = (o1, o2) => {
        for(var p in o1){
            if(o1.hasOwnProperty(p)){
                if(o1[p].quantityProduct !== o2[p].quantityProduct){
                    return false;
                }
            }
        }
        return true;
    }

    sendOrder = (newStatus) => {
        const id = this.props.navigation.getParam('item', '');
        const order = this.props.navigation.getParam('order', '');
        order.products = this.state.products;
        order.total = this.state.total;
        const navigation = this.props.navigation;
        let areChanges = this.areChanges()

        if( areChanges ){
            Object.assign( order, {
                status : 'unapproved',
            })   
        } else if( newStatus === 'cancelled') {
            Object.assign( order, {
                status : 'cancelled',
            })  
        } else {
            Object.assign( order, {
                status : 'processing',
            })   
        }
        const store_id = this.props.store.store.store_id;
        this.props.editOrder( id, order, store_id, navigation )
        if( areChanges ){
            this.props.sendPushNotification(
                [order.user_id], 
                `${order.store_name} modificó tú pedido.`, 
                new Date()
            )
        } else if( newStatus === 'cancelled') {
            this.props.sendPushNotification(
                [order.user_id], 
                `${order.store_name} a canceladó tú pedido.`, 
                new Date()
            )
        } else if(newStatus === 'accepted'){
            this.props.sendPushNotification(
                [order.user_id], 
                `${order.store_name} esta procesando tú pedido.`, 
                new Date()
            )
        }
    }

    deliveredOrder = (type) => {
        const id = this.props.navigation.getParam('item', '');
        const order = this.props.navigation.getParam('order', '');
        const navigation = this.props.navigation;
        const store_id = this.props.store.store.store_id;

        if(type === 'delivered'){
            Object.assign( order, {
                status : 'delivered',
            }) 
        } else {
            Object.assign( order, {
                status : 'dispatched',
            }) 
        }
 
        this.props.editOrder( id, order, store_id, navigation )
        if(type == 'dispatched'){
            this.props.sendPushNotification(
                [order.owner_id], 
                `${order.store_name} despachó su pedido!`, 
                new Date()
            )
        }
    }

    status = (status) => {
        switch (status) {
            case "pending":
                return 0
            case "processing":
                return 1
            case "unapproved":
                return 2
            case 'approved':
                return 3
            case 'dispatched':
                return 4
            case "delivered":
                return 5
            case "cancelled":
                return 6
            default:
                break;
        }
    }

    render() {
        const item = this.props.navigation.getParam('item', '');
        const color = this.props.navigation.getParam('color', '');
        const order = this.props.navigation.getParam('order', '');
        console.log('order.status', order.status)
        return (
        <View style={styles.DetailMainContainer}>
            <Transition shared={item}>
                <View style={[styles.detailTopContainer, {backgroundColor:color}]}>
                    <View style={styles.navigationHeaderContainer}>
                        <TouchableOpacity 
                            onPress={() => {
                                this.props.navigation.navigate('orders')
                            }}>
                        <Image style={{width:30, height:30}}
                            source={require('../../../../../assets/icons/down.png')}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.detailTopBottomSubContainer}>
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            marginLeft:10,
                            fontSize: scaleToDimension(14),
                        }}>Pedido #{item}</Text>
                         <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            marginLeft:10,
                            fontSize: scaleToDimension(14),
                        }}>Cliente: {order.client}</Text>
                         <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            marginLeft:10,
                            fontSize: scaleToDimension(14),
                        }}>Dirección: {order.address}</Text>
                         <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            marginLeft:10,
                            fontSize: scaleToDimension(14),
                        }}>Teléfono: {order.phone}</Text>
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            marginLeft:10,
                            fontSize: scaleToDimension(20),
                        }}>Total: ${this.state.total}</Text>
                    </View>
                </View>
            </Transition>
            <View style={{flex:1}}>
                <View style={styles.list}>
                    <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={false}
                    extraData={this.state}
                    data={this.state.products}
                    renderItem={({item, index}) => this.renderProductsCard(item, index)}
                    />      
                </View>
                <StepIndicator
                    customStyles={customStyles}
                    stepCount={7}
                    currentPosition={this.status(order.status)}
                    labels={labels}
                /> 
                { order.status === 'pending' && (
                <View style={[ styles.btnAction, { flexDirection:'row', justifyContent:'center',  marginTop:15 } ]}>
                    <ButtonRegister 
                    title="Aceptar" 
                    width={150}
                    fontSize={16}
                    style={{marginBottom:10}}
                    click={  () =>  
                        this.acceptOrder()
                        //this.setState({modalVisible:true}) 
                    }                           
                    invalid={ this.props.invalid } 
                    color="black"
                    />
                    <ButtonRegister 
                    title="Cancelar" 
                    width={150}
                    fontSize={16}
                    click={  () => this.cancelOrder() }                           
                    invalid={ this.props.invalid } 
                    color="#8f4d4e"
                    />
                </View> 
                )}
                { order.status === 'approved' || order.status === 'processing'  ? 
                <View style={[styles.btnAction, { marginTop:15 }]}>
                    <ButtonRegister 
                    title="Despachar" 
                    width={230}
                    fontSize={18}
                    click={  () => this.deliveredOrder('dispatched') }                           
                    invalid={ this.props.invalid } 
                    color="black"
                    />
                </View> : <View/>
                }
                { order.status === 'dispatched' && (
                <View style={[styles.btnAction, { marginTop:15 }]}>
                    <ButtonRegister 
                    title="Ya entregué el pedido!" 
                    width={230}
                    fontSize={18}
                    click={  () => this.deliveredOrder('delivered') }                           
                    invalid={ this.props.invalid } 
                    color="black"
                    />
                </View>
                )}
            </View>
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

    renderProductsCard(item, index) {
        const order = this.props.navigation.getParam('order', '');
        return <CardBasket 
                enabled = { order.status === 'pending' || order.status === 'processing' ? true : false}
                clickAdd= {(product) => { this.addQuantity(product)}} 
                clickReduce= {(product) => { this.reduceQuantity(product)}} 
                deleteProduct= {(product) => { this.deleteProduct(product)}}
                item={item} index = {index}/>
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
        marginBottom:12,
        alignItems:'center'
    },
    detailTopBottomSubContainer: {
        width: screenWidth - 30,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 5,
        left: 15,
        right: 15,
    },
    DetailMainContainer: {
        flex: 1,
        backgroundColor:'white'
    },
    detailTopContainer: {
        position:'relative',
        height: scaleToDimension(170),
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
        marginBottom:10,
        flexDirection:'row'
    },
    modalContainer: {
        flex: 1,
        height:200,
        width:300,
        justifyContent: 'center',
        alignContent:'center',
        alignItems:'center',
        backgroundColor: 'white',
    },
    innerContainer: {
        alignItems: 'center',
    },
    twoColumns:{
        flexDirection:'row',
        marginTop:12,
        marginTop:10
    },
    question: {
        fontSize:16, 
        marginHorizontal:10
    }
})

const mapStateToProps = state => ({
    user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
    loading: state.ReducerLoading.loading,
    details: state.ReducerOrderDetails.details,
    products: state.ReducerProducts.productsDetails,
    orders: state.ReducerOrders.orders,
    store : state.ReducerStore
});
  
  const mapDispatchToProps = dispatch => ({
    getOrderDetails: (token, id) => {
      dispatch(ActionSetLoading());
      dispatch(ActionGetOrderDetails(token, id))
    },
    editOrder:(id, order, uid, navigation) => {
        dispatch(ActionSetLoading());
        let type = 'store';
        let data = { id, order, uid, type }
        dispatch(ActionPutOrder(data))
        navigation.goBack()
    },
    addQuantity: (id ) => {
        dispatch(ActionAddQuantityProductOrder(id, orderId))
    },
    reduceQuantity:(id ) => {
        dispatch(ActionReducerProductOrder(id, orderId))
    },
    sendPushNotification:(devices, body, subtitle, path, id) => {
        dispatch(ActionSendPushNotication({devices, body, subtitle, path, id}));
    }
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
