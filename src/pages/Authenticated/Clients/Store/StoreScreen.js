import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
    Text, 
    View, 
    TouchableOpacity, 
    Image, 
    Dimensions,
    TextInput,
    StyleSheet,
    FlatList,
    Platform,
    TouchableWithoutFeedback } from 'react-native'
import { Header } from 'react-navigation';
import { Transition} from 'react-navigation-fluid-transitions'
import { ActionGetProductsByCategory, ActionAddToBasket, ActionGetProductsByKeyword } from '../../../../store/actions/ActionStores';
import { ActionSetLoading } from '../../../../store/actions/ActionApp';
import { CardProduct, CardProductHorizontal } from '../../../../components/CardProduct';
import { ButtonBackDown, ButtonGeneral } from '../../../../components/ButtonRegister';
import { showAlertError } from '../../../../utils/Alerts';

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

var products = [];

class StoreScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTapBarIndex: 0,
            selectedTapBarCategory: null,
            categories: null,
            products:'',
            searchText:'',
            filter: false,
            msgsearch: ''
        };
    }
    componentDidMount(){
        const categories =  this.props.navigation.getParam('categories', '');
        this.setState({ categories : categories })
        if(categories){
            this.getProductsByCategory(categories[0].id)
        }
    }

    getProductsByCategory = (id) => {
        const store_id = this.props.navigation.getParam('id', '');
        const data = this.props.dataProducts.products;
        if(data !== null){
            const categoryExist = data.filter(category => category._data.category_id === id);
            categoryExist.length === 0 ? this.props.getProducts(id, store_id) : null;
        } else {
            this.props.getProducts(id, store_id);
        }
    }

    addBasket = (product) => {
        this.props.addToCart(product._data)
    }

    render(){
        const { navigation, dataProducts, basket } = this.props;
        const categories = this.state.categories;
        const id = this.props.navigation.getParam('id', '');
        const item = navigation.getParam('name', '');
        const color = 'black';

        if(categories !== null && this.state.selectedTapBarCategory === null){
            this.setState({ selectedTapBarCategory : categories[0].id }) 
        }

        return (
            <View style={styles.DetailMainContainer}>
                <Transition shared={item}>
                    <View style={[styles.detailTopContainer, { backgroundColor:color }]}>
                        <View style={styles.detailTopBottomSubContainer}>
                            <Image source={validateIcon(item['icon'])}/>
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: scaleToDimension(20),
                            }}>{item}</Text>
                            {/* <Text style={{color: 'white', fontSize: scaleToDimension(15),}}>{numberStores} negocios en tu zona</Text> */}
                        </View>
                        <View style={styles.navigationHeaderContainer}>
                            <ButtonBackDown 
                            navigation = { this.props.navigation}
                            imageStyle = {{ width:scaleToDimension(35), height:scaleToDimension(35) }}
                            />
                        </View>
                    </View>
                </Transition>
                <View style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <View style={{ flex:2, marginTop:10, marginLeft:10,marginRight:10, justifyContent:'center', height:45 }}>
                        <TextInput
                        paddingLeft={12}
                        style={styles.searchBar}
                        value={this.state.searchText}
                        onChangeText={ (value) => this.setState({ searchText:value})}
                        placeholder='Producto' />
                    </View>
                    <View style={{flex:1, marginLeft:10, justifyContent:'center'}}>
                        <ButtonGeneral   
                        title="Buscar" 
                        width={100}
                        height={30}
                        click={() => this.searchText()}
                        color="black"
                        fontColor="white"/>
                    </View>
                </View>
                { this.state.searchText !== '' && (
                    <TouchableOpacity onPress={() => this.setState({ searchText: '', msgsearch: ''})}>
                        <Text style={{marginLeft:12, color:'red', textDecorationColor:'red'}}>Limpiar filtro</Text>
                    </TouchableOpacity>
                )}
                {  categories !== null ?
                <View style={{flex:5}}>
                    { this.state.searchText === '' ?
                    <View style={{flex:1}}>
                        <View style={{flex:1}}>
                            <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            data={categories}
                            extraData={this.state.selectedTapBarIndex }
                            renderItem={({item, index}) => this.renderTapBarItem(item, index)} />
                        </View>
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
                    <View style={{flex:1}}>                   
                        { dataProducts.filter.length > 0 ?
                            <View style={{flex:1}}>
                                <FlatList
                                data={ dataProducts.filter }
                                extraData={ dataProducts.filter }
                                renderItem={({item, index}) => {
                                    return <CardProductHorizontal 
                                    click={(product) => { this.addBasket(product)}} 
                                    item={item} 
                                    key={index}/>
                                }} /> 
                            </View>
                            :
                            <View style={{alignItems:'center', justifyContent:'center',marginTop:20}}>
                                <Text>{ this.state.msgsearch }</Text>
                            </View>
                        }
                    </View>
                    }
                </View> 
                : 
                <View style={{flex:2,alignItems:'center', justifyContent:'center', marginLeft:10, marginTop:50}}>
                    <Text style={{marginLeft:10}}>No hay categorias para este negocio.</Text>
                </View>
                }
                <Transition shared={'basket'}>
                    <View style={[styles.detailBottomContainer, {backgroundColor:color}]}>
                        <View style={{flex:1,alignItems:'flex-start', justifyContent:'center'}}>
                            <Text style={styles.total}>Total: ${ basket.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonBasket} onPress={() => { 
                             this.props.navigation.navigate('basket', {
                                idStore: id,
                            })
                            }}>
                            <Text style={styles.numberProducts}>{basket.quantityProduct}</Text>
                            <Image style={{width:30, height:30}}
                            source={require('../../../../../assets/icons/logo-2.png')}/>
                            <Text style={{fontFamily:'Ubuntu-Bold', fontSize:18, color:'white'}}> Ver</Text>
                        </TouchableOpacity>
                    </View>
                </Transition>
            </View>
        );
    }

    searchText = () => {
        let word = this.state.searchText.toLowerCase();
        const store_id = this.props.navigation.getParam('id', '');
        this.props.getProductsFilter(store_id, word)
        this.setState({ msgsearch : 'No encontramos resultados para su busqueda.'})
        // this.setState({ searchText:e , filter : true})
        // const data = this.props.dataProducts.products;
        // let text = e.toLowerCase()
        // // let products = this.state.products
        // let filteredName = products.filter((item) => item._data.name.toLowerCase().match(text) || item._data.brand.toLowerCase().match(text))
        // if (!text || text === '') {
        //     products = products = data.filter(product => product._data.category_id === this.state.selectedTapBarCategory);
        // } else if (!Array.isArray(filteredName) && !filteredName.length) {
        //     showAlertError('No se encontro ningun producto con este nombre');
        //     products = products = data.filter(product => product._data.category_id === this.state.selectedTapBarCategory);
        // } else if (Array.isArray(filteredName)) {
        //     if(filteredName.length > 0){
        //         products = filteredName;
        //     } else {
        //         this.setState({ searchText:'' })
        //         showAlertError('No se encontro ningun producto con este nombre');
        //         products = products = data.filter(product => product._data.category_id === this.state.selectedTapBarCategory);
        //     }   
        // }
    }

    renderProducts() {
        const data = this.props.dataProducts.products;
        if(data !== null && !this.state.filter){
            products = data.filter(product => product._data.category_id === this.state.selectedTapBarCategory && product._data.active);
        } 

        return <View style={{marginBottom:10}}> 
            { products.length > 0 ?
            <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={false}
            numColumns={2}
            extraData={products}
            data={products}
            renderItem={({item, index}) => this.renderCardProduct(item, index)}
            /> : 
            <View style={{alignItems:'center', justifyContent:'center',marginTop:20}}>
                <Text>No hay productos para esta categoria.</Text>
            </View>
            }
        </View>
    }

    renderCardProduct(item, index) {
        if(item._data.category_id === this.state.selectedTapBarCategory)
            return <CardProduct click={(product) => { this.addBasket(product)}} item={item} key={index}/>
        else {
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
                    this.setState({ selectedTapBarIndex: index, selectedTapBarCategory: item.id, filter : false, searchText : '' });
                    this.getProductsByCategory(item.id)
                }}>
                <View style={{justifyContent: 'center', flex: 1}}>
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

    },
    navigationHeaderContainer: {
        flex:1,
        color: "blue",
        justifyContent: 'center',
        alignItems:'flex-end',
        padding:10
    },
    DetailMainContainer: {
        flex: 1,
        backgroundColor:'#ffffff'
    },
    detailTopContainer: {
        flex:1.5,
        flexDirection:'row',
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
        flex:3,
        padding:10,
        justifyContent: 'center',
        alignItems:'center',
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
    },
    searchBar:{
        flex:1,
        backgroundColor: 'rgba(249, 247, 247, 0.8)',
        borderRadius:12,
        justifyContent: 'center',
        height:65,
        marginBottom:10
    },
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
    getProducts: (id, store_id ) => {
        dispatch(ActionSetLoading());
        let data = { id, store_id }
        dispatch(ActionGetProductsByCategory(data))
    },
    getProductsFilter: (store_id, word) => {
        dispatch(ActionSetLoading());
        dispatch(ActionGetProductsByKeyword(store_id, word))
    },
    setPosition:(position) => {
        dispatch(ActionSetPosition(position))
    },
    addToCart: (product) => {
        dispatch(ActionAddToBasket(product))
    }
});
  
export default connect(mapStateToProps, mapDispatchToProps)(StoreScreen);


