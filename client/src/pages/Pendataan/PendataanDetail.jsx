import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getData, putData } from "../../utils/fetch";
import Swal from "sweetalert2";
import { formatDate } from "../../utils/formatDate";
import axios from "axios";

export default function PendataanDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [role, setRole] = useState("");

  const [daftarUlangServer, setDaftarUlangServer] = useState({});
  const [statusServer, setStatusServer] = useState([]);

  const [form, setForm] = useState({
    status: "",
    catatan: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetch = async () => {
    try {
      const res = await getData(`/daftarulang/${id}`);
      setDaftarUlangServer(res.data.data);
    } catch (error) {
      navigate("/internal-server-error");
      console.log(error);
    }
  };

  const fetchStatus = async () => {
    try {
      const status = await getData(`/status`);
      setStatusServer(status.data.data);
    } catch (error) {
      navigate("/internal-server-error");
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Display a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah akan update pendataan MBKM?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    // // Check the result of the confirmation dialog
    if (result.isConfirmed) {
      try {
        const res = await putData(`/daftarulang/${id}`, form);

        if (res?.data) {
          toast.success("Berhasil update pendataan MBKM", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate("/pendataan/unitmbkm");
        } else {
          console.log(res);
          setError(res?.response?.data?.msg || "Terjadi kesalahan pada server");
        }
      } catch (error) {
        navigate("/internal-server-error");
        console.error("An error occurred:", error);
        setError("Terjadi kesalahan pada server");
      }
    }
  };

  const downloadFile = async () => {
    const token = localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : {};
    try {
      const response = await axios.get(
        `http://localhost:9000/api/v1/penugasan/download/${daftarUlangServer.silabus}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType = response.headers["content-type"];
      const extension = contentType.split("/")[1]; // Extract file extension from Content-Type

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `file.${extension}`); // Set file name with dynamic extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const formUnitMbkm = () => {
    if (role === "unitmbkm") {
      return (
        <form
          onSubmit={handleSubmit}
          className="h-fit block max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
        >
          <div>
            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Ganti Status persetujuan :
            </label>
            <select
              onChange={handleChange}
              id="status"
              name="status"
              className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              required={true}
            >
              <option value="">Pilih status pendataan baru</option>
              {statusServer.map((status, index) => (
                <option key={index} value={status._id}>
                  {status.nama}
                </option>
              ))}
            </select>

            <label
              htmlFor="catatan"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Catatan
            </label>
            <input
              type="text"
              name="catatan"
              id="catatan"
              className="mb-5 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
              value={form?.updateStatus?.catatan}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Update Pendataan
          </button>
        </form>
      );
    }
  };

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("role"));
    if (role !== "mahasiswa" && role !== "unitmbkm") {
      navigate("/forbidden");
    }
    fetch();
    setRole(role);
    if (role === "unitmbkm") {
      fetchStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
        <h1 className="text-2xl text-blue-500 font-bold mb-10">
          Detail Pendataan MBKM
        </h1>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-10">
          <div className="block max-w-md h-fit p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
            <h1 className="font-bold text-xl mb-5">Data Mahasiswa</h1>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Nama : {daftarUlangServer.idMahasiswa?.nama}
            </p>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              NIM : {daftarUlangServer.idMahasiswa?.nim}
            </p>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Semester : {daftarUlangServer.idMahasiswa?.semester}
            </p>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Program Studi : {daftarUlangServer.idMahasiswa?.prodi?.nama}
            </p>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Email : {daftarUlangServer.idMahasiswa?.email}
            </p>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              No Handphone : {daftarUlangServer.idMahasiswa?.noHP}
            </p>
          </div>

          <div className="block max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
            <h1 className="font-bold text-xl mb-5">Data Pendataan MBKM</h1>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Jenis Kegiatan : {daftarUlangServer.jenisKegiatan?.nama}
            </p>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Jenis Pelaksanaan : {daftarUlangServer.jenisPelaksanaan?.nama}
            </p>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Nama Mitra : {daftarUlangServer.namaMitra}
            </p>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Posisi : {daftarUlangServer.posisi}
            </p>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Mulai Kegiatan : {formatDate(daftarUlangServer.mulaiKegiatan)}
            </p>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Akhir Kegiatan : {formatDate(daftarUlangServer.akhirKegiatan)}
            </p>
            {daftarUlangServer.silabus && (
              <div className="mb-2">
                <p className="text-base">Silabus :</p>
                <p
                  onClick={downloadFile}
                  className="font-normal text-gray-400 hover:underline cursor-pointer"
                >
                  {daftarUlangServer.silabus}
                </p>
              </div>
            )}
            <span
              className={`px-3 py-2 text-white rounded-full inline-block ${
                daftarUlangServer?.status?.nama === "Diproses"
                  ? "bg-blue-500"
                  : daftarUlangServer?.status?.nama === "Diterima 20 SKS"
                  ? "bg-green-500"
                  : daftarUlangServer?.status?.nama === "Diterima kurang 20 SKS"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {daftarUlangServer.status?.nama}
            </span>

            {/* catatan */}
            {daftarUlangServer.catatan && (
              <p className="my-2 text-gray-500 dark:text-gray-400">
                Catatan : {daftarUlangServer?.catatan}
              </p>
            )}
          </div>

          {formUnitMbkm()}
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
