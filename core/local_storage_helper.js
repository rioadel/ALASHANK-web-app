// Helper for local storage operations

export const LocalStorageHelper = {
    // Save data to local storage
    setItem: (key, value) => {
      try {
        const stringValue = JSON.stringify(value);
        localStorage.setItem(key, stringValue);
      } catch (error) {
        console.error(`Error setting item to localStorage: ${error}`);
      }
    },
  
    // Retrieve data from local storage
    getItem: (key) => {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error(`Error getting item from localStorage: ${error}`);
        return null;
      }
    },
  
    // Remove an item from local storage
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing item from localStorage: ${error}`);
      }
    },
  
    // Clear all items from local storage
    clear: () => {
      try {
        localStorage.clear();
      } catch (error) {
        console.error(`Error clearing localStorage: ${error}`);
      }
    },
  
    // Check if a key exists in local storage
    hasKey: (key) => {
      return localStorage.getItem(key) !== null;
    },
  
    // Get all keys from local storage
    getAllKeys: () => {
      try {
        return Object.keys(localStorage);
      } catch (error) {
        console.error(`Error getting all keys from localStorage: ${error}`);
        return [];
      }
    }
  };
  
  export default LocalStorageHelper;
  