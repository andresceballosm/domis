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
    SafeAreaView } from 'react-native'
import { Transition} from 'react-navigation-fluid-transitions'
import { Header } from 'react-navigation';
import { MapsComponent } from '../../../../components/MapsComponent';
import { ActionSetLoading } from '../../../../store/actions/ActionApp';
import { ActionGetStoresByType } from '../../../../store/actions/ActionStores';
import { ButtonBackDown } from '../../../../components/ButtonRegister';
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


class DetailsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: null,
            longitude: null,
            storeName: null
        };
    }
    async componentWillMount(){
        const storetype = this.props.navigation.getParam('id', '');
        const geohash =  this.props.navigation.getParam('geohash', '');
        const range = this.props.navigation.getParam('range', '');
        if(range){
            await this.props.getStores(storetype, geohash, range)
        } else {
            showAlertError('Necesita habilitar su ubicación para poder consultar negocios cerca a usted.');
            this.props.navigation.pop();
        }
    }

    componentDidUpdate(){
        if(this.state.latitude === null && this.props.stores.stores !== null){
            console.log('this.props.stores',this.props.stores);
            this.setState({
                latitude: this.props.stores.stores[0]._data.latitude,
                longitude: this.props.stores.stores[0]._data.longitude,
                storeName: this.props.stores.stores[0]._data.name
            })
        }
    }

    goToStore = (item) => {
        this.props.navigation.navigate('store', {
            id: item._ref._documentPath._parts[1],
            categories: item._data['categories'],
            name: item._data['name'], 
            address: item._data['address'], 
        })
    }

    render() {
        const { navigation, stores} = this.props;
        const item = navigation.getParam('item', '');
        const color = navigation.getParam('color', '');
        const numberStores = 0//this.props.stores !== null ? this.props.stores.stores.length : 0;
        return (
            <View style={styles.DetailMainContainer}>
                <Transition shared={item}>
                    <View style={[styles.detailTopContainer, {backgroundColor:color}]}>
                        <View style={styles.navigationHeaderContainer}>
                            <ButtonBackDown 
                            navigation = { this.props.navigation}
                            imageStyle = {{ width:scaleToDimension(40), height:scaleToDimension(40) }}
                            />
                        </View>
                        <View style={styles.detailTopBottomSubContainer}>
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: scaleToDimension(35),
                            }}>{item}</Text>
                            <Text style={{color: 'white', fontSize: scaleToDimension(15),}}>{numberStores} negocios en tu zona</Text>
                        </View>
                    </View>
                </Transition>
                {this.renderMap(stores)}
            </View>
        );
    }

    renderMap(stores){
        if(stores !== null) {
            return(
                <View style={{  flex: 1}}>  
                    { this.state.latitude !== null ?
                    <MapsComponent 
                    latitude={this.state.latitude} 
                    longitude={this.state.longitude} 
                    storeName={this.state.storeName} 
                    />   
                    : <View></View>
                    }
                    <View style={styles.listStores}>
                        <FlatList
                        showsHorizontalScrollIndicator={false}
                        onPress
                        horizontal={true}
                        extraData={stores}
                        data={stores.stores}
                        renderItem={({item, index}) => this.renderDetailListCell(item, index)}
                        />   
                    </View>                                               
                </View>                 
            )  
        } else {
            return(
                <View style={{ paddingTop:50, height: scaleToDimension(200), alignItems:'center'}}>
                    <Text>
                        En el momento no hay negocios disponibles de esta categoria en tu zona
                    </Text>
                </View>
            )
        }
    }

    renderDetailListCell(item, index) {
        return (
                <TouchableOpacity onPress={() => {
                    this.setState({
                        latitude:item._data.latitude,
                        longitude:item._data.longitude,
                        storeName: item._data.name
                    })
                }} activeOpacity = {1}>
                    <Transition shared={item['name']}>
                        <View style={styles.card}>
                            <View style={{flex:1, marginTop:5}}>
                                <Image style={styles.image}
                                    source={require('../../../../../assets/images/ekoplaza.jpg')}/>
                            </View>
                            <View style={{flex:1, alignItems:'center'}}>
                                <View style={{marginTop:18, flexDirection:'row'}}>
                                    <Text style={{fontSize:16,fontFamily:'Georgia', color:'#666666'}}>{item._data.name}</Text>   
                                </View>  
                                <View style={{backgroundColor:'black', borderRadius:10, alignItems:'center', marginTop:5, width:80}}>
                                    <TouchableOpacity onPress={(event) => { this.goToStore(item)}}>
                                        <Text style={{fontFamily:'Ubuntu-Bold', color:'white'}}> Visitar</Text>
                                    </TouchableOpacity>
                                </View>  
                            </View> 
                        </View>
                    </Transition>
                </TouchableOpacity>
        );
    }
};

const scaleToDimension = (size) => {
    return screenWidth * size / 375
};

// All Styles related to design...
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
    bottomContainer: {
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    DetailMainContainer: {
        flex: 1,
    },
    detailTopContainer: {
        position:'relative',
        height: scaleToDimension(200),
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

        elevation: 7,
        borderRadius:10
    },
    map:{
        flex:1
    },  
    list:{
        flex:1,
        position:'relative',
        borderTopLeftRadius: 20,
        borderTopRightRadius:20,
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
              elevation: 11,
            }
        })
    },
    navigationHeaderContainer: {
        justifyContent: 'center',
        marginTop:30,
        alignItems:'center'
    },
    detailTopBottomSubContainer: {
        top:15,
        height:120,
        left: 15,
        bottom: 5,
        // width: screenWidth - 30,
        // marginTop: 5,
        // backgroundColor: 'transparent',
        // position: 'absolute',
        // bottom: 15,
        // left: 15,
        // right: 15,
    },
    image: {
        width: 160,
        height: 80,
        borderRadius:10
    },
    imageMap: {
        width: screenWidth,
        height: screenWidth,
        borderRadius:10
    },
    detailListCellContentViewBottomContainer: {
        width: screenWidth / 2,
        minHeight: scaleToDimension(50),
        backgroundColor: 'white',
        position: 'absolute',
        paddingBottom: 15,
        bottom: 1,
        marginLeft: 1,
        marginRight: 1,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
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
              elevation: 11,
            }
        }),
        position: 'relative',
        borderRadius: 10,
        width: 300,
        height: 150,
        marginLeft:5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'rgba(255,255,255,0.8)'
    },
    listStores:{    
        width: '100%', 
        borderRadius: 20,
        height: 155, 
        justifyContent: 'center', 
        alignItems: 'center',
        alignContent:'center',
        position: 'absolute',
        bottom: 0
    }
});

const mapStateToProps = state => {
    console.log('state', state)
    return{
        user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
        loading: state.ReducerLoading.loading,
        position: state.ReducerPosition,
        stores: state.ReducerStores
    }
};
  
  const mapDispatchToProps = dispatch => ({
    getStores: (storetype, geohash, range) => {
      dispatch(ActionSetLoading());
      dispatch(ActionGetStoresByType(storetype, geohash, range))
    },
    setPosition:(position) => {
        dispatch(ActionSetPosition(position))
    }
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(DetailsScreen);
