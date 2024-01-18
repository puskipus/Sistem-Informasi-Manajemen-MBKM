import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getData } from "../../utils/fetch";

export default function DospemIndex() {
  const navigate = useNavigate();

  const [dospemServer, setDospemServer] = useState("");

  const fetch = async () => {
    try {
      const res = await getData(`/dospem-mahasiswa`);
      setDospemServer(res.data.data.dospem);
    } catch (error) {
      navigate("/internal-server-error");
      console.log(error);
    }
  };

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("role"));
    if (role !== "mahasiswa") {
      navigate("/forbidden");
    }
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
        <h1 className="text-2xl text-blue-500 font-bold mb-10">
          Data Dosen Pembimbing
        </h1>

        {dospemServer ? (
          <div className="mb-5">
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Nama : {dospemServer?.nama}
            </p>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              NIP : {dospemServer?.nip}
            </p>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Program Studi : {dospemServer?.prodi?.nama}
            </p>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Email : {dospemServer?.email}
            </p>
          </div>
        ) : (
          "Silakan melakukan Pendaftaran dan Pendataan terlebih dahulu"
        )}
      </div>
    </div>
  );
}
