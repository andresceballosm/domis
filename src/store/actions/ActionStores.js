import CONSTANTS from '../CONSTANTS';

export const ActionGetStore = (idOwner) => ({
    type: CONSTANTS.GET_STORE,
    idOwner
});

export const ActionGetStoresByType = (storetype, geohash, range) => ({
    type: CONSTANTS.GET_STORES_BY_TYPE,
    storetype, geohash, range
});

export const ActionGetStoresById = (id) => ({
    type: CONSTANTS.GET_STORES_BY_ID,
    id
});

export const ActionDataStores = (stores) => ({
    type: CONSTANTS.SET_STORES_BY_TYPE,
    stores
});

export const ActionSetStore = (store) => ({
    type: CONSTANTS.SET_STORE,
    store
});

export const ActionGetCategoriesByStore = ( idStore) => ({
    type: CONSTANTS.GET_CATEGORIES_BY_STORE,
    idStore
});

export const ActionDataCategories = (categories) => ({
    type: CONSTANTS.SET_CATEGORIES_BY_STORE,
    categories
});

export const ActionGetProductsByCategory = (idCategory, store_id) => ({
    type: CONSTANTS.GET_PRODUCTS_BY_CATEGORY,
    idCategory, store_id
});

export const ActionUpdateProductsByCategory = (product) => ({
    type: CONSTANTS.UPDATE_PRODUCTS_BY_CATEGORY,
    product
});

export const ActionAddProductsByCategory = (product) => ({
    type: CONSTANTS.ADD_PRODUCT_BY_CATEGORY,
    product
});

export const ActionDeleteProductByCategory = ( id ) => ({
    type: CONSTANTS.DELETE_PRODUCT_BY_CATEGORY,
    id
});

export const ActionDataProductsByCategory = (products) => ({
    type: CONSTANTS.SET_PRODUCTS_BY_CATEGORY,
    products
});

export const ActionDataProductsOrderDetails = (products) => ({
    type: CONSTANTS.SET_PRODUCTS_DETAILS,
    products
});

export const ActionAddToBasket = (product) => ({
    type: CONSTANTS.ADD_PRODUCT_BASKET,
    product
});

export const ActionRemoveProductBasket = (id) => ({
    type: CONSTANTS.REMOVE_PRODUCT_BASKET,
    id
});

export const ActionAddQuantityProductBasket = (id) => ({
    type: CONSTANTS.ADD_QUANTITY_PRODUCT,
    id
});

export const ActionReducerProductBasket = (id) => ({
    type: CONSTANTS.SUB_QUANTITY_PRODUCT,
    id
});

export const ActionCreateOrder = (order) => ({
    type: CONSTANTS.CREATE_ORDER,
    order
});

export const ActionClearBasket = () => ({
    type: CONSTANTS.CLEAR_BASKET,
})

export const ActionDisableStore = (store) => ({
    type: CONSTANTS.DISABLE_STORE,
    store
})

export const ActionUpdateProduct = (data) => ({
    type: CONSTANTS.UPDATE_PRODUCT,
    data
})

export const ActionDeleteProduct = (id , store_id) => ({
    type: CONSTANTS.DELETE_PRODUCT,
    id, store_id
})

export const ActionAddProduct = (data) => ({
    type: CONSTANTS.ADD_PRODUCT,
    data
})

export const ActionUpdateStore = (store) => ({
    type: CONSTANTS.UPDATE_STORE,
    store
})



