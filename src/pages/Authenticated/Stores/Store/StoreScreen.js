import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
    Text, 
    View, 
    TouchableOpacity, 
    Image, 
    Dimensions,
    StyleSheet,
    FlatList,
    Platform,
    TouchableWithoutFeedback } from 'react-native'
import { Header } from 'react-navigation';
import { Transition} from 'react-navigation-fluid-transitions'
import { ActionGetCategoriesByStore, ActionGetProductsByCategory, ActionAddToBasket } from '../../../../store/actions/ActionStores';
import { ActionSetLoading } from '../../../../store/actions/ActionApp';
import { CardProduct } from '../../../../components/CardProduct';

let screenWidth = Dimensions.get('window').width;

const validateIcon = (icon) => {
    switch (icon) {
        case 'cart':
            return require('../../../../../assets/icons/cart.png') 
        case 'pharmacy':
            return require('../../../../../assets/icons/pharmacy.png')
        case 'fruver':
            return require('../../../../../assets/icons/fruver.png')
        default:
            break;
    }
}

class StoreScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTapBarIndex: 0,
            selectedTapBarCategory: null,
            lastVisible: 10,
            limit: 10
        };
    }
    async componentWillMount(){
        const id = this.props.navigation.getParam('id', '');
        await this.props.getCategories(id)
    }

    getProductsByCategory = (id,store_id) => {
        const { lastVisible, limit } = this.state;
        const data = this.props.dataProducts.products;
        const categoryExist = data.filter(category => category.category_id === id);
        categoryExist.length === 0 ? this.props.getProducts({ id, store_id, lastVisible, limit }) : null;
    }

    addBasket = (product) => {
        this.props.addToCart(product)
    }

    render(){
        const { navigation, categories, dataProducts, basket } = this.props;
        const item = navigation.getParam('name', '');
        const color = 'black';
        //const numberStores = this.props.stores !== null ? this.props.stores.stores.length : 0;
        //Set state initial change
        console.log('categories',categories)
        categories !== null && this.state.selectedTapBarCategory === null ? 
            this.setState({ selectedTapBarCategory:categories[0].id }) : null;

        return (
            <View style={styles.DetailMainContainer}>
                <Transition shared={item}>
                    <View style={[styles.detailTopContainer, {backgroundColor:color}]}>
                        <View style={styles.navigationHeaderContainer}>
                            <Image style={{width:30, height:30}}
                            source={require('../../../../../assets/icons/down.png')}/>
                        </View>
                        <View style={styles.detailTopBottomSubContainer}>
                            <Image style={styles.categoryImageContainer}
                                source={validateIcon(item['icon'])}/>
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: scaleToDimension(35),
                            }}>{item}</Text>
                            {/* <Text style={{color: 'white', fontSize: scaleToDimension(15),}}>{numberStores} negocios en tu zona</Text> */}
                        </View>
                    </View>
                </Transition>
                {  categories !== null ?
                <View style={{flex:1,backgroundColor:'#ffffff', height: scaleToDimension(50)}}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={categories}
                        extraData={this.state.selectedTapBarIndex }
                        renderItem={({item, index}) => this.renderTapBarItem(item, index)}
                    />
                    <View style={{flex:8}}>
                        { dataProducts !== null ?
                            this.renderProducts()
                        : 
                            <View style={{alignItems:'center', justifyContent:'center',marginTop:20}}>
                                <Text>No hay productos para esta categoria.</Text>
                            </View>
                        }
                    </View>
                </View> 
                : 
                <View style={{flex:2,alignItems:'center', justifyContent:'center', marginLeft:10, marginTop:50}}>
                    <Text style={{marginLeft:10}}>No hay categorias para este negocio.</Text>
                </View>
                }
                <Transition shared={'basket'}>
                    <View style={[styles.detailBottomContainer, {backgroundColor:color}]}>
                        <View style={{flex:1,alignItems:'flex-start', justifyContent:'center'}}>
                            <Text style={styles.total}>Total: ${ basket.total }</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonBasket} onPress={() => { this.props.navigation.navigate('basket')}}>
                            <Text style={styles.numberProducts}>{basket.quantity}</Text>
                            <Image style={{width:30, height:30}}
                            source={require('../../../../../assets/icons/logo-2.png')}/>
                            <Text style={{fontFamily:'Ubuntu-Bold', fontSize:18, color:'white'}}> Ver</Text>
                        </TouchableOpacity>
                    </View>
                </Transition>
            </View>
        );
    }

    renderProducts() {
        const data = this.props.dataProducts.products;
        const products = data.filter(product => product.category_id === this.state.selectedTapBarCategory);
        if(products.length > 0) {
            return <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={false}
            numColumns={2}
            extraData={products}
            data={products}
            renderItem={({item, index}) => this.renderCardProduct(item, index)}
        />
        } else {
            return (
                <View style={{alignItems:'center', justifyContent:'center',marginTop:20}}>
                    <Text>No hay productos para esta categoria.</Text>
                </View>
            )
        }
    }

    renderCardProduct(item, index) {
        if(item.category_id === this.state.selectedTapBarCategory)
            return <CardProduct click={(product) => { this.addBasket(product)}} item={item} index = {index}/>
        else{
            return (
                <View style={{alignItems:'center', justifyContent:'center',marginTop:20}}>
                    <Text>No hay productos para esta categoria.</Text>
                </View>
            )
        }
    }

    renderTapBarItem(item, index) {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    this.setState({ selectedTapBarIndex: index, selectedTapBarCategory: item.id });
                    console.log('this.state.selectedTapBarIndex22 ',this.state.selectedTapBarIndex )
                    console.log('index',index)
                    this.getProductsByCategory(item.id, this.props.user.jwt_token)
                }}>
                <View style={{justifyContent: 'center', flex: 1, marginTop:10}}>
                    <Text style={
                        {
                            marginLeft: 10,
                            marginRight: 10,
                            color: 'black',
                            fontSize: this.state.selectedTapBarIndex == index ? 18 : 15,
                            fontWeight: this.state.selectedTapBarIndex == index ? 'bold' : 'normal',
                            textDecorationLine: this.state.selectedTapBarIndex == index ? 'underline' : 'none',
                        }}>
                        {item['name']}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
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
    categoryImageContainer: {
        marginLeft: 15,
        marginTop: 5,
        height: 50,
        width: 50,
    },
    navigationHeaderContainer: {
        height: Header.HEIGHT,
        width: screenWidth,
        color: "blue",
        justifyContent: 'center',
        alignItems:'center',
        marginTop:12
    },
    DetailMainContainer: {
        flex: 1,
        backgroundColor:'#ffffff'
    },
    detailTopContainer: {
        height: scaleToDimension(150),
        width: screenWidth,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius:20,
    }, 
    list:{
        flex:1,
        position:'relative',
        borderTopLeftRadius: 30,
        borderTopRightRadius:30,
        backgroundColor:'#ffffff',
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
    detailTopBottomSubContainer: {
        width: screenWidth - 30,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 15,
        left: 15,
        right: 15,
    },
    detailListCellContainer: {
        width: screenWidth,
        height: screenWidth/2,
        alignItems:'center',
        backgroundColor: 'transparent',
        paddingTop: 10,
        paddingBottom: 10,
    },
    detailListCellContentViewContainer: {
        width: screenWidth / 2,
        height: screenWidth / 2,
        borderRadius: 20,
        marginRight: 10,
        marginLeft: 10,
    },
    detailListCellLastIndexContentViewContainer: {
        width: screenWidth / 2,
        height: screenWidth / 2,
        borderRadius: 20,
        marginRight: 10,
        marginLeft: 10,
    },
    image: {
        width: 160,
        height: 80,
        borderRadius:10
    },
    card:{
        ...Platform.select({
            ios: {
            padding: 10,
            shadowColor: 'gray',
            shadowOffset: {
                width: 0,
                height: 3
            },
            shadowRadius: 5,
            shadowOpacity: 0.75
            },
            android: {
            elevation: 3,
            }
        }),
        position: 'relative',
        borderRadius: 10,
        width: 300,
        height: 150,
        marginLeft:5,
        alignItems: 'center',
        marginTop:2,
        justifyContent: 'center',
        backgroundColor:'rgba(255,255,255,0.8)'
    },
    listStores:{    
        width: '100%', 
        borderRadius: 20,
        height: 170, 
        justifyContent: 'center', 
        alignItems: 'center',
        alignContent:'center',
        position: 'absolute',
        bottom: 0
    },
    detailBottomContainer:{
        flexDirection:'row',
        height: scaleToDimension(70),
        width: screenWidth,
        justifyContent:'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius:20,
    },
    total:{
        fontSize:24,
        marginLeft:15,
        fontFamily:'Ubuntu-Bold',
        color:'white',
    },
    buttonBasket:{
        flex:1, 
        flexDirection:'row',
        alignItems:'center', 
        justifyContent:'flex-end', 
        marginHorizontal:15
    }, 
    numberProducts :{
        fontFamily:'Ubuntu-Bold', 
        marginBottom:10, 
        fontSize:18, 
        color:'#c44f58'
    }
})


const mapStateToProps = state => ({
    user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
    loading: state.ReducerLoading.loading,
    categories: state.ReducerCategories,
    position: state.ReducerPosition,
    stores: state.ReducerStores,
    dataProducts: state.ReducerProducts,
    basket: state.ReducerBasket
});
  
  const mapDispatchToProps = dispatch => ({
    getCategories: (idStore ) => {
      dispatch(ActionSetLoading());
      dispatch(ActionGetCategoriesByStore(idStore))
    },
    getProducts: (data) => {
        dispatch(ActionSetLoading());
        dispatch(ActionGetProductsByCategory(data))
    },
    setPosition:(position) => {
        dispatch(ActionSetPosition(position))
    },
    addToCart: (product) => {
        dispatch(ActionAddToBasket(product))
    }
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(StoreScreen);


