export async function addColumnsToStore(
    dbName: string,
    objectStoreName: string,
    newColumnsName: string[],
    options: IDBIndexParameters = {}
): Promise<IDBDatabase> {
    let db: IDBDatabase;
    let currentVersion: number;

    // Step 1: Get the current version
    const dbRequest = indexedDB.open(dbName);

    await new Promise<void>((resolve, reject) => {
        dbRequest.onsuccess = function (event: Event) {
            db = (event.target as IDBOpenDBRequest).result;
            currentVersion = db.version;
            // Step 2: Close all connections
            db.close();
            resolve();
        };

        dbRequest.onerror = function (event: Event) {
            reject(new Error("Couldn't open database"));
        };
    });

    // Step 3: Open with incremented version
    const newVersion = currentVersion! + 1;
    const upgradeRequest = indexedDB.open(dbName, newVersion);

    return new Promise((resolve: (db: IDBDatabase) => void, reject) => {
        upgradeRequest.onupgradeneeded = function (event: IDBVersionChangeEvent) {
            db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(objectStoreName, 'readwrite');
            const objectStore = transaction.objectStore(objectStoreName);
            // Step 4: Add new index
            for (const columnName of newColumnsName) {
                objectStore.createIndex(columnName, columnName, options);
            }
        };

        upgradeRequest.onsuccess = function (event: Event) {
            db = (event.target as IDBOpenDBRequest).result;
            resolve(db);
        };

        upgradeRequest.onerror = function (event: Event) {
            reject(new Error("Couldn't upgrade database"));
        };
    });
}

// Usage
// addColumnToStore('yourDatabaseName', 'yourObjectStoreName', 'newColumn', { unique: false })
//   .then(() => {
//     console.log('Column added');
//   })
//   .catch((err) => {
//     console.error('Error:', err);
//   });
