<script setup>
import axios from '../axios_intercept'
import { ref, onBeforeMount } from 'vue';
import { URL_ALL_ARAHAN, URL_ARAHAN_BY_ID, URL_GET_ALL_KARYAWAN } from '../url'
import { useToast } from 'primevue/usetoast';
const toast = useToast();
const dataArahan=ref(null)
const loading=ref({
    loadArahan:false
})
onBeforeMount(()=>{
    initDataArahan()
    initDataKaryawan()
})
const paginator=ref(null)
const breadcrumbHome = ref({ icon: 'pi pi-home', route: '/' });
const breadcrumbItems = ref([{ label: 'Daftar Arahan' }]);
const initDataArahan=(size=10,page=1)=>{
    loading.value.loadArahan=true
    const url=`${URL_ALL_ARAHAN}?size=${size}&page=${page}`
    axios({
        url,
        method:'get'
    })
    .then((response)=>{
        dataArahan.value=response.data
        initPelaksana()
    })
    .catch((error)=>{
        console.log(error)
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
    "Gagal",
    "Selesai",
    "Dalam Proses",
    "Tidak ada Tindak Lanjut"
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
        toast.add({ severity: 'success', summary: 'Berhasil', detail: `${response.data.message} :${data.arahan}`, life: 3000 });
    })
    .catch((error)=>{
        console.log(error)
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal Mengambil Data Arahan, harap periksa console', life: 3000 });
    })
    .finally(()=>{
        data.isLoading=false
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
    dataArahan.value.data.forEach(arahan => {
        arahan.pelaksana_pilih=matchDropDown(listKaryawan,arahan.pelaksana)
        arahan.terupdate=false
        console.log(arahan)
    });
}
const arahanTerupdate=arahan=>{
    arahan.terupdate=true
}

const updatePage = (event) => {
    initDataArahan(event.rows,event.page+1)
};
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
                <template #empty> <p v-if="!loading">Belum ada data rapat.</p> </template>
                <!-- <template #loading> Sedang load data rapat... </template> -->
                <template #loading>
                    <div class="flex flex-column align-items-center">
                        <ProgressSpinner />
                        <span>Sedang load data rapat...</span> 
                    </div>
                </template>
            <!-- <template #slotProps> -->
                <Column field="nama" header="Nama Rapat" style="min-width: 12rem">
                    <template #body="{ data }">
                        <template v-if="data.isLoading">
                            <Skeleton></Skeleton>
                        </template>
                        <template v-else>
                            {{ data.nama_rapat }}
                        </template>
                    </template>
                </Column>
                <Column field="arahan" header="Arahan" style="min-width: 18rem">
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

                <Column field="pelaksana" header="Pelaksana" style="min-width: 18rem">
                    <template #body="{ data }">
                        <template v-if="data.isLoading">
                            <Skeleton></Skeleton>
                        </template>
                        <template v-else>
                            <template v-if="data.isEdit">
                                <Dropdown @change="arahanTerupdate(data)" v-model="data.pelaksana_pilih" :options="listKaryawan" filter optionLabel="nama" placeholder="Pelaksana" />
                            </template>
                            <template v-else>
                                {{ data.pelaksana }}
                            </template>
                        </template>
                    </template>
                </Column>

                <Column field="deadline" header="Batas Waktu" style="min-width: 12rem">
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

                <Column field="status" header="Status" style="min-width: 12rem">
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

                <Column header="Penyelesaian" field="penyelesaian" style="min-width: 10rem">
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
                <Column header="Data Dukung" field="data_dukung" style="min-width: 10rem">
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
                <Column header="Keterangan" field="keterangan" style="min-width: 10rem">
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
                :currentPageReportTemplate="`Menampilkan ${ paginator+1 } - ${ paginator+dataArahan.per_page } dari ${dataArahan.total} data`"
                template="PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport"
                @page="updatePage($event)"
            />
        </div>
    </div>
    
</template>