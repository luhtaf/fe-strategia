<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import axios from '../axios_intercept'
import { URL_TOP5_ARAHAN, URL_TOP5_KEHADIRAN, URL_TOP5_PENYELESAIAN, URL_TOP5_TEMA } from '../url'
import { useToast } from 'primevue/usetoast';
import { hasNoNullValues, parsingDateToURL } from '../library'
const toast = useToast();

const props = defineProps({
    jangkaWaktu:Array
})

watch(props,(v)=>{
    if (hasNoNullValues(v.jangkaWaktu)){
        getDataTop5Arahan()
        getDataTop5Kehadiran()
        getDataTop5Penyelesaian()
        getDataTop5Tema()
    }
})

const loading=ref({
    tableArahan:false,
    tableKehadiran:false,
    tablePenyelesaian:false,
    tableTema:false
})

const sortTableArahan=ref({
    total:null,
    selesai:null,
    dalam_proses:null,
    tanpa_keterangan:null,
    tidak_ada_tindak_lanjut:null,
    gagal:null,
    pelaksana:null,
    persentase_selesai:null
})

const dataTop5Arahan=ref([{}])
const getDataTop5Arahan = (sort_by='total',order='desc')=>{
    loading.value.tableArahan=true
    let url=URL_TOP5_ARAHAN(sort_by,order)
    url=props.jangkaWaktu?`${url}&tanggal_mulai=${parsingDateToURL(props.jangkaWaktu[0])}&tanggal_selesai=${parsingDateToURL(props.jangkaWaktu[1])}`:url
    axios({
        url,
        method:'get'
    })
    .then((response)=>{
        dataTop5Arahan.value=response.data
        setchartDataArahan();
    })
    .catch((error)=>{
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'gagal load data top5', life: 3000 });
        console.error(error)
    })
    .finally(()=>{
        loading.value.tableArahan=false
    })
}

const dataTop5Tema=ref([{}])
const getDataTop5Tema = ()=>{
    loading.value.tableTema=true
    let url=URL_TOP5_TEMA
    axios({
        url,
        method:'get'
    })
    .then((response)=>{
        dataTop5Tema.value=response.data
        setchartDataTema();
    })
    .catch((error)=>{
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'gagal load data top5', life: 3000 });
        console.error(error)
    })
    .finally(()=>{
        loading.value.tableTema=false
    })
}


const sortTablePenyelesaian=ref({
    pelaksana:null,
    total:null,
    tepat_waktu:null,
    terlambat:null,
    belum_tl:null,
    persentase_tepat_waktu:null
})

const dataTop5Penyelesaian=ref([{}])
const getDataTop5Penyelesaian = (sort_by='tepat_waktu',order='desc')=>{
    loading.value.tablePenyelesaian=true
    let url=URL_TOP5_PENYELESAIAN(sort_by,order)
    url=props.jangkaWaktu?`${url}&tanggal_mulai=${parsingDateToURL(props.jangkaWaktu[0])}&tanggal_selesai=${parsingDateToURL(props.jangkaWaktu[1])}`:url
    axios({
        url,
        method:'get'
    })
    .then((response)=>{
        dataTop5Penyelesaian.value=response.data
        setchartDataPenyelesaian();
    })
    .catch((error)=>{
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'gagal load data top5', life: 3000 });
        console.error(error)
    })
    .finally(()=>{
        loading.value.tablePenyelesaian=false
    })
}


const sortTableKehadiran=ref({
    total:null,
    hadir:null,
    nama:null,
    persentase_hadir:null
})

const dataTop5Kehadiran=ref([{}])
const getDataTop5Kehadiran = (sort_by='persentase_hadir',order='desc')=>{
    loading.value.tableKehadiran=true
    let url=URL_TOP5_KEHADIRAN(sort_by,order)
    url=props.jangkaWaktu?`${url}&tanggal_mulai=${parsingDateToURL(props.jangkaWaktu[0])}&tanggal_selesai=${parsingDateToURL(props.jangkaWaktu[1])}`:url
    axios({
        url,
        method:'get'
    })
    .then((response)=>{
        dataTop5Kehadiran.value=response.data
        setchartDataKehadiran()
    })
    .catch((error)=>{
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'gagal load data top5', life: 3000 });
        console.error(error)
    })
    .finally(()=>{
        loading.value.tableKehadiran=false
    })
}

