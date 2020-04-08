import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
  Text, 
  View, 
  SafeAreaView, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity, 
  FlatList,
  Image,
  ScrollView, 
  Modal,
  RefreshControl } from 'react-native'
import moment from "moment";
import { CardOrder, ListOrder } from '../../../../components/CardOrder'
import { Transition} from 'react-navigation-fluid-transitions'
import { ActionGetOrders, ActionGetOrderDetails, ActionGetOrdersStore, ActionGetOrdersListener } from '../../../../store/actions/ActionOrder';
import { ActionSetLoading } from '../../../../store/actions/ActionApp';
import { FieldDate } from '../../../../components/Fields';
import { ButtonRegister } from '../../../../components/ButtonRegister';

let screenWidth = Dimensions.get('window').width;

class OrdersScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
        refreshing: false,
        modalVisible: false,
        visibleDateFrom: false,
        dateFrom: '',
        visibleDateTo: false,
        dateTo: '',
        orders : []
      };
    }
    componentDidMount(){
      this.getOrders()
    }

    _onRefresh = () => {
      this.getOrders()
      this.setState({refreshing: false});
    }

    setFilter = () => {
      let dateFrom = new Date(this.state.dateFrom);
      let dateTo = new Date(this.state.dateTo);

      let filterOrders = this.props.orders.filter((order) => { 
        let date = new Date(order._data.created_at);  
        return dateFrom <= date && date <= dateTo
      })
      console.log('filterOrders', filterOrders)
      this.setState({modalVisible: false, orders : filterOrders})
    }

    componentWillReceiveProps(newProps){
      if(newProps.orders !== this.props.orders){
        this.setState({ orders : newProps.orders })
      }
    }

    getOrders = () => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const day = new Date().getDate()
      const startDate = { year, month, day}
      const endDate = { year, month, day}
      const store_id = this.props.store.store.store_id;
      this.props.getOrders(store_id)
    }

    validatePendings = () => {
      let orders = this.props.orders;
      let response = true;
      orders.forEach(item => {
        if(item._data.status === 'pending' || item._data.status === 'processing' || 
        item._data.status === 'unapproved' || item._data.status === 'approved' || item._data.status === 'dispatched'){
          response = false;
        }
      });
      return response;
    }

    render() {
      const { orders } = this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
              <View style={{flex:1}}>
                <Text style={styles.titleHeader}> Ordenes </Text>      
                { orders ? 
                  <View>
                    <ScrollView  
                    refreshControl= {
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                      /> 
                    }>
                      <View style={styles.header}>
                      { this.validatePendings() ?
                        <Text style={{fontSize:18, textAlign:'center'}}>No hay ordenes pendientes</Text>
                        :
                        <FlatList
                          showsHorizontalScrollIndicator={false}
                          horizontal={true}
                          data={orders}
                          extraData={orders}
                          renderItem={({item, index}) => this.renderOrdersPending(item, index)}
                        /> 
                      }
                      </View>
                   </ScrollView>
                    <View style={styles.body}>
                      <View style={{marginBottom:12, marginTop:12, flexDirection:'row'}}>
                        <View style={{flex:2, paddingLeft:140}}>
                          <Text style={styles.titleHeaderSmall}>HISTORIAL</Text>
                        </View>
                        <TouchableOpacity 
                        onPress={() => this.setState({modalVisible: true})} 
                        style={{flex:1, flexDirection:'row'}}>
                          <Image style={{width:20, height:20}}
                          source={require('../../../../../assets/icons/filter.png')} />
                          <Text style={{}}>Filtrar</Text>
                        </TouchableOpacity>
                      </View>   
                      <View style={{width:'100%', marginBottom:15}}>                  
                        <FlatList
                        data={orders}
                        extraData={orders}
                        renderItem={({item, index}) => this.renderOrdersFinished(item, index)}
                        /> 
                      </View>
                    </View>
                  </View>
                  :  <Text>No tienes ordenes aún</Text>
                }
              </View>
              <Modal 
              transparent={true}
              initialNumToRender={1}
              animationType="slide"
              animationInTiming={1000}
              animationOutTiming={600}
              visible={this.state.modalVisible}
              style={styles.modal}>
                  <View style={styles.modal}>
                      <View style={{flexDirection:'row'}}>
                        <View style={{flex:2, alignItems:'flex-start'}}>
                          <TouchableOpacity onPress={() => this.setState({modalVisible:false }) }>
                            <Text style={{marginLeft:12, marginTop:12, fontSize:20, color:'black'}}>X</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{ flex:1,alignItems:'flex-end'}}>
                          <TouchableOpacity onPress={() => this.setState({
                            modalVisible:false,  
                            orders : this.props.orders,
                            dateFrom: '',
                            dateTo: ''
                          })}>
                            <Text style={{marginLeft:12, marginTop:12, fontSize:12, color:'black'}}>Eliminar Filtro</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text style={{textAlign:'center', fontSize:16}}>Filtrar</Text>
                      <View style={{marginTop:12, marginBottom:12}}>
                        <FieldDate  
                        label="Desde" 
                        editable={true}
                        value={this.state.dateFrom}
                        action={(date) => this.setState({dateFrom : date, visibleDateFrom : false})}
                        visible={this.state.visibleDateFrom}  
                        isVisible={(value) => {
                          this.setState({visibleDateFrom:value})
                        }}/>
                        <FieldDate  
                        label="A" 
                        editable={true}
                        value={this.state.dateTo}
                        action={(date) => this.setState({dateTo : date, visibleDateTo : false})}
                        visible={this.state.visibleDateTo }  
                        isVisible={(value) => {
                          this.setState({visibleDateTo:value})
                        }}/>
                      </View>
                      <View style={{alignItems:'center'}}>
                        <ButtonRegister
                        title='Aplicar' 
                        width={150}
                        fontSize={12}
                        click={ () => this.setFilter() }                           
                        invalid={ !this.state.dateFrom ||  !this.state.dateTo } 
                        color="black"/>
                      </View>
                  </View>
              </Modal>
            </SafeAreaView>
        )
    }
    
  colorBackGround = (status) => {
      switch (status) {
          case 'pending':
              return '#edca58'
          case 'processing':
              return '#8da1b8'
          case 'unapproved':
              return '#ab8c8c'
          case 'approved':
              return '#28c996'
          case 'dispatched':
            return '#8da1b8'
          case 'delivered':
              return '#78b3a3'
          case 'cancelled':
              return '#964b4e'
          default:
              break;
      }
  }

  getOrderDetails(id , color, item){
    this.props.navigation.navigate('orderDetail', {
      item: id, 
      color: color,
      order: item
    })
  }

  renderOrdersPending(item, index) {
    const color = this.colorBackGround(item._data.status);
    if(item._data.status === 'pending' || item._data.status === 'processing' || 
    item._data.status === 'unapproved' || item._data.status === 'approved' || item._data.status === 'dispatched'){
      return (
        <TouchableOpacity
        style={{paddingTop:10, marginBottom:10}}
        activeOpacity = {1}
        onPress={() => { 
          this.getOrderDetails(item['id'], color, item._data)
        }}
        >
          <Transition shared={item['key']}> 
            <CardOrder item={item} index = {index} color={color}/>
          </Transition>
        </TouchableOpacity>
      )
    } 
  }

  renderOrdersFinished(item, index) {
    const color = this.colorBackGround(item._data.status);
    if(item._data.status === 'delivered' || item._data.status === 'cancelled'){
      return (
        <TouchableOpacity
        style={{ width:'99%', marginBottom:5}}
        activeOpacity = {1}
        onPress={() => { 
          this.getOrderDetails(item['id'], color, item._data)
        }}>
          <Transition shared={item['key']}> 
            <ListOrder item={item} index = {index} color={color}/>
          </Transition>
        </TouchableOpacity>
      )
    } 
  }
}

