<script setup>
import axios from '../axios_intercept'
import { ref, onBeforeMount } from 'vue';
import { URL_ARAHAN, URL_ARAHAN_BY_ID, URL_GET_ALL_UNIT_KERJA } from '../url'
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
const dataArahan=ref(null)
const loading=ref({
    loadArahan:false
})

const popup=ref(null)
const confirmPopup = useConfirm();
const confirmKosongkanArahan = (event,data) => {
    confirmPopup.require({
        target: event.target,
        message: 'Apakah anda yakin akan menghapus arahan?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            deleteData(data)
        },
        reject: () => {
            
        }
    });
};
const deleteData=(data)=>{
    data.isLoading=true
    const url= URL_ARAHAN_BY_ID(data.rapat_id,data.id)
    axios({
        url,
        method:'delete',
    })
    .then((response)=>{
        toast.add({ severity: 'success', summary: 'Berhasil', detail: `${response.data.message} :${data.arahan}`, life: 3000 });
    })
    .catch((error)=>{
        console.error(error)
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal Mengambil Data Arahan, harap periksa console', life: 3000 });
    })
    .finally(()=>{
        initDataArahan()
    })   
}

const props = defineProps({
    currentData:Object
})

onBeforeMount(async ()=>{
    await initDataUnitKerja()
    await initDataArahan()
    
})
const paginator=ref(null)
const initDataArahan=async (size=10,page=1)=>{
    loading.value.loadArahan=true
    const {id}=props.currentData
    var url=`${URL_ARAHAN(id)}?size=${size}&page=${page}`
    if (search.value.isSearch) {
        url=search.value.nama?`${url}&nama_rapat=${search.value.nama}`:url
        url=search.value.arahan?`${url}&arahan=${search.value.arahan}`:url
        url=search.value.pelaksana?`${url}&pelaksana=${search.value.pelaksana.nama}`:url
        url=search.value.deadline?`${url}&deadline=${search.value.deadline.toISOString().replace('.000', '.000') + 'Z'}`:url
        url=search.value.status?`${url}&status=${search.value.status}`:url
        url=search.value.penyelesaian?`${url}&penyelesaian=${search.value.penyelesaian}`:url
        url=search.value.data_dukung?`${url}&data_dukung=${search.value.data_dukung}`:url
        url=search.value.keterangan?`${url}&keterangan=${search.value.keterangan}`:url
        url=search.value.global?`${url}&search=${search.value.global}`:url
    }
    axios({
        url,
        method:'get'
    })
    .then((response)=>{
        dataArahan.value=response.data
        initPelaksana()
    })
    .catch((error)=>{
        console.error(error)
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal Mengambil Data Arahan, harap periksa console', life: 3000 });
    })
    .finally(()=>{
        loading.value.loadArahan=false
    })
}
const formatTimestampToWIB = (timestamp) => {
    if (!timestamp) { // Check if timestamp is null or undefined
        return "Belum ada Batas Waktu";
    }
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'Asia/Jakarta',
        hour12: false,
    };

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('id-ID', options);

    return formattedDate.replace(/(\d+:\d+)/, '$1 WIB');
};

const dropDownStatus=ref([
    // "Gagal",
    "Selesai",
    "Dalam Proses",
    // "Tidak ada Tindak Lanjut"
])
const dropDownPenyelesaian=ref([
    "Terlambat",
    "Tepat Waktu"
])
const editData=(data)=>{
    data.isEdit=true
}

const saveData=async (data)=>{
    data.isEdit=false
    
    if(data.terupdate)
    {
        data.isLoading=true
        data.pelaksana=data.pelaksana_pilih.nama
        data._method='PATCH'
        const url=URL_ARAHAN_BY_ID(data.rapat_id,data.id)
        axios({
            url,
            method:'post',
            data
        })
        .then((response)=>{
            delete data.terupdate
            toast.add({ severity: 'success', summary: 'Berhasil', detail: `${response.data.message} :${data.arahan}`, life: 3000 });
        })
        .catch((error)=>{
            console.error(error)
            toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal Mengambil Data Arahan, harap periksa console', life: 3000 });
        })
        .finally(()=>{
            data.isLoading=false
        })
    }
}

