import type { Contact } from "@/types/row"
import type { Ref } from "vue"

export const resolverIDB = (resolve: (value: IDBDatabase) => void, reject: (value: Event) => void) => {
    const DBOpenRequest = indexedDB.open('Whatsapp')

    DBOpenRequest.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("contacts")) {
            db.createObjectStore("contacts", { keyPath: 'id', autoIncrement: true });
        }
    }

    DBOpenRequest.onsuccess = event => {
        resolve((event.target as IDBOpenDBRequest).result)
    }
    DBOpenRequest.onerror = error => {
        reject(error)
    }
}

export async function fillWhatsappDatabaseAndAlterIfNecessary(
    keys: string[],
    items: Contact[],
    progressState?: Ref<string>
): Promise<void> {
    const dbName = 'Whatsapp';
    const objectStoreName = 'contacts';

    // Stage 1: Check for missing indexes and alter the database if needed
    const alterDatabase = (db: IDBDatabase, missingIndexes: string[]): Promise<void> => {
        return new Promise((resolve, reject) => {
            const newVersion = db.version + 1;
            db.close();
            const alterRequest = indexedDB.open(dbName, newVersion);

            alterRequest.onupgradeneeded = event => {
                const db = (event.target as IDBOpenDBRequest).result;
                const objectStore = (event.currentTarget as any).transaction.objectStore(objectStoreName);

                for (const key of missingIndexes) {
                    objectStore.createIndex(key, key, { unique: false });
                }
            };

            alterRequest.onsuccess = () => resolve();
            alterRequest.onerror = event => reject(event);
        });
    };

    // Stage 2: Fill the database with items
    const fillDatabase = (db: IDBDatabase): Promise<void> => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([objectStoreName], 'readwrite');
            const objectStore = transaction.objectStore(objectStoreName);

            let count = 0
            for (const item of items) {
                objectStore.add(item);
                count++
                progressState ? progressState.value = `${count} contactos importados` : null
            }

            transaction.oncomplete = () => {
                db.close();
                resolve();
            };
            transaction.onerror = event => reject(event);
        });
    };

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = async event => {
            const db = (event.target as IDBOpenDBRequest).result;
            const tx = db.transaction(objectStoreName, 'readonly');
            const objectStore = tx.objectStore(objectStoreName);
            const existingIndexes = Array.from(objectStore.indexNames);
            const missingIndexes = keys.filter(key => !existingIndexes.includes(key));

            if (missingIndexes.length > 0) {
                try {
                    if (progressState) progressState.value = "Updating database schema"
                    await alterDatabase(db, missingIndexes);
                    const newRequest = indexedDB.open(dbName);
                    newRequest.onsuccess = async newEvent => {
                        const newDb = (newEvent.target as IDBOpenDBRequest).result;
                        await fillDatabase(newDb);
                        resolve();
                    };
                    newRequest.onerror = newEvent => reject(newEvent);
                } catch (error) {
                    reject(error);
                }
            } else {
                await fillDatabase(db);
                resolve();
            }
        };

        request.onerror = event => reject(event);
    });
}
