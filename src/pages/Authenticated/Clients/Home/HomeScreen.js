import React, { Component } from 'react'
import { connect } from 'react-redux';
import { 
    Text, 
    View, 
    TouchableOpacity, 
    Image, 
    FlatList,
    SafeAreaView,
    Dimensions,
    ScrollView,
    PermissionsAndroid,
    StyleSheet } from 'react-native'
import Geolocation from '@react-native-community/geolocation'
import { Transition} from 'react-navigation-fluid-transitions'
import { ActionSetPosition, ActionSetLoading, ActionGetCategories } from '../../../../store/actions/ActionApp.js';
import { getGeohashRange } from '../../../../components/GeoHashRange.js';
import geohash from "ngeohash";
import { ActionGetUser } from '../../../../store/actions/ActionOrder.js';
import { LoadingSmall } from '../../../../components/LoadingSmall.js';


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

async function requestPositionPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso para acceder a ubicación',
          message:
            'Para mostrar negocios cerca a usted ' +
            'es necesario acceder a su ubicación actual.',
          buttonNeutral: 'Preguntarme luego',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Aceptar',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
}

class HomeScreen extends Component {
    // static router = Navigator.router;
    static navigationOptions = {
        title: 'Home',
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
            geohash:'',
            range: ''
        };
    }
    
    componentDidMount(){
        this.props.getUser(this.props.user.uid);
        this.props.getCategories()
    }

    componentWillMount(){
        try {
            var permission = requestPositionPermission() //Geolocation.requestAuthorization();
            Geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude
                    //const lat = 4.738025;
                    //const lng = -74.040747;
                    const range = getGeohashRange(lat, lng, 2);
                    const hash = geohash.encode(lat, lng);
                    this.setState({range:range, geohash: hash})
                    this.props.setPosition(position.coords)
                }
            )
            
        } catch (error) {
            console.log('error getPosition', error)
        }
    }

    getStores = (item) => {
        this.props.navigation.navigate('homeDetails', { 
            item: item._data['key'], 
            color: item._data['color'], 
            id: item._ref._documentPath._parts[1], 
            geohash:this.state.geohash,
            range: this.state.range
        })
    }

    validateCategories = () => {
        try {
            return this.props.categories.length > 0 ? true : false;
        } catch (error) {
            return false;
        }
    }

    render() {
        const { dataUser, categories } = this.props;
        return (
            <SafeAreaView style={styles.mainContainer}>
                <ScrollView style={styles.mainContainer}>
                    <View style={styles.topContainer}>
                    <View style={{ flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
                    <View style={{flex:1, marginLeft:15}}>
                        <Text style={{ marginTop: 8, color: '#58647a'}}>
                            Hola!{"\n"}{dataUser ? dataUser.firstname : 'usuario' }
                        </Text>
                    </View>
                    <View style={{ flex:3, flexDirection:'row', alignItems:'center'}}>
                        <Image style={styles.userImageContainer}
                        source={require('../../../../../assets/icons/logo-100.png')}/>
                        <Text style={{fontSize:30, fontFamily:'HermanoAlto Round', paddingTop:12}}>DOMIS</Text>
                    </View>
                    </View>
                        <Text style={{
                            marginLeft: 15,
                            marginRight: 15,
                            marginTop: 30,
                            color: '#58647a',
                            fontSize: 35,
                            fontWeight: 'bold'
                        }}>
                            Que quieres pedir hoy?
                        </Text>
                    </View>
                    <View style={styles.bottomContainer}>
                        <View style={styles.bottomGridContainer}>
                            { this.validateCategories() && (
                            <FlatList
                            showsHorizontalScrollIndicator={false}
                            onPress
                            horizontal={true}
                            data={categories}
                            renderItem={({item, index}) => this.renderGridItem(item, index)}
                            /> 
                            )}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    renderGridItem(item, index) {
        if(item._data.available)
        return (
            <TouchableOpacity
                key={index}
                activeOpacity = {1}
                onPress={() => {
                    this.getStores(item)
                }}>
                <Transition shared={item._data['key']}>
                    <View style={[styles.bottomGridItemContainer,{backgroundColor:item._data['color']}]}>
                        <Image style={styles.categoryImageContainer}
                            source={ validateIcon(item._data['icon']) }/>
                        <Text style={{
                            marginLeft: 15,
                            marginRight: 10,
                            position: 'absolute',
                            bottom: 20,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 35,
                        }}>{item._data['key']}</Text>
                    </View>
                </Transition>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    topContainer: {
        backgroundColor: 'white'
    },
    bottomContainer: {
        alignItems: 'center',
        // height: screenHeight/2,
        backgroundColor: 'transparent'
    },
    userImageContainer: {
        marginLeft: 15,
        marginTop: 5,
        height: screenWidth * 40 / 375,
        width: screenWidth * 40 / 375,
        borderRadius: (screenWidth * 50 / 375) / 2,
    },
    categoryImageContainer: {
        marginLeft: 15,
        marginTop: 5,
        marginBottom: 50,
        height: 70,
        width: 70,
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
        height: screenHeight / 2 - 50,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'center'
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
    }
});

const mapStateToProps = state => ({
    user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
    dataUser: state.ReducerUser && state.ReducerUser.user ? state.ReducerUser.user : false,
    loading: state.ReducerLoading.loading,
    position: state.ReducerPosition,
    categories : state.ReducerCategoriesApp
});

const mapDispatchToProps = dispatch => ({
    setPosition:(position) => {
        dispatch(ActionSetPosition(position))
    },
    getUser:(uid) => {
        dispatch(ActionSetLoading());
        dispatch(ActionGetUser(uid))
    },
    getCategories:() => {
        dispatch(ActionSetLoading())
        dispatch(ActionGetCategories())
    }
});
  
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);