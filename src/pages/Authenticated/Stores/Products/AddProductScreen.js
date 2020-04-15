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

    createKeywords = name => {
        const arrName = [];
        let curName = '';
        name.split('').forEach(letter => {
          curName += letter;
          arrName.push(curName);
        });
        return arrName;
    }
    
    generateKeywords = (product) => {
        const [ name, brand, description ] = product;
        const nameLower = name.toLowerCase();
        const brandLower = brand.toLowerCase();
        const keyWordName = this.createKeywords(`${nameLower}`);
        const keyWordBrand = this.createKeywords(`${brandLower}`);
        return [
            ...new Set([
            '',
            ...keyWordName,
            ...keyWordBrand,
            ])
        ];
    };

    addProduct = () => {
        const values = this.props.form.values;
        const { name, brand } = values;
        const keywords = this.generateKeywords([name, brand])
        Object.assign( values, {
            active : true,
            keywords
        }) 
        const image = this.props.image;
        const store_id = this.props.store.store.store_id;
        this.props.addProduct(values, image, store_id, this.props.navigation)
    }

    loadImage = (image) => {
        this.props.loadImage(image);
    }
    render() {
        const { navigation, store } = this.props;
        try {
            if(!this.props.form.values['category_id']){
                this.props.form.values['category_id'] = store.store.categories[0].id;
            }
        } catch (error) {
            console.log(error)
        }
       
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