<script setup>
import axios from '../axios_intercept'
import { ref, onBeforeMount } from 'vue';
import { URL_ALL_ARAHAN, URL_ARAHAN_BY_ID, URL_ARAHAN_LAPORAN, URL_GET_ALL_UNIT_KERJA } from '../url'
import { useToast } from 'primevue/usetoast';
import { parsingDateToURL } from '../library'
const toast = useToast();
const dataArahan=ref(null)
const loading=ref({
    loadArahan:true
})
onBeforeMount(async ()=>{
    await initDataUnitKerja()
    await initDataArahan()
})
const userData = ref(JSON.parse(localStorage.getItem('userData')))
const paginator=ref(null)
const breadcrumbHome = ref({ icon: 'pi pi-home', route: '/' });
const breadcrumbItems = ref([{ label: 'Daftar Arahan' }]);
const initDataArahan=async (size=10,page=1)=>{
    loading.value.loadArahan=true

    var url=`${URL_ALL_ARAHAN}?size=${size}&page=${page}`
    if (search.value.isSearch) {
        url=search.value.nama?`${url}&nama_rapat=${search.value.nama}`:url
        url=search.value.arahan?`${url}&arahan=${search.value.arahan}`:url
        url=search.value.pelaksana?`${url}&pelaksana=${search.value.pelaksana.nama}`:url
        url=search.value.deadline?`${url}&deadline=${parsingDateToURL(search.value.deadline)}`:url
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
// const cekJikaArahandidiamkan7Hari = 
const formatTimestampToWIB = (timestamp, kosong=true) => {
    if (!timestamp) { // Check if timestamp is null or undefined
        return kosong?"Belum ada Batas Waktu":"-";
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
    "Drop",
    "Menunggu Konfirmasi Perbaikan",
    "Belum Ada Tindak Lanjut dari Unit Kerja"
    // "Tidak ada Tindak Lanjut"
])
const dropDownPenyelesaian=ref([
    "Terlambat",
    "Tepat Waktu"
])
const editData=(data)=>{
    data.isEdit=true
}

const saveData=(data)=>{
    data.isEdit=false
    if(data.terupdate)
    {
        data.isLoading=true
        data.pelaksana=data.pelaksana_pilih.nama
        data._method='PATCH'
        console.log(userData)
    console.log(userData.value)
        const isAdmin = userData.value.role[0]=='admin'?true:false
        const url= isAdmin? URL_ARAHAN_BY_ID(data.rapat_id,data.id):URL_ARAHAN_LAPORAN(data.rapat_id,data.id)
        axios({
            url,
            method:'post',
            data
        })
        .then((response)=>{
            // data=response.data
            // console.log(data)
            // console.log(response.data)
            data.status=response.data.data.status
            // data=response.data.data
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



const opBatasKonfirmasi=ref()
const toggleKonfirmasi=(event)=>{
    opBatasKonfirmasi.value.toggle(event);
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
    keterangan:null,
    batas_konfirmasi:null,
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
        keterangan:null,
        batas_konfirmasi:null,
    }
    initDataArahan(dataArahan.per_page)
}
</script>
<template>
    <div class="col-12">
        <div class="card card-w-title overflow-auto">
            <div class="card-title mb-3">
                <h5>Daftar Arahan</h5>
                <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" >
                    <template #item="{ item, props }">
                        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                            <a :href="href" v-bind="props.action" @click="navigate">
                                <span :class="[item.icon, 'text-color']" />
                                <span class="text-primary font-semibold">{{ item.label }}</span>
                            </a>
                        </router-link>
                        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                            <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
                        </a>
                    </template>
                </Breadcrumb>
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
                            <template v-if="data.isEdit && userData?.role[0]=='admin'">
                                <InputText @change="arahanTerupdate(data)" v-model="data.arahan" placeholder="Arahan"/>
                            </template>
                            <template v-else>
                                <div 
                                    :class="{
                                        'bg-red-100': data.status === 'Gagal',
                                        'bg-red-200':data.status === 'Belum Ada Tindak Lanjut dari Unit Kerja',
                                        'bg-green-100': data.status === 'Selesai',
                                        'bg-green-200': data.status === 'Drop',
                                        'bg-orange-200': data.status === 'Dalam Proses',
                                        'bg-orange-100': data.status === 'Menunggu Konfirmasi Perbaikan',
                                        'bg-black-100': data.status === 'Tidak ada Tindak Lanjut',
                                        'bg-gray-100': data.status == null
                                    }"
                                    style="padding: 0.5rem"
                                >
                                    <p>{{ data.arahan }}</p>
                                </div>
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
                            <template v-if="data.isEdit && userData?.role[0]=='admin'">
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
                            <template v-if="data.isEdit && userData?.role[0]=='admin'">
                                <Calendar @change="arahanTerupdate(data)" @date-select="arahanTerupdate(data)" v-model="data.deadline" :showIcon="true" :manualInput="true" showTime hourFormat="24"></Calendar>
                            </template>
                            <template v-else>
                                {{ formatTimestampToWIB(data.deadline) }}
                            </template>
                        </template>

                    </template>
                </Column>

                <Column field="batas_konfirmasi" style="min-width: 12rem">
                    <template #header>
                        Batas Konfirmasi &nbsp;
                        <i 
                            class="pi pi-filter" 
                            @click="toggleKonfirmasi"
                            style="font-size: 1rem; cursor: pointer;">
                        </i>
                        <OverlayPanel ref="opBatasKonfirmasi" appendTo="body" id="overlay_panel">
                            <IconField iconPosition="left">
                                <InputGroup>
                                    <Button icon="pi pi-search" @click="doSearch" />
                                    <Calendar v-model="search.batas_konfirmasi" placeholder="Tanggal dan Waktu Rapat" :manualInput="true" showTime hourFormat="24" />
                                </InputGroup>
                            </IconField>
                        </OverlayPanel>
                    </template>
                    <template #body="{ data }">
                        <template v-if="data.isLoading">
                            <Skeleton></Skeleton>
                        </template>
                        <template v-else>
                            <template v-if="data.isEdit && userData?.role[0]=='admin'">
                                <Calendar @change="arahanTerupdate(data)" @date-select="arahanTerupdate(data)" v-model="data.batas_konfirmasi" :showIcon="true" :manualInput="true" showTime hourFormat="24"></Calendar>
                            </template>
                            <template v-else>
                                {{ formatTimestampToWIB(data.batas_konfirmasi,false) }}
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
                            <template v-if="data.isEdit && userData?.role[0]=='admin'">
                                <Dropdown @change="arahanTerupdate(data)" v-model="data.status" :options="dropDownStatus" placeholder="Status" />
                            </template>
                            <template v-else>
                                <template v-if="data.status=='Dalam Proses'">
                                    {{ data.status }}
                                    <template v-if="data.revisi>0">
                                        - {{ data.revisi }}
                                    </template>
                                </template>
                                <template v-else>
                                    {{ data.status }}
                                </template>
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
                            <template v-if="data.isEdit && userData?.role[0]=='admin'">
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
                        <Button severity="danger" rounded icon="pi pi-trash"></Button>
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