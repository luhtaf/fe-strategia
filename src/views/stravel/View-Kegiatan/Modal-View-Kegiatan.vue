<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth'
import timeGridPlugin from '@fullcalendar/timegrid'


import { ref, watch, onBeforeMount } from 'vue';
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

const handleDateClick=(arg)=> {
    alert('date click! ' + arg.dateStr)
}

const calendarOptions= ref()

const setCalendarOption=()=>{
    calendarOptions.value={
        
        plugins: [ dayGridPlugin, interactionPlugin, multiMonthPlugin, timeGridPlugin ],
        headerToolbar: {
            start: 'dayGridMonth,timeGridWeek,timeGridDay,multiMonthYear',
            center: 'title',
            end: 'prevYear,prev,next,nextYear'
        },
        initialView: 'multiMonthYear',
        dateClick: handleDateClick,
        events: [
            { title: 'event 1', date: '2024-08-01' },
            { title: 'event 2', date: '2024-08-02' },
            { title: 'NCE #7 Sentul', start: '2024-08-26', end:'2024-08-29' }
        ]
    }
}

onBeforeMount(()=>{
    setCalendarOption()
})

const formattedLinkRsvp= (linkRsvp)=> {
      if (!linkRsvp.startsWith('http://') && !linkRsvp.startsWith('https://')) {
        return 'https://' + linkRsvp;
      }
      return linkRsvp;
    }

</script>
<template>
    <Dialog v-model:visible="visible" class="z-5" maximizable modal :style="{ width: '85rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <template #header>
            <h2>
                Detail Kegiatan - {{ currentData.nama }}
            </h2>
        </template>
        <div class="grid card p-fluid mt-2">
            <div class="col-12 lg:col-6">
                <div class="grid">
                    <div class="col-12 lg:col-4">
                        <h5>
                            Kategori
                        </h5>
                        <!-- <InputGroup>
                            <p class="line-height-3 m-0" style="word-wrap: break-word">
                                {{ currentData.kategori }}
                            </p>
                        </InputGroup>   -->
                    </div>
                    <div class="col-12 lg:col-8">
                        <p class="line-height-3 m-0" style="word-wrap: break-word">
                            {{ currentData.kategori }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="col-12 lg:col-6">
                <div class="grid">
                    <div class="col-12 lg:col-4">
                        <h5>
                            Sifat
                        </h5>
                        
                    </div>
                    <div class="col-12 lg:col-8">
                        <p class="line-height-3 m-0" style="word-wrap: break-word">
                            {{ currentData.urgensi }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="col-12 lg:col-6">
                <div class="grid">
                    <div class="col-12 lg:col-4">
                        <h5>
                            Tema
                        </h5> 
                    </div>
                    <div class="col-12 lg:col-8">
                        <p class="line-height-3 m-0" style="word-wrap: break-word">
                            {{ currentData.tema }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="col-12 lg:col-6">
                <div class="grid">
                    <div class="col-12 lg:col-4">
                        <h5>
                            Lokasi
                        </h5>      
                    </div>
                    <div class="col-12 lg:col-8">
                        <p class="line-height-3 m-0" style="word-wrap: break-word">
                            {{ currentData.lokasi }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="col-12 lg:col-6">
                <div class="grid">
                    <div class="col-12 lg:col-4">
                        <h5>
                            Metode
                        </h5>      
                    </div>
                    <div class="col-12 lg:col-8">
                        <p class="line-height-3 m-0" style="word-wrap: break-word">
                            {{ currentData.metode }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="col-12 lg:col-6">
                <div class="grid">
                    <div class="col-12 lg:col-4">
                        <h5>
                            Penyelenggara
                        </h5>      
                    </div>
                    <div class="col-12 lg:col-8">
                        <p class="line-height-3 m-0" style="word-wrap: break-word">
                            {{ currentData.penyelenggara }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="col-12 lg:col-6">
                <div class="grid">
                    <div class="col-12 lg:col-4">
                        <h5>
                            Link RSVP
                        </h5>      
                    </div>
                    <div class="col-12 lg:col-8">
                        <a :href="formattedLinkRsvp(currentData.link_rsvp)" class="line-height-3 m-0" style="word-wrap: break-word">
                            {{ currentData.link_rsvp }}
                        </a>
                    </div>
                </div>
            </div>

            <div class="col-12 lg:col-6">
                <div class="grid">
                    <div class="col-12 lg:col-4">
                        <h5>
                            Pimpinan Rapat
                        </h5>      
                    </div>
                    <div class="col-12 lg:col-8">
                        <p class="line-height-3 m-0" style="word-wrap: break-word">
                            {{ currentData.pimpinan }}
                        </p>
                    </div>
                </div>
            </div>


            <div class="col-12 lg:col-6">
                <div class="grid">
                    <div class="col-12 lg:col-4">
                        <h5>
                            Jenis Kegiatan
                        </h5>      
                    </div>
                    <div class="col-12 lg:col-8">
                        <p class="line-height-3 m-0" style="word-wrap: break-word">
                            {{ currentData.jenis }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="col-12 lg:col-6">
                <div class="grid">
                    <div class="col-12 lg:col-4">
                        <h5>
                            Pemapar
                        </h5>      
                    </div>
                    <div class="col-12 lg:col-8">
                        <p class="line-height-3 m-0" style="word-wrap: break-word">
                            {{ currentData.pemapar }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="col-12 lg:col-6">
                <div class="grid">
                    <div class="col-12 lg:col-4">
                        <h5>
                            Tautan
                        </h5>      
                    </div>
                    <div class="col-12 lg:col-8">
                        <a :href="formattedLinkRsvp(currentData.tautan)" class="line-height-3 m-0" style="word-wrap: break-word">
                            {{ currentData.tautan }}
                        </a>
                    </div>
                </div>
            </div>

            <div class="card col-12">
                <FullCalendar :options="calendarOptions" />        
            </div>

            
        </div>
        
    </Dialog>
</template>
