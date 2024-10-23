<script setup>
import { ref, onBeforeMount } from 'vue';
import axios from '../axios_intercept'
import { URL_RAPAT, URL_RAPAT_BY_ID, URL_TEMA } from '../url';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
const loading=ref({
    loadSuggest:false
})
const dropdownMetodeValues = ref([
        { name: 'Luring' },
        { name: 'Daring' },
        { name: 'Hybrid' }
]);
const dropdownMetodeValue = ref()

const dropdownKategoriValues = ref([
        { name: 'Internal' },
        { name: 'External' },
]);
const dropdownKategoriValue = ref()

const dropdownSifatValues = ref([
    { name: 'Biasa' },
    { name: 'Urgen' },
]);
const dropdownSifatValue = ref(null);

const dropdownPenyelenggaraValues = ref([
    { name: 'Tu Kepala' },
    { name: 'Unit Kerja' },
]);
const dropdownPenyelenggaraValue = ref(null);

const dropdownPimpinanRapatValues = ref([
    { name: 'Kepala' },
    { name: 'Wakil Kepala' },
]);
const dropdownPimpinanRapatValue = ref(null);
const currentData=ref({
    nama:null,
    tanggal:null,
    lokasi:null,
    metode:null,
    jenis:null,
    pemapar:null,
    tautan:null,
    tema:null,
    kategori:null,
    urgensi:null,
    penyelenggara:null,
    pimpinan:null,

})
const date=ref(null)
const props = defineProps({
    currentData:Object
})

const emit=defineEmits([
    'closeModal'
])

onBeforeMount(() => {
    initSuggestTema()
    if (props.currentData) {
        currentData.value=props.currentData
        dropdownKategoriValue.value=matchDropDown(dropdownKategoriValues,currentData.value.kategori)
        dropdownSifatValue.value=matchDropDown(dropdownSifatValues,currentData.value.urgensi)
        dropdownPenyelenggaraValue.value=matchDropDown(dropdownPenyelenggaraValues,currentData.value.penyelenggara)
        dropdownPimpinanRapatValue.value=matchDropDown(dropdownPimpinanRapatValues,currentData.value.pimpinan)
        dropdownMetodeValue.value=matchDropDown(dropdownMetodeValues,currentData.value.metode)
        if(props.currentData.tanggal_mulai && props.currentData.tanggal_selesai) {
            const {tanggal_mulai,tanggal_selesai}=props.currentData
            date.value=[new Date(tanggal_mulai),new Date(tanggal_selesai)]
        }
    }
    else{
        currentData.value={
            nama:null,
            tanggal_mulai:null,
            tanggal_selesai:null,
            lokasi:null,
            metode:null,
            jenis:null,
            pemapar:null,
            tautan:null,
            tema:null,
            kategori:null,
            urgensi:null,
            penyelenggara:null,
            pimpinan:null,
            link_rsvp:null
        }
    }
});

const matchDropDown = (array,nilai) => {
    return array.value.filter(item => item.name == nilai).map(item => item)[0];
};



const simpanRapat=()=>{
    currentData.value.kategori=dropdownKategoriValue.value.name
    currentData.value.urgensi=dropdownSifatValue.value.name
    currentData.value.penyelenggara=dropdownPenyelenggaraValue.value.name
    currentData.value.pimpinan=dropdownPimpinanRapatValue.value.name
    currentData.value.metode=dropdownMetodeValue.value.name
    currentData.value.tanggal_mulai=date.value[0]
    currentData.value.tanggal_selesai=date.value[1]
    if (typeof(currentData.value.tema)==='object') currentData.value.tema=currentData.value.tema.nama
    var url=URL_RAPAT
    if (currentData.value.id) {
        currentData.value._method='PATCH'
        url=URL_RAPAT_BY_ID(currentData.value.id)
    }
    axios({
        url,
        method:'post',
        data:currentData.value
    })
    .then((response)=>{
        toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Sukses menyimpan data rapat', life: 3000 });
        if (!currentData.value.id) {
            emit('closeModal',true)
        }
        
    })
    .catch((error)=>{
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'gagal menyimpan data rapat', life: 3000 });
        console.error(error)
    })
}

