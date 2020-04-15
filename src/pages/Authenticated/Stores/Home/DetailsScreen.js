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
    Platform } from 'react-native'
import { Transition} from 'react-navigation-fluid-transitions'
import { Header } from 'react-navigation';
import { MapsComponent } from '../../../../components/MapsComponent';
import { ButtonBackDown } from '../../../../components/ButtonRegister';


let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

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
    // async componentWillMount(){
    //     const storetype = this.props.navigation.getParam('id', '');
    //     const city = 'Bogota'
    //     await this.props.getStores(storetype, this.props.position.position, city)
    // }

    componentDidUpdate(){
        if(this.state.latitude === null && this.props.stores !== null){
            this.setState({
                latitude: this.props.stores.stores[0].latitude,
                longitude: this.props.stores.stores[0].longitude,
                storeName: this.props.stores.stores[0].name
            })
        }
    }

    goToStore = (item) => {
        this.props.navigation.navigate('store', {
            id: item['id'],
            name: item['name'], 
            address: item['address'], 
        })
    }

    render() {
        const { navigation, stores} = this.props;
        const item = navigation.getParam('item', '');
        const color = navigation.getParam('color', '');
        const numberStores = this.props.stores !== null ? this.props.stores.stores.length : 0;
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
                            <Image style={styles.categoryImageContainer}
                                source={validateIcon(item['icon'])}/>
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
                        latitude:item.latitude,
                        longitude:item.longitude,
                        storeName: item.name
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
                                    <Text style={{fontSize:16,fontFamily:'Georgia', color:'#666666'}}>{item.name}</Text>   
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
    navigationHeaderContainer: {
        height: Header.HEIGHT,
        width: screenWidth,
        color: "blue",
        justifyContent: 'center',
        marginTop: 12,
        alignItems:'center'
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

        elevation: 3,
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
              elevation: 3,
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
        height: 170, 
        justifyContent: 'center', 
        alignItems: 'center',
        alignContent:'center',
        position: 'absolute',
        bottom: 0
    }
});

const mapStateToProps = state => {
    return{
        user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
        loading: state.ReducerLoading.loading,
        position: state.ReducerPosition,
        stores: state.ReducerStores
    }
};
  
  const mapDispatchToProps = dispatch => ({
    setPosition:(position) => {
        dispatch(ActionSetPosition(position))
    }
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(DetailsScreen);
