import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getData } from "../../utils/fetch";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";

export default function PendataanIndex() {
  const navigate = useNavigate();

  const [pendataanMahasiswaServer, setpendataanMahasiswaServer] = useState([]);

  const renderAddButton = () => {
    return (
      <NavLink
        to={"/pendataan/create"}
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 my-5 focus:outline-none"
      >
        Tambah
      </NavLink>
    );
  };

  const fetch = async () => {
    try {
      const res = await getData(`/daftarulang`);
      setpendataanMahasiswaServer(res.data.data);
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
          Pendataan MBKM
        </h1>
        <p>
          Mahasiswa dapat melakukan pendataan apabila telah diterima pada salah
          satu mitra dan hanya berlaku untuk 1 mitra.
        </p>
        {renderAddButton()}

        {pendataanMahasiswaServer.map((data, index) => (
          <Link key={index} to={`/pendataan/${data._id}`}>
            <div className="text-sm md:text-xl gap-5 flex justify-between items-center my-5 min-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
              <h5 className="mb-2 font-bold tracking-tight text-gray-900">
                Nama mitra: {data.namaMitra}
              </h5>
              <h5 className="mb-2 font-bold tracking-tight text-gray-900">
                Posisi: {data.posisi}
              </h5>
              <h5 className="mb-2 font-bold tracking-tight text-gray-900">
                Tanggal Pengajuan : {formatDate(data.createdAt)}
              </h5>
              <span
                className={`px-3 py-1 text-center text-white rounded-full inline-block ${
                  data?.status?.nama === "Diproses"
                    ? "bg-blue-500"
                    : data?.status?.nama === "Diterima 20 SKS"
                    ? "bg-green-500"
                    : data?.status?.nama === "Diterima kurang 20 SKS"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {data.status?.nama}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
