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
                <div class="contact">
                    <div class="contact_field"> </div>
                    <div class="contact_field"></div>
                    <div class="contact_field"></div>
                </div>
                <div class="contact" v-for="contact in contacts">
                    <div class="contact_field"></div>
                    <div class="contact_field"></div>
                    <div class="contact_field"></div>
                </div>
            </div>
        </div>
        <div class="right">
            <div>
                <ExcelReader/>
                <button @click="deleteAndReload">Delete Contacts</button>
                <div v-if="progressState" class="progress">{{progressState}}</div>
            </div>
            <div>
                <textarea name="message" id="message" cols="30" rows="10"></textarea>
                <button class="send">Enviar</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import type { Contact } from "@/types/row";
import {IDBTransactionGetContacts, IDBTransactionDeleteContacts} from "@/indexedDB/queries"
import ExcelReader from "@/components/ExcelReader.vue";
const contacts = ref<Contact[]>([])

onMounted(() => IDBTransactionGetContacts().then(response => {
    contacts.value = response
}))
const progressState = ref("")

const deleteAndReload = () => IDBTransactionDeleteContacts().then(() => location.reload())

const filters = reactive<Partial<Omit<Contact, "id">>>({})
const search = ref('')

watch([filters, search], (state) => {
    console.log(state)
    IDBTransactionGetContacts((c: Contact) => c.nombre.toLowerCase().includes(state[1].toLowerCase()))
        .then(result => contacts.value = result)
})

</script>

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
    background: whitesmoke;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.contact_container {
    overflow: scroll;
    max-height: 100%;
    display: grid;
    grid-template-columns: 1pt 1pt 1pt;
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

.send {
    display: block;
}
.columns {
    display: flex;
}

.contact_field {
    border: 1px solid red;
    height: 20px;
    width: 80px;
}

</style>
