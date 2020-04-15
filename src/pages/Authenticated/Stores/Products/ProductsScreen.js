import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
    Text, 
    View, 
    TouchableOpacity, 
    Image, 
    Alert,
    SafeAreaView,
    ActivityIndicator,
    Dimensions,
    Modal,
    TextInput,
    FlatList,
    TouchableWithoutFeedback,
    StyleSheet } from 'react-native'
import { Transition} from 'react-navigation-fluid-transitions'
import { Header } from 'react-navigation';
import { ActionSetLoading } from '../../../../store/actions/ActionApp.js';
import { ActionGetProductsByCategory, ActionUpdateProduct, ActionUpdateStore, ActionGetProductsByKeyword } from '../../../../store/actions/ActionStores.js';
import { CardProductStore } from '../../../../components/CardProduct.js';
import DropDown from '../../../../components/DropDown.js';
import { Form, Item, Input, Label } from 'native-base';
import { ButtonRegister, ButtonGeneral } from '../../../../components/ButtonRegister.js';
import { showAlertError } from '../../../../utils/Alerts.js';
import { LoadingSmall } from '../../../../components/LoadingSmall.js';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

class ProductsScreen extends Component {
    // static router = Navigator.router;
    flatlist = React.createRef();
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
            selectedTapBarCategory: null,
            categories: null,
            products: null,
            productsFilter: null,
            searchText:'' ,
            filter: true,
            showFormCategory: false,
            category: '',
            categorySelected: '',
            lastVisible: [],
            lastVisibleNow : 0,
            limit: 10,
            scrollPosition: 0,
            msgsearch: ''
        };
    }

    getProductsByCategory = (id, lastVisible, refresh) => {
        const {  limit } = this.state;
        const categories = this.props.store.store.categories;
        this.setState({ categories : categories })
        const store_id = this.props.store.store.store_id;
        const data = this.props.dataProducts.products;
        if(!refresh){
            if(data !== null ){
                const categoryExist = data.filter(category => category._data.category_id === id);
                categoryExist.length === 0 ? this.props.getProducts({id, store_id,lastVisible, limit}) : null;
            } else {
                this.props.getProducts({id, store_id})
            }  
        } else {
            this.props.getProducts({id, store_id})
        }     
    }

    componentDidMount(){
        const categories = this.props.store.store.categories;
        if(categories){
            this.getProductsByCategory(categories[0].id, 0, false)
        }

        // this.props.navigation.addListener('willBlur', () => {
        //   const offset = this.state.scrollPosition;
        //   console.log('llgaaaa', offset)
        //   setTimeout(() => {
        //     console.log('this.flatlist',this.flatlist.current.scrollToOffset())
        //     this.flatlist.current.getNode().scrollToOffset({ 
        //         offset
        //     })
        //   }, 500)
        // })
    }

    searchText = () => {
        let word = this.state.searchText.toLowerCase()
        const store_id = this.props.store.store.store_id;
        this.props.getProductsFilter(store_id, word)
        this.setState({ msgsearch : 'No encontramos resultados para su busqueda.'})
        // console.log('this.props.dataProducts',this.props.dataProducts)
        // let products = this.props.dataProducts.products;
        // let filteredName = products.filter((item) => item._data.name.toLowerCase().match(text) || item._data.brand.toLowerCase().match(text))
        // if (!text || text === '') {
        //   this.setState({
        //     productsFilter: this.props.dataProducts.products,
        //     filter: true
        //   })
        // } else if (!Array.isArray(filteredName) && !filteredName.length) {

        // } else if (Array.isArray(filteredName)) {
        //     if(filteredName.length > 0){
        //         this.setState({
        //             productsFilter : filteredName
        //         })
        //     } else {
        //         e.slice(0, -1)
        //         this.setState({ searchText:e })
        //         showAlertError('No se encontro ningun producto con este nombre');
        //     }      
        // }
    }

    editProduct = (product) => {
        let product_ID = product._ref._documentPath._parts[1];
        this.props.navigation.navigate('editProduct', {
            product: product._data, 
            id: product_ID, 
        })
    }

    goToAdd = (route) => {
        if( route === 1){
            this.setState({showFormCategory:true})
        } else if(route === 2){
            this.props.navigation.navigate('addProduct')  
        }   
    }

    removeCategory = (category ) => {
        const store = this.props.store.store;
        const categories = store.categories;
        const newCategories = categories.filter((obj, i) => obj.id !== category);
        Alert.alert(
            'Eliminar',
            'Esta seguro(a) que desea eliminar esta categoría.',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {   text: 'Aceptar', onPress: () => { 
                    Object.assign( store, {
                        categories : newCategories,
                    });
                    this.props.editStore(store);
                    this.setState({ selectedTapBarIndex: 0, 
                                    selectedTapBarCategory: categories[0].id,
                                    categories : newCategories }); 
                }},
            ],
            { cancelable: false},
        );    
    }

    addCategory = () => {
        const store = this.props.store.store;
        const categories = store.categories;

        var deletespaces = this.state.category.replace(/\s+/g, '');
        let code = deletespaces.slice(0,6);

        let category = {            
            name : this.state.category,
            id :  `${code + '_' + new Date().getTime()}`
        }
        categories.push(category)
        Alert.alert(
            `${'Seguro(a) de crear la categoría' + ' ' + this.state.category }`,
            '',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {   text: 'Aceptar', onPress: () => { 
                    this.setState({ showFormCategory: false})
                    this.props.editStore(store) 
                }},
            ],
            { cancelable: false },
        ); 
    }

    activeProduct = (product) => {
        const id = product._ref._documentPath._parts[1];
        const values = product._data;
        Object.assign( values, {
            active : true,
        }) 
        const store_id = this.props.store.store.store_id;
        Alert.alert(
            `${'Habilitar' + ' ' + values.name }`,
            'Esta seguro(a) que desea habilitar el producto, lo cual significa será visible para sus clientes.',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {   text: 'Aceptar', onPress: () => this.props.disableProduct(id, values, store_id) },
            ],
            {cancelable: false},
        );    
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


    disableProduct = (product) => {
        const id = product._ref._documentPath._parts[1];
        const values = product._data;
        Object.assign( values, {
            active : false,
        }) 
        const store_id = this.props.store.store.store_id;
        Alert.alert(
            `${'Inhabilitar' + ' ' + values.name }`,
            'Esta seguro(a) que desea inhabilitar el producto, lo cual significa que no sera visible para sus clientes.',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {   text: 'Aceptar', onPress: () => this.props.disableProduct(id, values, store_id) },
            ],
            {cancelable: false},
        );    
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

    onChangeMenu = (value ) => {
        console.log('value',value);
    }

    componentWillReceiveProps (newProps) {
        if( newProps.dataProducts !== this.props.dataProducts ) {
            console.log(' newProps.dataProducts', newProps.dataProducts)
            let lastVisibleData = this.state.lastVisible;
            if(this.state.lastVisible.length > 0){
                let exist = this.state.lastVisible.filter((value) => value.category === this.state.selectedTapBarCategory);
                if(exist.length === 0) {
                    // let number = newProps.dataProducts.products.filter((product) => product._data.category_id === this.state.selectedTapBarCategory);
                    let lastVisibleData = this.state.lastVisible;
                    lastVisibleData.push({
                        category: this.state.selectedTapBarCategory,
                        lastVisible : 10
                    })
                    this.setState({
                        lastVisible : lastVisibleData
                    })
                }
            } else {
                lastVisibleData.push({
                    category: newProps.dataProducts.products[0]._data.category_id,
                    lastVisible : 10
                })
            }
            this.setState({filter: true, lastVisible : lastVisibleData, lastVisibleNow : 10})
        }
    }
    
    retrieveMore = async () => {
        // let lastVisible = this.state.lastVisible.filter((value) => value.category === this.state.selectedTapBarCategory);
        let number = this.props.dataProducts.products.filter((product) => product._data.category_id === this.state.selectedTapBarCategory);
        let lastVisibleData = this.state.lastVisible;
        let lastVisibleNowData = 10;

        for (let i = 0; i < lastVisibleData.length; i++) {
            if( lastVisibleData[i].category === this.state.selectedTapBarCategory){
                let number = lastVisibleData[i].lastVisible + 10
                lastVisibleData[i].lastVisible = number; 
                lastVisibleNowData = number;
            }                
        }

        this.setState({
            lastVisible : lastVisibleData,
            lastVisibleNow : lastVisibleNowData
        })
    };

    handleScroll = (event) => {
        this.setState({ scrollPosition: event.nativeEvent.contentOffset.y });
    }

    render() {
        const { dataProducts } = this.props;
        console.log('dataProducts',dataProducts);
        const data = [
            {'title' : 'Menu',
            'items' : [ "Agregar","Categorías", "Productos"]
            },
        ]

        const categories = this.state.categories;
        categories !== null && this.state.selectedTapBarCategory === null ? 
            this.setState({selectedTapBarCategory:categories[0].id}) : null;
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.showFormCategory}>
                    <View style={styles.modalBackground}>
                        <TouchableOpacity
                        style={{flex:1, alignItems:'flex-end', marginTop:30}}
                        onPress={()=> this.setState({ showFormCategory : false })}> 
                            <Image 
                            style={styles.userImageContainer1}
                            source={require('../../../../../assets/icons/down-black.png')}/>
                        </TouchableOpacity>
                        <View style={styles.bodyModal}>
                            <Text style={{
                                marginLeft: 15,
                                marginRight: 15,
                                marginBottom:20,
                                color: '#58647a',
                                fontSize: 20,
                                fontWeight: 'bold'
                            }}>Agregar Categoria</Text>
                            <Form style={styles.bodyModal}>
                                <Item floatingLabel>
                                    <Label>Nombre de categoria</Label>
                                    <Input 
                                    name="category"  
                                    onChangeText={(ref) => { this.setState({ category : ref })}}
                                    />
                                </Item>
                                <Item style={{marginTop:30}}>
                                    <ButtonRegister 
                                    title="Guardar" 
                                    click={  () => this.addCategory() }                           
                                    invalid={ this.state.category === '' ? true : false } 
                                    color="black"
                                    />
                                </Item>                                  
                            </Form>
                        </View>
                    </View>
                </Modal>
                <View style={{flexDirection:'row', marginTop:15}}>
                    <View style={styles.headerProducts}>
                        <Text style={{
                        marginLeft: 15,
                        marginRight: 15,
                        marginBottom:10,
                        color: '#58647a',
                        fontSize: 25,
                        fontWeight: 'bold'
                        }}>
                            Productos
                        </Text> 
                    </View>
                    <View style={{ justifyContent:'center', alignItems:'center', marginHorizontal:10}}>
                       <DropDown add= {(route) => { this.goToAdd(route)}} data={data}/>
                    </View>
                </View>  
                <View style={styles.mainContainer}>
                    <View style={{ flexDirection:'row', marginTop:10, justifyContent:'center', marginRight:10}}>
                        <View style={{ flex:2, marginTop:10, marginLeft:10,marginRight:10, justifyContent:'center', height:45 }}>
                            <TextInput
                            paddingLeft={12}
                            style={styles.searchBar}
                            value={this.state.searchText}
                            onChangeText={value => this.setState({ searchText:value})}
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
                    <View style={{flex:1}}>
                        { this.state.searchText === '' ?
                            <View style={{flex:1}}>
                                <View style={{flex:1}}>
                                    <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                    data={categories}
                                    extraData={this.state.selectedTapBarIndex }
                                    renderItem={({item, index}) => this.renderTapBarItem(item, index)}
                                    />
                                </View>
                                <View style={{flex:6}}> 
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
                                <View style={{flex:1}}>
                                    { dataProducts.filter.length > 0 ?
                                        <FlatList
                                        data={ dataProducts.filter }
                                        extraData={ dataProducts.filter }
                                        renderItem={({item, index}) => {
                                            return(
                                                <CardProductStore 
                                                click={(product) => { this.editProduct(product)}} 
                                                disable = {(product) => { this.disableProduct(product)}}
                                                active = {(product) => { this.activeProduct(product)}}
                                                item={item} 
                                                index = {index}/>
                                            )
                                        }}
                                        /> 
                                        :
                                        <View style={{alignItems:'center', justifyContent:'center',marginTop:20}}>
                                            <Text>{this.state.msgsearch}</Text>
                                        </View>
                                    }
                                </View>
                            </View>
                        }
                    </View> : <View></View>
                    }
                </View>  
            </SafeAreaView>
        );
    }

    // Render Footer
    renderFooter = (productsTotal, products) => {
        if(productsTotal.length != products.length){
            return (
                <View style={{alignItems:'center', padding:10}}>
                    <ActivityIndicator />
                    <Text>Cargando productos...</Text>
                </View>
                )
        } else {
            return null;
        } 
    };

    renderProducts() {
        const data = this.props.dataProducts.products;
        if(data){
            const productsTotal = data.filter( (product, index) => product._data.category_id === this.state.selectedTapBarCategory);
            const products = productsTotal.filter( (product, index) => index <= this.state.lastVisibleNow);
            if(products.length > 0) {
                if(this.state.filter === true){
                    this.setState({ products : '', filter : false })
                    this.setState({ products : products })
                } else if (this.state.products.length != products.length){
                    this.setState({ products : products })
                }
                return (
                    <View style={{flex:1, marginBottom:10}}>
                        <FlatList
                        onScroll={this.handleScroll} 
                        ref={(ref) => { this.flatlist = ref; }}
                        onEndReached={ this.retrieveMore }
                        //ListFooterComponent={this.renderFooter(productsTotal, products)}
                        onEndReachedThreshold={0.01}
                        horizontal={false}
                        numColumns={1}
                        extraData={this.state.products}
                        data={this.state.products}
                        renderItem={({item, index}) => this.renderCardProduct(item, index)}
                        />
                    </View>
                )
            } else {
                return (
                    <View style={{alignItems:'center', justifyContent:'center',marginTop:20}}>
                        <Text style={{marginBottom:20}}>No hay productos para esta categoria.</Text>
                        <ButtonRegister 
                        title="Eliminar categoría" 
                        fontSize={16}
                        click={  () => this.removeCategory(this.state.selectedTapBarCategory) }                           
                        color="#8f4d4e"
                        />
                    </View>
                )
            }
        }
    }

    renderCardProduct(item, index) {
        if(item._data.category_id === this.state.selectedTapBarCategory)
            return <CardProductStore 
                    click={(product) => { this.editProduct(product)}} 
                    disable = {(product) => { this.disableProduct(product)}}
                    active = {(product) => { this.activeProduct(product)}}
                    item={item} 
                    index = {index}/>
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
                    this.setState({ selectedTapBarIndex: index, selectedTapBarCategory: item.id,  filter : true, categorySelected : item['name'] });
                    let exist = this.state.lastVisible.filter((value) => value.category === item.id);
                    if(exist.length === 0) {
                        this.setState({ lastVisibleNow : 10 })
                        this.getProductsByCategory(item.id, 0, false)
                    } else {
                        this.setState({ lastVisibleNow : exist[0].lastVisible })
                    }
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
                            fontSize: 25,
                        }}>{ item['key'] }</Text>
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
    searchBar:{
        flex:1,
        backgroundColor: 'rgba(182, 182, 182, 0.4)',
        borderRadius:12,
        justifyContent: 'center',
        height:65,
        marginBottom:10
    },
    userImageContainer1:{
        height: screenWidth * 30 / 375,
        width: screenWidth * 30 / 375,
        borderRadius: (screenWidth * 50 / 375) / 2,
    },
    headerProducts:{
        flex:2,
        justifyContent:'center'
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        height:200
    },
    bodyModal:{
        flex:5,
        alignItems:'center',
        width:300,
    }
});


const mapStateToProps = state => {
    return {
        user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
        loading: state.ReducerLoading.loading,
        store : state.ReducerStore,
        dataProducts: state.ReducerProducts,
    } 
};
  
const mapDispatchToProps = dispatch => ({
    getProducts: (data ) => {
        dispatch(ActionSetLoading());
        dispatch(ActionGetProductsByCategory(data))
    },
    getProductsFilter: (store_id, word) => {
        dispatch(ActionSetLoading());
        dispatch(ActionGetProductsByKeyword(store_id, word))
    },
    disableProduct: ( id, values, store_id ) => {
        dispatch(ActionSetLoading());
        dispatch(ActionUpdateProduct({id,values,store_id}));
    },
    editStore: ( store ) => {
        dispatch(ActionSetLoading());
        dispatch(ActionUpdateStore(store));
    },
});
  
export default connect(mapStateToProps, mapDispatchToProps)(ProductsScreen);

