import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getData, putData } from "../../utils/fetch";
import Swal from "sweetalert2";
import axios from "axios";

export default function NilaiMitraDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [role, setRole] = useState("");

  const [nilaiMitraServer, setnilaiMitraServer] = useState({});

  const [form, setForm] = useState({
    status: nilaiMitraServer.status,
    catatan: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetch = async () => {
    try {
      const res = await getData(`/nilai-mitra/${id}`);
      setnilaiMitraServer(res.data.data);
      setForm({ ...form, status: res.data.data.status });
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
      text: "Apakah akan update status Nilai Mitra MBKM?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    // // Check the result of the confirmation dialog
    if (result.isConfirmed) {
      try {
        const res = await putData(`/nilai-mitra/${id}`, form);

        if (res?.data) {
          toast.success("Berhasil update Nilai Mitra MBKM", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate("/nilai-mitra/admin");
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

  const downloadFile = async (data) => {
    const token = localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : {};
    try {
      const response = await axios.get(
        `http://localhost:9000/api/v1/penugasan/download/${data}`,
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
          className="h-fit block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
        >
          <div>
            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Ganti Status persetujuan :
            </label>
            <select
              value={form.status}
              onChange={handleChange}
              id="status"
              name="status"
              className={`mb-2 flex items-center gap-3 px-3 py-1 rounded-full `}
              required={true}
            >
              <option value="Diperiksa">Diperiksa</option>
              <option value="Diterima">Diterima</option>
              <option value="Ditolak">Ditolak</option>
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
            Update Status
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
        <h1 className="text-2xl text-blue-500 font-bold mb-10">
          Detail Nilai Mitra MBKM
        </h1>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-10">
          <div className="block max-w-md h-fit p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
            <h1 className="font-bold text-xl mb-5">Data Mahasiswa</h1>
            <p className="mb-2 text-gray-500 ">
              Nama : {nilaiMitraServer.idMahasiswa?.nama}
            </p>
            <p className="mb-2 text-gray-500 ">
              NIM : {nilaiMitraServer.idMahasiswa?.nim}
            </p>
            <p className="mb-2 text-gray-500 ">
              Semester : {nilaiMitraServer.idMahasiswa?.semester}
            </p>
            <p className="mb-2 text-gray-500 ">
              Program Studi : {nilaiMitraServer.idMahasiswa?.prodi?.nama}
            </p>
            <p className="mb-2 text-gray-500 ">
              Email : {nilaiMitraServer.idMahasiswa?.email}
            </p>
            <p className="mb-2 text-gray-500 ">
              No Handphone : {nilaiMitraServer.idMahasiswa?.noHP}
            </p>
          </div>

          <div className="block max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
            <h1 className="font-bold text-xl mb-5">Data Nilai Mitra MBKM</h1>
            <p className="mb-2 text-gray-500 ">
              Nama Mitra : {nilaiMitraServer.namaMitra}
            </p>
            <p className="mb-2 text-gray-500 ">
              Posisi : {nilaiMitraServer.posisi}
            </p>
            <div className="mb-2">
              <p className="text-gray-500">Bukti Nilai :</p>
              <p
                onClick={() => downloadFile(nilaiMitraServer.buktiNilai)}
                className="font-normal text-gray-700 hover:underline cursor-pointer"
              >
                {nilaiMitraServer.buktiNilai}
              </p>
            </div>
            <span
              className={`mb-2 px-3 py-1 text-white rounded-full inline-block ${
                nilaiMitraServer?.status === "Diperiksa"
                  ? "bg-blue-500"
                  : nilaiMitraServer?.status === "Diterima"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {nilaiMitraServer.status}
            </span>

            {/* catatan */}
            {nilaiMitraServer.catatan && (
              <p className="mb-2 text-gray-500 ">
                Catatan : {nilaiMitraServer?.catatan}
              </p>
            )}
          </div>

          {formUnitMbkm()}
        </div>
      </div>
    </div>
  );
}
