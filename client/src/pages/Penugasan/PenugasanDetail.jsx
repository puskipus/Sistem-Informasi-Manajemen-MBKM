import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { getData, postData, putData } from "../../utils/fetch";
import { formatDate } from "../../utils/formatDate";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { useNavigate } from "react-router-dom";

export default function PenugasanDetail() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [penugasanServer, setPenugasanServer] = useState([]);
  const [tugasServer, setTugasServer] = useState([]);
  const [tugasMahasiswaBimbinganServer, setTugasMahasiswaBimbinganServer] =
    useState([]);
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const [nilaiValues, setNilaiValues] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetch = async () => {
    try {
      const res = await getData(`/penugasan/${id}`);
      setPenugasanServer(res.data.data);
    } catch (error) {
      navigate("/internal-server-error");
      console.log(error);
    }
  };

  const [form, setForm] = useState({
    idPenugasan: id,
    file: null,
  });

  const fetchTugasDikumpulkan = async () => {
    try {
      const res = await getData(`/tugas/${id}`);
      if (res.data.data) {
        setTugasServer(res.data.data);
        setShowForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTugasMahasiswaBimbingan = async () => {
    try {
      const res = await getData(`/tugas/dospem/${id}`);
      if (res.data.data) {
        const nilaiValuesObj = {};
        res.data.data.forEach((data) => {
          nilaiValuesObj[data._id] = data.nilai;
        });
        setNilaiValues(nilaiValuesObj);
        setTugasMahasiswaBimbinganServer(res.data.data);
        setShowForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("role"));
    setRole(role);
    fetch();

    if (role === "mahasiswa") {
      fetchTugasDikumpulkan();
    }

    if (role === "dospem") {
      fetchTugasMahasiswaBimbingan();
    }

    if (role === "kaprodi") {
      navigate("/forbidden");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/*": [".pdf", ".msword"],
      "video/mp4": [".mp4"],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
        "application/msword",
        "video/mp4",
      ];

      if (file && allowedTypes.includes(file.type)) {
        setForm({
          ...form,
          file: file,
        });
      } else {
        toast.error(
          "Upload file dalam format jpeg, png, pdf, msword, atau mp4",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        setForm({ ...form, file: "" });
      }
    },
  });

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "video/mp4",
  ];

  const filePreview = acceptedFiles
    .filter((file) => allowedTypes.includes(file.type))
    .map((file) => (
      <div
        key={file.path}
        className="flex flex-col items-center justify-center w-full"
      >
        <h4 className="text-xs sm:text-base text-center truncate w-full">
          {file.path}
        </h4>
        {file.type.startsWith("image/") ? ( // Show image preview if it's an image file
          <img
            src={URL.createObjectURL(file)}
            alt={file.path}
            className="w-20 h-20 sm:w-32 sm:h-32 object-contain"
          />
        ) : null}
      </div>
    ));

  const renderFormTugas = () => {
    if (role === "mahasiswa") {
      return (
        <div className="mt-10">
          <h1 className="text-lg font-bold">Kumpulkan Tugas</h1>

          {/* dropzone */}
          <div className="mt-10 md:w-1/2">
            {/* Dropzone with file preview */}
            <div
              {...getRootProps()}
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
            >
              <input
                {...getInputProps()}
                id="dropzone-file"
                className="hidden"
                accept="image/jpeg, image/png, application/pdf, application/msword, video/mp4"
                required={true}
              />
              {filePreview.length ? (
                filePreview // Show file preview if there are uploaded files
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {/* Placeholder content for dropzone */}
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 "
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

          {uploadProgress <= 0 ? null : (
            <div className="mt-5 md:w-1/2">
              <ProgressBar progress={uploadProgress} />
            </div>
          )}

          {/* submit */}
          <div className="flex flex-col">
            <button
              type="button"
              className="mt-5 md:w-1/2 text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              onClick={handleClickSubmit}
            >
              Submit Tugas
            </button>
            {tugasServer.length !== 0 && (
              <button
                type="button"
                className="mt-5 md:w-1/2 text-white bg-red-400 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={() => setShowForm(false)}
              >
                Batalkan
              </button>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderTugasSebelumnya = () => {
    if (role === "mahasiswa") {
      return (
        <div className="mt-10">
          <h1 className="text-lg font-bold">Tugas Dikumpulkan Sebelumnya</h1>
          <p className="text-base">
            File :{" "}
            <span
              onClick={() => downloadFile(tugasServer.file)}
              className="font-normal text-gray-700 hover:underline cursor-pointer"
            >
              {tugasServer.file}
            </span>
          </p>

          <p className="font-normal text-gray-700">
            Dikumpulkan: {formatDate(tugasServer.updatedAt)}
          </p>
          <p className="mb-2 text-gray-700 ">
            Status :{" "}
            {formatDate(tugasServer?.updatedAt) >
            formatDate(penugasanServer.tenggat) ? (
              <span className="text-red-500">Diserahkan terlambat</span>
            ) : (
              "Diserahkan"
            )}
          </p>
          <p className="mb-2 text-gray-500 ">
            Nilai : {tugasServer?.nilai} / 100
          </p>
          <button
            type="button"
            className="mt-5 md:w-1/4 text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={() => setShowForm(true)}
          >
            Ubah tugas yang telah dikumpulkan
          </button>
        </div>
      );
    }
    return null;
  };

  const handleClickSubmit = async () => {
    if (form.file === null) {
      return toast.error("Pilih file yang akan dikumpulkan", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // Display a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah akan mengumpulkan tugas ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    // Check the result of the confirmation dialog
    if (result.isConfirmed) {
      try {
        const onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted); // Update the upload progress state
        };
        const res = await postData(`/tugas/`, form, true, onUploadProgress);

        if (res?.data) {
          toast.success("Berhasil Mengumpulkan Tugas", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setForm({ ...form, file: "" });
          setUploadProgress(0);
          fetchTugasDikumpulkan();
        } else {
          console.log(res);
          setError(res?.response?.data?.msg || "Terjadi kesalahan pada server");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setError("Terjadi kesalahan pada server");
      }
    }
  };

  const [isOpen, setIsOpen] = useState({});

  const toggleAccordion = (index) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const updateNilai = async () => {
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah akan memberi nilai?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const res = await putData(`/tugas/dospem/nilai`, formNilai);
        if (res?.data) {
          toast.success("Berhasil memberi nilai", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          fetchTugasMahasiswaBimbingan();
          toggleModal();
        } else {
          console.error("Failed to update:", res);
        }
      } catch (error) {
        console.error("An error occurred while updating:", error);
      }
    }
  };

  const [formNilai, setFormNilai] = useState({
    id: "",
    nilai: "",
  });

  const handleChange = (e) => {
    let newValue = parseInt(e.target.value);

    // Ensure the value is between 0 and 100
    if (isNaN(newValue) || newValue < 0) {
      newValue = 0;
    } else if (newValue > 100) {
      newValue = 100;
    }

    setFormNilai({ ...formNilai, nilai: newValue });
  };

  const toggleModal = (id) => {
    if (!modalVisible) {
      setFormNilai({ ...formNilai, id: id });
    } else {
      setFormNilai({ ...formNilai, id: "", nilai: "" });
    }
    setModalVisible(!modalVisible);
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
          <div className="relative p-4 bg-white rounded-lg shadow  sm:p-5 w-1/2 md:w-1/6">
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
              <h3 className="text-lg font-semibold text-gray-9">
                Berikan Penilaian
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
                value={formNilai.nilai}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="mt-10 w-full text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={updateNilai}
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDospem = () => {
    if (role === "dospem") {
      return (
        <div className="mt-10">
          <h1 className="text-lg font-bold">Tugas Mahasiswa Bimbingan</h1>

          {tugasMahasiswaBimbinganServer.length > 0 ? (
            <>
              {tugasMahasiswaBimbinganServer.map((data, index) => (
                <div
                  key={index}
                  id={`accordion-color-${index}`}
                  data-accordion="collapse"
                  data-active-classes="bg-blue-100 dark:bg-gray-800 text-blue-600"
                  className="my-3"
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
                      <span>{data?.idMahasiswa?.nama}</span>
                      <span>{data?.idMahasiswa?.nim}</span>
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
                    <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                      <div className="flex gap-2">
                        <p className="mb-2 text-gray-500 ">File :</p>
                        <p
                          onClick={() => downloadFile(data?.file)}
                          className="font-normal text-gray-700 hover:underline cursor-pointer"
                        >
                          {data?.file}
                        </p>
                      </div>

                      <p className="mb-2 text-gray-500 ">
                        Diserahkan : {formatDate(data?.updatedAt)}
                      </p>
                      <p className="mb-2 flex gap-2 text-gray-500 ">
                        Status :{" "}
                        {formatDate(data?.updatedAt) >
                        formatDate(penugasanServer.tenggat) ? (
                          <p className="text-red-500">Diserahkan terlambat</p>
                        ) : (
                          <p className="text-green-500">Diserahkan</p>
                        )}
                      </p>

                      {/* nilai */}
                      <p className="mb-2 text-gray-500 ">
                        Nilai : {nilaiValues[data._id]} / 100
                      </p>

                      <button
                        type="submit"
                        className="w-full md:w-1/4 text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        onClick={() => toggleModal(data._id)}
                      >
                        Beri penilaian
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="mt-5">Belum ada mahasiswa yang mengumpulkan</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
          <div className="flex justify-between items-center my-10 border-b-2 border-blue-500 pb-1">
            <h1 className="text-2xl text-blue-500 font-bold">
              {penugasanServer.judul}
            </h1>
            {penugasanServer.tenggat && (
              <p className="font-normal text-gray-700">
                Tenggat: {formatDate(penugasanServer.tenggat)}
              </p>
            )}
          </div>

          <p className="text-lg mb-10">{penugasanServer?.petunjuk}</p>

          {penugasanServer.lampiran && (
            <div>
              <p className="text-base">
                Lampiran :
                <span
                  onClick={() => downloadFile(penugasanServer.lampiran)}
                  className="ml-5 font-normal text-gray-700 hover:underline cursor-pointer"
                >
                  {penugasanServer.lampiran}
                </span>
              </p>
            </div>
          )}

          {showForm ? renderFormTugas() : renderTugasSebelumnya()}

          {renderDospem()}
          {modalVisible && modal()}

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </>
  );
}