const listUnitKerja=ref()
const initDataUnitKerja=async ()=>{
    loading.value.loadKaryawan=true
    await axios({
            url: URL_GET_ALL_UNIT_KERJA,
            method: 'get',
        })
        .then((response) => {
            
            listUnitKerja.value = response.data
            
        })
        .catch((error) => {
            console.error(error)
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
    dataArahan.value.data.forEach(arahan => {
        arahan.pelaksana_pilih=matchDropDown(listUnitKerja,arahan.pelaksana)
        arahan.terupdate=false
    });
}
const arahanTerupdate=arahan=>{
    arahan.terupdate=true
}

const updatePage = (event) => {
    initDataArahan(event.rows,event.page+1)
};

const opNama=ref()
const toggleNama=(event)=>{
    opNama.value.toggle(event);
}

const opArahan=ref()
const toggleArahan=(event)=>{
    opArahan.value.toggle(event);
}

const opPelaksana=ref()
const togglePelaksana=(event)=>{
    opPelaksana.value.toggle(event);
}

const opDeadline=ref()
const toggleDeadline=(event)=>{
    opDeadline.value.toggle(event);
}

const opStatus=ref()
const toggleStatus=(event)=>{
    opStatus.value.toggle(event);
}

const opPenyelesaian=ref()
const togglePenyelesaian=(event)=>{
    opPenyelesaian.value.toggle(event);
}

const opDataDukung=ref()
const toggleDataDukung=(event)=>{
    opDataDukung.value.toggle(event);
}

const opKeterangan=ref()
const toggleKeterangan=(event)=>{
    opKeterangan.value.toggle(event);
}

const search=ref({
    isSearch:false,
    nama:null,
    global:null,
    arahan:null,
    pelaksana:null,
    status:null,
    deadline:null,
    penyelesaian:null,
    data_dukung:null,
    keterangan:null
})
const doSearch=()=>{
    search.value.isSearch=true
    initDataArahan(dataArahan.per_page)
}

const clearFilter=()=>{
    search.value={
        isSearch:false,
        nama:null,
        global:null,
        arahan:null,
        pelaksana:null,
        status:null,
        deadline:null,
        penyelesaian:null,
        data_dukung:null,
        keterangan:null
    }
    initDataArahan(dataArahan.per_page)
}
</script>
<template>
    <div class="col-12">
        <div class="card card-w-title overflow-auto">
            <div class="card-title mb-3">
                <h5>Daftar Arahan</h5>

            </div>
            <DataTable
                :value="dataArahan?.data"
                :rows="dataArahan?.per_page"
                :rowHover="true"
                :loading="loading.loadArahan"
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
                <Column field="nama" style="min-width: 12rem">
                    <template #header>
                        Nama Rapat &nbsp;
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
                        <template v-if="data.isLoading">
                            <Skeleton></Skeleton>
                        </template>
                        <template v-else>
                            {{ data.nama_rapat }}
                        </template>
                    </template>
                </Column>
                <Column field="arahan" style="min-width: 18rem">
                    <template #header>
                        Arahan &nbsp;
                        <i 
                            class="pi pi-filter" 
                            @click="toggleArahan"
                            style="font-size: 1rem; cursor: pointer;">
                        </i>
                        <OverlayPanel ref="opArahan" appendTo="body" id="overlay_panel">
                            <InputText v-model="search.arahan" placeholder="Arahan" />
                            <Button class="ml-1" @click="doSearch">Search</Button>
                        </OverlayPanel>
                    </template>
                    <template #body="{ data }">
                        <template v-if="data.isLoading">
                            <Skeleton></Skeleton>
                        </template>
                        <template v-else>
                            <template v-if="data.isEdit">
                                <InputText @change="arahanTerupdate(data)" v-model="data.arahan" placeholder="Arahan"/>
                            </template>
                            <template v-else>
                                {{ data.arahan }}
                            </template>
                        </template>
                    </template>
                </Column>

                <Column field="pelaksana" style="min-width: 18rem">
                    <template #header>
                        Pelaksana &nbsp;
                        <i 
                            class="pi pi-filter" 
                            @click="togglePelaksana"
                            style="font-size: 1rem; cursor: pointer;">
                        </i>
                        <OverlayPanel ref="opPelaksana" appendTo="body" id="overlay_panel">
                            <Dropdown @change="doSearch" :options="listUnitKerja" optionLabel="nama" v-model="search.pelaksana" filter placeholder="Pelaksana" />
                        </OverlayPanel>
                    </template>
                    <template #body="{ data }">
                        <template v-if="data.isLoading">
                            <Skeleton></Skeleton>
                        </template>
                        <template v-else>
                            <template v-if="data.isEdit">
                                <Dropdown @change="arahanTerupdate(data)" v-model="data.pelaksana_pilih" :options="listUnitKerja" filter optionLabel="nama" placeholder="Pelaksana" />
                            </template>
                            <template v-else>
                                {{ data.pelaksana }}
                            </template>
                        </template>
                    </template>
                </Column>

                <Column field="deadline" style="min-width: 12rem">
                    <template #header>
                        Batas Waktu &nbsp;
                        <i 
                            class="pi pi-filter" 
                            @click="toggleDeadline"
                            style="font-size: 1rem; cursor: pointer;">
                        </i>
                        <OverlayPanel ref="opDeadline" appendTo="body" id="overlay_panel">
                            <IconField iconPosition="left">
                                <InputGroup>
                                    <Button icon="pi pi-search" @click="doSearch" />
                                    <Calendar v-model="search.deadline" placeholder="Tanggal dan Waktu Rapat" :manualInput="true" showTime hourFormat="24" />
                                </InputGroup>
                            </IconField>
                        </OverlayPanel>
                    </template>
                    <template #body="{ data }">
                        <template v-if="data.isLoading">
                            <Skeleton></Skeleton>
                        </template>
                        <template v-else>
                            <template v-if="data.isEdit">
                                <Calendar @change="arahanTerupdate(data)" v-model="data.deadline" :showIcon="true" :manualInput="true" showTime hourFormat="24"></Calendar>
                            </template>
                            <template v-else>
                                {{ formatTimestampToWIB(data.deadline) }}
                            </template>
                        </template>

                    </template>
                </Column>

                <Column field="status" style="min-width: 12rem">
                    <template #header>
                        Status &nbsp;
                        <i 
                            class="pi pi-filter" 
                            @click="toggleStatus"
                            style="font-size: 1rem; cursor: pointer;">
                        </i>
                        <OverlayPanel ref="opStatus" appendTo="body" id="overlay_panel">
                            <Dropdown @change="doSearch" :options="dropDownStatus" v-model="search.status" placeholder="Status" />
                        </OverlayPanel>
                    </template>
                    <template #body="{ data }">
                        <template v-if="data.isLoading">
                            <Skeleton></Skeleton>
                        </template>
                        <template v-else>
                            <template v-if="data.isEdit">
                                <Dropdown @change="arahanTerupdate(data)" v-model="data.status" :options="dropDownStatus" placeholder="Status" />
                            </template>
                            <template v-else>
                                {{ data.status }}
                            </template>
                        </template>
                    </template>
                </Column>

                <Column field="penyelesaian" style="min-width: 11rem">
                    <template #header>
                        Penyelesaian &nbsp;
                        <i 
                            class="pi pi-filter" 
                            @click="togglePenyelesaian"
                            style="font-size: 1rem; cursor: pointer;">
                        </i>
                        <OverlayPanel ref="opPenyelesaian" appendTo="body" id="overlay_panel">
                            <Dropdown @change="doSearch" :options="dropDownPenyelesaian" v-model="search.penyelesaian" placeholder="Penyelesaian" />
                        </OverlayPanel>
                    </template>
                    <template #body="{ data }">
                        <template v-if="data.isLoading">
                            <Skeleton></Skeleton>
                        </template>
                        <template v-else>
                            <template v-if="data.isEdit">
                                <Dropdown @change="arahanTerupdate(data)" v-model="data.penyelesaian" :options="dropDownPenyelesaian" placeholder="Penyelesaian" />
                            </template>
                            <template v-else>
                                {{ data.penyelesaian }}
                            </template>
                        </template>
                    </template>
                </Column>

                <Column field="data_dukung" style="min-width: 10rem">
                    <template #header>
                        Data Dukung &nbsp;
                        <i 
                            class="pi pi-filter" 
                            @click="toggleDataDukung"
                            style="font-size: 1rem; cursor: pointer;">
                        </i>
                        <OverlayPanel ref="opDataDukung" appendTo="body" id="overlay_panel">
                            <InputText v-model="search.data_dukung" placeholder="Data Dukung" />
                            <Button class="ml-1" @click="doSearch">Search</Button>
                        </OverlayPanel>
                    </template>
                    <template #body="{ data }">
                        <template v-if="data.isLoading">
                            <Skeleton></Skeleton>
                        </template>
                        <template v-else>
                            <template v-if="data.isEdit">
                                <InputText @change="arahanTerupdate(data)" v-model="data.data_dukung" placeholder="Data Dukung"/>
                            </template>
                            <template v-else>
                                {{ data.data_dukung }}
                            </template>
                        </template>
                    </template>
                </Column>
                <Column field="keterangan" style="min-width: 10rem">
                    <template #header>
                        Keterangan &nbsp;
                        <i 
                            class="pi pi-filter" 
                            @click="toggleKeterangan"
                            style="font-size: 1rem; cursor: pointer;">
                        </i>
                        <OverlayPanel ref="opKeterangan" appendTo="body" id="overlay_panel">
                            <InputText v-model="search.keterangan" placeholder="Keterangan" />
                            <Button class="ml-1" @click="doSearch">Search</Button>
                        </OverlayPanel>
                    </template>
                    <template #body="{ data }">
                        <template v-if="data.isLoading">
                            <Skeleton></Skeleton>
                        </template>
                        <template v-else>
                            <template v-if="data.isEdit">
                                <InputText @change="arahanTerupdate(data)" v-model="data.keterangan" placeholder="Keterangan"/>
                            </template>
                            <template v-else>
                                {{ data.keterangan }}
                            </template>
                        </template>
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
                        <Button v-if="data.isEdit" severity="success" @click="saveData(data)" rounded class="mr-1" icon="pi pi-check"/>
                        <Button v-else severity="warning" @click="editData(data)" rounded class="mr-1" icon="pi pi-wrench"/>
                        <ConfirmPopup></ConfirmPopup>
                        <Button v-if="isAdmin" ref="popup" @click="confirmKosongkanArahan($event,data)" severity="danger" rounded icon="pi pi-trash"></Button>
                    </template>
                </Column>
            </DataTable>
            <Paginator
                v-if="!loading.loadArahan"
                class="my-2"
                :rows="dataArahan?.per_page"
                :totalRecords="dataArahan?.total"
                :rowsPerPageOptions="[5, 10, 25, 50, 100]"
                v-model:first="paginator"
                :currentPageReportTemplate="`Menampilkan ${paginator + 1} - ${Math.min(paginator + dataArahan?.per_page, dataArahan?.total) | 0} dari ${dataArahan?.total | 0} data`"
                template="PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport"
                @page="updatePage($event)"
            />
        </div>
    </div>
    
</template>