<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { URL_RAPAT } from './url'
import axios from './axios_intercept'
import { useToast } from 'primevue/usetoast';

// const listRapat = ref(null);
const dataRapat=ref({
    data:null,
    links:null,
    meta:null
})

const toast = useToast();
const initDataRapat=()=>{
    loading.value=true
    axios({
    url:URL_RAPAT,
        method:'get'
    })
    .then((response)=>{
        dataRapat.value=response.data
    })
    .catch((error)=>{
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal Mengambil Data Rapat', life: 3000 });
    })
    .finally(()=>{
        loading.value=false
        // if (props.renewData) {
        emit('successRenewData',dataRapat.value)
        // }
    })
}
const loading=ref(true)

const props=defineProps({
    renewData:Boolean
})

const emit=defineEmits([
    'editModal',
    'successRenewData'
])

const editModal=(data)=>{
    emit('editModal',data)
}

onBeforeMount(() => {
    initDataRapat()
});

watch(props,(v)=>{
    if (v.renewData) {
        initDataRapat()
    }
})


const formatDate = (value) => {
    try{
        if (value) {
            if(value=='null'){
                return 'Belum ada tanggal'
            }
            var tanggal=JSON.parse(value)
            var date = new Date(tanggal[0]);
            var day = String(date.getUTCDate()).padStart(2, '0');
            var month = String(date.getUTCMonth() + 1).padStart(2, '0');
            var year = String(date.getUTCFullYear()).slice(-2); // Get last two digits
            var hours = String(date.getUTCHours()).padStart(2, '0');
            var minutes = String(date.getUTCMinutes()).padStart(2, '0');
            var seconds = String(date.getUTCSeconds()).padStart(2, '0');

            const tanggalMulai = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;


            date = new Date(tanggal[1]);
            day = String(date.getUTCDate()).padStart(2, '0');
            month = String(date.getUTCMonth() + 1).padStart(2, '0');
            year = String(date.getUTCFullYear()).slice(-2); // Get last two digits
            hours = String(date.getUTCHours()).padStart(2, '0');
            minutes = String(date.getUTCMinutes()).padStart(2, '0');
            seconds = String(date.getUTCSeconds()).padStart(2, '0');

            const tanggalSelesai = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

            return `${tanggalMulai} s.d. ${tanggalSelesai}`   
            
        }
        else{
            return 'Belum ada tanggal'
        }
    }
    catch(error){
        console.log(error)
        return 'Format Tanggal Salah'
    }
};


</script>


<template>
    <div class="col-12">
            <div class="card overflow-auto">
                <h5>Daftar Rapat</h5>
                <DataTable
                    :value="dataRapat?.data"
                    :paginator="true"
                    :rows="10"
                    :rowHover="true"
                    :loading="loading"
                    showGridlines
                >
                    <template #empty> <p v-if="!loading">Belum ada data rapat.</p> </template>
                    <!-- <template #loading> Sedang load data rapat... </template> -->
                    <template #loading>
                        <div class="flex flex-column align-items-center">
                            <ProgressSpinner />
                            <span>Sedang load data rapat...</span> 
                        </div>
                    </template>
                <!-- <template #slotProps> -->
                    <Column field="nama" header="Nama" style="min-width: 24rem">
                        <template #body="{ data }">
                            {{ data.nama }}
                        </template>
                    </Column>
                    <Column field="kategori" header="Kategori" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.kategori }}
                        </template>
                    </Column>

                    <Column field="urgensi" header="Urgensi" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.urgensi }}
                        </template>
                    </Column>

                    <Column field="metode" header="Metode" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.metode }}
                        </template>
                    </Column>

                    <Column field="pimpinan" header="Pimpinan" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.pimpinan }}
                        </template>
                    </Column>

                    <Column header="Tanggal" dataType="date" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatDate(data.tanggal) }}
                        </template>
                    </Column>
                    <Column
                        header="Aksi"
                        dataType="boolean"
                        bodyClass="text-center"
                        style="min-width: 8rem"
                        headerClass="column-text-center"
                    >
                        <template #body="{ data }">
                            <Button severity="warning" @click="editModal(data)" rounded class="mr-1" icon="pi pi-wrench"></Button>
                            <Button severity="danger" rounded icon="pi pi-trash"></Button>
                        </template>
                    </Column>
                <!-- </template> -->
                    
                    
                    
                </DataTable>
            </div>
        </div>
</template>