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
    StyleSheet } from 'react-native'
import { ActionGetStore, ActionDisableStore } from '../../../../store/actions/ActionStores.js';
import { ButtonGeneral } from '../../../../components/ButtonRegister.js';
import { ActionLogout, ActionDeleteUser } from '../../../../store/actions/ActionsAuthentication.js';
import { ActionSetLoading } from '../../../../store/actions/ActionApp.js';

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
            visibleSettings: false
        };
    }
    
    componentDidMount(){
        this.props.getStore(this.props.user.uid)
    }


    getStores = (item) => {
        this.props.navigation.navigate('homeDetails', {item: item['key'], color: item['color'], id: item['id']})
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
            {cancelable: false},
        );       
    }

    render() {
        const {dataUser, store } = this.props;
        try {
            var storeName = store.store.name;   
        } catch (error) {
            var storeName = '';  
        }

        return (
            <SafeAreaView style={styles.mainContainer}>
                <ScrollView style={styles.mainContainer}>
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
                            color: '#58647a',
                            fontSize: 25,
                            fontWeight: 'bold'
                        }}>
                            { storeName }
                        </Text> : <View></View>
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
        store : state.ReducerStore
    }
};

const mapDispatchToProps = dispatch => ({
    getStore:(idOwner) => {
        dispatch(ActionGetStore(idOwner))
    },
    closeSesion: () => {
        dispatch(ActionLogout());
      },
    deleteUser:(store) => {
        dispatch(ActionSetLoading());
        dispatch(ActionDisableStore(store))
        //dispatch(ActionDeleteUser())
    },
});
  
export default connect(mapStateToProps, mapDispatchToProps)(HomeStoreScreen);