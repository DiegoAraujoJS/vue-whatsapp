<template>
    <div class="home">
        <div class="left">
            <div class="search">
                <div v-for="(_, filter) in filters" class="search-input">
                    <span>{{filter}}</span>
                    <input type="text" v-model="filters[filter]" :id="`input_${filter}`"/>
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
                <button class="send" @click="handleSendMessage">Enviar</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import type { Contact } from "@/types/row";
import {IDBTransactionGetContacts, IDBTransactionDeleteContacts} from "@/indexedDB/queries"
import ExcelReader from "@/components/ExcelReader.vue";
import {massSendWhatsAppMessage} from "@/utils/whatsApp"
import Swal from "sweetalert2";
const contacts = ref<Contact[]>([])

const properties = computed(() => {
    return Object.keys(contacts.value.reduce((acum, current) => {
        return {...acum, ...current}
    }, {})).filter(k => k !== "id")
})

onMounted(() => IDBTransactionGetContacts().then(response => {
    contacts.value = response
}))
const progressState = ref("")

const deleteAndReload = () => IDBTransactionDeleteContacts().then(() => location.reload())

const filters = reactive<Contact>({nombre: "", numero: 0})

const propertiesDefined = ref(false)
watch(properties, () => {
    if (propertiesDefined.value) return 
    propertiesDefined.value = true
    for (const prop of properties.value) {
        filters[prop] = ""
    }
})


function createPredicate(filters: Contact, keys: (keyof Contact)[]): (c: Contact) => boolean {
    return (c: Contact) => {
        for (const key of keys) {
            if (!c[key].toLowerCase().includes(filters[key])) {
                return false;
            }
        }
        return true;
    };
}

watch([filters], () => {
    const nonZeroFilters = Object.keys(filters).filter(k => filters[k]) as unknown as (keyof Contact)[]
    IDBTransactionGetContacts(createPredicate(filters, nonZeroFilters))
        .then(result => {
            contacts.value = result
        })
})

const message = ref("")


function generateTableHTML(properties: string[], contacts: Contact[]): string {
    let html = '<table>';

    // Generate tbody
    html += '<tbody>';
    for (const contact of contacts) {
        html += `<tr style="text-align:left">`;
        for (const property of ['nombre', 'numero']) {
            html += `<td>${contact[property]}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody>';

    html += '</table>';

    return html;
}

const handleSendMessage = (event: Event) => {
    return Swal.fire({
        icon: 'warning',
        html: generateTableHTML(properties.value, contacts.value),
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar'
    })
}

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
