import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getData, putData } from "../../utils/fetch";
import Swal from "sweetalert2";
import { useDropzone } from "react-dropzone";
import DatePicker from "react-datepicker";
import axios from "axios";

export default function PenugasanUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    judul: "",
    petunjuk: "",
    lampiran: null,
    tenggat: null,
  });
  const [oldLampiran, setOldLampiran] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeDate = (date) => {
    setForm({
      ...form,
      tenggat: date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Display a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah akan mengupdate penugasan ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    // Check the result of the confirmation dialog
    if (result.isConfirmed) {
      try {
        const res = await putData(`/penugasan/${id}`, form, true);

        if (res?.data) {
          toast.success("Berhasil update penugasan", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate("/penugasan");
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

  const fetchPenugasanId = async () => {
    try {
      const res = await getData(`/penugasan/${id}`);
      const {
        judul,
        petunjuk = "",
        lampiran = null,
        tenggat = null,
      } = res.data.data;

      setOldLampiran(lampiran);

      setForm({ judul, petunjuk, lampiran, tenggat });
    } catch (error) {
      navigate("/internal-server-error");

      console.log(error);
    }
  };

  useEffect(() => {
    setError("");
  }, [form]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("role")) !== "unitmbkm") {
      navigate("/forbidden");
    }
    fetchPenugasanId();
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
          lampiran: file,
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
        className="flex flex-col items-center justify-center w-full"
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

  const downloadFile = async () => {
    const token = localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : {};
    try {
      const response = await axios.get(
        `http://localhost:9000/api/v1/penugasan/download/${oldLampiran}`,
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
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-36 sm:mt-24">
        <h1 className="text-2xl text-blue-500 font-bold mb-10">
          Update Penugasan
        </h1>

        {/* form */}
        <form className="space-y-4 md:space-y-6 w-1/2" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="judul"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Judul
            </label>
            <input
              type="text"
              name="judul"
              id="judul"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
              required={true}
              value={form?.judul}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="petunjuk"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Petunjuk
            </label>
            <input
              type="text"
              name="petunjuk"
              id="petunjuk"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
              value={form?.petunjuk}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Lampiran lama
            </label>
            {oldLampiran ? (
              <p
                onClick={downloadFile}
                className="font-normal text-gray-700 hover:underline cursor-pointer"
              >
                {oldLampiran}
              </p>
            ) : (
              <p className="font-normal text-gray-700">Tidak ada</p>
            )}
          </div>

          {/* lampiran dropzone */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Lampiran
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
                filePreview // Show file preview if there are uploaded files
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {/* Placeholder content for dropzone */}
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

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">
              Tenggat Pengumpulan
            </label>
            <DatePicker
              name="tenggat"
              selected={form.tenggat ? new Date(form.tenggat) : null}
              onChange={handleChangeDate}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
              dateFormat="dd-MM-yyyy h:mm aa"
              showTimeSelect
              timeIntervals={15}
              timeFormat="HH:mm"
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type="submit"
            className="w-full text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
