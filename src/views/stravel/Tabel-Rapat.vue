<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { URL_RAPAT, URL_TEMA } from './url'
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
    var url=`${URL_RAPAT}?size=${size}&page=${page}`
    if (search.value.isSearch) {
        url=search.value.nama?`${url}&rapat=${search.value.nama}`:url
        url=search.value.kategori?`${url}&kategori=${search.value.kategori}`:url
        url=search.value.urgensi?`${url}&urgensi=${search.value.urgensi}`:url
        url=search.value.global?`${url}&search=${search.value.global}`:url
        url=search.value.metode?`${url}&metode=${search.value.metode}`:url
        url=search.value.pimpinan?`${url}&pimpinan=${search.value.pimpinan}`:url
        url=search.value.tema?`${url}&tema=${search.value.tema}`:url
    }
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
        emit('successRenewData',dataRapat.value)
    })
}
const loading=ref(true)

const props=defineProps({
    renewData:Boolean
})

const emit=defineEmits([
    'editModal',
    'successRenewData',
    'viewModal'
])

const editModal=(data,jenisEmit='editModal')=>{
    emit(jenisEmit,data)
}

onBeforeMount(() => {
    initDataRapat()
    initTema()
});

watch(props,(v)=>{
    if (v.renewData) {
        initDataRapat()
    }
})


