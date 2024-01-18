import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getData } from "../../utils/fetch";
import { formatDateNoTime } from "../../utils/formatDate";

export default function MahasiswaBimbinganIndex() {
  const navigate = useNavigate();

  const [dospemServer, setDospemServer] = useState("");

  const fetch = async () => {
    try {
      const res = await getData(`/mahasiswa-bimbingan`);
      setDospemServer(res.data.data);
    } catch (error) {
      navigate("/internal-server-error");

      console.log(error);
    }
  };

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("role"));
    if (role !== "dospem") {
      navigate("/forbidden");
    }
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
        <h1 className="text-2xl text-blue-500 font-bold mb-10">
          Data Mahasiswa Bimbingan
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {dospemServer && dospemServer.length > 0
            ? dospemServer.map((data, index) => (
                <div
                  key={index}
                  className="my-5 min-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
                >
                  <div>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      Nama : {data?.idMahasiswa?.nama}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      NIM : {data?.idMahasiswa?.nim}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      Semester : {data?.idMahasiswa?.semester}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      Program Studi : {data?.idMahasiswa?.prodi?.nama}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      Email : {data?.idMahasiswa?.email}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      No. Handphone : {data?.idMahasiswa?.noHP}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      Nama Mitra : {data?.namaMitra}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      Posisi : {data?.posisi}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      Jenis Kegiatan : {data?.jenisKegiatan?.nama}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      Jenis Pelaksanaan : {data?.jenisPelaksanaan?.nama}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      Mulai Kegiatan : {formatDateNoTime(data?.mulaiKegiatan)}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      Akhir Kegiatan : {formatDateNoTime(data?.akhirKegiatan)}
                    </p>
                  </div>

                  <Link to={`/logbook-mahasiswa/${data.idMahasiswa._id}`}>
                    <button
                      type="button"
                      className="mt-5 text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Lihat Logbook
                    </button>
                  </Link>
                </div>
              ))
            : "Belum ada mahasiswa yang di bimbing"}
        </div>
      </div>
    </div>
  );
}
