import { call, takeEvery, put, take } from 'redux-saga/effects';
import CONSTANTS from '../CONSTANTS';
import { ActionStopLoading } from '../actions/ActionApp';
import { showAlertError, showAlertSuccess } from '../../utils/Alerts';
import { ActionDataStores, ActionDataCategories, ActionDataProductsByCategory, ActionGetProductsByCategory, ActionClearBasket, ActionSetStore, ActionUpdateProductsByCategory, ActionDeleteProductByCategory, ActionAddProductsByCategory } from '../actions/ActionStores';
import { dataBase, storage } from '../../services/Firebase';
import { getGeohashRange } from '../../components/GeoHashRange';
import { ActionGetOrders } from '../actions/ActionOrder';
import { ActionDeleteUser } from '../actions/ActionsAuthentication';

const getStoresByType = ref => 
  ref.get().then(stores => stores);

const getProductsByCategory = ref => 
  ref.get().then(stores => stores);

const createOrder = (values) => 
  dataBase.collection('orders').doc().set(values)

const deleteProduct = (data) => 
  dataBase.collection(`${'products' + '_' + data.store_id}`).doc(data.id).delete().then(success => success);

const addProduct = (data) => 
  dataBase.collection(`${'products' + '_' + data.store_id}`).doc(data.id).set(data.values)

const updateStore = (store) => 
  dataBase.collection('stores').doc(`${store.store_id}`).update(store)
  .then(success => success);


function* GetStore(data){
  const { idOwner } = data;
  try {
    console.log('idOwner',idOwner)
    const storeRef = dataBase.collection('stores').where("owner_id", "==", idOwner);
    const data = yield call(getStoresByType, storeRef);
    console.log('data getStore', data);
    const store_id = data._docs[0]._ref._documentPath._parts[1];
    const store = data._docs[0]._data;
    console.log('store', store);
    Object.assign( store, {
      store_id : store_id,
  }) 
    yield put(ActionSetStore(store));
    yield put(ActionStopLoading());
  } catch (error) {
    console.log('error', error)
    //showAlertError('Se ha producido un error')
    yield put(ActionStopLoading());
  }
}

function* GetStoresByType(values) {
  const { storetype, geohash, range } = values
  try {
    console.log('range',range);
    console.log('geohash',geohash);
    const ref = dataBase.collection('stores')
                        .where("geohash", ">=", range.lower)
                        .where("geohash", "<=", range.upper)
    const stores = yield call(getStoresByType, ref)
    const dataStores = stores._docs;
    var data = []
    for (let i = 0; i < dataStores.length; i++) {
      if(dataStores[i]._data.storetype == storetype){
        const lat = dataStores[i]._data.latitude;
        const lng = dataStores[i]._data.longitude;
        const range = getGeohashRange(lat, lng, dataStores[i]._data.perimeter);
        if(geohash >= range.lower && geohash <= range.upper){
            data.push(dataStores[i])
        }
      }      
    }
    yield put(ActionDataStores(data));
    yield put(ActionStopLoading());
  } catch (error) {
    showAlertError('Se ha producido un error')
    yield put(ActionStopLoading());
  }
}

function* GetCategoriesByStore(values) {
  const { idStore, token } = values
  try {
    const id = idStore
    const categories = yield call(getCategoriesByStore, { id, token });
    if(categories.error || categories.info ){
      categories.error ? showAlertError(error) : null;
    } else {
      yield put(ActionDataCategories(categories));
      yield put(ActionGetProductsByCategory(categories[0].id, token))
    }
    yield put(ActionStopLoading());
  } catch (error) {
    console.log(error)
    showAlertError('Se ha producido un error')
    yield put(ActionStopLoading());
  }
}

function* GetProductsByCategory(values) {
  const { idCategory, store_id } = values
  try {
    const ref = dataBase.collection(`${'products' + '_' + store_id}`).where("category_id", "==", idCategory)
    const products = yield call(getProductsByCategory, ref);
    console.log('products in GetProductsByCategory', products);
    const lists = [];
    if(products){
      const productLists = products._docs;
      for (let i = 0; i < productLists.length; i++) {
        productLists[i]._data.id = productLists[i]._ref._documentPath._parts[1];
        lists.push(productLists[i]);
      }
    }
    console.log('lists', lists)
    yield put(ActionDataProductsByCategory( lists )); 
    yield put(ActionStopLoading());
    
  } catch (error) {
    console.log(error)
    showAlertError('Se ha producido un error')
    yield put(ActionStopLoading());
  }
}

