import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { deleteData, getData, putData } from "../../utils/fetch";
import { formatDateNoTime } from "../../utils/formatDate";
import axios from "axios";

export default function LogbookMahasiswaDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [role, setRole] = useState("");
  const [logbookServer, setLogbookServer] = useState([]);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    id: "",
    feedbackDosen: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      const res = await getData(`/logbook-mahasiswa/${id}`);
      setLogbookServer(res.data.data);
    } catch (error) {
      navigate("/internal-server-error");

      console.log(error);
    }
  };

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("role"));
    setRole(role);
    if (role !== "dospem") {
      navigate("/forbidden");
    }
    fetch();
  }, []);

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

  const handleChangeStatus = async (e, id) => {
    const status = e.target.value;
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah akan mengganti status logbook?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const res = await putData(`/logbook`, {
          id: id,
          status: status,
        });

        if (res?.data) {
          toast.success("Berhasil mengganti status logbook", {
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

        console.error("An error occurred while updating:", error);
      }
    }
  };

  const toggleModal = (id) => {
    if (!modalVisible) {
      setForm({ ...form, id: id });
    } else {
      setForm({ ...form, id: "", feedbackDosen: "" });
    }
    setModalVisible(!modalVisible);
  };

  const handleClickFeedback = async () => {
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah akan memberi feedback?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const res = await putData(`/logbook/feedback`, form);

        if (res?.data) {
          toast.success("Berhasil memberi feedback", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          toggleModal();
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

  const modal = () => {
    return (
      <div
        id="defaultModal"
        tabIndex="-1"
        aria-hidden="true"
        className={`${
          modalVisible ? "" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full`}
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative p-4 bg-white rounded-lg shadow sm:p-5 w-full md:w-1/3 md:h-1/3">
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
              <h3 className="text-lg font-semibold text-gray-9">
                Tambahkan Feedback
              </h3>
              <div className="absolute top-0 right-0 p-4">
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center  dark:hover:text-white"
                  data-modal-toggle="defaultModal"
                  onClick={toggleModal}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
            </div>

            {/* filter nama */}
            <div className="relative">
              <input
                type="text"
                id="feedbackDosen"
                name="feedbackDosen"
                className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                value={form.feedbackDosen}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="mt-10 w-full text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={handleClickFeedback}
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getBackgroundColor = (status) => {
    switch (status) {
      case "Diperiksa":
        return "bg-blue-500";
      case "Disetujui":
        return "bg-green-500";
      case "Ditolak":
        return "bg-red-500";
      default:
        return "bg-gray-500"; // Default color if none matches
    }
  };

  return (
    <>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
          <h1 className="text-2xl text-blue-500 font-bold mb-10">
            Logbook Mahasiswa Bimbingan
          </h1>

          {/* tabel */}
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
                      <td className="px-6 py-4">{data.pemaparanMahasiswa}</td>
                      <td className="px-6 py-4">{data.feedbackDosen}</td>
                      <td
                        onClick={() => downloadFile(data.buktiKegiatan)}
                        className="px-6 py-4 hover:underline cursor-pointer"
                      >
                        {data.buktiKegiatan}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={data.status}
                          onChange={(e) => handleChangeStatus(e, data._id)}
                          id="status"
                          name="status"
                          className={`appearance-none flex items-center gap-3 px-3 py-1 rounded-full text-white border-black ${getBackgroundColor(
                            data.status
                          )}`}
                          required={true}
                        >
                          <option
                            value="Diperiksa"
                            className="bg-white text-black"
                          >
                            Diperiksa
                          </option>
                          <option
                            value="Disetujui"
                            className="bg-white text-black"
                          >
                            Disetujui
                          </option>
                          <option
                            value="Ditolak"
                            className="bg-white text-black"
                          >
                            Ditolak
                          </option>
                        </select>
                      </td>
                      <td className="flex">
                        <div
                          className="font-medium text-blue-400 text-center hover:underline cursor-pointer px-6 py-8 flex items-center gap-5"
                          onClick={() => toggleModal(data._id)}
                        >
                          Feedback
                        </div>
                        <div
                          className="font-medium text-red-600 text-center hover:underline cursor-pointer px-6 py-8 flex items-center gap-5"
                          onClick={() => handleDelete(data._id)}
                        >
                          Delete
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          ) : (
            <p>Tidak ada data</p>
          )}

          {modalVisible && modal()}
        </div>
      </div>
    </>
  );
}
