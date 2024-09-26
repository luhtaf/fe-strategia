<script setup>
import { ref, onBeforeMount } from 'vue';
import ModalKegiatanBaru from './Kegiatan-Baru/Modal-Kegiatan-Baru.vue'
import ModalViewKegiatan from './View-Kegiatan/Modal-View-Kegiatan.vue'
import TabelRapat from './Tabel-Rapat.vue';
import { useRouter } from 'vue-router';
import { URL_COUNT_ARAHAN_BELUM_TL } from './url';
import axios from './axios_intercept'
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const initJumlahArahanBelumTL=()=>{
    axios({
        url:URL_COUNT_ARAHAN_BELUM_TL,
        method:'get'
    })
    .then((response)=>{
        jumlahArahanBelumTL.value=response.data.jumlah
    })
    .catch((error)=>{
        console.log(error)
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal Mengambil Jumlah Arahan, harap periksa console', life: 3000 });
    })
}
const jumlahArahanBelumTL=ref(0)
const router = useRouter()

const modalViewKegiatan=ref(false)
const createRapatModal = ref(false)
const currentData=ref(null)
const currentDataView=ref(null)
const tekan=(data)=>{
    createRapatModal.value=true
    currentData.value=data?data:null
}
const viewRapat=(data)=>{
    modalViewKegiatan.value=true
    currentDataView.value=data?data:null
}
const renewData=ref(false)
const dataRapat=ref({
    data:null,
    links:null,
    meta:null
})

onBeforeMount(()=>{
    initJumlahArahanBelumTL()
})

</script>

<template>
    <h3 class="mx-2">Pilih Layanan</h3>
    <div class="grid mb-0 mx-2">
        <div class="col-12 lg:col-6 xl:col-4">
            <div class="card mb-0" style="cursor: pointer;" @click="tekan()">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3" >Kegiatan Saya</span>
                        <div class="text-900 font-medium text-xl">{{dataRapat.meta?.total || 0}} Kegiatan</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">Buat dan Kelola </span>
                <span class="text-500">Rapat</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-4">
            <div class="card mb-0" style="cursor: pointer;" @click="router.push('/performa-tim')">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Performa Tim</span>
                        <div class="text-900 font-medium text-xl">Performa </div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user-edit text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">Dashboard </span>
                <span class="text-500">Rekapitulasi Performa dan Kinerja Personil</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-4">
            <div class="card mb-0" style="cursor: pointer;" @click="router.push('/arahan-pimpinan')">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Arahan dan Instruksi</span>
                        <div class="text-900 font-medium text-xl">{{ jumlahArahanBelumTL }} Arahan Belum ditindaklanjuti</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-file text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium"></span>
                <span class="text-500">Arahan dan Instruksi</span>
            </div>
        </div>

        
    </div>
    
    <TabelRapat
        :renewData="renewData"
        @viewModal="(currentData)=>viewRapat(currentData)"
        @editModal="(currentData)=>tekan(currentData)"
        @successRenewData="(data)=>{
            renewData=false
            dataRapat=data
            }"
    />
    <ModalKegiatanBaru
        :propsVisible="createRapatModal"
        :currentData='currentData'
        @closeModal="(closeModal)=>{
            createRapatModal=closeModal
            renewData=true
            initJumlahArahanBelumTL()
            }"
    />

    <ModalViewKegiatan
        :propsVisible="modalViewKegiatan"
        :currentData='currentDataView'
        @closeModal="(closeModal)=>{
            modalViewKegiatan=closeModal
            renewData=true
            }"
    />

</template>
