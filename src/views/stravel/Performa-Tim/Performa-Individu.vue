<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import axios from '../axios_intercept'
import { URL_KEHADIRAN_PERSONEL, URL_ARAHAN_PERSONEL } from '../url'
import { useToast } from 'primevue/usetoast';
import { hasNoNullValues, parsingDateToURL } from '../library'
const toast = useToast();

const loading=ref({
    loadPenyelesaianArahan:true,
    loadKehadiranKegiatan:true,
})

const props = defineProps({
    jangkaWaktu:Array,
    karyawanTampil:Object
})

const dataKehadiran=ref([])
const getDataKehadiran = (nama)=>{
    const data={nama}
    loading.value.loadKehadiranKegiatan=true
    let url=URL_KEHADIRAN_PERSONEL
    url=props.jangkaWaktu?`${url}?tanggal_mulai=${parsingDateToURL(props.jangkaWaktu[0])}&tanggal_selesai=${parsingDateToURL(props.jangkaWaktu[1])}`:url
    axios({
        url,
        method:'post',
        data
    })
    .then((response)=>{
        dataKehadiran.value=response.data
        setChartKehadiran()
    })
    .catch((error)=>{
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'gagal load data top5', life: 3000 });
        console.log(error)
    })
    .finally(()=>{
        loading.value.loadKehadiranKegiatan=false
    })
}

const dataArahan=ref([])
const getDataArahan = (nama)=>{
    const data={nama}
    loading.value.loadPenyelesaianArahan=true
    let url=URL_ARAHAN_PERSONEL
    url=props.jangkaWaktu?`${url}?tanggal_mulai=${parsingDateToURL(props.jangkaWaktu[0])}&tanggal_selesai=${parsingDateToURL(props.jangkaWaktu[1])}`:url
    axios({
        url,
        method:'post',
        data
    })
    .then((response)=>{
        dataArahan.value=response.data
        setChartArahan()
    })
    .catch((error)=>{
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'gagal load data top5', life: 3000 });
        console.log(error)
    })
    .finally(()=>{
        loading.value.loadPenyelesaianArahan=false
    })

}
let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');


const pieDataKehadiran = ref(null);
const pieDataArahan = ref(null);
const pieOptionsKehadiran = ref(null);
const pieOptionsArahan = ref(null);


const setChartKehadiran = () => {
    const { hadir, tidak_hadir, diwakilkan }=dataKehadiran.value
    pieDataKehadiran.value = {
        labels: ['Hadir', 'Tidak Hadir','Diwakilkan'],
        datasets: [
            {
                data: [hadir,tidak_hadir,diwakilkan],
                backgroundColor: [documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--red-500'), documentStyle.getPropertyValue('--orange-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--red-400'),documentStyle.getPropertyValue('--orange-500')]
            }
        ]
    };
};

const setChartArahan = () => {
    const { selesai, gagal, dalam_proses, tidak_ada_tindak_lanjut, tanpa_keterangan }=dataArahan.value
    pieDataArahan.value = {
        labels: ['Selesai', 'Gagal','Dalam Proses','Tidak Ada Tindak Lanjut', 'Tanpa Keterangan'],
        datasets: [
            {
                data: [selesai, gagal, dalam_proses, tidak_ada_tindak_lanjut, tanpa_keterangan],
                backgroundColor: [documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--red-500'), documentStyle.getPropertyValue('--orange-500'),documentStyle.getPropertyValue('--gray-500'),documentStyle.getPropertyValue('--black-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--red-500'), documentStyle.getPropertyValue('--orange-500'),documentStyle.getPropertyValue('--gray-500'),documentStyle.getPropertyValue('--black-500')]
            }
        ]
    };
};

const setchartOptionsArahan=()=>{
    pieOptionsArahan.value = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
}

const setchartOptionsKehadiran=()=>{
    pieOptionsKehadiran.value = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
}

onBeforeMount(()=>{
    getDataKehadiran(props.karyawanTampil.nama)
    getDataArahan(props.karyawanTampil.nama)
    setchartOptionsArahan()
    setchartOptionsKehadiran()
})



watch(props,(baru,lama) => {
    // if (baru.jangkaWaktu!==lama.jangkaWaktu) {
    if (hasNoNullValues(baru.jangkaWaktu)){
        getDataKehadiran(props.karyawanTampil.nama)
        getDataArahan(props.karyawanTampil.nama)
    }    
    // }
})



const karyawanTampil = ref()

const ubahPelaksana=()=>{
    const { nama }=props.karyawanTampil
    getDataKehadiran(nama)
    getDataArahan(nama)
}

</script>


<template>
    <div class="col-12 xl:col-6">
        <div class="card flex flex-column align-items-center">
            <h5 class="text-left w-full">Penyelesaian Arahan dan Instruksi</h5>
            <Chart v-if="!loading.loadPenyelesaianArahan" type="pie" :data="pieDataArahan" :options="pieOptionsArahan" />
            <Skeleton v-else shape="circle" width="20em" height="20em"/>
        </div>
    </div>
    <div class="col-12 xl:col-6">
        <div class="card flex flex-column align-items-center">
            <h5 class="text-left w-full">Kehadiran Kegiatan</h5>
            <Chart v-if="!loading.loadKehadiranKegiatan" type="pie" :data="pieDataKehadiran" :options="pieOptionsKehadiran" />
            <Skeleton v-else shape="circle" width="20em" height="20em"/>
        </div>
    </div>
</template>