onBeforeMount(()=>{
    getDataTop5Arahan()
    getDataTop5Kehadiran()
    getDataTop5Penyelesaian()
    getDataTop5Tema()

    setchartOptionsArahan()
    setchartOptionsKehadiran()
    setchartOptionsPenyelesaian()
    setchartOptionsTema()
})


const sortArahan=(sortColumn)=>{
    const currColumn=sortTableArahan.value[sortColumn]
    sortTableArahan.value={
        total:null,
        selesai:null,
        dalam_proses:null,
        tanpa_keterangan:null,
        tidak_ada_tindak_lanjut:null,
        gagal:null,
        pelaksana:null,
        persentase_selesai:null
    }
    if (currColumn===null) {
        sortTableArahan.value[sortColumn]=true
    }
    else{
        sortTableArahan.value[sortColumn]=!currColumn
    }
    const isDesc=sortTableArahan.value[sortColumn]?'desc':'asc'
    getDataTop5Arahan(sortColumn,isDesc)
}

const sortKehadiran=(sortColumn)=>{
    const currColumn=sortTableKehadiran.value[sortColumn]
    sortTableKehadiran.value={
        total:null,
        hadir:null,
        nama:null,
        persentase_hadir:null
    }
    if (currColumn===null) {
        sortTableKehadiran.value[sortColumn]=true
    }
    else{
        sortTableKehadiran.value[sortColumn]=!currColumn
    }
    const isDesc=sortTableKehadiran.value[sortColumn]?'desc':'asc'
    getDataTop5Kehadiran(sortColumn,isDesc)
}

const sortPenyelesaian=(sortColumn)=>{
    const currColumn=sortTablePenyelesaian.value[sortColumn]
    sortTablePenyelesaian.value={
        pelaksana:null,
        total:null,
        tepat_waktu:null,
        terlambat:null,
        belum_tl:null,
        persentase_tepat_waktu:null
    }
    if (currColumn===null) {
        sortTablePenyelesaian.value[sortColumn]=true
    }
    else{
        sortTablePenyelesaian.value[sortColumn]=!currColumn
    }
    const isDesc=sortTablePenyelesaian.value[sortColumn]?'desc':'asc'
    getDataTop5Penyelesaian(sortColumn,isDesc)
}

const chartDataArahan = ref();
const chartOptionsArahan = ref();
const chartDataPenyelesaian = ref();
const chartOptionsPenyelesaian = ref();
const chartDataKehadiran = ref();
const chartOptionsKehadiran = ref();
const chartDataTema = ref();
const chartOptionsTema = ref();

const setchartDataArahan = () =>  {
    const documentStyle = getComputedStyle(document.documentElement);
    let pelaksana = [];
    let selesai = [];
    let gagal = [];
    let dalam_proses = [];
    let tidak_ada_tindak_lanjut = [];
    let tanpa_keterangan = [];
    dataTop5Arahan.value.forEach(arahan => {
        pelaksana.push(arahan.pelaksana)
        selesai.push(parseInt(arahan.selesai, 10)); 
        gagal.push(parseInt(arahan.gagal, 10));
        dalam_proses.push(parseInt(arahan.dalam_proses, 10));
        tidak_ada_tindak_lanjut.push(parseInt(arahan.tidak_ada_tindak_lanjut, 10));
        tanpa_keterangan.push(parseInt(arahan.tanpa_keterangan, 10));
    });
    chartDataArahan.value= {
        labels: pelaksana,
        datasets: [
            {
                type: 'bar',
                label: 'Selesai',
                backgroundColor: documentStyle.getPropertyValue('--green-500'),
                data: selesai
            },
            // {
            //     type: 'bar',
            //     label: 'Gagal',
            //     backgroundColor: documentStyle.getPropertyValue('--red-500'),
            //     data: gagal
            // },
            {
                type: 'bar',
                label: 'Dalam Proses',
                backgroundColor: documentStyle.getPropertyValue('--orange-500'),
                data: dalam_proses
            },
            // {
            //     type: 'bar',
            //     label: 'Tidak ada Tindak Lanjut',
            //     backgroundColor: documentStyle.getPropertyValue('--surface-500'),
            //     data: tidak_ada_tindak_lanjut
            // },
            // {
            //     type: 'bar',
            //     label: 'Tanpa Keterangan',
            //     backgroundColor: documentStyle.getPropertyValue('--gray-900'),
            //     data: tanpa_keterangan
            // }
        ]
    };
};

