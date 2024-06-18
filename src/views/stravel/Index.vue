<script setup>
import { ref } from 'vue';
import ModalKegiatanBaru from './Kegiatan-Baru/Modal-Kegiatan-Baru.vue'
import TabelRapat from './Tabel-Rapat.vue';

const createRapatModal = ref(false)
const currentData=ref(null)
const tekan=(data)=>{
    createRapatModal.value=true
    currentData.value=data?data:null
}
const renewData=ref(false)
const dataRapat=ref({
    data:null,
    links:null,
    meta:null
})


</script>

<template>
    <h3 class="mx-2">Pilih Layanan</h3>
    <div class="grid mb-0 mx-2">
        <div class="col-12 lg:col-6 xl:col-4" style="cursor: pointer;" @click="tekan()">
            <div class="card mb-0">
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
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Performa Tim</span>
                        <div class="text-900 font-medium text-xl">5 Tim Performa Rendah </div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user-edit text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">Dashboard </span>
                <span class="text-500">Rekapitulasi Performa dan Kinerja Tim</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-4">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Arahan dan Instruksi</span>
                        <div class="text-900 font-medium text-xl">1 Arahan Belum ditindaklanjuti</div>
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
            }"
    />
</template>
