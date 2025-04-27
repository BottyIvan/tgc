// This function saves an item to localStorage with a specified key and value
const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (error) {
        console.error("Error saving to localStorage", error);
    }
}

// This function retrieves an item from localStorage by its key
const getFromLocalStorage = (key) => {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }
    catch (error) {
        console.error("Error getting from localStorage", error);
        return null;
    }
}

// This function removes an item from localStorage by its key
const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    }
    catch (error) {
        console.error("Error removing from localStorage", error);
    }
}

export {
    saveToLocalStorage,
    getFromLocalStorage,
    removeFromLocalStorage
};