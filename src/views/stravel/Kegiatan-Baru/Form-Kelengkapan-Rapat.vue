<script setup>
import { ref, onBeforeMount } from 'vue';
import axios from '../axios_intercept'
import { URL_KELENGKAPAN, URL_KELENGKAPAN_BY_ID } from '../url'
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const loading=ref({
    loadKelengkapan:null
})
const initKelengkapanRapat=()=>{
    loading.value.loadKelengkapan=true
    axios({
        url: URL_KELENGKAPAN(props.currentData.id),
        method: 'get',
    })
    .then((response) => {
        if (response.data.data) currentData.value = response.data.data
    })
    .catch((error) => {
        console.error(error)
    })
    .finally(()=>{
        loading.value.loadKelengkapan=false
    })
}

onBeforeMount(()=>{
    initKelengkapanRapat()
})

const props=defineProps({
    currentData:Object
})

const currentData=ref({
    id:null,
    undangan:null,
    rekaman:null,
    risalah:null,
    bahan:null,
    absen:null,
    laporan:null,
    dokumentasi:null
})

const simpanKelengkapan=()=>{
    loading.value.loadKelengkapan=true
    var url
    if(currentData.value.id){
        currentData.value._method='PATCH'
        url=URL_KELENGKAPAN_BY_ID(props.currentData.id,currentData.value.id)
    }
    else{
        url=URL_KELENGKAPAN(props.currentData.id)
    }
    axios({
        url,
        method: 'post',
        data:currentData.value
    })
    .then((response) => {
        initKelengkapanRapat()
        toast.add({ severity: 'success', summary: 'Berhasil', detail: `Sukses mengubah data kelengkapan`, life: 3000 });
    })
    .catch((error) => {
        console.error(error)
        toast.add({ severity: 'error', summary: 'Gagal', detail: `Gagal mengubah data kelengkapan`, life: 3000 });
    })
    .finally(()=>{
        loading.value.loadKelengkapan=false
    })
}
</script>
<template>
    <template v-if="!loading.loadKelengkapan">
        <div class="mt-3 col-12 md:col-6 lg:col-6">
            
            <div class="grid p-fluid">
                <div class="col-12 card">
                    <h5>Undangan</h5>
                    <div class="grid formgrid">
                        <div class="col-12">
                            <IconField>
                                <InputText v-model="currentData.undangan" type="text" placeholder="Link Lampiran Undangan" />
                            </IconField>
                        </div>
                    </div>
                </div>

                <div class="col-12 card">
                    <h5>Risalah Arahan</h5>
                    <div class="grid formgrid">
                        <div class="col-12">
                            <IconField>
                                <InputText v-model="currentData.risalah" type="text" placeholder="Link Lampiran Risalah" />
                            </IconField>
                        </div>
                    </div>
                </div>

                <div class="col-12 card">
                    <h5>Daftar Hadir</h5>
                    <div class="grid formgrid">
                        <div class="col-12">
                            <IconField>
                                <InputText v-model="currentData.absen" type="text" placeholder="Link Lampiran Daftar Hadir" />
                            </IconField>
                        </div>
                    </div>
                </div>

                <div class="col-12 card">
                    <h5>Foto Kegiatan</h5>
                    <div class="grid formgrid">
                        <div class="col-12">
                            <IconField>
                                <InputText v-model="currentData.dokumentasi" type="text" placeholder="Link Lampiran Foto Kegiatan" />
                            </IconField>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>

        <div class="mt-3 col-12 md:col-6 lg:col-6">
            
            <div class="grid p-fluid">
                <div class="col-12 card">
                    <h5>Rekaman Rapat</h5>
                    <div class="grid formgrid">
                        <div class="col-12">
                            <IconField>
                                <InputText v-model="currentData.rekaman" type="text" placeholder="Link Lampiran Rekaman Rapat" />
                            </IconField>
                        </div>
                    </div>
                </div>

                <div class="col-12 card">
                    <h5>Bahan Rapat</h5>
                    <div class="grid formgrid">
                        <div class="col-12">
                            <IconField>
                                <InputText v-model="currentData.bahan" type="text" placeholder="Link Lampiran Bahan Rapat" />
                            </IconField>
                        </div>
                    </div>
                </div>

                <div class="col-12 card">
                    <h5>Laporan Pendampingan</h5>
                    <div class="grid formgrid">
                        <div class="col-12">
                            <IconField>
                                <InputText v-model="currentData.laporan" type="text" placeholder="Link Lampiran Laporan Pendampingan" />
                            </IconField>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 mt-2">
            <Button @click="simpanKelengkapan()" label="Simpan Kelengkapan Rapat" class="mb-2 mr-2" />
        </div>
    </template>
    <div v-else class="mt-3 col-12 card">
        <ProgressSpinner
            style="width: 50px; height: 50px"
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration=".5s"
            aria-label="Custom ProgressSpinner"
        />
        <h4>Sedang memuat data kelengkapan rapat...</h4>
    </div>

</template>