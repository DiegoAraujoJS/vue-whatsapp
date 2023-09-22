import type { Contact } from "@/types/entity"
import { resolverIDB } from "./resolver"

// SELECT //
const queryContacts = (db: IDBDatabase, where?: (c: Contact) => boolean) => new Promise((resolve: (e: Contact[]) => void, reject) => {
    const transaction = db.transaction("contacts", "readwrite")
    const store = transaction.objectStore("contacts")

    if (where) {
        const request = store.openCursor();
        const results: any[] = [];
        request.onsuccess = function(event) {
            const cursor = (event.target as any).result;
            if (cursor) {
                if (where(cursor.value)) {
                    results.push(cursor.value);
                }
                cursor.continue();
            } else {
                resolve(results)
            }
        };

    } else {
        store.getAll().onsuccess = ({target}) => {
            resolve((target as IDBRequest).result)
        }
    }


    transaction.onerror = (error) => {
        reject(error)
    }
})

export const IDBTransactionGetContacts = (where?: (c: Contact) => boolean) => new Promise(resolverIDB).then(db => queryContacts(db, where))

// INSERT //
const insertContact = (db: IDBDatabase, contact: Omit<Contact, "id">) => new Promise((resolve: (e: Event) => void, reject) => {
    const transaction = db.transaction("contacts", "readwrite")
    const store = transaction.objectStore("contacts")

    store.add(contact)

    transaction.oncomplete = event => {
        resolve(event)
    }

    transaction.onerror = error => {
        reject(error)
    }
})

export const IDBTransactionCreateContact = (contact: Omit<Contact, "id">) => new Promise(resolverIDB).then((db) => insertContact(db, contact))

// DELETE //
const deleteContacts = (db: IDBDatabase)  => new Promise((resolve: any, reject) => {
    const transaction = db.transaction("contacts", "readwrite")
    const store = transaction.objectStore("contacts")

    const request = store.clear()

    request.onsuccess = () => resolve(true)
    request.onerror = (error) => reject(error.target)
})

export const IDBTransactionDeleteContacts = () => new Promise(resolverIDB).then(deleteContacts)
