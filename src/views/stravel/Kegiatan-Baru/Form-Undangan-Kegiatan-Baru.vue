<script setup>
import { ref, onBeforeMount } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import axios from '../axios_intercept'
import { URL_GET_ALL_KARYAWAN, URL_UNDANGAN, URL_UNDANGAN_BY_ID } from '../url'
import { useClipboard } from '@vueuse/core';
import { useToast } from 'primevue/usetoast';
import {undangan} from './undangan_template'
const toast = useToast();
const props=defineProps({
    currentData:Object
})

const karyawanValue = ref({
    daring:null,
    luring:null
});
const loading=ref({
    loadUndangan:false,
    loadKaryawan:false
})
const listKaryawan=ref(null)
const listUndangan=ref([])

const removeUndangan=async (data,all=false)=>{
    loading.value.loadUndangan=true
    const id=data.id
    const rapatId=props.currentData.id
    const url=URL_UNDANGAN_BY_ID(rapatId,id)
    await axios({
        url,
        method:'delete'
    })
    .then((response)=>{
        toast.add({ severity: 'success', summary: 'Berhasil', detail: `${response.data.message} : ${data.nama}`, life: 3000 });
    })
    .catch(error=>{
        console.error(error)
        toast.add({ severity: 'error', summary: 'Gagal', detail: `gagal hapus ${data.nama} sebagai undangan`, life: 3000 });
    })
    .finally(()=>{
        initDataUndangan()
    })
}

const initDataKaryawanFromDB=async ()=>{
    loading.value.loadKaryawan=true
    axios({
            url: URL_GET_ALL_KARYAWAN,
            method: 'get',
        })
        .then((response) => {
            listKaryawan.value = response.data
        })
        .catch((error) => {
            console.error(error)
        })
        .finally(()=>{
            loading.value.loadKaryawan=false
        })
}


const initDataUndangan=async ()=>{
    loading.value.loadUndangan=true
    axios({
        url: URL_UNDANGAN(props.currentData.id),
        method: 'get',
    })
    .then((response) => {
        listUndangan.value = response.data.data
        source.value=undangan(
            props.currentData,
            listUndangan.value
        )
        initDataKaryawanExisting()
    })
    .catch((error) => {
        console.error(error)
    })
    .finally(()=>{
        loading.value.loadUndangan=false
    })
}

const initDataKaryawanExisting=async ()=>{
    listKaryawan.value = listKaryawan.value.filter(karyawan => !listUndangan.value.some(undangan => undangan.nama === karyawan.nama));
}

onBeforeMount(async ()=>{
    await initDataUndangan()
    await initDataKaryawanFromDB()
    
})

const tambahKaryawanKeUndangan = async (jenis) => {
    loading.loadUndangan = true;

    let karyawanList;
    if (jenis === 'Daring') {
        karyawanList = karyawanValue.value.daring;
    } 
    else if (jenis === 'Luring') {
        karyawanList = karyawanValue.value.luring;
    }

    if (jenis === 'Daring') {
        karyawanValue.value.daring = null;
    }
    else if (jenis === 'Luring') {
        karyawanValue.value.luring = null;
    }
    
    if (karyawanList && karyawanList.length > 0) {
    await Promise.all(karyawanList.map(async karyawan => {
        await simpanUndangan(karyawan, jenis);
        listUndangan.value.push(karyawan);
    }));
    }

    initDataUndangan();
    await initDataKaryawanExisting();
    
};


const popup=ref(null)
const confirmPopup = useConfirm();
const confirmKosongkanUndangan = (event) => {
    confirmPopup.require({
        target: event.target,
        message: 'Apakah anda yakin akan mengosongkan undangan?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            kosongkanUndangan()
        },
        reject: () => {
            
        }
    });
};
const kosongkanUndangan=()=>{
    loading.value.loadUndangan=true
    const rapatId=props.currentData.id
    const url=URL_UNDANGAN_BY_ID(rapatId,'all')
    axios({
        url,
        method:'delete'
    })
    .then((response)=>{
        toast.add({ severity: 'success', summary: 'Berhasil', detail: `${response.data.message}`, life: 3000 });
    })
    .catch(error=>{
        console.error(error)
        toast.add({ severity: 'error', summary: 'Gagal', detail: `gagal mengosongkan daftar undangan`, life: 3000 });
    })
    .finally(()=>{
        initDataUndangan()
        initDataKaryawanFromDB()
    })
    
}

