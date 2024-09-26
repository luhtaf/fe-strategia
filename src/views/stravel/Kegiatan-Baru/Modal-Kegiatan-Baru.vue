<script setup>
import { ref, watch } from 'vue';
import FormKegiatanBaru from './Form-Kegiatan-Baru.vue'
import FormUndanganKegiatanBaru from './Form-Undangan-Kegiatan-Baru.vue'
import FormKehadiranPesertaKegiatan from './Form-Kehadiran-Peserta-Kegiatan.vue'
import FormKelengkapanRapat from './Form-Kelengkapan-Rapat.vue';
import FormArahanPimpinan from './Form-Arahan-Pimpinan.vue';
import TindakLanjutArahanPimpinan from './Tindak-Lanjut-Arahan-Pimpinan.vue';
const visible=ref(false);

const nowTampil=ref(null)
const props = defineProps({
    propsVisible:Boolean,
    currentData:Object
})

const currentData=ref(null)

const emit=defineEmits([
    'closeModal',
])

watch(visible,(v)=>{
    emit('closeModal',v)
})

watch(props,(v)=>{
    visible.value=v.propsVisible;
    currentData.value=v.currentData
    nowTampil.value='form'
})


const nestedMenuitems = ref([
    {
        label:"Form",
        icon: 'pi pi-book',
        command: () => {
            nowTampil.value='form'
        }
    },
    {
        label: 'Undangan',
        icon: 'pi pi-fw pi-table',
        command: () => {
            nowTampil.value='undangan'
        },
    },
    {
        label: 'Kehadiran',
        icon: 'pi pi-fw pi-users',
        command: ()=>{
            nowTampil.value='kehadiran'
        }
    },
    {
        label: 'Kelengkapan',
        icon: 'pi pi-fw pi-briefcase',
        command: ()=>{
            nowTampil.value='kelengkapan'
        }
    },
    {
        label: 'Arahan',
        icon: 'pi pi-fw pi-check-circle',
        command: ()=>{
            nowTampil.value='arahan'
        }
    },
    {
        label: 'Tindak Lanjut Arahan',
        icon: 'pi pi-fw pi-check-circle',
        command: ()=>{
            nowTampil.value='tindak_lanjut'
        }
    }
]);
const nestedKosong=ref([
    {
        label:"Form",
        icon: 'pi pi-book',
        command: () => {
            nowTampil.value='form'
        }
    }
])
</script>
<template>
    <Dialog header="Detail Rapat" v-model:visible="visible" class="z-5" maximizable modal :style="{ width: '85rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <template #header>
            <h2>
                Kegiatan Baru {{ currentData?.nama }}
            </h2>
        </template>
        <div class="grid mt-2 card">
            <div class="card-header col-12">
                <TabMenu v-if="currentData?.id" :model="nestedMenuitems" />
                <TabMenu v-else :model="nestedKosong" />
            </div>                        
            <FormKegiatanBaru
                v-if="nowTampil=='form'"
                :currentData="currentData"
                @closeModal="(_)=>{
                    visible=false
                }"
            />
            <FormUndanganKegiatanBaru
                v-else-if="nowTampil=='undangan'"
                :currentData="currentData"
            />
            <FormKehadiranPesertaKegiatan
                v-else-if="nowTampil=='kehadiran'"
                :currentData="currentData"
            />
            <FormKelengkapanRapat
                v-else-if="nowTampil=='kelengkapan'"
                :currentData="currentData"
            />
            <FormArahanPimpinan
                v-else-if="nowTampil=='arahan'"
                :currentData="currentData"
            />
            <TindakLanjutArahanPimpinan
                v-else-if="nowTampil=='tindak_lanjut'"
                :currentData="currentData"
            />
        </div>
        
    </Dialog>
</template>
