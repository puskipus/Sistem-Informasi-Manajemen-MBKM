import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getData, putData } from "../../utils/fetch";
import Swal from "sweetalert2";

export default function PendaftaranDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [role, setRole] = useState("");

  const [isOpen, setIsOpen] = useState({});

  const toggleAccordion = (index) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const [detailDaftarServer, setDetailDaftarServer] = useState([]);
  const [umumDaftarServer, setUmumDaftarServer] = useState([]);
  const [statusServer, setStatusServer] = useState([]);

  const [form, setForm] = useState({
    updateStatus: Array.from({ length: 11 }, () => ({
      id: "",
      status: "",
      catatan: "",
    })),
  });

  const [error, setError] = useState("");

  const handleChange = (e, i) => {
    let _temp = [...form.updateStatus];

    _temp[i][e.target.name] = e.target.value;

    setForm({ ...form, updateStatus: _temp });
  };

  const handleChangeStatus = (e, i, data) => {
    let _temp = [...form.updateStatus];

    _temp[i][e.target.name] = e.target.value;
    _temp[i]["id"] = data;

    setForm({ ...form, updateStatus: _temp });
  };

  const fetch = async () => {
    try {
      const res = await getData(`/daftarmbkm/${id}`);
      setDetailDaftarServer(res.data.data.mitra);
      setUmumDaftarServer(res.data.data);
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

    const slicedUpdateStatus = form.updateStatus.slice(
      0,
      detailDaftarServer.length
    );
    const updatedForm = { ...form, updateStatus: slicedUpdateStatus };
    const isStatusValid = updatedForm.updateStatus.every(
      (item) => item.status !== "" && item.status !== null
    );

    if (!isStatusValid) {
      toast.error("Status harus diisi pada setiap mitra", {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    console.log(updatedForm);
    // Display a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah akan update persetujuan MBKM?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    // // Check the result of the confirmation dialog
    if (result.isConfirmed) {
      try {
        const res = await putData(`/daftarmbkm/${id}`, updatedForm);

        if (res?.data) {
          toast.success("Berhasil update persetujuan MBKM", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate("/persetujuan");
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

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("role"));
    if (role !== "mahasiswa" && role !== "kaprodi") {
      navigate("/forbidden");
    }
    fetch();
    setRole(role);
    if (role === "kaprodi") {
      fetchStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
        <h1 className="text-2xl text-blue-500 font-bold mb-10">
          Detail Daftar MBKM
        </h1>

        <div className="mb-5">
          <div className="block max-w-md h-fit p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
            <h1 className="font-bold text-xl mb-5">Data Mahasiswa</h1>
            <p className="mb-2 text-gray-500 ">
              Nama : {umumDaftarServer.idMahasiswa?.nama}
            </p>
            <p className="mb-2 text-gray-500 ">
              NIM : {umumDaftarServer.idMahasiswa?.nim}
            </p>
            <p className="mb-2 text-gray-500 ">
              Semester : {umumDaftarServer.idMahasiswa?.semester}
            </p>
            <p className="mb-2 text-gray-500 ">
              Program Studi : {umumDaftarServer.idMahasiswa?.prodi?.nama}
            </p>
            <p className="mb-2 text-gray-500 ">
              Email : {umumDaftarServer.idMahasiswa?.email}
            </p>
            <p className="mb-2 text-gray-500 ">
              No Handphone : {umumDaftarServer.idMahasiswa?.noHP}
            </p>
            <p className="mb-2 text-gray-500 ">
              IPK Terakhir : {umumDaftarServer.ipk}
            </p>
            <p className="mb-2 text-gray-500 ">
              SKS Lulus : {umumDaftarServer.sksLulus}
            </p>
            {umumDaftarServer.matkulWajib && (
              <p className="mb-2 text-gray-500 ">
                Mata kuliah wajib : {umumDaftarServer.matkulWajib}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {detailDaftarServer.map((data, index) => (
            <div
              key={index}
              id={`accordion-color-${index}`}
              data-accordion="collapse"
              data-active-classes="bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-white"
            >
              <h2 id={`accordion-color-heading-${index}`}>
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 dark:border-gray-700  hover:bg-blue-100 dark:hover:bg-gray-800 gap-3"
                  data-accordion-target={`#accordion-color-body-${index}`}
                  aria-expanded={isOpen[index]}
                  aria-controls={`accordion-color-body-${index}`}
                  onClick={() => toggleAccordion(index)}
                >
                  <span>Mitra {index + 1}</span>
                  <svg
                    data-accordion-icon
                    className={`w-3 h-3 rotate-${
                      isOpen[index] ? "0" : "180"
                    } shrink-0`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              <div
                id={`accordion-color-body-${index}`}
                className={`${isOpen[index] ? "" : "hidden"}`}
                aria-labelledby={`accordion-color-heading-${index}`}
              >
                <div className="flex flex-col lg:flex-row justify-around gap-4 sm:gap-10 p-5 border border-b-0 border-gray-200">
                  <div className="block max-w-xl h-fit p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                    <p className="mb-2 text-gray-500 ">
                      Jenis Kegiatan : {data.jenisKegiatan.nama}
                    </p>
                    <p className="mb-2 text-gray-500 ">
                      Nama Mitra : {data.namaMitra}
                    </p>
                    <p className="mb-2 text-gray-500 ">
                      Posisi : {data.posisi}
                    </p>
                    <p className="mb-2 text-gray-500 ">
                      Link website MBKM :{" "}
                      <a
                        className="hover:text-blue-700 break-words max-w-full"
                        href={
                          data.link.includes("http")
                            ? data.link
                            : `http://${data.link}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {data.link}
                      </a>
                    </p>
                    <span
                      className={`px-3 py-1 text-white rounded-full inline-block ${
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
                    {/* catatan */}
                    {data.catatan && (
                      <p className="my-2 text-gray-500 ">
                        Catatan : {data?.catatan}
                      </p>
                    )}
                  </div>

                  {role === "kaprodi" ? (
                    <div className="block max-w-xl h-fit p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                      <label
                        htmlFor="status"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Ganti Status persetujuan :
                      </label>
                      <select
                        onChange={(e) => handleChangeStatus(e, index, data._id)}
                        id="status"
                        name="status"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      >
                        <option value="">Pilih status persetujuan baru</option>
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
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
                        value={form?.updateStatus?.catatan}
                        onChange={(e) => handleChange(e, index)}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
          {role === "kaprodi" ? (
            <button
              type="submit"
              className="w-full text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Kirim Persetujuan
            </button>
          ) : null}
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
