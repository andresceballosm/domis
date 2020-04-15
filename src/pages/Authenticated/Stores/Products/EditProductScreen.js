import React, { Component } from 'react'
import { 
    Text, 
    View, 
    TouchableOpacity, 
    Alert, 
    Dimensions,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView } from 'react-native'
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import ProductForm from './ProductForm';
import SelectSavedImage from '../../../../components/SelectSavedImage';
import { ActionUploadImage, ActionSetLoading } from '../../../../store/actions/ActionApp';
import { ActionUpdateProduct, ActionDeleteProduct } from '../../../../store/actions/ActionStores';

let screenWidth = Dimensions.get('window').width;

class EditProductScreen extends Component {

    editProduct = () => {
        const id = this.props.navigation.getParam('id', '');
        const values = this.props.form.values;
        console.log('values', values);
        const image = this.props.image;
        const store_id = this.props.store.store.store_id;
        this.props.editProduct(id,values,image,store_id, this.props.navigation)
    }

    deleteProduct = () => {
        const id = this.props.navigation.getParam('id', '');
        let product = this.props.navigation.getParam('product', '');
        Alert.alert(
            'Eliminar',
            `${'Seguro(a) que desea eliminar' + ' ' + product.name }`,
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {   text: 'Aceptar', onPress: () => { 
                    this.props.deleteProduct(id, this.props.store.store.store_id, this.props.navigation);
                }},
            ],
            { cancelable: false },
        );    
    }

    loadImage = (image) => {
        this.props.loadImage(image);
    }
    render() {
        const { navigation, store } = this.props;
        const product = navigation.getParam('product', '');
        return (
            <SafeAreaView style={styles.DetailMainContainer}>
                <View style={styles.header}>
                    <View style={{flex:1}}>
                        <Icon onPress={() => navigation.pop()} name='md-arrow-round-back' />
                    </View>
                    <View style={{flex:7}}>
                        <Text style={{
                            marginLeft: 15,
                            marginRight: 15,
                            marginBottom:10,
                            color: '#58647a',
                            fontSize: 20,
                            fontWeight: 'bold'
                        }}>Editar {product.name}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Icon style={{color: '#b8444a'}} onPress={() => this.deleteProduct()} name='md-trash' />
                    </View>
                </View>
                <ScrollView style={styles.container}>
                    <View style={styles.viewSection}>
                        <SelectSavedImage 
                        titleBtn="Cambiar imagen"
                        image={this.props.image}
                        load={this.loadImage} 
                        urlImage={product.image}
                        />
                    </View>
                    <View>
                        <ProductForm 
                        initialValues={product} 
                        save={this.editProduct}  origin='edit' categories={store.store.categories} />
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
        marginHorizontal:10,
        marginTop:15,
        marginBottom:10
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
    viewSection:{
        alignItems: 'center',
        paddingTop:20,
        marginBottom:15
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
    editProduct: ( id,values,image,store_id, navigation ) => {
        dispatch(ActionSetLoading());
        dispatch(ActionUpdateProduct({id,values,image,store_id}));
        navigation.goBack();
    },
    loadImage:(image)=>{
        dispatch(ActionUploadImage(image));
    },
    deleteProduct :( id, store_id, navigation) => {
        dispatch(ActionSetLoading());
        dispatch(ActionDeleteProduct(id, store_id));
        navigation.pop();
    }
});
  
export default connect(mapStateToProps, mapDispatchToProps)(EditProductScreen);