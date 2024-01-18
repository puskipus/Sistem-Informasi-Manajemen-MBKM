import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getData, postData } from "../../utils/fetch";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import { useDropzone } from "react-dropzone";

export default function PendataanCreate() {
  const navigate = useNavigate();
  const [jenisKegiatanServer, setJenisKegiatanServer] = useState([]);
  const [jenisPelaksanaanServer, setjenisPelaksanaanServer] = useState([]);

  const [form, setForm] = useState({
    namaMitra: "",
    posisi: "",
    silabus: null,
    mulaiKegiatan: null,
    akhirKegiatan: null,
    jenisKegiatan: "",
    jenisPelaksanaan: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeDate = (date, nama) => {
    setForm({
      ...form,
      [nama]: date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Display a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah akan mengirim pendataan ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    // Check the result of the confirmation dialog
    if (result.isConfirmed) {
      try {
        const res = await postData(`/daftarulang`, form, true);

        if (res?.data) {
          toast.success("Berhasil mengirim pendataan", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate("/pendataan");
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

  const fetchJeniskegiatan = async () => {
    try {
      const res = await getData(`/jeniskegiatan`);
      setJenisKegiatanServer(res.data.data);
    } catch (error) {
      navigate("/internal-server-error");

      console.log(error);
    }
  };

  const fetchJenisPelaksanaan = async () => {
    try {
      const res = await getData(`/jenispelaksanaan`);
      setjenisPelaksanaanServer(res.data.data);
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
    fetchJeniskegiatan();
    fetchJenisPelaksanaan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/*": [".pdf", ".msword"],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
        "application/msword",
      ];

      if (file && allowedTypes.includes(file.type)) {
        setForm({
          ...form,
          silabus: file,
        });
      } else {
        // Handle invalid file type (e.g., show an error message)
        setError(
          "Invalid file type. Please upload an jpeg, png, pdf, msword file type."
        );
      }
    },
  });

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/msword",
  ];

  const filePreview = acceptedFiles
    .filter((file) => allowedTypes.includes(file.type)) // Filter files based on allowed types
    .map((file) => (
      <div
        key={file.path}
        className="flex flex-col items-center text-center justify-center w-full"
      >
        <h4 className="text-xs sm:text-base truncate w-full">{file.path}</h4>
        {file.type.startsWith("image/") ? ( // Show image preview if it's an image file
          <img
            src={URL.createObjectURL(file)}
            alt={file.path}
            className="w-20 h-20 sm:w-32 sm:h-32 object-contain"
          />
        ) : null}
      </div>
    ));

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
        <h1 className="text-2xl text-blue-500 font-bold mb-5">
          Buat Pendataan
        </h1>

        {/* form */}
        <form className="space-y-4 md:space-y-6 w-full" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-10 lg:w-1/2">
            {/* jenis kegiatan */}
            <div className="relative mt-10 flex gap-5 items-center">
              <label
                htmlFor="jenisKegiatan"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Jenis Kegiatan
              </label>
              <select
                value={form.jenisKegiatan}
                onChange={handleChange}
                id="jenisKegiatan"
                name="jenisKegiatan"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
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

            {/* jenis pelaksanaan */}
            <div className="relative mt-10 flex md:gap-5 items-center">
              <label
                htmlFor="jenisPelaksanaan"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Jenis Pelaksanaan
              </label>
              <select
                value={form.jenisPelaksanaan}
                onChange={handleChange}
                id="jenisPelaksanaan"
                name="jenisPelaksanaan"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                required={true}
              >
                <option value="">Pilih Jenis Kegiatan</option>
                {jenisPelaksanaanServer.map((data, index) => (
                  <option key={index} value={data._id}>
                    {data.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-10 w-full">
            {/* nama mitra */}
            <div className="">
              <label
                htmlFor="namaMitra"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Nama mitra
              </label>
              <input
                type="text"
                name="namaMitra"
                id="namaMitra"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
                required={true}
                value={form?.namaMitra}
                onChange={handleChange}
              />
            </div>

            {/* posisi */}
            <div className="">
              <label
                htmlFor="posisi"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Posisi
              </label>
              <input
                type="text"
                name="posisi"
                id="posisi"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
                value={form?.posisi}
                onChange={handleChange}
                required={true}
              />
            </div>
          </div>

          <div className="flex gap-10">
            {/* mulai kegiatan */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 ">
                Mulai Kegiatan
              </label>
              <DatePicker
                name="mulaiKegiatan"
                selected={form.mulaiKegiatan}
                onChange={(date) => handleChangeDate(date, "mulaiKegiatan")}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                dateFormat="dd-MM-yyyy"
                required={true}
              />
            </div>

            {/* akhir kegiatan */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 ">
                Akhir kegiatan
              </label>
              <DatePicker
                name="akhirKegiatan"
                selected={form.akhirKegiatan}
                onChange={(date) => handleChangeDate(date, "akhirKegiatan")}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                dateFormat="dd-MM-yyyy"
                required={true}
              />
            </div>
          </div>

          {/* silabus dropzone */}
          <div className="md:w-1/2">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Silabus (Apabila sudah ada)
            </label>
            {/* Dropzone with file preview */}
            <div
              {...getRootProps()}
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
            >
              <input
                {...getInputProps()}
                id="dropzone-file"
                className="hidden"
                accept="image/jpeg, image/png, application/pdf, application/msword"
              />
              {filePreview.length ? (
                filePreview
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                </div>
              )}
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type="submit"
            className="w-1/2 text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
}
