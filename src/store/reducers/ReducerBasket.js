import CONSTANTS from '../CONSTANTS';

const initState = {
    addedItems:[],
    quantityProduct:0,
    total: 0
}
export const ReducerBasket = ( state = initState , action) => {
    if(action.type === CONSTANTS.ADD_PRODUCT_BASKET){
        if(state.addedItems === null) {
            return { ...state,  addedItems: action.products, quantityProduct: state.quantityProduct + 1 }
        } else {
            const addedItem = action.product;
            const existed_item= state.addedItems.find(item=> action.product.id === item.id);
            if(existed_item) {
                addedItem.quantityProduct += 1 
                return {
                        ...state,
                        total: state.total + addedItem.price,
                        quantityProduct: state.quantityProduct + 1
                    }
            } else {
                addedItem.quantityProduct = 1;
                //calculating the total
                let newTotal = state.total + addedItem.price 
                
                return{
                    ...state,
                    addedItems: [...state.addedItems, addedItem],
                    total : newTotal,
                    quantityProduct: state.quantityProduct + 1
                }
                
            }
        }
    }
        
    if(action.type === CONSTANTS.REMOVE_PRODUCT_BASKET){
        const itemToRemove= state.addedItems.find(item=> action.id === item.id)
        let new_items = state.addedItems.filter(item=> action.id !== item.id)
        //calculating the total
        let newTotal = state.total - (itemToRemove.price * itemToRemove.quantityProduct )
        return {
            ...state,
            addedItems: new_items,
            total: newTotal,
            quantityProduct: state.quantityProduct - itemToRemove.quantityProduct
        }
    }
    if( action.type === CONSTANTS.ADD_QUANTITY_PRODUCT){
        const addedItem = state.addedItems.find(item=> item.id === action.id)
        addedItem.quantityProduct += 1 
        let newTotal = state.total + addedItem.price
        return {
            ...state,
            total: newTotal,
            quantityProduct: state.quantityProduct + 1
        }
    }
    if( action.type === CONSTANTS.SUB_QUANTITY_PRODUCT){
        const addedItem = state.addedItems.find(item=> item.id === action.id) 
        //if the qt == 0 then it should be removed
        if(addedItem.quantityProduct === 1){
            let new_items = state.addedItems.filter(item=>item.id !== action.id)
            let newTotal = state.total - addedItem.price
            return{
                ...state,
                addedItems: new_items,
                total: newTotal,
                quantityProduct: state.quantityProduct - 1
            }
        }
        else {
            addedItem.quantityProduct -= 1
            let newTotal = state.total - addedItem.price
            return{
                ...state,
                total: newTotal,
                quantityProduct: state.quantityProduct - 1
            }
        }
    }
    if( action.type === CONSTANTS.CLEAR_BASKET){
        console.log('llega alimpiar basket')
        return initState;
    }
    
    return state;
}