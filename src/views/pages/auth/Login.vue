<script setup>
import { ref,  } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useRouter } from 'vue-router';
import axios from '@/views/stravel/axios_intercept'
import { ROOT_URL } from '../../stravel/root_url';
import Swal from 'sweetalert2'
import { jwtDecode } from "jwt-decode";

const email = ref('');
const password = ref('');


const router = useRouter()

const login=()=>{
    const url=`${ROOT_URL}/api/login`
    const method='post'
    const data={
        email:email.value,
        password:password.value
    }
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
        console.log(error)
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
        // loading.value.loadArahan=false
    })
}
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Selamat datang di aplikasi instraction</div>
                        <span class="text-600 font-medium">Silahkan login</span>
                    </div>

                    <div>
                        <label class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText v-model="email" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" />

                        <label class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password v-model="password" placeholder="Password" :toggleMask="true" :feedback="false" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                        <Button @click="login()" label="Login" class="w-full p-3 text-xl"></Button>
                    </div>
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
