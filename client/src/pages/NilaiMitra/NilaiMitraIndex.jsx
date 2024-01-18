import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getData } from "../../utils/fetch";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";

export default function NilaiMitraIndex() {
  const navigate = useNavigate();

  const [nilaiMitraServer, setNilaiMitraServer] = useState([]);
  const [dospemServer, setDospemServer] = useState("");
  const [role, setRole] = useState("");

  const renderAddButton = () => {
    return (
      <NavLink
        to={"/nilai-mitra/create"}
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 my-5 focus:outline-none"
      >
        Tambah
      </NavLink>
    );
  };

  const fetch = async () => {
    try {
      const res = await getData(`/nilai-mitra`);
      setNilaiMitraServer(res.data.data);
    } catch (error) {
      navigate("/internal-server-error");

      console.log(error);
    }
  };

  const fetchDospem = async () => {
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
    setRole(role);

    if (role !== "mahasiswa") {
      navigate("/forbidden");
    }

    if (role === "mahasiswa") {
      fetchDospem();
    }
  }, []);

  useEffect(() => {
    if (dospemServer) {
      fetch();
    }
  }, [dospemServer]);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
        <h1 className="text-2xl text-blue-500 font-bold mb-10">
          Pengumpulan Nilai Mitra MBKM
        </h1>

        {dospemServer !== undefined ? (
          <>
            <p>
              Mahasiswa dapat mengumpulkan nilai dari mitra dalam bentuk gambar
              atau dokumen.
            </p>
            {renderAddButton()}

            {nilaiMitraServer.map((data, index) => (
              <Link key={index} to={`/nilai-mitra/${data._id}`}>
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
                      data?.status === "Diperiksa"
                        ? "bg-blue-500"
                        : data?.status === "Diterima"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {data.status}
                  </span>
                </div>
              </Link>
            ))}
          </>
        ) : (
          "Silakan melakukan Pendaftaran dan Pendataan terlebih dahulu"
        )}
      </div>
    </div>
  );
}
