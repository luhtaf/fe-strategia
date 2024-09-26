<script setup>
import { ref, onBeforeMount } from 'vue';
import axios from '../axios_intercept'
import { URL_RAPAT, URL_RAPAT_BY_ID, URL_TEMA } from '../url';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
const loading=ref({
    loadSuggest:false
})

const currentData=ref({
    nama:null,
    tanggal:null,
    lokasi:null,
    metode:null,
    jenis:null,
    pemapar:null,
    tautan:null,
    tema:null,
    kategori:null,
    urgensi:null,
    penyelenggara:null,
    pimpinan:null,

})
const date=ref(null)
const props = defineProps({
    currentData:Object
})

const emit=defineEmits([
    'closeModal'
])

onBeforeMount(() => {
    if (props.currentData) {
        if(props.currentData.tanggal_mulai && props.currentData.tanggal_selesai) {
            const {tanggal_mulai,tanggal_selesai}=props.currentData
            date.value=[new Date(tanggal_mulai),new Date(tanggal_selesai)]
        }
    }
});

</script>
<template>
    <div class="">
        
        <div class="grid p-fluid">
        
        </div>
    </div>

    <div class="col-12 mt-2">
        <Button class="mb-2 mr-2" 
        @click="simpanRapat()"
        >
            Simpan Rapat
        </Button>
    </div>
</template>