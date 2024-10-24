<script setup>
import { ref, onMounted  } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/views/stravel/axios_intercept'
import { ROOT_URL } from '../../stravel/root_url';
import Swal from 'sweetalert2'
import { jwtDecode } from "jwt-decode";

const email = ref('');
const password = ref('');
const loading=ref(false)

const router = useRouter()
const route = useRoute()
const token = ref()
onMounted(() => {
    token.value = route.query.token;
    token.value?login_dws(token.value):null
})

const login_dws=(token)=>{
    const url=`${ROOT_URL}/api/login-dws`
    const method='post'
    const data={
        token
    }
    loading.value=true
    axios({url,method,data})
    .then((response)=>{
        console.log(response)
        Swal.fire({
            title: 'Berhasil',
            html: `
                <p class="mb-2 font-weight-medium">
                    sukses login
                </p>
            `,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        }).then(()=>{
            const accessToken=response.data.token
            localStorage.setItem("accessToken", accessToken)
            var userData = jwtDecode(accessToken); 
            var activeRole = userData?.role[0] || null
            localStorage.setItem('userData', JSON.stringify(userData))
            localStorage.setItem("activeRole", activeRole)
            router.push('/')
        })
    })
    .catch((error)=>{
        console.error(error)
        Swal.fire({
            title: 'Gagal',
            html: `
                <p class="mb-2 font-weight-medium">
                    gagal login, email atau password salah
                </p>
            `,
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
        });
    })
    .finally(()=>{
        loading.value=false
    })
}
const login=()=>{
    const url=`${ROOT_URL}/api/login`
    const method='post'
    const data={
        email:email.value,
        password:password.value
    }
    loading.value=true
    axios({url,method,data})
    .then((response)=>{
        Swal.fire({
            title: 'Berhasil',
            html: `
                <p class="mb-2 font-weight-medium">
                    sukses login
                </p>
            `,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        }).then(()=>{
            const accessToken=response.data.authorization.token
            localStorage.setItem("accessToken", accessToken)
            var userData = jwtDecode(accessToken);
            var activeRole = userData?.role[0] || null

            localStorage.setItem('userData', JSON.stringify(userData))
            localStorage.setItem("activeRole", activeRole)
            router.push('/')
        })
    })
    .catch((error)=>{
        console.error(error)
        Swal.fire({
            title: 'Gagal',
            html: `
                <p class="mb-2 font-weight-medium">
                    gagal login, email atau password salah
                </p>
            `,
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
        });
    })
    .finally(()=>{
        loading.value=false
    })
}
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Selamat datang di aplikasi SIMANTAP</div>
                        <!-- <span class="text-600 font-medium">Silahkan login</span> -->
                        <div class="text-900 text-3xl font-medium mb-3">Silahkan login Melalui Aplikasi DWS</div>
                    </div>

                    <!-- <div>
                        <label class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText :disabled="loading" v-model="email" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" />

                        <label class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password :disabled="loading" v-model="password" placeholder="Password" :toggleMask="true" :feedback="false" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password> -->
                        <a href="https://dws.bssn.go.id">
                            <Button :disabled="loading" label="Login" :loading="loading" class="w-full p-3 text-xl"/>
                        </a>
                    <!-- </div> -->
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
