import { ROOT_URL } from "./root_url"

const BASE_URL=`${ROOT_URL}`
export const URL_RAPAT = `${BASE_URL}/api/rapat`
export const URL_RAPAT_BY_ID = (id) => `${URL_RAPAT}/${id}`
export const URL_UNDANGAN = (id) => `${URL_RAPAT}/${id}/peserta`
export const URL_UNDANGAN_BY_ID=(idRapat,idUndangan)=>`${URL_UNDANGAN(idRapat)}/${idUndangan}`
export const URL_KELENGKAPAN = (id) => `${URL_RAPAT}/${id}/kelengkapan_post`
export const URL_KELENGKAPAN_BY_ID = (idRapat,idKelengkapan) => `${URL_KELENGKAPAN(idRapat)}/${idKelengkapan}`
export const URL_ARAHAN = (id) => `${URL_RAPAT}/${id}/arahan_pimpinan`
export const URL_ARAHAN_BY_ID = (idRapat,idArahan) => `${URL_ARAHAN(idRapat)}/${idArahan}`
export const URL_GET_ALL_KARYAWAN=`http://localhost:5173/demo/data/karyawan.json`