import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getData } from "../../utils/fetch";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";

export default function PendaftaranIndex() {
  const navigate = useNavigate();

  const [daftarMahasiswaServer, setDaftarMahasiswaServer] = useState([]);

  const renderAddButton = () => {
    if (daftarMahasiswaServer.length < 2) {
      return (
        <NavLink
          to={"/pendaftaran/create"}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 my-5 focus:outline-none"
        >
          Tambah
        </NavLink>
      );
    }
    return null;
  };

  const fetch = async () => {
    try {
      const res = await getData(`/daftarmbkm`);
      setDaftarMahasiswaServer(res.data.data);
    } catch (error) {
      navigate("/internal-server-error");
      console.log(error);
    }
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("role")) !== "mahasiswa") {
      navigate("/forbidden");
    }

    fetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
        <h1 className="text-2xl text-blue-500 font-bold mb-10">
          Pengajuan Persetujuan KPS
        </h1>
        <p>
          Mahasiswa dapat melakukan pengajuan sebanyak 2 kali dengan sekali
          pengajuan maksimal 11 mitra
        </p>
        {renderAddButton()}

        {daftarMahasiswaServer.map((data, index) => (
          <Link key={index} to={`/pendaftaran/${data._id}`}>
            <div className="flex justify-between my-5 min-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                {index === 0 ? "Pengajuan pertama" : "Pengajuan kedua"}
              </h5>
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                Tanggal Pengajuan : {formatDate(data.createdAt)}
              </h5>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
