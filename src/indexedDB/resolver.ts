const onUpgradeNeeded = (event: IDBVersionChangeEvent) => {
    const db = (event.target as IDBOpenDBRequest).result

    if (!db.objectStoreNames.contains("contacts")) {
        const objectStore = db.createObjectStore("contacts", { keyPath: "id", autoIncrement: true })
        objectStore.createIndex("name", "name", {unique: false})
        objectStore.createIndex("number", "number", {unique: true})
        objectStore.createIndex("profession", "profession", {unique: false})
        objectStore.createIndex("gender", "gender", {unique: true})
    }
}

export const resolverIDB = (resolve: (value: IDBDatabase) => void, reject: (value: Event) => void) => {
    const DBOpenRequest = indexedDB.open('Whatsapp', 6)
    DBOpenRequest.onsuccess = event => {
        resolve((event.target as IDBOpenDBRequest).result)
    }
    DBOpenRequest.onerror = error => {
        reject(error)
    }
    DBOpenRequest.onupgradeneeded = onUpgradeNeeded
}
