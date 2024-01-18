import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getData, postData } from "../../utils/fetch";
import Swal from "sweetalert2";

export default function PendaftaranCreate() {
  const navigate = useNavigate();
  const [jenisKegiatanServer, setJenisKegiatanServer] = useState([]);

  const [form, setForm] = useState({
    sksLulus: "",
    ipk: "",
    matkulWajib: "",
    mitra: [
      {
        jenisKegiatan: "",
        namaMitra: "",
        posisi: "",
        link: "",
      },
    ],
  });
  const [error, setError] = useState("");
  const [cekDaftar, setCekDaftar] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Display a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah akan daftar MBKM?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    // Check the result of the confirmation dialog
    if (result.isConfirmed) {
      try {
        const res = await postData(`/daftarmbkm`, form);

        if (res?.data) {
          toast.success("Berhasil daftar MBKM", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate("/pendaftaran");
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

  const handlePlusMitra = () => {
    let _temp = [...form.mitra];
    _temp.push({
      jenisKegiatan: "",
      namaMitra: "",
      posisi: "",
      link: "",
    });

    setForm({ ...form, mitra: _temp });
  };

  const handleMinusMitra = (index) => {
    let _temp = [...form.mitra];
    let removeIndex = _temp
      .map(function (_, i) {
        return i;
      })
      .indexOf(index);

    _temp.splice(removeIndex, 1);
    setForm({ ...form, mitra: _temp });
  };

  const handleChangeMitra = (e, i) => {
    let _temp = [...form.mitra];

    _temp[i][e.target.name] = e.target.value;

    setForm({ ...form, mitra: _temp });
  };

  const fetchJeniskegiatan = async () => {
    try {
      const res = await getData(`/jeniskegiatan`);
      setJenisKegiatanServer(res.data.data);
    } catch (error) {
      navigate("/internal-server-error");

      console.log(error);
    }
  };

  const fetchDaftar = async () => {
    try {
      const res = await getData(`/daftarmbkm`);
      setCekDaftar(res.data.data.length);
    } catch (error) {
      navigate("/internal-server-error");

      console.log(error);
    }
  };

  useEffect(() => {
    setError("");
  }, [form]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("role")) !== "mahasiswa") {
      navigate("/forbidden");
    }

    fetchDaftar();
    if (cekDaftar >= 2) {
      navigate("/forbidden");
    }

    fetchJeniskegiatan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
        <h1 className="text-2xl text-blue-500 font-bold mb-10">Daftar MBKM</h1>

        {/* form */}
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-2 w-full">
            {/* sks lulus */}
            <div className="">
              <label
                htmlFor="sksLulus"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                SKS Lulus
              </label>
              <input
                type="number"
                name="sksLulus"
                id="sksLulus"
                className="w-24 px-2 py-2 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block"
                required={true}
                value={form?.sksLulus}
                onChange={handleChange}
              />
            </div>

            {/* ipk lulus */}
            <div>
              <label
                htmlFor="ipk"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                IPK Lulus
              </label>
              <input
                type="number"
                name="ipk"
                id="ipk"
                className="w-24 px-2 py-2 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block"
                required={true}
                value={form?.ipk}
                onChange={handleChange}
              />
            </div>

            {/* matkul wajib */}
            <div>
              <label
                htmlFor="matkulWajib"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Mata Kuliah Wajib (selain PKL, Pengabdian kepada Masyarakat dan
                Skripsi)
              </label>
              <input
                type="text"
                name="matkulWajib"
                id="matkulWajib"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
                value={form?.matkulWajib}
                onChange={handleChange}
                placeholder="Kosongkan jika tidak ada"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {form.mitra.map((data, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 p-5 rounded-lg w-full"
              >
                <div className="flex justify-between">
                  <h1>Mitra {index + 1}</h1>

                  {/* close button */}
                  {index !== 0 && (
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-hide="default-modal"
                      onClick={() => handleMinusMitra(index)}
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  )}
                </div>

                {/* jenis kegiatan */}
                <div className="relative mt-10 flex items-center gap-5">
                  <label
                    htmlFor="jenisKegiatan"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Jenis Kegiatan
                  </label>
                  <select
                    value={data.jenisKegiatan}
                    onChange={(e) => handleChangeMitra(e, index)}
                    id="jenisKegiatan"
                    name="jenisKegiatan"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5  "
                    required={true}
                  >
                    <option value="">Pilih Jenis Kegiatan</option>
                    {jenisKegiatanServer.map((data, index) => (
                      <option key={index} value={data._id}>
                        {data.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* nama mitra */}
                <div>
                  <label
                    htmlFor="namaMitra"
                    className="block my-2 text-sm font-medium text-gray-900 "
                  >
                    Nama Mitra
                  </label>
                  <input
                    type="text"
                    name="namaMitra"
                    id="namaMitra"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
                    value={data?.namaMitra}
                    onChange={(e) => handleChangeMitra(e, index)}
                    required={true}
                  />
                </div>

                {/* posisi */}
                <div>
                  <label
                    htmlFor="posisi"
                    className="block my-2 text-sm font-medium text-gray-900 "
                  >
                    Posisi
                  </label>
                  <input
                    type="text"
                    name="posisi"
                    id="posisi"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
                    value={data?.posisi}
                    onChange={(e) => handleChangeMitra(e, index)}
                    required={true}
                  />
                </div>

                {/* posisi */}
                <div>
                  <label
                    htmlFor="link"
                    className="block my-2 text-sm font-medium text-gray-900 "
                  >
                    Link website kampus merdeka
                  </label>
                  <input
                    type="text"
                    name="link"
                    id="link"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
                    value={data?.link}
                    onChange={(e) => handleChangeMitra(e, index)}
                    required={true}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            className={`flex gap-5 ${
              form.mitra.length === 1 ? "justify-start" : "md:justify-center"
            }`}
          >
            {form.mitra.length < 11 && (
              <div
                type="submit"
                className="cursor-pointer md:w-1/4 text-white bg-blue-400 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={handlePlusMitra}
              >
                + Tambah Mitra
              </div>
            )}
            <button
              type="submit"
              className=" text-white w-1/4 bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Kirim
            </button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
