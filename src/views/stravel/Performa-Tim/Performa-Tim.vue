<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import axios from '../axios_intercept'
import { URL_GET_ALL_KARYAWAN } from '../url'
import PerformaIndividu from './Performa-Individu.vue'
import PerformaAll from './Performa-All.vue';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const loading=ref({
    loadKaryawan:false
})

const nowTampil=ref('all')

const optionNowTampil = ref(['all','individu'   ]);

const jangkaWaktu = ref()

onBeforeMount(()=>{
    initDataKaryawan()
})

const listKaryawan=ref()
const initDataKaryawan=async ()=>{
    loading.value.loadKaryawan=true
    await axios({
            url: URL_GET_ALL_KARYAWAN,
            method: 'get',
        })
        .then((response) => {
            listKaryawan.value = response.data
            karyawanTampil.value=listKaryawan.value[0]
            // getDataKehadiran(listKaryawan.value[0]['nama'])
            // getDataArahan(listKaryawan.value[0]['nama'])
        })
        .catch((error) => {
            console.log(error)
            toast.add({ severity: 'error', summary: 'Gagal', detail: `Gagal inisialisasi data karyawan, harap periksa console atau reload halaman`, life: 3000 });
        })
        .finally(()=>{
            loading.value.loadKaryawan=false    
        })
}
const karyawanTampil = ref()
</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12">
            <div class="grid card card-w-title overflow-auto">
                <div class="col-12 card-title">
                    <div class="grid p-fluid">
                        <div class="col-12 lg:col-2">
                            <h3>Performa Tim</h3>
                        </div>
                        <div class="col-12 lg:col-10">
                            <SelectButton v-model="nowTampil" :options="optionNowTampil" aria-labelledby="basic" />
                        </div>
                    </div>
                </div>
                <div class="col-12 lg:col-6 card-body">
                    <div class="grid p-fluid">
                        <div class="col-12 lg:col-3">
                            <h4>Jangka Waktu</h4>
                        </div>
                        <div class="col-9">
                            <IconField>
                                <Calendar placeholder="Jangka Waktu" v-model="jangkaWaktu" selectionMode="range" :showTime="true" :showIcon="true" />
                            </IconField>
                        </div>
                    </div>
                </div>
                <div class="col-12 lg:col-6 card-body" v-if="nowTampil!='all'">
                    <div class="grid">
                        <div class="col-12 lg:col-3">
                            <h4>Pelaksana</h4>
                        </div>
                        <div class="col-9">
                            <IconField>
                                <Dropdown :options="listKaryawan" v-model="karyawanTampil" :disabled="loading.loadKaryawan" filter optionLabel="nama" placeholder="Pelaksana" />
                            </IconField>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <PerformaIndividu 
            v-if="nowTampil=='individu'" 
            :jangkaWaktu="jangkaWaktu"
            :karyawanTampil="karyawanTampil"
        />
        <PerformaAll 
            :jangkaWaktu="jangkaWaktu"
            v-else-if="nowTampil=='all'"
        />
    </div>
</template>
