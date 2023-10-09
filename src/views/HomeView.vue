<template>
    <div class="home">
        <div class="left">
            <div class="search">
                <div v-for="property in properties" class="search-input">
                    <span>{{property}}</span>
                    <input type="text" v-model="filters[property]" :id="`input_${property}`"/>
                </div>
            </div>

                <table>
                    <thead>
                        <tr>
                            <th class="property" v-for="property in properties" :key="property">{{ property }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="contact in contacts" :key="contact.id">
                            <td v-for="property in properties" :key="property">{{ contact[property] }}</td>
                        </tr>
                    </tbody>
                </table>
            
        </div>
        <div class="right">
            <div>
                <ExcelReader/>
                <button @click="deleteAndReload">Delete Contacts</button>
                <div v-if="progressState" class="progress">{{progressState}}</div>
            </div>
            <div>
                <textarea name="message" id="message" cols="30" rows="10" v-model="message"></textarea>
                <button class="send" @click="handleSendMessage(contacts, message)">Enviar</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import type { Contact } from "@/types/row";
import {IDBTransactionGetContacts, IDBTransactionDeleteContacts} from "@/indexedDB/queries"
import ExcelReader from "@/components/ExcelReader.vue";
import { createPredicate } from "@/utils/logic";
import { handleSendMessage } from "@/utils/handleSendMessage";

const contacts = ref<Contact[]>([])
const properties = ref<string[]>([])

onMounted(() => IDBTransactionGetContacts().then(response => {
    contacts.value = response

    properties.value = Object.keys(response.reduce((acum, current) => {
        return {...acum, ...current}
    }, {})).filter(k => k !== "id")

    properties.value.forEach(prop => filters[prop] = "")
}))

const progressState = ref("")

const deleteAndReload = () => IDBTransactionDeleteContacts().then(() => location.reload())

const filters = reactive<Contact>({nombre: "", numero: 0, id: 0})

watch([filters], () => {
    const nonZeroFilters = Object.keys(filters).filter(k => filters[k]) as unknown as (keyof Contact)[]
    IDBTransactionGetContacts(createPredicate(filters, nonZeroFilters))
        .then(result => {
            contacts.value = result
        })
})

const message = ref("")

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

.search-input {
    display: flex;
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

.property {
    text-align: left;
}
</style>
