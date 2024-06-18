<script setup>
import { ref, onBeforeMount } from 'vue';
import axios from '../axios_intercept'
import { URL_RAPAT, URL_RAPAT_BY_ID } from '../url';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
const dropdownMetodeValues = ref([
        { name: 'Luring' },
        { name: 'Daring' },
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
        var tanggal
        if(!currentData.value.tanggal && currentData.value.tanggal!=='null') {
            tanggal=JSON.parse(currentData.value.tanggal)
            date.value=[new Date(tanggal[0]),new Date(tanggal[1])]
        }
    }
    else{
        currentData.value={
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
    currentData.value.tanggal=JSON.stringify(date.value)
    if (typeof(currentData.value.tema)==='object') currentData.value.tema=currentData.value.tema.nama
    var url=URL_RAPAT
    if (currentData.value.id) {
        currentData.value._method='PATCH'
        url=URL_RAPAT_BY_ID(currentData.value.id)
    }
    axios({
        url:url,
        method:'post',
        data:currentData.value
    })
    .then((response)=>{
        console.log(response)
        toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Sukses menyimpan data rapat', life: 3000 });
        if (!currentData.value.id) {
            emit('closeModal',true)
        }
        
    })
    .catch((error)=>{
        console.log(error)
    })
}

const search = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            filteredTema.value = [...tema.value];
        } else {
            filteredTema.value = tema.value.filter((item) => {
                return item.nama.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
}
const tema = ref();
const filteredTema = ref();
const initSuggestTema=()=>{
    tema.value=[
    {
        nama:"Judi Online"
    },
    {
        nama:"SPBE"
    },
    {
        nama:"Anggaran"
    }
]
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
                                v-model="currentData.tema" 
                                optionLabel="nama" 
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
                <h5>Tanggal dan Waktu</h5>
                <div class="grid formgrid">
                    <div class="col-12">
                        <IconField>
                            <!-- <Calendar id="calendar-timeonly" v-model="time" timeOnly selectionMode="range" placeholder="Waktu" /> -->
                            <Calendar v-model="date" placeholder="Tanggal dan Waktu Rapat" selectionMode="range" :manualInput="true" showTime hourFormat="24" />

                        </IconField>
                    </div>
                </div>
            </div>

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