<script setup lang="ts">
import { onMounted, ref } from "vue";
import {resolverIDB} from "../indexedDB/resolver"

const IDBTransactionCreateContact = () => {
    return new Promise(resolverIDB)
        .then(db => new Promise((resolve: (e: Event) => void, reject) => {
            const transaction = db.transaction("contacts", "readwrite")
            const store = transaction.objectStore("contacts")

            store.add({
                name: "Juan",
                number: "541128391034",
            }, undefined)

            transaction.oncomplete = event => {
                resolve(event)
            }

            transaction.onerror = error => {
                reject(error)
            }
        }))
    .then(console.log)
}

type Contact = {
    name: string
    number: string
    id: number
}

const IDBTransactionGetContacts = () => {
    return new Promise(resolverIDB)
        .then(db => new Promise((resolve: (e: Contact[]) => void, reject) => {
            const transaction = db.transaction("contacts", "readwrite")
            const store = transaction.objectStore("contacts")

            store.getAll().onsuccess = ({target}) => {
                resolve((target as IDBRequest).result)
            }

            transaction.onerror = error => {
                reject(error)
            }
        }))
}


const contacts = ref<Contact[]>([])

onMounted(() => IDBTransactionGetContacts().then(response => contacts.value = response))

</script>

<template>
    <div class="home">
        <div class="left">
            <div v-for="contact in contacts">{{contact.name}} {{contact.number}}</div>
        </div>
        <div class="right">
        </div>
    </div>
</template>

<style scoped>
.home {
    background: lightblue;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: space-between;
}

.left {
    background: lightgrey;
    border-right: 1px solid black;
    width: 100%;
    height: 100%;
}

.right {
    background: lightgreen;
    width: 100%;
    height: 100%;
}

</style>
