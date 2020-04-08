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
  Image,
  RefreshControl } from 'react-native'
import { CardOrder, ListOrder } from '../../../../components/CardOrder'
import { Transition} from 'react-navigation-fluid-transitions'
import { ActionGetOrders, ActionGetOrderDetails } from '../../../../store/actions/ActionOrder';
import { ActionSetLoading } from '../../../../store/actions/ActionApp';
import { ActionGetOrdersListenerUser } from '../../../../store/actions/ActionOrder';

let screenWidth = Dimensions.get('window').width;

class OrdersScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
        refreshing: false,
      };
    }
    componentDidMount(){
      this.props.getOrders(this.props.user.uid)
    }

    _onRefresh = () => {
      this.props.getOrders(this.props.user.uid)
      this.setState({refreshing: false});
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
              <View style={{flex:1}}>
                <Text style={styles.titleHeader}> Ordenes </Text>      
                { orders.length > 0 ? 
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
                            <View style={styles.viewNoProductsSmall}>
                              <Image style={{height:140,width:200}}
                              source={require('../../../../../assets/images/noorders.png')}/>
                              <Text style={styles.titleNoProductsSmall}>No hay ordenes pendientes</Text>
                            </View>
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
                      <View style={{marginBottom:10}}>
                        <Text style={styles.titleHeaderSmall}>HISTORIAL</Text>
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
                  :  
                  <View style={styles.viewNoProducts}>
                    <Text style={styles.titleNoProducts}>No tienes ordenes aún</Text>
                    <Image style={{height:400,width:400}}
                    source={require('../../../../../assets/images/noorders.png')}/>
                  </View>
                }
              </View>
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
    if(item._data.status === 'pending' || item._data.status === 'processing' || item._data.status === 'unapproved' 
    || item._data.status === 'approved' || item._data.status === 'dispatched'){
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
    color: 'black', 
    fontSize: scaleToDimension(30),
    marginLeft:10,
    textAlign:'center',
    marginTop:10
  },
  titleHeaderSmall:{
    fontFamily:'Ubuntu-Bold',
    color: 'black', 
    fontSize: scaleToDimension(24),
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
  titleNoProducts:{
    fontSize:20,
    textAlign:'center'
  },
  titleNoProductsSmall:{
    fontSize:18,
    marginBottom:25,
    textAlign:'center'
  },
  viewNoProducts:{
    flex:1,
    marginTop:20,
    alignItems:'center',
    justifyContent:'center'
  },
  viewNoProductsSmall:{
    flex:1,
    marginTop:5,
    alignItems:'center',
    justifyContent:'center'
  },
  titleHeaderSmall:{
    fontWeight:'bold',
    fontSize:18
  }
})

const mapStateToProps = state => ({
  user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
  loading: state.ReducerLoading.loading,
  orders: state.ReducerOrders.orders
});

const mapDispatchToProps = dispatch => ({
  getOrders:(user_id) => {
    dispatch(ActionGetOrders(user_id))
    dispatch(ActionGetOrdersListenerUser(user_id))
  },
  getOrderDetails: (token, id) => {
    dispatch(ActionSetLoading());
    dispatch(ActionGetOrderDetails(token, id))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrdersScreen);