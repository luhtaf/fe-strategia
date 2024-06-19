<script setup>
import { ref, onBeforeMount } from 'vue';
import axios from '../axios_intercept'
import { URL_GET_ALL_KARYAWAN, URL_ARAHAN, URL_ARAHAN_BY_ID } from '../url'
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';


const loading=ref({
    loadKaryawan:false,
    loadArahan:false
})
onBeforeMount(()=>{
    initDataKaryawan()
    initDataArahan()
})

const props=defineProps({
    currentData:Object
})

const listArahan=ref([])
const initDataArahan=()=>{
    loading.value.loadArahan=true
    const {id}=props.currentData
    axios({
            url: URL_ARAHAN(id),
            method: 'get',
        })
        .then((response) => {
            if(response.data.data) listArahan.value = response.data.data
            initPelaksana()
        })
        .catch((error) => {
            console.log(error)
            toast.add({ severity: 'error', summary: 'Gagal', detail: `Gagal inisialisasi data arahan, harap periksa console atau reload halaman`, life: 3000 });
        })
        .finally(()=>{
            loading.value.loadArahan=false
        })
}

const listKaryawan=ref()
const initDataKaryawan=async ()=>{
    loading.value.loadKaryawan=true
    await axios({
            url: URL_GET_ALL_KARYAWAN,
            method: 'get',
        })
        .then((response) => {
            
            listKaryawan.value = response.data
            
        })
        .catch((error) => {
            console.log(error)
            toast.add({ severity: 'error', summary: 'Gagal', detail: `Gagal inisialisasi data karyawan, harap periksa console atau reload halaman`, life: 3000 });
        })
        .finally(()=>{
            loading.value.loadKaryawan=false
        })
}

const matchDropDown = (array,nilai) => {
    return array.value.filter(item => item.nama == nilai).map(item => item)[0];
};
const initPelaksana=()=>{
    listArahan.value.forEach(arahan => {
        arahan.pelaksana=matchDropDown(listKaryawan,arahan.pelaksana)
        arahan.terupdate=false
    });
}



const tambahArahan=()=>{
    listArahan.value.push({
        arahan:null,
        deadline:null,
        pelaksana:null,
        status:null,
        penyelesaian:null,
        data_dukung:null,
        keterangan:null,
        terupdate:false
    })
}

const simpanAllArahan = async () => {
    loading.value.loadArahan=true
    const simpanPromises = listArahan.value.map(async arahan => {
        return simpanArahan(arahan); // Wrap each simpanArahan call in a Promise    
        
    });

    await Promise.all(simpanPromises); // Wait for all Promises to resolve
    initDataArahan(); // Now call initDataArahan safely
};

const simpanArahan=async (arahan)=>{
    if (arahan.terupdate) {
        if (typeof(arahan.pelaksana)==='object') arahan.pelaksana=arahan.pelaksana.nama
        const idRapat = props.currentData.id;
        const {id}=arahan
        var url = id?
            URL_ARAHAN_BY_ID(idRapat,id):
            URL_ARAHAN(idRapat)

        if (id) arahan._method='PATCH'
        await axios({
            url,
            method:'post',
            data:arahan
        })
        .then((data)=>{
            toast.add({ severity: 'success', summary: 'Berhasil', detail: `Berhasil Update data arahan ${arahan.arahan}`, life: 3000 });
        })
        .catch(err=>{
            console.log(err)
            toast.add({ severity: 'error', summary: 'Gagal', detail: `Gagal Menambahkan arahan ${arahan.arahan} ke Undangan`, life: 3000 });
        })
    }
}

const arahanTerupdate=arahan=>{
    arahan.terupdate=true
}

