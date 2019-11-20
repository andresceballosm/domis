import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, SafeAreaView, Dimensions, FlatList, Image, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native'
import { Transition} from 'react-navigation-fluid-transitions'
import { Header } from 'react-navigation';
import { CardBasket } from '../../../../components/CardBasket';
import DeliveryForm from './DeliveryForm'
import { ActionRemoveProductBasket, ActionReducerProductBasket, ActionAddQuantityProductBasket, ActionGetCategoriesByStore, ActionCreateOrder } from '../../../../store/actions/ActionStores';
import { showAlertError } from '../../../../components/Alerts';
import { ActionSetLoading } from '../../../../store/actions/ActionApp';
import { ActionGetAddress } from '../../../../store/actions/ActionOrder';

let screenWidth = Dimensions.get('window').width;

class BasketScreen extends Component {

    componentDidMount(){
        const id = this.props.user.user.id
        const token = this.props.user.jwt_token
        this.props.getAddress(token, id)
    }

    addQuantity = (idProduct) => {
        this.props.addQuantity(idProduct)
    }

    reduceQuantity = (idProduct) => {
        this.props.reduceQuantity(idProduct)
    }

    deleteProduct = (idProduct) => {
        this.props.deleteProduct(idProduct)
    }

    addOrder = () => {
        if(this.props.basket.addedItems.length > 0){
            const store_id = this.props.basket.addedItems[0].store_id;
            const user_id = this.props.user.uid;
            const total = this.props.basket.total;
            const status = 'pending';
            const products = this.props.basket.addedItems;
            const address = this.props.form.values.address;
            const phone = this.props.form.values.phone;
        
            const order = { store_id, total, status, products, address,phone, store_name };
            this.props.addOrder(order, this.props.navigation, user_id)
        } else {
            showAlertError('No hay productos en la cesta aún!')
        }
    }

    render() {
        const { basket } = this.props;
        return (
            <SafeAreaView>
                <Transition shared={'basket'}>
                    <View style={[styles.detailTopContainer]}>
                        <View style={styles.navigationHeaderContainer}>
                            <Image style={{width:scaleToDimension(30), height:scaleToDimension(30)}}
                            source={require('../../../../../assets/icons/down.png')}/>
                        </View>
                        <View style={styles.detailTopBottomSubContainer}>
                            <Image style={{width:scaleToDimension(40), height:scaleToDimension(40)}}
                            source={require('../../../../../assets/icons/logo-2.png')}/>
                           <Text style={styles.titleHeader}>$ {basket.total}</Text>
                        </View>
                    </View>
                </Transition>
                <View style={styles.body}>
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
                <View style={styles.footer}>
                    <View style={styles.viewTitleFooter}>
                        <Text style={styles.titleFooter}>Entrega</Text>
                    </View>
                    <View style={{height: scaleToDimension(240),marginTop:10, paddingHorizontal:20}}>                      
                       <DeliveryForm 
                       note={true} 
                       editable={true}
                       data={this.props.address} 
                       addOrder={this.addOrder} 
                       buttonName="Pedir" />
                    </View>
                </View>
            </SafeAreaView>
        )
    }

    renderProductsCard(item, index) {
        return <CardBasket 
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
        backgroundColor:'black',
        height: scaleToDimension(120),
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
        height: scaleToDimension(30),
    },
    titleFooter:{
        fontSize:24,
        fontFamily:'Ubuntu-Bold',
        textAlign:'center'
    },  
    navigationHeaderContainer: {
        height: Header.HEIGHT,
        width: screenWidth,
        color: "blue",
        justifyContent: 'center',
        alignItems:'center'
    },
    detailTopBottomSubContainer: {
        flexDirection:'row',
        alignItems:'flex-end',
        width: screenWidth - 30,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 15,
        left: 15,
        right: 15,
    },
    titleHeader:{
        fontFamily:'Ubuntu-Bold',
        color: 'white', 
        fontSize: scaleToDimension(30),
        marginLeft:10
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
    }
})

const mapStateToProps = state => {
    console.log('state in basket', state)
    return {
        user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
        loading: state.ReducerLoading.loading,
        categories: state.ReducerCategories,
        position: state.ReducerPosition,
        stores: state.ReducerStores,
        dataProducts: state.ReducerProducts,
        basket: state.ReducerBasket,
        form: state.form.DeliveryForm,
        address: state.ReducerAddress.address,
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
    addOrder:(order) => {
        dispatch(ActionSetLoading());
        dispatch(ActionCreateOrder(order))
    },
    getAddress:(token, id) => {
        dispatch(ActionSetLoading());
        dispatch(ActionGetAddress(token, id))
    },
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(BasketScreen);


