import CONSTANTS from '../CONSTANTS';

const initStateStores = {
    stores:[],
}

export const ReducerStores = ( state = null , action) => {
    switch (action.type) {
        case CONSTANTS.SET_STORES_BY_TYPE:
            console.log('action',action)
            return { ...state, stores: action.stores };
        case CONSTANTS.LOGOUT:
            return { ...state, stores: null}; 
        default:
            return state;
    }
}

export const ReducerStore = ( state = null , action) => {
    switch (action.type) {
        case CONSTANTS.SET_STORE:
            return { ...state, store: action.store };
        case CONSTANTS.LOGOUT:
            return { ...state, store: null}; 
        default:
            return state;
    }
}

export const ReducerCategoriesApp = ( state = null , action) => {
    switch (action.type) {
        case CONSTANTS.SET_CATEGORIES:
            return action.categories;
        case CONSTANTS.LOGOUT:
            return { ...state, store: null}; 
        default:
            return state;
    }
}

export const ReducerCategories = ( state = null , action) => {
    switch (action.type) {
        case CONSTANTS.SET_CATEGORIES_BY_STORE:
            return action.categories;
        case CONSTANTS.LOGOUT:
            return state; 
        default:
            return state;
    }
}

const initStateProducts = {
    products:[],
    productsDetails:[]
}

export const ReducerProducts = ( state = initStateProducts , action) => {
    switch (action.type) {
        case CONSTANTS.SET_PRODUCTS_BY_CATEGORY:
            if(state.products === null){
                return { ...state,  products: action.products };
            } else {
                return { ...state,  products: [...state.products, ...action.products] };
            }
        case CONSTANTS.UPDATE_PRODUCTS_BY_CATEGORY:
            var productsNow = state.products;
            for (let i = 0; i < productsNow.length; i++) {
                console.log('productsNow[i]._ref._documentPath._parts[1]',productsNow[i]._ref._documentPath._parts[1])
                console.log('action.product',action.product)
                if(productsNow[i]._ref._documentPath._parts[1] === action.product.id){
                    productsNow[i]._data = action.product;
                }
            }
            return { ...state,  products: productsNow };
        case CONSTANTS.DELETE_PRODUCT_BY_CATEGORY : 
            var productsNow = state.products;
            let newProducts = productsNow.filter(item=>item.id !== action.id);
            return { ...state,  products: newProducts };

        case CONSTANTS.ADD_PRODUCT_BY_CATEGORY : 
            var productsNow = state.products; 
            productsNow.push(action.product)
            return { ...state,  products: productsNow }

        // case CONSTANTS.SET_PRODUCTS_BY_CATEGORY:
        //     var productsNow = state.products;
        //     return { ...state,  products: productsNow };

        case CONSTANTS.SET_PRODUCTS_DETAILS:
            return { ...state,  productsDetails: [...state.productsDetails, ...action.products] };
        case CONSTANTS.LOGOUT:
            return { ...state, products: null}; 
        default:
            return state;
    }
}

export const ReducerUploadImage = (state=null, action) => {
    switch (action.type) {
        case CONSTANTS.UPLOAD_IMAGE:
            return action.image;
        case CONSTANTS.CLEAN_IMAGE_LOGOCLUB:
            return null
        default:
            return state;
    }
}