const toast = useToast();
const popup=ref(null)
const popup2=ref(null)
const confirmPopup = useConfirm();
const hapusArahan=(arahan,index)=>{
    if (arahan.id) {
        loading.value.loadArahan=true
        const idRapat = props.currentData.id;
        const {id}=arahan
        var url = id?
            URL_ARAHAN_BY_ID(idRapat,id):
            URL_ARAHAN(idRapat)
        axios({
            url,
            method:'delete'
        })
        .then((response)=>{
            toast.add({ severity: 'success', summary: 'Berhasil', detail: `${response.data.message} : ${arahan.arahan}`, life: 3000 });
            initDataArahan()
        })
        .catch((error)=>{
            console.log(error)
            toast.add({ severity: 'error', summary: 'Gagal', detail: `gagal hapus arahan ${arahan.arahan}, cek console untuk detail`, life: 3000 });
        })
    }
    else{
        listArahan.value.splice(index,1)
    }
}
const confirmHapusArahan = (event,arahan,index) => {
    confirmPopup.require({
        target: event.target,
        message: 'Apakah anda yakin akan menghapus arahan ini?',
        icon: 'pi pi-trash',
        accept: () => {
            hapusArahan(arahan,index)
        },
        reject: () => {
            
        }
    });
};
const confirmKosongkanArahan = (event) => {
    confirmPopup.require({
        target: event.target,
        message: 'Apakah anda yakin akan menghapus semua arahan?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            kosongkanArahan()
        },
        reject: () => {
            
        }
    });
};
const kosongkanArahan=()=>{
    loading.value.loadUndangan=true
    const rapatId=props.currentData.id
    const url=URL_ARAHAN_BY_ID(rapatId,'all')
    axios({
        url,
        method:'delete'
    })
    .then((response)=>{
        toast.add({ severity: 'success', summary: 'Berhasil', detail: `${response.data.message}`, life: 3000 });
    })
    .catch(error=>{
        console.log(error)
        toast.add({ severity: 'error', summary: 'Gagal', detail: `gagal mengosongkan arahan`, life: 3000 });
    })
    .finally(()=>{
        initDataArahan()
    })
    
}
</script>
<template>
    <div v-if="!loading.loadArahan" class="col-12 overflow-auto">

        <div class="grid">
            <div class="col-5 hidden lg:block">
                <h5>Arahan/Instruksi</h5>
            </div>

            <div class="col-4 hidden lg:block">
                <h5>Pelaksana</h5>
            </div>

            <div class="col-3 hidden lg:block">
                <h5>Batas Waktu</h5>
            </div>
        </div>
        <div class="grid p-fluid mt-12 lg:mt-0 card" v-for="(arahan,index) in listArahan">
            
            <div class="col-12">
                <h5>Arahan {{index+1}}</h5>
            </div>
            <div class="col-12 lg:col-5">
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <InputText @change="arahanTerupdate(arahan)" v-model="arahan.arahan" type="text" placeholder="Arahan" />
                        </IconField>
                    </div>
                </div>
            </div>

            <div class="col-12 lg:col-4">
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <Dropdown @change="arahanTerupdate(arahan)" :disabled="loading.loadKaryawan" v-model="arahan.pelaksana" :options="listKaryawan" filter optionLabel="nama" placeholder="Pelaksana" />
                        </IconField>
                    </div>
                </div>
            </div>

            <div class="col-12 lg:col-3">
                <div class="grid formgrid p-fluid">
                    <div class="col-12 lg:col-10">
                        <IconField>
                            <Calendar @change="arahanTerupdate(arahan)" v-model="arahan.deadline" placeholder="Batas Waktu" :manualInput="false" showTime hourFormat="24" />
                        </IconField>
                    </div>
                    <div class="hidden lg:block col-2">
                        <Button ref="popup2" @click="confirmHapusArahan($event,arahan,index)" icon="pi pi-times" severity="danger"  text outlined rounded aria-label="Cancel" />
                    </div>
                    <div class="col-6 block lg:hidden mt-4">
                        <Button @click="hapusArahan($event,arahan,index)" label="Hapus" severity="danger"/>
                    </div>
                </div>
            </div>
            
        </div>
        <div v-if="listArahan?.length==0" class="card grid p-fluid mt-12 lg:mt-0">
            <div class="col-12">
                <InputText disabled placeholder="Belum ada Arahan"></InputText>
            </div>
            
        </div>
        <div class="grid">
            <div class="col-12">
                <Button severity="info" @click="tambahArahan" class="mr-2 mt-2">Tambah Arahan</Button>
                <Button ref="popup" severity="danger" @click="confirmKosongkanArahan($event)" class="mr-2 mt-2">Hapus Semua Arahan</Button>
                <ConfirmPopup></ConfirmPopup>
                <Button class="mt-2" @click="simpanAllArahan()">Simpan Arahan</Button>
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
        <h4>Sedang memuat data arahan pimpinan...</h4>
    </div>

</template>