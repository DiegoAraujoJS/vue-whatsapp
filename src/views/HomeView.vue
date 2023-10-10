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
            <div class="right-actions">
                <ExcelReader/>
                <div v-if="progressState" class="progress">{{progressState}}</div>
                <div class="message-input">
                    <textarea name="message" id="message" cols="30" rows="10" v-model="message"></textarea>
                    <button class="send" @click="handleSendMessage(contacts, message)">Enviar</button>
                </div>
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
const properties = ref<string[]>(['nombre', 'numero'])

onMounted(() => IDBTransactionGetContacts().then(response => {
    contacts.value = response

    const keys = Object.keys(response.reduce((acum, current) => {
        return {...acum, ...current}
    }, {})).filter(k => k !== "id")
    if (keys.length > 0) properties.value = keys

    properties.value.forEach(prop => filters[prop] = "")
}))

const progressState = ref("")

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
}

.left {
    background: #FDFDF9;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}


.contact {
    border-radius: 5px;
    margin: 2px;
    padding: 5px;
}

.search {
    background: #F5F5DC;
    display: flex;
    justify-content: space-between;
}

.search-input {
    display: flex;
    font-family: Georgia, 'Times New Roman', Times, serif;
    padding: 4px;
}

.search-input span {
    margin: 0 3px 0 0;
}
.search-input input {
    border-radius: 5px;
    max-width: 100px;
}

.progress {
    font-size: 1.25rem;
}

.send {
    position: absolute;
    top: 0;
    margin: 0 5px;
}
.columns {
    display: flex;
}

.property {
    text-align: left;
}

.right {
    position: relative;
    background: #F9FDFD;
    width: 75%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 4px 0 0 5px;
}

.message-input {
    position: relative;
    top: 10%;
    width: 100%;
}

.message-input textarea {
    width: 80%;
    font-family: 'Arial', sans-serif; /* Change 'Arial' to your preferred font */
    font-size: 1.1rem; /* Adjust size as needed */
    font-weight: normal; /* Change to bold, italic, etc., if needed */
}

</style>
