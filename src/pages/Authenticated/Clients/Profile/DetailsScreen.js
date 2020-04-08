import React, { Component } from 'react'
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

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
let arrTapBar = [{"key": "Dish types"}, {"key": "Ingredients"}, {"key": "Cooking time"}, {"key": "Low calories"}, {"key": "Popular"}]

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

    render() {
        const {navigation} = this.props;
        console.log('navigation',navigation)
        const item = navigation.getParam('item', '');
        const color = navigation.getParam('color', '');
        return (
            <SafeAreaView style={styles.DetailMainContainer}>
                <Transition shared={item}>
                    <View style={[styles.detailTopContainer, {backgroundColor:color}]}>
                        <View style={styles.navigationHeaderContainer}>
                            <TouchableOpacity style={{bottom: 15, position: 'absolute', left: 15,height:20,width:20,}}
                                onPress={(event) => {
                                    navigation.goBack()
                                }}>
                            <Image style={{height:20,width:20,}}
                                   source={require('../../../../../assets/images/ic_back.png')}/>
                            </TouchableOpacity>
                            <Image style={{bottom: 15, position: 'absolute', right: 30,height:20,width:20,}}
                                   source={require('../../../../../assets/images/ic_search_white.png')}/>
                        </View>
                        <View style={styles.detailTopBottomSubContainer}>
                            <Image style={styles.categoryImageContainer}
                                source={validateIcon(item['icon'])}/>
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: scaleToDimension(35),
                            }}>{item}</Text>
                            <Text style={{color: 'white', fontSize: scaleToDimension(15),}}>87 recipes available</Text>
                        </View>
                    </View>
                </Transition>
                {/* <FlatList
                    showsVerticalScrollIndicator={false}
                    data={arrTapBar}
                    renderItem={({item, index}) => this.renderDetailListCell(item, index)}
                /> */}
            </SafeAreaView>
        );
    }

    renderDetailListCell(item, index) {
        return (
            <TouchableOpacity
                activeOpacity = {1}
            >
        <View style={styles.detailListCellContainer}>
                    <View style={index == arrTapBar.length - 1 ? styles.detailListCellLastIndexContentViewContainer : styles.detailListCellContentViewContainer}>
                        <View style={styles.detailListCellContentViewBottomContainer}>
                            <Text style={{
                                color: '#33353b',
                                marginLeft: 15,
                                marginTop: 15,
                                fontSize: 18,
                                fontWeight: 'bold'
                            }}>Turkey Risotto</Text>

                            <View style={{
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                                marginLeft: 15,
                                marginTop: 12
                            }}>
                                <Text style={{color: '#33353b', fontSize: 15}}>40 min</Text>
                                <Text style={{color: '#33353b', marginLeft: 20, fontSize: 15}}>450 cal</Text>
                            </View>
                        </View>
                    </View>
                </View>
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
        justifyContent: 'center'
    },
    bottomContainer: {
        alignItems: 'center',
        // height: screenHeight/2,
        backgroundColor: 'transparent'
    },
    // detailsHeader: {
    //     height: 160,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: '#0000FA',
    // },
    DetailMainContainer: {
        flex: 1,
    },
    detailTopContainer: {
        height: scaleToDimension(250),
        width: screenWidth,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius:20,
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
    detailListCellContainer: {
        flex: 0,
        width: screenWidth,
        height: screenWidth,
        backgroundColor: 'transparent',
        paddingTop: 10,
        paddingBottom: 10,
    },
    detailListCellContentViewContainer: {
        width: screenWidth - 20,
        height: screenWidth - 10,
        backgroundColor: '#5677f1',
        borderRadius: 10,
        marginRight: 10,
        marginLeft: 10,
    },
    detailListCellLastIndexContentViewContainer: {
        width: screenWidth - 20,
        height: screenWidth - 20,
        backgroundColor: '#5677f1',
        borderRadius: 10,
        marginRight: 10,
        marginLeft: 10,
    },
    detailListCellContentViewBottomContainer: {
        width: screenWidth - 22,
        minHeight: scaleToDimension(70),
        backgroundColor: 'white',
        position: 'absolute',
        paddingBottom: 15,
        bottom: 1,
        marginLeft: 1,
        marginRight: 1,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
});

export default DetailsScreen;