const search = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            filteredTema.value = [...tema.value];
        } else {
            filteredTema.value = tema.value.filter((item) => {
                return item.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
}
const tema = ref();
const filteredTema = ref();
const initSuggestTema=()=>{
    loading.value.loadSuggest=true
    const url=URL_TEMA
    axios({
        url,
        method:'get',
    })
    .then((response)=>{
        tema.value=response.data.tema
    })
    .catch((error)=>{
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'gagal load tema rapat', life: 3000 });
        console.error(error)
    })
    .finally(()=>{
        loading.value.loadSuggest=false
    })
}

const autoCompleteRef=ref(null)
const handleBlur = () => {
    autoCompleteRef.value.hide();
};

</script>
<template>
    <div class="card pt-5 col-12 md:col-6 lg:col-4">
        
        <div class="grid p-fluid">
            <div class="col-12">
                <h5>Nama Kegiatan</h5>
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <InputText v-model="currentData.nama" type="text" placeholder="Nama Kegiatan" />
                        </IconField>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <h5>Kategori</h5>
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <Dropdown v-model="dropdownKategoriValue" :options="dropdownKategoriValues" optionLabel="name" placeholder="Kategori" />
                        </IconField>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <h5>Sifat</h5>
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <Dropdown v-model="dropdownSifatValue" :options="dropdownSifatValues" optionLabel="name" placeholder="Sifat" />
                        </IconField>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <h5>Tema</h5>
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <AutoComplete 
                                v-if="!loading.loadSuggest"
                                v-model="currentData.tema" 
                                placeholder="Tema" 
                                :suggestions="filteredTema" 
                                @complete="search" 
                                @blur="handleBlur"
                                ref="autoCompleteRef" 
                            >
                                <template #empty>
                                    <p @click="handleBlur" style="cursor: pointer;">No suggestion found, use <b>{{ currentData.tema }}</b> instead</p>
                                </template>
                            </AutoComplete>
                            <InputText
                                v-else
                                v-model="currentData.tema" 
                                placeholder="Tema" 
                            />
                        </IconField>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <h5>Tanggal dan Waktu</h5>
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <Calendar :showIcon="true" v-model="date" placeholder="Tanggal dan Waktu Rapat" selectionMode="range" :manualInput="true" showTime hourFormat="24" />
                        </IconField>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card col-12 md:col-6 lg:col-4">
        <h4/>
        <div class="grid p-fluid">
            <div class="col-12">
                <h5>Lokasi</h5>
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <InputText v-model="currentData.lokasi" type="text" placeholder="Lokasi" />
                        </IconField>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <h5>Metode</h5>
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <!-- <InputText v-model="currentData.metode" type="text" placeholder="Metode" /> -->
                            <Dropdown v-model="dropdownMetodeValue" :options="dropdownMetodeValues" optionLabel="name" placeholder="Metode" />
                        </IconField>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <h5>Penyelenggara</h5>
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <Dropdown v-model="dropdownPenyelenggaraValue" :options="dropdownPenyelenggaraValues" optionLabel="name" placeholder="Penyelenggara" />
                        </IconField>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <h5>Link RSVP</h5>
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <InputText v-model="currentData.link_rsvp" type="text" placeholder="Link RSVP" />
                        </IconField>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div class="card col-12 lg:col-4">
        <h4> </h4>
        <div class="grid p-fluid">
            <div class="col-12">
                <h5>Pimpinan Rapat</h5>
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <Dropdown v-model="dropdownPimpinanRapatValue" :options="dropdownPimpinanRapatValues" optionLabel="name" placeholder="Pimpinan Rapat" />
                        </IconField>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <h5>Jenis Kegiatan</h5>
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <InputText v-model="currentData.jenis" type="text" placeholder="Jenis Kegiatan" />
                        </IconField>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <h5>Pemapar</h5>
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <InputText v-model="currentData.pemapar" type="text" placeholder="Pemapar" />
                        </IconField>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <h5>Tautan</h5>
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <InputText v-model="currentData.tautan" type="text" placeholder="Tautan" />
                        </IconField>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-12 mt-2">
        <Button class="mb-2 mr-2" 
        @click="simpanRapat()"
        >
            Simpan Rapat
        </Button>
    </div>
</template>