<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Contact } from "@/types/entity"
import {IDBTransactionGetContacts, IDBTransactionDeleteContacts} from "@/indexedDB/queries"
import {bootstrapContacts} from "@/scripts/bootstrapContacts"

const contacts = ref<Contact[]>([])

onMounted(() => IDBTransactionGetContacts().then(response => contacts.value = response))
const progressState = ref(0)

const createAndReload = () => bootstrapContacts(100, progressState).then(() => location.reload())
const deleteAndReload = () => IDBTransactionDeleteContacts().then(() => location.reload())

</script>

<template>
    <div class="home">
        <div class="left">
                <div class="search">
                <input type="text">
                </div>
                <div class="contact_container">
                    <div class="contact" v-for="contact in contacts">{{contact.name}} {{contact.number}}</div>
                </div>
        </div>
        <div class="right">
            <button @click="createAndReload">Create Contacts</button>
            <button @click="deleteAndReload">Delete contacts</button>
            <div v-if="progressState" class="progress">{{progressState}} contactos importados</div>
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
    display: flex;
    flex-direction: column;
}

.right {
    background: lightgreen;
    width: 100%;
    height: 100%;
}

.contact_container {
    border: 1px solid red;
    overflow: scroll;
    max-height: 100%;
}

.contact {
    border: 1px solid blue;
    border-radius: 5px;
    margin: 2px;
    padding: 5px;
}

.search {
    background: grey;
}

.progress {
    font-size: 1.25rem;
}

</style>
