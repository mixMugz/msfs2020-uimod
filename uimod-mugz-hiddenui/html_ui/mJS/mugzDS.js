Include.addScript("/JS/dataStorage.js");

class mugzDataStore {
    static get(key, defaultVal) {
        const val = GetStoredData(`mugz_${key}`);
        if (!val) {
            return defaultVal;
        }
        return val;
    }

    static set(key, val) {
        SetStoredData(`mugz_${key}`, val);
    }
}
