export const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = '*';
    }
    if (!values.category_id) {
      errors.category_id = '*';
    }
    if (!values.brand) {
      errors.brand = '*';
    }
    if (!values.description) {
      errors.description = '*';
    }
    if (!values.money || values.money == "Seleccione") {
      errors.money = '*';
    }
    if (!values.price) {
      errors.price = '*';
    }
    if (!values.quantity) {
      errors.quantity = '*';
    }
    if (!values.unity || values.unity == 'Seleccione') {
      errors.unity = '*';
    }
          
    return errors;
};