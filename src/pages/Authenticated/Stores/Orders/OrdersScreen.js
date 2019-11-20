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
  ScrollView, 
  RefreshControl } from 'react-native'
import moment from "moment";
import { CardOrder } from '../../../../components/CardOrder'
import { Transition} from 'react-navigation-fluid-transitions'
import { ActionGetOrders, ActionGetOrderDetails, ActionGetOrdersStore } from '../../../../store/actions/ActionOrder';
import { ActionSetLoading } from '../../../../store/actions/ActionApp';

let screenWidth = Dimensions.get('window').width;

class OrdersScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
        refreshing: false,
      };
    }
    componentDidMount(){
      this.getOrders()
    }

    _onRefresh = () => {
      this.getOrders()
      this.setState({refreshing: false});
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
      const { orders } = this.props;
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
              <ScrollView  
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
              >
                <Text style={styles.titleHeader}> Ordenes </Text>      
                { orders ? 
                  <View>
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
                    <View style={styles.body}>
                        <Text style={styles.titleHeaderSmall}>Historial</Text>
                        <FlatList
                        numColumns={2}
                        showsHorizontalScrollIndicator={false}
                        horizontal={false}
                        data={orders}
                        data={orders.sort((a, b) =>  a - b)}
                        extraData={orders}
                        renderItem={({item, index}) => this.renderOrdersFinished(item, index)}
                      /> 
                    </View>
                  </View>
                  :  <Text>No tienes ordenes aún</Text>
                }
                <View>
                  
                </View>
              </ScrollView>
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
        style={{paddingTop:10}}
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
        style={{paddingTop:10}}
        activeOpacity = {1}
        onPress={() => { 
          this.getOrderDetails(item['id'], color, item._data)
        }}>
          <Transition shared={item['key']}> 
            <CardOrder item={item} index = {index} color={color}/>
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
    color: 'black', 
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

    elevation: 7,
    borderRadius:12
  },
  body:{
    alignItems:'center'
  }
})

const mapStateToProps = state => ({
  user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
  loading: state.ReducerLoading.loading,
  orders: state.ReducerOrders.orders,
  store : state.ReducerStore
});

const mapDispatchToProps = dispatch => ({
  getOrders:(store_id) => {
      dispatch(ActionGetOrdersStore(store_id))
  },
  getOrderDetails: (token, id) => {
    dispatch(ActionSetLoading());
    dispatch(ActionGetOrderDetails(token, id))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrdersScreen);