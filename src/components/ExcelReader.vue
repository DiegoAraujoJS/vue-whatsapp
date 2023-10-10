<template>
    <div class="excel-container">
        <input class="excel-input" type="file" @change="handleFileUpload" accept=".xlsx,.xls" />
    </div>
</template>

<script lang="ts" setup>
import { fillWhatsappDatabaseAndAlterIfNecessary } from '@/indexedDB/resolver';
import type { Contact } from '@/types/row';
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

</script>

<style scoped>

.excel-container {
    margin-bottom: 5px;
}

.excel-input {

}
</style>