const formatDate = (tanggal_mulai,tanggal_selesai) => {
    try{
        if (tanggal_mulai && tanggal_selesai) {

            
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                timeZone: 'Asia/Jakarta',
                hour12: false,
            };

            var date = new Date(tanggal_mulai);
            var formattedDate = date.toLocaleDateString('id-ID', options);

            const tanggalMulai= formattedDate.replace(/(\d+:\d+)/, '$1 WIB');

            var date = new Date(tanggal_selesai);
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
const opNama=ref()
const toggleNama=(event)=>{
    opNama.value.toggle(event);
}

const opKategori=ref()
const toggleKategori=(event)=>{
    opKategori.value.toggle(event);
}

const opUrgensi=ref()
const toggleUrgensi=(event)=>{
    opUrgensi.value.toggle(event);
}

const opMetode=ref()
const toggleMetode=(event)=>{
    opMetode.value.toggle(event);
}

const opPimpinan=ref()
const togglePimpinan=(event)=>{
    opPimpinan.value.toggle(event);
}

const opTema=ref()
const toggleTema=(event)=>{
    opTema.value.toggle(event);
}

const updatePage = (event) => {
    initDataRapat(event.rows,event.page+1)
};

const search=ref({
    nama:null,
    isSearch:false,
    global:null,
    urgensi:null,
    metode:null,
    pimpinan:null,
    tema:null
})
const doSearch=()=>{
    search.value.isSearch=true
    initDataRapat(dataRapat.per_page)
}

const clearFilter=()=>{
    search.value={
        nama:null,
        isSearch:false,
        global:null,
        urgensi:null,
        metode:null,
        pimpinan:null,
        tema:null
    }
    initDataRapat(dataRapat.per_page)
}
const dropdownKategori = ref([
    'Internal',
    'External'
]);
const dropdownUrgensi = ref([
    'Biasa',
    'Urgen'
]);
const dropdownMetode = ref([
    'Daring',
    'Luring'
]);
const dropdownPimpinan = ref([
    'Kepala',
    'Wakil Kepala'
]);

const dropdownTema= ref({})

const initTema=()=>{
    const url=URL_TEMA
    axios({
        url,
        method:'get'
    })
    .then((response)=>{
        dropdownTema.value=response.data.tema
        console.log(dropdownTema)
        console.log(dropdownPimpinan)
        console.log(response)
    })
    .catch((error)=>{
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal Mengambil Tema Rapat', life: 3000 });
    })
}


</script>


<template>
    <div class="col-12">
            <div class="card overflow-auto">
                <h5>Daftar Kegiatan</h5>
                <DataTable
                    :value="dataRapat?.data"
                    :rows="dataRapat?.per_page"
                    :rowHover="true"
                    :loading="loading"
                    showGridlines
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter" />
                                <IconField iconPosition="left">
                                    <InputGroup>
                                        <Button label="Search" @click="doSearch" />
                                        <InputText v-model="search.global" placeholder="Keyword" />
                                    </InputGroup>
                                </IconField>
                            
                        </div>
                    </template>
                    <template #empty> <p v-if="!loading">Belum ada data rapat.</p> </template>
                    <template #loading>
                        <div class="flex flex-column align-items-center">
                            <ProgressSpinner />
                            <span>Sedang load data rapat...</span> 
                        </div>
                    </template>
                    <Column field="nama" style="min-width: 24rem">
                        <template #header>
                            Nama &nbsp;
                            <i 
                                class="pi pi-filter" 
                                @click="toggleNama"
                                style="font-size: 1rem; cursor: pointer;">
                            </i>
                            <OverlayPanel ref="opNama" appendTo="body" id="overlay_panel">
                                <InputText v-model="search.nama" placeholder="Nama" />
                                <Button class="ml-1" @click="doSearch">Search</Button>
                            </OverlayPanel>
                        </template>
                        <template #body="{ data }">
                            {{ data.nama }}
                        </template>
                    </Column>
                    <Column field="kategori" style="min-width: 12rem">
                        <template #header>
                            Kategori &nbsp;
                            <i 
                                class="pi pi-filter" 
                                @click="toggleKategori"
                                style="font-size: 1rem; cursor: pointer;">
                            </i>
                            <OverlayPanel ref="opKategori" appendTo="body" id="overlay_panel">
                                <Dropdown @change="doSearch" :options="dropdownKategori" v-model="search.kategori" placeholder="Kategori" />
                            </OverlayPanel>
                        </template>
                        <template #body="{ data }">
                            {{ data.kategori }}
                        </template>
                    </Column>
                    <Column field="tema" style="min-width: 12rem">
                        <template #header>
                            Tema &nbsp;
                            <i 
                                class="pi pi-filter" 
                                @click="toggleTema"
                                style="font-size: 1rem; cursor: pointer;">
                            </i>
                            <OverlayPanel ref="opTema" appendTo="body" id="overlay_panel">
                                <Dropdown @change="doSearch" :options="dropdownTema" v-model="search.tema" placeholder="Tema" />
                            </OverlayPanel>
                        </template>
                        <template #body="{ data }">
                            {{ data.tema }}
                        </template>
                    </Column>

                    <Column field="urgensi" style="min-width: 12rem">
                        <template #header>
                            Urgensi &nbsp;
                            <i 
                                class="pi pi-filter" 
                                @click="toggleUrgensi"
                                style="font-size: 1rem; cursor: pointer;">
                            </i>
                            <OverlayPanel ref="opUrgensi" appendTo="body" id="overlay_panel">
                                <Dropdown @change="doSearch" :options="dropdownUrgensi" v-model="search.urgensi" placeholder="Urgensi" />
                            </OverlayPanel>
                        </template>
                        <template #body="{ data }">
                            {{ data.urgensi }}
                        </template>
                    </Column>

                    <Column field="metode" style="min-width: 12rem">
                        <template #header>
                            Metode &nbsp;
                            <i 
                                class="pi pi-filter" 
                                @click="toggleMetode"
                                style="font-size: 1rem; cursor: pointer;">
                            </i>
                            <OverlayPanel ref="opMetode" appendTo="body" id="overlay_panel">
                                <Dropdown @change="doSearch" :options="dropdownMetode" v-model="search.metode" placeholder="Metode" />
                            </OverlayPanel>
                        </template>
                        <template #body="{ data }">
                            {{ data.metode }}
                        </template>
                    </Column>

                    <Column field="pimpinan" style="min-width: 12rem">
                        <template #header>
                            Pimpinan &nbsp;
                            <i 
                                class="pi pi-filter" 
                                @click="togglePimpinan"
                                style="font-size: 1rem; cursor: pointer;">
                            </i>
                            <OverlayPanel ref="opPimpinan" appendTo="body" id="overlay_panel">
                                <Dropdown @change="doSearch" :options="dropdownPimpinan" v-model="search.pimpinan" placeholder="Pimpinan" />
                            </OverlayPanel>
                        </template>
                        <template #body="{ data }">
                            {{ data.pimpinan }}
                        </template>
                    </Column>

                    <Column header="Tanggal" dataType="date" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatDate(data.tanggal_mulai,data.tanggal_selesai) }}
                        </template>
                    </Column>
                    <Column
                        header="Aksi"
                        dataType="boolean"
                        bodyClass="text-center"
                        style="min-width: 12rem"
                        headerClass="column-text-center"
                    >
                        <template #body="{ data }">
                            <Button severity="success" @click="editModal(data,'viewModal')" rounded class="mr-1" icon="pi pi-eye"></Button>
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
                    :currentPageReportTemplate="`Menampilkan ${paginator + 1} - ${Math.min(paginator + dataRapat.meta.per_page, dataRapat.meta.total)} dari ${dataRapat.meta.total} data`"
                    template="PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport"
                    @page="updatePage($event)"
                />
            </div>
        </div>
</template>