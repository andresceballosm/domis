import React, { Component } from 'react'
import { 
    Text, 
    View, 
    Dimensions,
    ScrollView,
    StyleSheet,
    Platform,
    SafeAreaView } from 'react-native'
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import ProductForm from './ProductForm';
import SelectSavedImage from '../../../../components/SelectSavedImage';
import { ActionUploadImage, ActionSetLoading } from '../../../../store/actions/ActionApp';
import { ActionAddProduct } from '../../../../store/actions/ActionStores';

let screenWidth = Dimensions.get('window').width;

class AddProductScreen extends Component {

    addProduct = () => {
        const values = this.props.form.values;
        const image = this.props.image;
        const store_id = this.props.store.store.store_id;
        this.props.addProduct(values, image, store_id, this.props.navigation)
    }

    loadImage = (image) => {
        this.props.loadImage(image);
    }
    render() {
        const { navigation, store } = this.props;
        return (
            <SafeAreaView style={styles.DetailMainContainer}>
                <View style={styles.header}>
                    <View style={{flex:1}}>
                        <Icon onPress={() => navigation.pop()} name='md-arrow-round-back' />
                    </View>
                    <View style={{flex:8}}>
                        <Text style={{
                            marginLeft: 15,
                            marginRight: 15,
                            marginBottom:10,
                            color: '#58647a',
                            fontSize: 20,
                            fontWeight: 'bold'
                        }}>Agregar Producto</Text>
                    </View>
                </View>
                <ScrollView style={styles.container}>
                    <View style={styles.viewSection}>
                        <SelectSavedImage 
                        titleBtn="Cambiar imagen"
                        image={this.props.image}
                        load={this.loadImage} 
                        />
                    </View>
                    <View>
                        <ProductForm 
                        save={this.addProduct}  
                        origin='add' 
                        categories={store.store.categories} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
};

const scaleToDimension = (size) => {
    return screenWidth * size / 375
};

// All Styles related to design...
const styles = StyleSheet.create({
    DetailMainContainer: {
        flex: 1,
        backgroundColor:'white'
    },
    header:{
        flexDirection:'row',
        marginHorizontal:10,
        marginVertical:10
    },
    container:{
        flex:1,
        marginTop:15,
        marginBottom:10
    }, 
    viewSection:{
        alignItems: 'center',
        paddingTop:20,
        paddingBottom:10
    },
  
});

const mapStateToProps = state => {
    return {
        user : state.ReducerSesion && state.ReducerSesion.user ? state.ReducerSesion.user : false,
        loading: state.ReducerLoading.loading,
        store : state.ReducerStore,
        dataProducts: state.ReducerProducts,
        form: state.form.ProductForm,
        image: state.ReducerUploadImage,
    } 
};
  
const mapDispatchToProps = dispatch => ({
    addProduct: ( values, image, store_id, navigation ) => {
        dispatch(ActionSetLoading());
        dispatch(ActionAddProduct({values, image, store_id}));
        navigation.pop();
    },
    loadImage:(image)=>{
        dispatch(ActionUploadImage(image));
    },
});
  
export default connect(mapStateToProps, mapDispatchToProps)(AddProductScreen);