function* CreateOrder(values) {
  try {
    const { order, navigation } = values.order;
    yield call(createOrder, order);
    yield put(ActionClearBasket());
    showAlertSuccess('Se ha enviado su pedido exitosamente, espere confirmación por parte del negocio.');
    yield put(ActionGetOrders(order.user_id))
    yield put(ActionStopLoading());
    navigation.navigate('orders');
  } catch (error) {
    console.log('error in order' ,error)
    showAlertError('Se ha producido un error, intente de nuevo.')
    yield put(ActionStopLoading());
  }
}

function* DisableStore(values) {
  try {
    const { store } = values;
    yield call(updateStore, store );
    yield put(ActionDeleteUser())
    yield put(ActionStopLoading());
  } catch (error) {
    
  }
}

function* AddProduct(newValues) {
  try {
    const { values, image, store_id } = newValues.data;
    const name = values.name;
    var code = '';
    if (name.trim()) {
      var deletespaces = name.replace(/\s+/g, '');
      code = deletespaces.slice(0,6)
    }else{
      code = idClub;
    }
    const id = code + '-' + new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate() + '-' + new Date().getTime();
    
    var product = {};
    product._data = values;
    product._ref = { _documentPath: { _parts : []}};
    product._ref._documentPath._parts[1] = id;
  
    if(image){
      const storageRef = storage.ref().child("products/" + id);
      yield storageRef.put(image.path).then(function(snapshot) {
        let url = snapshot.downloadURL;
        Object.assign( values, {
          image : url
        }) 
        dataBase.collection(`${'products' + '_' + store_id}`).doc(id).set(values)
        .then(success => success);
      });
    } else {
      yield call(addProduct, { values, store_id, id}); 
    }
    product.id = id;
    console.log('product',product)
    yield put(ActionAddProductsByCategory(product))
    showAlertSuccess('Se ha agregado el producto con exito!')
    yield put(ActionStopLoading());

  } catch (error) {
    console.log('error se va por catch', error);
    yield put(ActionStopLoading());
    showAlertError('Ha ocurrido un error en la creación, por favor intente de nuevo.')
  }
} 

function* UpdateProduct(newValues) {
    try {
      const { id, values, image, store_id } = newValues.data;
      if(image){
        const storageRef = storage.ref().child("products/" + id);
        yield storageRef.put(image.path).then(function(snapshot) {
          let url = snapshot.downloadURL;
          Object.assign( values, {
            image : url
          }); 
          dataBase.collection(`${'products' + '_' + store_id}`).doc(id).update(values)
          .then(success => success);
        });
      } else {
        dataBase.collection(`${'products' + '_' + store_id}`).doc(id).update(values)
        .then(success => success);
      }
      values.id = id;
      yield put(ActionUpdateProductsByCategory(values))
      showAlertSuccess('Se ha editado el producto con exito!')
      yield put(ActionStopLoading());

    } catch (error) {
      console.log('error se va por catch', error);
      yield put(ActionStopLoading());
      showAlertError('Ha ocurrido un error en la edición, por favor intente de nuevo.')
    }
}

function* UpdateStore(values) {
  const { store } = values
  try {
    yield call(updateStore, store);
    showAlertSuccess('Operación exitosa!')
    yield put(ActionSetStore(store));
    yield put(ActionStopLoading());
  } catch (error) {
    console.log(error)
    showAlertError('Se ha producido un error')
    yield put(ActionStopLoading());
  }
}

function* DeleteProduct(values) {
  const { id, store_id } = values
  try {
    yield call(deleteProduct, { id, store_id });
    showAlertSuccess('Se eliminó el producto de manera exitosa!')
    yield put(ActionDeleteProductByCategory(id))
    yield put(ActionStopLoading());
  } catch (error) {
    console.log(error)
    showAlertError('Se ha producido un error')
    yield put(ActionStopLoading());
  }
}


export const sagaStores = [
  //take every listening to the dispatch
  takeEvery(CONSTANTS.GET_STORE, GetStore),
  takeEvery(CONSTANTS.GET_STORES_BY_TYPE, GetStoresByType), 
  takeEvery(CONSTANTS.GET_CATEGORIES_BY_STORE, GetCategoriesByStore),
  takeEvery(CONSTANTS.GET_PRODUCTS_BY_CATEGORY, GetProductsByCategory),
  takeEvery(CONSTANTS.CREATE_ORDER, CreateOrder),
  takeEvery(CONSTANTS.DISABLE_STORE, DisableStore),
  takeEvery(CONSTANTS.UPDATE_PRODUCT, UpdateProduct),
  takeEvery(CONSTANTS.ADD_PRODUCT, AddProduct),
  takeEvery(CONSTANTS.UPDATE_STORE, UpdateStore),
  takeEvery(CONSTANTS.DELETE_PRODUCT, DeleteProduct)
]
