<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import type { Contact } from "@/types/row";
import {IDBTransactionGetContacts, IDBTransactionDeleteContacts} from "@/indexedDB/queries"
import {fillWhatsappDatabaseAndAlterIfNecessary} from "@/indexedDB/resolver"
import { parseExcel } from "@/utils/parseExcel";

const contacts = ref<Contact[]>([])

onMounted(() => IDBTransactionGetContacts().then(response => {
    contacts.value = response
}))
const progressState = ref(0)

const createAndReload = async () => {
    const {results, schema} = await parseExcel()
    await fillWhatsappDatabaseAndAlterIfNecessary(Object.keys(schema), results, progressState)
    location.reload()
}
const deleteAndReload = () => IDBTransactionDeleteContacts().then(() => location.reload())

const filters = reactive<Partial<Omit<Contact, "id">>>({})
const search = ref('')

watch([filters, search], (state) => {
    console.log(state)
    IDBTransactionGetContacts((c: Contact) => c.name.toLowerCase().includes(state[1].toLowerCase()))
        .then(result => contacts.value = result)
})

</script>

<template>
    <div class="home">
        <div class="left">
            <div class="search">
                <div>
                    <span>Buscar</span>
                    <input type="text" v-model="search"/>
                </div>
            </div>
            <div class="contact_container">
                <div class="contact" v-for="contact in contacts">{{contact.name}} {{contact.number}}</div>
            </div>
        </div>
        <div class="right">
            <div>
                <button @click="createAndReload">Create Contacts</button>
                <button @click="deleteAndReload">Delete Contacts</button>
                <div v-if="progressState" class="progress">{{progressState}} contactos importados</div>
            </div>
            <div></div>
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
    display: flex;
    flex-direction: column;
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
    display: flex;
    justify-content: space-between;
}

.progress {
    font-size: 1.25rem;
}

</style>
