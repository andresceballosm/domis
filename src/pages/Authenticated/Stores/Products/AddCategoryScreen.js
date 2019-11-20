import React, { Component } from 'react'
import { 
    Text, 
    View, 
    TouchableOpacity, 
    Image, 
    Dimensions,
    StyleSheet,
    Platform,
    SafeAreaView } from 'react-native'

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

class AddCategoryScreen extends Component {

    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Text>Catefgory</Text>
               
            </SafeAreaView>
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
              elevation: 11,
            }
        })
    },
});

export default AddCategoryScreen;