<script setup>
import { ref, onBeforeMount } from 'vue';
import axios from '../axios_intercept'
import {URL_GET_ALL_KARYAWAN, URL_UNDANGAN, URL_UNDANGAN_BY_ID} from '../url'
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const props=defineProps({
    currentData:Object
})


const loading=ref({
    simpanUndangan:false,
    loadUndangan:false,
    loadKaryawan:false
})

const listKaryawan=ref()
const initDataKaryawan=()=>{
    axios({
            url: URL_GET_ALL_KARYAWAN,
            method: 'get',
        })
        .then((response) => {
            listKaryawan.value = response.data
        })
        .catch((error) => {
            console.error(error)
            toast.add({ severity: 'error', summary: 'Gagal', detail: `Gagal inisialisasi data karyawan, harap periksa console atau reload halaman`, life: 3000 });
        })
}

const matchDropDown = (array,nilai) => {
    return array.value.filter(item => item.name == nilai).map(item => item)[0];
};

const matchDropDownPerwakilan = (nilai) => {
    return listKaryawan.value.filter(item => item.nama == nilai).map(item => item)[0];
};
const initKeteranganUndangan=()=>{
    listUndangan.value.forEach(undangan => {
        undangan.keterangan=matchDropDown(dropdownKategoriValues,undangan.keterangan)
        undangan.perwakilan=matchDropDownPerwakilan(undangan.perwakilan)
    });
}

const initDataUndangan=()=>{
    loading.value.loadUndangan=true
    axios({
            url: URL_UNDANGAN(props.currentData.id),
            method: 'get',
        })
        .then((response) => {
            listUndangan.value = response.data.data
            initKeteranganUndangan(listUndangan)
        })
        .catch((error) => {
            console.error(error)
            toast.add({ severity: 'error', summary: 'Gagal', detail: `Gagal load data undangan, harap reload halaman`, life: 3000 });
        })
        .finally(()=>{
            loading.value.loadUndangan=false
        })
}
const listUndangan=ref([])
onBeforeMount(()=>{
    initDataUndangan()
    initDataKaryawan()    
    
})

const dropdownKategoriValues = ref([
        { name: 'Hadir - Luring', },
        { name: 'Hadir - Daring', },
        { name: 'Diwakilkan'},
        { name: 'Tidak Hadir'}
    ]);

const simpanUndangan=async (undangan,diwakilkan=false,all=false)=>{
    if (diwakilkan||(undangan.keterangan.name!='Diwakilkan')) {
        var payload={
            ...undangan
        }
        if(typeof(payload.keterangan)==='object') payload.keterangan=payload.keterangan.name
        if(diwakilkan) payload.perwakilan=payload.perwakilan.nama
        payload._method='PATCH'
        const dataId = props.currentData.id;
        const {id}=payload
        var url = URL_UNDANGAN_BY_ID(dataId,id)

        await axios({
            url,
            method:'post',
            data:payload
        })
        .then((data)=>{
            if (!all) toast.add({ severity: 'success', summary: 'Berhasil', detail: `Berhasil Update Kehadiran ${undangan.nama}`, life: 3000 });
        })
        .catch(error=>{
            console.error(error)
            toast.add({ severity: 'error', summary: 'Gagal', detail: `Gagal Update Kehadiran ${undangan.nama}`, life: 3000 });
        })
    }
}

const simpanAllUndangan=async ()=>{
    listUndangan.value.forEach(async undangan => {
        var diwakilkan=undangan.keterangan.name=='Diwakilkan'?true:false
        await simpanUndangan(undangan,diwakilkan,true)
    });
    toast.add({ severity: 'success', summary: 'Berhasil', detail: `Sukses update semua data kehadiran`, life: 3000 });
    initDataUndangan()
}
</script>
<template>
    <div v-if="!loading.loadUndangan" class="mt-3 col-12">
        
        <div v-if="listUndangan.length>0" class="grid p-fluid">
            <div v-for="peserta in listUndangan" class="card col-12 lg:col-6">
                <h5>{{peserta.nama}}</h5>
                <h6>Undangan {{ peserta.jenis }}</h6>
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <Dropdown @change="simpanUndangan(peserta)" v-model="peserta.keterangan" :options="dropdownKategoriValues" optionLabel="name" placeholder="Konfirmasi Kehadiran" />
                        </IconField>
                    </div>
                    <div v-if="peserta.keterangan?.name=='Diwakilkan'" class="mx-2 mt-2 col-11">
                        <IconField>
                            <Dropdown @change="simpanUndangan(peserta,true)" v-model="peserta.perwakilan" :options="listKaryawan" optionLabel="nama" filter placeholder="Diwakilkan Oleh" />
                        </IconField>
                    </div>
                </div>
            </div>
            
        </div>

        <div v-else class="grid p-fluid">
            <div class="col-12 lg:col-6">
                <h2>Belum ada Undangan</h2>
                <div class="grid formgrid">
                    <div class="col-12">
                        
                    </div>
                </div>
            </div>
            
        </div>
    </div>
    <div v-else class="mt-3 col-12 card">
        <ProgressSpinner
            style="width: 50px; height: 50px"
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration=".5s"
            aria-label="Custom ProgressSpinner"
        />
        <h4>Sedang memuat data kehadiran...</h4>
    </div>

    

    <div v-if="listUndangan.length>0" class="col-12 mt-6">
        <Button @click="simpanAllUndangan()" label="Simpan Kehadiran Peserta" size="large" class="mb-2 mr-2" />
    </div>



</template>