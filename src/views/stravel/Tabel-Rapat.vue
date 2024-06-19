<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { URL_RAPAT } from './url'
import axios from './axios_intercept'
import { useToast } from 'primevue/usetoast';

const paginator=ref(null)
const dataRapat=ref({
    data:null,
    links:null,
    meta:null
})

const toast = useToast();
const initDataRapat=(size=10,page=1)=>{
    loading.value=true
    const url=`${URL_RAPAT}?size=${size}&page=${page}`
    axios({
        url,
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
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                timeZone: 'Asia/Jakarta',
                hour12: false,
            };

            var formattedDate = date.toLocaleDateString('id-ID', options);

            const tanggalMulai= formattedDate.replace(/(\d+:\d+)/, '$1 WIB');

            var formattedDate = date.toLocaleDateString('id-ID', options);

            const tanggalSelesai= formattedDate.replace(/(\d+:\d+)/, '$1 WIB');

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

const updatePage = (event) => {
    initDataRapat(event.rows,event.page+1)
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
                </DataTable>
                <Paginator
                    v-if="!loading"
                    class="my-2"
                    :rows="dataRapat?.meta?.per_page"
                    :totalRecords="dataRapat?.meta?.total"
                    :rowsPerPageOptions="[5, 10, 25, 50, 100]"
                    v-model:first="paginator"
                    :currentPageReportTemplate="`Menampilkan ${ paginator+1 } - ${ paginator+dataRapat?.meta?.per_page } dari ${dataRapat.meta.total} data`"
                    template="PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport"
                    @page="updatePage($event)"
                />
            </div>
        </div>
</template>