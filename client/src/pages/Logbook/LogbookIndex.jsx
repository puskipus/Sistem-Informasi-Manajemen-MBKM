import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { deleteData, getData } from "../../utils/fetch";
import { formatDateNoTime } from "../../utils/formatDate";
import axios from "axios";

export default function LogbookIndex() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [logbookServer, setLogbookServer] = useState([]);
  const [error, setError] = useState("");
  const [dospemServer, setDospemServer] = useState("");

  const handleDelete = async (data) => {
    // Display a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah menghapus logbook ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    // Check the result of the confirmation dialog
    if (result.isConfirmed) {
      try {
        const res = await deleteData(`/logbook/${data}`);

        if (res?.data) {
          toast.success("Berhasil Hapus logbook", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          fetch();
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

  const fetch = async () => {
    try {
      const res = await getData(`/logbook`);
      setLogbookServer(res.data.data);
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

  const renderAddButton = () => {
    if (role === "mahasiswa") {
      return (
        <NavLink
          to={"/logbook/create"}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-10 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Tambah
        </NavLink>
      );
    }
    return null;
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

  return (
    <>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
          <h1 className="text-2xl text-blue-500 font-bold mb-10">
            Logbook Kegiatan MBKM
          </h1>

          {/* tabel */}
          {dospemServer !== undefined ? (
            <>
              {renderAddButton()}
              {logbookServer.length > 0 ? (
                <div className="my-10 border-2 relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="border-b-2 text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          No
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Tanggal
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Jam Mulai
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Jam Selesai
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Pemaparan Mahasiswa
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Feedback Dosen
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Bukti Kegiatan
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    {logbookServer.map((data, index) => (
                      <tbody key={index}>
                        <tr className="bg-white border-b font-medium hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDateNoTime(data.tanggal)}
                          </td>
                          <td className="px-6 py-4">{data.jamMulaiKegiatan}</td>
                          <td className="px-6 py-4">{data.jamAkhirKegiatan}</td>
                          <td className="px-6 py-4">
                            {data.pemaparanMahasiswa}
                          </td>
                          <td className="px-6 py-4">{data.feedbackDosen}</td>
                          <td
                            onClick={() => downloadFile(data.buktiKegiatan)}
                            className="px-6 py-4 hover:underline cursor-pointer"
                          >
                            {data.buktiKegiatan}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-white rounded-full inline-block ${
                                data.status === "Diperiksa"
                                  ? "bg-blue-500"
                                  : data.status === "Disetujui"
                                  ? "bg-green-500"
                                  : data.status === "Ditolak"
                                  ? "bg-red-500"
                                  : null
                              }`}
                            >
                              {data.status}
                            </span>
                          </td>
                          <td
                            className="font-medium text-red-600 hover:underline cursor-pointer px-6 py-6 flex items-center gap-5"
                            onClick={() => handleDelete(data._id)}
                          >
                            Delete
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
              ) : (
                <p>Logbook belum ada</p>
              )}
            </>
          ) : (
            "Silakan melakukan Pendaftaran dan Pendataan terlebih dahulu"
          )}
        </div>
      </div>
    </>
  );
}
