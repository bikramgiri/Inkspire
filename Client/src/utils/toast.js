let addToast = null;

export const toast = (message, type = 'info') => {
  if (addToast) {
    addToast(message, type);
  }
};

export const setToastAdder = (adder) => {
  addToast = adder;
};

export const clearToastAdder = () => {
  addToast = null;
};