import React, { Component } from 'react'
import { connect } from 'react-redux';
import { 
    Text, 
    View, 
    Image, 
    Alert,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    ScrollView,
    Modal,
    RefreshControl,
    StyleSheet } from 'react-native'
import { ActionGetStore, ActionDisableStore } from '../../../../store/actions/ActionStores.js';
import { ButtonGeneral } from '../../../../components/ButtonRegister.js';
import { ActionLogout } from '../../../../store/actions/ActionsAuthentication.js';
import { ActionSetLoading } from '../../../../store/actions/ActionApp.js';
import { ChartList } from '../../../../components/Charts.js';
import moment from "moment";
import { ActionGetOrdersStoreByDate } from '../../../../store/actions/ActionOrder.js';
import { ActionSetNotifications } from '../../../../store/actions/ActionNotifications.js';
import { pushNotifications } from '../../../../services/index.js';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

class HomeStoreScreen extends Component {
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
            visibleSettings: false,
            dataChart: null,
            refreshing: false,
        };
    }
    
    componentDidMount(){
        this.props.getStore(this.props.user.uid);
    }

    componentWillReceiveProps(newProps) {
        if(newProps.store !== this.props.store){
            console.log('entraa', newProps.store)
            this.getOrdersByDate(newProps.store);
        }
    }

    deleteUser = () => {
        var dataStore = this.props.store.store;
        Object.assign( dataStore, {
            active : false,
        })  
        Alert.alert(
            'Eliminar cuenta',
            'Esta seguro(a) de eliminar su cuenta, perderá la oportunidad de captar más clientes y pedidos por el App.',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {   text: 'Aceptar', onPress: () => { 
                        this.setState({ visibleSettings : false })
                        this.props.deleteUser(dataStore) 
                    }
                },
            ],
            { cancelable: false },
        );       
    }

    updateDataChart = () => {
        if ( this.props.orders.length > 0 ){
            var orders = this.props.orders;
            var pending = [];
            var processing = [];
            var delivered = [];
            var cancelled = [];
            for (let i = 0; i < orders.length; i++) {
                const status = orders[i]._data.status;
                switch (status) {
                    case 'pending':
                        pending.push(orders[i]._data);
                        break;
                    case 'processing':
                        processing.push(orders[i]._data);
                        break;
                    case 'delivered':
                        delivered.push(orders[i]._data);
                        break;
                    case 'cancelled':
                        cancelled.push(orders[i]._data);
                        break;
                    default:
                        break;
                }
            };
            var dataset = [ pending.length, processing.length, delivered.length, cancelled.length ];
            var dataChart = {
                labels: ["Pendiente","Procesando", "Entregado", "Cancelado"],
                datasets: [
                  {
                    data: dataset
                  }
                ]
            };
            this.setState({ dataChart : dataChart })
        }
    };

    getOrdersByDate = (store) => {
        moment.locale('en');
        console.log('l', moment().format('l'))
        this.props.getOrdersByDate(store.store.store_id, moment().format('l'));
        setTimeout(() => { this.updateDataChart() }, 900)
    }

    _onRefresh = () => {
        this.getOrdersByDate(this.props.store);
        this.setState({refreshing: false});
    }
    
    render() {
        const {dataUser, store } = this.props;
        try {
            var storeName = store.store.name;   
        } catch (error) {
            var storeName = '';  
        }

        if(this.state.dataChart === null ){
            this.updateDataChart()
        }

        return (
            <SafeAreaView style={styles.mainContainer}>
                <ScrollView 
                style={styles.mainContainer}
                refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                    />
                }
                >
                    <View style={styles.topContainer}>
                        <View style={styles.headerBanner}>
                            <View style={styles.headerItem}>
                                <Text style={{marginLeft: 15, marginTop: 8, fontSize:16, color: '#58647a'}}>
                                    Hola!{"\n"}{dataUser ? dataUser.firstname : 'usuario' }
                                </Text>
                            </View>
                            <View style={{flex:1, flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
                                <Image style={styles.userImageContainer}
                                source={require('../../../../../assets/icons/logo-100.png')}/>
                                <Text style={{fontSize:30, fontFamily:'HermanoAlto Round', paddingTop:12}}>DOMIS</Text>
                            </View>
                            <View  style={[styles.headerItem, { alignItems:'flex-end', marginRight:10}]}>
                                <TouchableOpacity
                                onPress={()=> this.setState({ visibleSettings : true })}> 
                                    <Image 
                                    style={styles.userImageContainer1}
                                        source={require('../../../../../assets/icons/settings.png')}/>
                                </TouchableOpacity>
                                <Modal
                                animationType="slide"
                                transparent={true}
                                visible={this.state.visibleSettings}>
                                    <View style={styles.modalBackground}>
                                        <TouchableOpacity
                                        style={{flex:1, alignItems:'flex-end', marginTop:30}}
                                        onPress={()=> this.setState({ visibleSettings : false })}> 
                                            <Image 
                                            style={styles.userImageContainer1}
                                            source={require('../../../../../assets/icons/down.png')}/>
                                        </TouchableOpacity>
                                        <View style={styles.bodyModal}>
                                            <View  style={[styles.bottomGridContainer, { marginTop: 50}]}>
                                                <ButtonGeneral 
                                                title="Cerrar sesion" 
                                                click={() => this.props.closeSesion()}
                                                color="#9c272c"
                                                fontColor="white"
                                                />
                                            </View>
                                            <View style={[styles.bottomGridContainer, {  }]}>
                                                <ButtonGeneral 
                                                title="Eliminar cuenta" 
                                                click={() => this.deleteUser()}
                                                color="white"
                                                fontColor="#9c272c"
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                        </View>
                       
                        { store !== null ?
                        <Text style={{
                            marginLeft: 15,
                            marginRight: 15,
                            marginTop: 30,
                            color: '#78b3a3',
                            fontSize: 25,
                            fontWeight: 'bold'
                        }}>
                            { storeName }
                        </Text> : <View></View>
                        }
                    </View>
                    <View style={styles.viewChart}>
                        { this.state.dataChart !== null ? 
                        <ChartList data={ this.state.dataChart } title="PEDIDOS HOY"/> 
                        : <View></View>
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
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
    userImageContainer1:{
        marginTop: 5,
        height: screenWidth * 30 / 375,
        width: screenWidth * 30 / 375,
        borderRadius: (screenWidth * 50 / 375) / 2,
    },
    categoryImageContainer: {
        marginLeft: 15,
        marginTop: 5,
        height: 50,
        width: 50,
    },
    viewChart:{
        flex:1,
        paddingHorizontal:15,
        alignItems:'center',
        marginTop:12
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
        alignItems:'center',
        width: screenWidth,
        marginBottom:30,
        //height: screenHeight / 2 - 50,
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
    },
    headerBanner: {
        flex:1,
        flexDirection:'row',
        //borderBottomWidth:.5
    },
    headerItem:{
        flex:1,
        justifyContent:'center'
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.9)',
        height:200
    },
    bodyModal:{
        flex:5,
        alignItems:'center'
    }
});

const mapStateToProps = state => {
    return{
        user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
        dataUser: state.ReducerUser && state.ReducerUser.user ? state.ReducerUser.user : false,
        loading: state.ReducerLoading.loading,
        position: state.ReducerPosition,
        store : state.ReducerStore,
        orders : state.ReducerOrdersByDate.orders
    }
};

const mapDispatchToProps = dispatch => ({
    getStore:(idOwner) => {
        console.log('idOwner')
        dispatch(ActionGetStore(idOwner))
    },
    getOrdersByDate:(store_id, date) => {
        dispatch(ActionGetOrdersStoreByDate(store_id, date))
    },
    closeSesion: () => {
        dispatch(ActionLogout());
      },
    deleteUser:(store) => {
        dispatch(ActionSetLoading());
        dispatch(ActionDisableStore(store))
        //dispatch(ActionDeleteUser())
    }
});
  
export default connect(mapStateToProps, mapDispatchToProps)(HomeStoreScreen);