const scaleToDimension = (size) => {
  return screenWidth * size / 375
};

const styles = StyleSheet.create({
  titleHeader:{
    fontFamily:'Ubuntu-Bold',
    color: '#58647a',
    fontSize: scaleToDimension(30),
    marginLeft:10,
    textAlign:'center',
    marginTop:10
  },
  header:{
    marginHorizontal:12,
    paddingTop:10,

    height:scaleToDimension(180),  
    marginTop:10, 
    marginBottom:10,
    marginLeft:7, 
    marginRight:7,
    backgroundColor:'#ffffff',
    alignItems:'center',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 6,

    elevation: 3,
    borderRadius:12
  },
  body:{
    alignItems:'center',
    height:400
  },
  titleHeaderSmall:{
    fontWeight:'bold',
    fontSize:18
  },
  modal: {
    margin: 0, 
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    paddingVertical:10,
    paddingHorizontal:10,
    backgroundColor: 'white', 
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    height: 250, 
    flex:1, 
    bottom: 0, 
    position: 'absolute',
    width: '100%'
  },
})

const mapStateToProps = state => ({
  user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
  loading: state.ReducerLoading.loading,
  orders: state.ReducerOrders.orders,
  store : state.ReducerStore
});

const mapDispatchToProps = dispatch => ({
  getOrders:(store_id) => {
    dispatch(ActionGetOrdersStore(store_id));
    dispatch(ActionGetOrdersListener(store_id))
  },
  getOrderDetails: (token, id) => {
    dispatch(ActionSetLoading());
    dispatch(ActionGetOrderDetails(token, id))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrdersScreen);