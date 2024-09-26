// const undangan=`Hal : *Paparan Tindak Lanjut Penyampaian Rencana Kerja Pemerintah (RKP) Tahun 2025* 

// Yth.
// 1. Dist C;
// 2. Kepala UPT;
// 3. Jubir;
// 4. Asops Pemilu;
// 5. Asops Perlindungan Data;
// 6. Tim Pokja Identitas Digital
// 7. Tim teknis S1 & Tim DSP.

// Dari : Bagian Dukungan Strategis & Tata Usaha Pimpinan

// Sehubungan kegiatan Paparan Tindak Lanjut Penyampaian Rencana Kerja Pemerintah (RKP) Tahun 2025 kepada Bapak KA, mohon perkenan kehadiran secara *Hybrid* yang akan dilaksanakan pada : 

// hari, tanggal : Senin, 29 April 2024
// waktu : 15.00 WIB s.d Selesai
// Pakaian : PDH Senin
// Pemapar : *S1* 

// Pengaturan Kehadiran
//  *Luring* 
// WaKa, Dist B, S1, S4, D31, KaBS, Tim Teknis S1, Tim DSP
// Tempat : Ruang Rapat OpsKa, BSSN Sawangan 

//  *Daring* 
// Pejabat sesuai Undangan diluar peserta terdaftar hadir Luring. 

// Link Daring :
// https://zoom.us/j/91003828531?pwd=S2tpMkNESlE5S1JKSE4vSGxtL1RZZz09

//  *Mohon kesediaannya setiap peserta rapat menyiapkan bahan terkait RKP dan RKT tahun 2025* . Demikian disampaikan, atas perhatiannya diucapkan terima kasih.  

// Hormat kami.`

// export default undangan;

const formatDate = (value) => {
    try{
        if (value) {
            if(value=='null'){
                return 'Belum ada tanggal'
            }
            var tanggal=JSON.parse(value)
            var date = new Date(tanggal[0]);
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                timeZone: 'Asia/Jakarta',
                hour12: false,
            };

            var formattedDate = date.toLocaleDateString('id-ID', options);

            const tanggalMulai= formattedDate.replace(/(\d+:\d+)/, '$1 WIB');

            var formattedDate = date.toLocaleDateString('id-ID', options);

            const tanggalSelesai= formattedDate.replace(/(\d+:\d+)/, '$1 WIB');

            return `${tanggalMulai} s.d. ${tanggalSelesai}`   
            
        }
        else{
            return 'Belum ada tanggal'
        }
    }
    catch(error){
        console.log(error)
        return 'Format Tanggal Salah'
    }
};

const formattingNama=(undangan)=>{
    return undangan.map((orang, index) => `${index + 1}. ${orang.nama};`).join('\n')
}

export const undangan = (
    dataRapat, undangan
) => {
return `Hal : ${dataRapat.nama}

Yth.
${formattingNama(undangan)}

Dari : Bagian Dukungan Strategis & Tata Usaha Pimpinan

Sehubungan dengan kegiatan ${dataRapat.nama}, dimohon kehadirannya secara hybrid pada :

Hari, Tanggal : ${formatDate(dataRapat.tanggal)}
Pemapar: ${dataRapat.pemapar} 
Tempat : ${dataRapat.lokasi}

Link Rapat Daring
Join Zoom Meeting
${dataRapat.tautan}

Seluruh undangan Wajib melakukan konfirmasi kehadiran maksimal 3 (tiga) jam sebelum rapat dimulai melalui tautan RSVP: ${dataRapat.link_rsvp}

Demikian disampaikan, atas perhatiannya diucapkan terima kasih.

Hormat kami`;
};
