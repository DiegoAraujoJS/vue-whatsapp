<template>
    <div class="load-contacts">
        <div>
            <span>Cargar Contactos</span>
            <button class="info-button" @click="renderInstructions({
                title: 'Cargar los contactos desde un Excel',
                instructions: uploadInstructions
            })">i</button>
        </div>
        <input class="excel-input" type="file" @change="handleFileUpload" accept=".xlsx,.xls" />
        <button class="button-delete" @click="deleteAndReload">Eliminar Contactos</button>
    </div>
</template>

<script lang="ts" setup>
import { IDBTransactionDeleteContacts } from '@/indexedDB/queries';
import { fillWhatsappDatabaseAndAlterIfNecessary } from '@/indexedDB/resolver';
import type { Contact } from '@/types/row';
import { renderInstructions } from '@/utils/instructions';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
const readExcel = (file: File): Promise<Contact[]> => {
    return new Promise((resolve: (results: any) => void, reject) => {
        const reader = new FileReader();
        reader.onload = function(event: ProgressEvent<FileReader>) {
            const data = event.target?.result;
            if (typeof data === 'string') {
                const workbook = XLSX.read(data, {
                    type: 'binary'
                });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const array = XLSX.utils.sheet_to_json(worksheet);
                resolve(array);
            }
        };
        reader.onerror = function(event) {
            reject(new Error('File could not be read: ' + event.target?.error));
        };
        reader.readAsBinaryString(file);
    });
};

const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
        const file = files[0];
        try {
            const array = await readExcel(file);
            const keys = Object.keys(array[0]).filter(k => k !== "__rowNum__")
            console.log(keys)
            if (!keys.includes("nombre") || !keys.includes("numero")) throw new Error("Faltan la propiedad 'nombre' o la propiedad 'numero'")
            if (array.length) await fillWhatsappDatabaseAndAlterIfNecessary(keys, array)
            location.reload()
            console.log(array);
        } catch (error) {
            console.error(error);
        }
    }
};

const deleteAndReload = () => Swal.fire({
    title: '¿Seguro que querés eliminar toda la base de datos de clientes?',
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: `Cancelar`,
})
    .then((result) => {
        if (result.isConfirmed) {
            IDBTransactionDeleteContacts()
                .then(() => Swal.fire('Se eliminaron todos los clientes', '', 'success'))
                .then(() => location.reload())
                .catch(() => Swal.fire('Hubo un error al eliminar la base de datos', '', 'error'))

        } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
        }
    })

const uploadInstructions = `El primer paso es cargar contactos. Tenés que cargar un excel en formato .xlsx o .xls con tus contactos organizados de la siguiente manera: <table>
                    <thead>
                        <tr>
                            <th class="property">nombre</th>
                            <th class="property">numero</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Susana</td>
                            <td>541175354103</td>
                        </tr>
                        <tr>
                            <td>Jerónimo</td>
                            <td>541183423721</td>
                        </tr>
                    </tbody>
                </table>
<br/>
Debe haber al menos las columnas de nombre y numero para que se puedan cargar los contactos. Además puede haber tantas columnas adicionales como se desee.
`

</script>

<style scoped>

.load-contacts {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    grid-row-start: 2;
}

.load-contacts button {
    grid-column: 2;
    grid-row: 2;
    width: fit-content;
}

.load-contacts input {
    grid-column: 1;
    grid-row: 2
}



</style>
