import { ROOT_URL } from "./root_url"

const BASE_URL=`${ROOT_URL}`
export const URL_RAPAT = `${BASE_URL}/api/rapat`
export const URL_RAPAT_BY_ID = (id) => `${URL_RAPAT}/${id}`
export const URL_UNDANGAN = (id) => `${URL_RAPAT}/${id}/peserta`
export const URL_UNDANGAN_BY_ID=(idRapat,idUndangan)=>`${URL_UNDANGAN(idRapat)}/${idUndangan}`
export const URL_KELENGKAPAN = (id) => `${URL_RAPAT}/${id}/kelengkapan_post`
export const URL_KELENGKAPAN_BY_ID = (idRapat,idKelengkapan) => `${URL_KELENGKAPAN(idRapat)}/${idKelengkapan}`
export const URL_ALL_ARAHAN = `${BASE_URL}/api/arahan_pimpinan`
export const URL_COUNT_ARAHAN_BELUM_TL = `${BASE_URL}/api/total_arahan_belum_tl`
export const URL_ARAHAN = (id) => `${URL_RAPAT}/${id}/arahan_pimpinan`
export const URL_ARAHAN_BY_ID = (idRapat,idArahan) => `${URL_ARAHAN(idRapat)}/${idArahan}`
export const URL_TEMA= `${BASE_URL}/api/tema`
export const URL_TOP5_TEMA= `${BASE_URL}/api/top5_tema`
export const URL_GET_ALL_KARYAWAN=`http://localhost:5173/demo/data/karyawan.json`
export const URL_TOP5_ARAHAN=(sort_by,order)=>`${BASE_URL}/api/top5_arahan?sort_by=${sort_by}&order=${order}`
export const URL_TOP5_KEHADIRAN=(sort_by,order)=>`${BASE_URL}/api/top5_kehadiran?sort_by=${sort_by}&order=${order}`
export const URL_TOP5_PENYELESAIAN=(sort_by,order)=>`${BASE_URL}/api/top5_penyelesaian?sort_by=${sort_by}&order=${order}`
export const URL_KEHADIRAN_PERSONEL=`${BASE_URL}/api/statistik_kehadiran`
export const URL_ARAHAN_PERSONEL=`${BASE_URL}/api/statistik_arahan`
