import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, 
    View, 
    SafeAreaView, 
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
import { ActionGetUser } from '../../../../store/actions/ActionOrder';
import { FieldSelect } from '../../../../components/Fields';
import { ButtonBackDown } from '../../../../components/ButtonRegister';
import moment from "moment";
import 'moment/locale/es'

let screenWidth = Dimensions.get('window').width;

class BasketScreen extends Component {
    state = {
        address : null
    }

    componentDidMount(){
        this.props.getUser(this.props.user.uid)
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
            const store_id =  this.props.navigation.getParam('idStore', '');
            const stores = this.props.stores.stores;
            var store_name = ''
            for (let i = 0; i < stores.length; i++) {
                const id = stores[i]._ref._documentPath._parts[1];
                if(id === store_id){
                    store_name = stores[i]._data.name;
                }
            }
            const user_id = this.props.user.uid;
            moment.locale('es');
            const created_at = moment().format('l');
            const time = moment().format('LT');
            const total = this.props.basket.total;
            const status = 'pending';
            const products = this.props.basket.addedItems;
            const address = this.props.form.values.address;
            const phone = this.props.form.values.phone;
            var note = 'Ninguna';
            try {
                note = this.props.form.values.note ?  this.props.form.values.note : 'Ninguna'
            } catch (error) {
               console.log(error);     
            } 
            this.props.addOrder({store_id,store_name,total,status,products,address,phone,note,user_id, created_at, time}, this.props.navigation)
        } else {
            showAlertError('No hay productos en la cesta aún!')
        }
    }

    onChange = ( value ) => {
        this.setState({ address:value })
    }

    render() {
        const { basket, dataUser } = this.props;
        if(  dataUser.address && this.state.address == null ){
            this.setState({ address: dataUser.address[0]})
        }

        return (
            <View style={{flex:1, backgroundColor:'white'}}>
                <Transition style={{flex:1}} shared={'basket'}>
                    <View style={[styles.detailTopContainer]}>
                        <View style={styles.navigationHeaderContainer}>
                            <ButtonBackDown 
                            navigation = { this.props.navigation}
                            imageStyle = {{ width:scaleToDimension(30), height:scaleToDimension(30) }}
                            />
                        </View>
                        <View style={styles.detailTopBottomSubContainer}>
                            <Image style={{width:scaleToDimension(40), height:scaleToDimension(40)}}
                            source={require('../../../../../assets/icons/logo-2.png')}/>
                           <Text style={styles.titleHeader}>$ {basket.total}</Text>
                        </View>
                    </View>
                </Transition>
                <View style={{flex:2}}>
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
                <View style={{ flex:2 }}>
                    <View style={styles.viewTitleFooter}>
                        <Text style={styles.titleFooter}>Entrega</Text>
                    </View>
                    { this.props.dataUser ?
                    <ScrollView style={{flex:6}}>          
                        <View style={{ flex:1, marginBottom:10, alignItems:'center', justifyContent:'center'}}>
                            <FieldSelect
                            data={ dataUser.address }
                            initialValue={this.state.address}
                            change={(value) => this.onChange(value)}
                            />
                        </View>
                        <View style={{flex:4,marginTop:10, paddingHorizontal:20}}>         
                            <DeliveryForm 
                            note={true} 
                            editable={true}
                            data={this.state.address} 
                            addOrder={this.addOrder} 
                            buttonName="Pedir" />
                        </View>                
                    </ScrollView>: <View></View>
                    }
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
       marginBottom:10
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
        alignItems:'center',
        top:15
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
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(BasketScreen);