const simpanUndangan=async (undangan,jenis)=>{
    var payload={
        nama:undangan.nama,
        jenis
    }
    const dataId = props.currentData.id;
    var url = URL_UNDANGAN(dataId);

    await axios({
        url,
        method:'post',
        data:payload
    })
    .then((data)=>{
        toast.add({ severity: 'success', summary: 'Berhasil', detail: `Berhasil Menambahkan ${undangan.nama} ke Undangan`, life: 3000 });
    })
    .catch(error=>{
        console.error(error)
        toast.add({ severity: 'error', summary: 'Gagal', detail: `Gagal Menambahkan ${undangan.nama} ke Undangan`, life: 3000 });
    })
}



const source = ref();
const { copy, copied } = useClipboard({ source });

</script>
<template>
    <div class="mt-3 col-12 lg:col-6">
        <div class="grid p-fluid">
            <div class="card mx-1 col-12">
                <h5>Tambah Undangan Luring</h5>
                <div class="grid formgrid p-fluid">
                    <div class="col-12">
                        <IconField v-if="!loading.loadKaryawan">
                            <MultiSelect v-model="karyawanValue.luring" :options="listKaryawan" filter optionLabel="nama" placeholder="Pilih Karyawan"/>
                        </IconField>
                        <IconField v-else>
                            <InputIcon class="pi pi-spin pi-spinner" />
                            <MultiSelect disabled placeholder="Loading Data Karyawan"/>
                        </IconField>
                    </div>
                    <div class="col-12 item-right mt-2">
                        <IconField>
                            <Button 
                                icon="pi pi-plus"
                                size="large" 
                                rounded 
                                :disabled="loading.loadUndangan||(!karyawanValue.luring)"
                                class="mr-2 mb-2"
                                label="Tambah Undangan"
                                @click="tambahKaryawanKeUndangan('Luring')"
                                />
                        </IconField>
                    </div>
                    
                </div>
            </div>
        </div>
        
    </div>

    <div class="mt-3 col-12 lg:col-6">
        <div class="grid p-fluid">
            <div class="card mx-1 col-12">
                <h5>Tambah Undangan Daring</h5>
                <div class="grid formgrid p-fluid">
                    <div class="col-12">
                        <IconField v-if="!loading.loadKaryawan">
                            <MultiSelect v-model="karyawanValue.daring" :options="listKaryawan" filter optionLabel="nama" placeholder="Pilih Karyawan"/>
                        </IconField>
                        <IconField v-else>
                            <InputIcon class="pi pi-spin pi-spinner" />
                            <MultiSelect disabled placeholder="Loading Data Karyawan"/>
                        </IconField>
                    </div>
                    <div class="col-12 item-right mt-2">
                        <IconField>
                            <Button 
                                icon="pi pi-plus"
                                size="large" 
                                rounded 
                                :disabled="loading.loadUndangan||(!karyawanValue.daring)"
                                class="mr-2 mb-2"
                                label="Tambah Undangan"
                                @click="tambahKaryawanKeUndangan('Daring')"
                                />
                        </IconField>
                    </div>
                    
                </div>
            </div>
        </div>
        
    </div>

    <div v-if="listUndangan.length>0||loading.loadUndangan" class="mt-3 col-12">
        <div class="grid">
            <div class="card col-12">
                <h5>List Undangan</h5>
                <div class="grid formgrid">
                    <div class="col-12" v-if="!loading.loadUndangan">
                        <IconField>
                            <Chip v-for="(item) in listUndangan" label="Action" class="mr-2 mb-2">
                                {{ item.nama }} - {{ item.jenis }} &nbsp;
                                <Button 
                                icon="pi pi-times" 
                                severity="danger" 
                                rounded outlined 
                                aria-label="Cancel"
                                @click="removeUndangan(item)"
                                />
                            </Chip>
                        </IconField>
                    
                    
                    </div>
                    <div class="col-12" v-else>
                        <IconField>
                            <Skeleton v-for="(item) in [1,2,2,1]" width="25rem" class="mb-2"></Skeleton>
                        </IconField>
                    
                    
                    </div>


                    
                </div>
            </div>
        </div>
        
    </div>
    <div class="col-12 mt-6">
        <ConfirmPopup></ConfirmPopup>
        <Button ref="popup" @click="confirmKosongkanUndangan($event)" :disabled="listUndangan.length==0" label="Kosongkan Undangan" size="large" severity="danger" outlined class="mb-2 mr-2" />
        <Button size="large" class="mb-2 mr-2" @click="copy(source)" label="Salin Format Undangan"/>
    </div>


</template>