const setchartOptionsArahan = () =>  {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    chartOptionsArahan.value= {
        plugins: {
            tooltips: {
                mode: 'index',
                intersect: false
            },
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}

const setchartDataPenyelesaian = () =>  {
    const documentStyle = getComputedStyle(document.documentElement);
    let tepat_waktu = [];
    let terlambat = [];
    let belum_tl = [];
    let pelaksana = [];
    dataTop5Penyelesaian.value.forEach(penyelesaian => {
        pelaksana.push(penyelesaian.pelaksana)
        terlambat.push(parseInt(penyelesaian.terlambat, 10)); 
        belum_tl.push(parseInt(penyelesaian.belum_tl, 10)); 
        tepat_waktu.push(parseInt(penyelesaian.tepat_waktu, 10));
    });
    chartDataPenyelesaian.value= {
        labels: pelaksana,
        datasets: [
            {
                type: 'bar',
                label: 'Tepat Waktu',
                backgroundColor: documentStyle.getPropertyValue('--green-500'),
                data: tepat_waktu
            },
            {
                type: 'bar',
                label: 'Terlambat',
                backgroundColor: documentStyle.getPropertyValue('--red-500'),
                data: terlambat
            },
            // {
            //     type: 'bar',
            //     label: 'Tidak Ada Tindak Lanjut',
            //     backgroundColor: documentStyle.getPropertyValue('--surface-500'),
            //     data: belum_tl
            // },
        ]
    };
};

const setchartOptionsPenyelesaian = () =>  {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    chartOptionsPenyelesaian.value= {
        plugins: {
            tooltips: {
                mode: 'index',
                intersect: false
            },
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}

const setchartDataKehadiran = () =>  {
    const documentStyle = getComputedStyle(document.documentElement);
    let nama = [];
    let persentase_hadir = [];
    
    dataTop5Kehadiran.value.forEach(kehadiran => {
        nama.push(kehadiran.nama)
        persentase_hadir.push(parseFloat(kehadiran.persentase_hadir));
    });
    chartDataKehadiran.value= {
        labels: nama,
        datasets: [
            {
                type: 'bar',
                label: 'Persentase Kehadiran',
                backgroundColor: documentStyle.getPropertyValue('--cyan-500'),
                data: persentase_hadir,
                borderWidth: 1
            },
        ]
    };
};

const setchartOptionsKehadiran = () =>  {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    chartOptionsKehadiran.value= {
        plugins: {
            tooltips: {
                mode: 'index',
                intersect: false
            },
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}

const setchartDataTema = () =>  {
    const documentStyle = getComputedStyle(document.documentElement);
    let nama=[]
    let jumlah=[]
    dataTop5Tema.value.temaCounts.forEach(tema => {
        nama.push(tema.tema)
        jumlah.push(tema.count)
    });
    chartDataTema.value= {
        labels: nama,
        datasets: [
        {
                type: 'bar',
                label: 'Jumlah Tema',
                backgroundColor: documentStyle.getPropertyValue('--cyan-500'),
                data: jumlah,
                borderWidth: 1
            },
        ]
    };
};

const setchartOptionsTema = () =>  {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    chartOptionsTema.value= {
        plugins: {
            tooltips: {
                mode: 'index',
                intersect: false
            },
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}
</script>


<template>
    <div class="col-12 xl:col-6">
        <div class="card">
            <h5>Persentase Kehadiran Rapat</h5>
            <Chart v-if="!loading.tableKehadiran" type="bar" :data="chartDataKehadiran" :options="chartOptionsKehadiran" class="h-[30rem]" />
            <Skeleton v-else width="100%" height="20em"/>
        </div>
    </div>
    <div class="col-12 xl:col-6">
        <div class="card">
            <h5>Penyelesaian Arahan dan Instruksi</h5>
            <Chart v-if="!loading.tableArahan" type="bar" :data="chartDataArahan" :options="chartOptionsArahan" class="h-[30rem]" />
            <Skeleton v-else width="100%" height="20em"/>
        </div>
    </div>
    <div class="col-12 xl:col-6">
        <div class="card">
            <h5>Ketepatan Pemenuhan Arahan dan Instruksi</h5>
            <Chart v-if="!loading.tablePenyelesaian" type="bar" :data="chartDataPenyelesaian" :options="chartOptionsPenyelesaian" class="h-[30rem]" />
            <Skeleton v-else width="100%" height="20em"/>
        </div>
    </div>
    <div class="col-12 xl:col-6">
        <div class="card">
            <h5>Tema Rapat</h5>
            <Chart v-if="!loading.tableTema" type="bar" :data="chartDataTema" :options="chartOptionsTema" class="h-[30rem]" />
            <Skeleton v-else width="100%" height="20em"/>
        </div>
    </div>
    
    <div class="col-12">
        <div class="card">
            <div class="card-12">
                <h4>
                    Rekapitulasi Pelaksana Arahan Pimpinan
                </h4>
            </div>
            
            <DataTable 
                :value="dataTop5Arahan" 
                :loading="loading.tableArahan"
            >
                <Column field="pelaksana" >
                    <template #header>
                        Personil &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTableArahan.pelaksana===null, 
                                'pi pi-sort-alpha-down-alt':sortTableArahan.pelaksana===true,
                                'pi pi-sort-alpha-up-alt':sortTableArahan.pelaksana===false
                                }" 
                            @click="sortArahan('pelaksana')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column>
                <Column field="total">
                    <template #header>
                        Total Arahan &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTableArahan.total===null, 
                                'pi pi-sort-amount-down':sortTableArahan.total===true,
                                'pi pi-sort-amount-up':sortTableArahan.total===false
                                }" 
                            @click="sortArahan('total')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column>
                <Column field="persentase_selesai">
                    <template #header>
                        Persentase &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTableArahan.persentase_selesai===null, 
                                'pi pi-sort-amount-down':sortTableArahan.persentase_selesai===true,
                                'pi pi-sort-amount-up':sortTableArahan.persentase_selesai===false
                                }" 
                            @click="sortArahan('persentase_selesai')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column>
                <Column field="selesai">
                    <template #header>
                        Selesai &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTableArahan.selesai===null, 
                                'pi pi-sort-amount-down':sortTableArahan.selesai===true,
                                'pi pi-sort-amount-up':sortTableArahan.selesai===false
                                }" 
                            @click="sortArahan('selesai')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column>
                <!-- <Column field="gagal">
                    <template #header>
                        Gagal &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTableArahan.gagal===null, 
                                'pi pi-sort-amount-down':sortTableArahan.gagal===true,
                                'pi pi-sort-amount-up':sortTableArahan.gagal===false
                                }" 
                            @click="sortArahan('gagal')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column> -->
                <Column field="dalam_proses">
                    <template #header>
                        Dalam Proses &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTableArahan.dalam_proses===null, 
                                'pi pi-sort-amount-down':sortTableArahan.dalam_proses===true,
                                'pi pi-sort-amount-up':sortTableArahan.dalam_proses===false
                                }" 
                            @click="sortArahan('dalam_proses')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column>
                <!-- <Column field="tidak_ada_tindak_lanjut">
                    <template #header>
                        Tidak Ditindaklanjuti &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTableArahan.tidak_ada_tindak_lanjut===null, 
                                'pi pi-sort-amount-down':sortTableArahan.tidak_ada_tindak_lanjut===true,
                                'pi pi-sort-amount-up':sortTableArahan.tidak_ada_tindak_lanjut===false
                                }" 
                            @click="sortArahan('tidak_ada_tindak_lanjut')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column>
                <Column field="tanpa_keterangan">
                    <template #header>
                        Tanpa Keterangan &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTableArahan.tanpa_keterangan===null, 
                                'pi pi-sort-amount-down':sortTableArahan.tanpa_keterangan===true,
                                'pi pi-sort-amount-up':sortTableArahan.tanpa_keterangan===false
                                }" 
                            @click="sortArahan('tanpa_keterangan')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column> -->
                <template #empty> Data Top 5 Tidak ditemukan. </template>
                <template #loading> Loading... Please wait. </template>
            </DataTable>
        </div>
    </div>
    <div class="col-12 xl:col-6">
        <div class="card">
            <h5>Ketepatan Pemenuhan Arahan dan Instruksi</h5>
            <DataTable 
                :value="dataTop5Penyelesaian" 
                :loading="loading.tablePenyelesaian"
            >
                <Column field="pelaksana" >
                    <template #header>
                        Personil &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTablePenyelesaian.pelaksana===null, 
                                'pi pi-sort-alpha-down-alt':sortTablePenyelesaian.pelaksana===true,
                                'pi pi-sort-alpha-up-alt':sortTablePenyelesaian.pelaksana===false
                                }" 
                            @click="sortPenyelesaian('pelaksana')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column>
                <Column field="tepat_waktu">
                    <template #header>
                        Tepat Waktu &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTablePenyelesaian.tepat_waktu===null, 
                                'pi pi-sort-amount-down':sortTablePenyelesaian.tepat_waktu===true,
                                'pi pi-sort-amount-up':sortTablePenyelesaian.tepat_waktu===false
                                }" 
                            @click="sortPenyelesaian('tepat_waktu')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column>
                <Column field="persentase_tepat_waktu">
                    <template #header>
                        Persentase Tepat Waktu &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTablePenyelesaian.persentase_tepat_waktu===null, 
                                'pi pi-sort-amount-down':sortTablePenyelesaian.persentase_tepat_waktu===true,
                                'pi pi-sort-amount-up':sortTablePenyelesaian.persentase_tepat_waktu===false
                                }" 
                            @click="sortPenyelesaian('persentase_tepat_waktu')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column>
                <Column field="terlambat">
                    <template #header>
                        Terlambat &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTablePenyelesaian.terlambat===null, 
                                'pi pi-sort-amount-down':sortTablePenyelesaian.terlambat===true,
                                'pi pi-sort-amount-up':sortTablePenyelesaian.terlambat===false
                                }" 
                            @click="sortPenyelesaian('terlambat')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column>
                <!-- <Column field="belum_tl">
                    <template #header>
                        Tidak ada Tindak Lanjut &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTablePenyelesaian.belum_tl===null, 
                                'pi pi-sort-amount-down':sortTablePenyelesaian.belum_tl===true,
                                'pi pi-sort-amount-up':sortTablePenyelesaian.belum_tl===false
                                }" 
                            @click="sortPenyelesaian('belum_tl')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column> -->
                <template #empty> Data Pelaksana Tidak ditemukan. </template>
                <template #loading> Loading... Please wait. </template>
            </DataTable>
        </div>
    </div>
    <div class="col-12 xl:col-6">
        <div class="card">
            <h5>Rekapitulasi Kehadiran Rapat</h5>
            <DataTable 
                :value="dataTop5Kehadiran" 
                :loading="loading.tableKehadiran"
            >
                <Column field="nama" >
                    <template #header>
                        Personil &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTableKehadiran.nama===null, 
                                'pi pi-sort-alpha-down-alt':sortTableKehadiran.nama===true,
                                'pi pi-sort-alpha-up-alt':sortTableKehadiran.nama===false
                                }" 
                            @click="sortKehadiran('nama')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column>
                <Column field="total">
                    <template #header>
                        Total Kehadiran &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTableKehadiran.total===null, 
                                'pi pi-sort-amount-down':sortTableKehadiran.total===true,
                                'pi pi-sort-amount-up':sortTableKehadiran.total===false
                                }" 
                            @click="sortKehadiran('total')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column>
                <Column field="persentase_hadir">
                    <template #header>
                        Persentase Hadir &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTableKehadiran.persentase_hadir===null, 
                                'pi pi-sort-amount-down':sortTableKehadiran.persentase_hadir===true,
                                'pi pi-sort-amount-up':sortTableKehadiran.persentase_hadir===false
                                }" 
                            @click="sortKehadiran('persentase_hadir')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column>
                <Column field="hadir">
                    <template #header>
                        Hadir &nbsp;
                        <i 
                            :class="{
                                'pi pi-sort-alt':sortTableKehadiran.hadir===null, 
                                'pi pi-sort-amount-down':sortTableKehadiran.hadir===true,
                                'pi pi-sort-amount-up':sortTableKehadiran.hadir===false
                                }" 
                            @click="sortKehadiran('hadir')"
                            style="cursor: pointer;">
                        </i>
                    </template>
                </Column>
                <template #empty> Data Kehadiran Tidak ditemukan. </template>
                <template #loading> Loading... Please wait. </template>
            </DataTable>
        </div>
    </div>
    
    
</template>