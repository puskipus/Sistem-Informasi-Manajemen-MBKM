import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { deleteData, getData } from "../../utils/fetch";
import { formatDate } from "../../utils/formatDate";

export default function PenugasanIndex() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [penugasanServer, setPenugasanServer] = useState([]);
  const [error, setError] = useState("");
  const [dospemServer, setDospemServer] = useState("");

  const handleDelete = async (data) => {
    // Display a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah menghapus penugasan ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    // Check the result of the confirmation dialog
    if (result.isConfirmed) {
      try {
        const res = await deleteData(`/penugasan/${data}`);

        if (res?.data) {
          toast.success("Berhasil Hapus penugasan", {
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
        console.error("An error occurred:", error);
        setError("Terjadi kesalahan pada server");
      }
    }
  };

  const fetch = async () => {
    try {
      const res = await getData(`/penugasan`);
      setPenugasanServer(res.data.data);
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
    if (role === "unitmbkm") {
      return (
        <NavLink
          to={"/penugasan/create"}
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
    if (role !== "mahasiswa" && role !== "unitmbkm" && role !== "dospem") {
      navigate("/forbidden");
    }

    if (role === "mahasiswa") {
      fetchDospem();
    }

    if (role === "unitmbkm" || role === "dospem") {
      fetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dospemServer) {
      fetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dospemServer]);

  return (
    <>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
          <h1 className="text-2xl text-blue-500 font-bold mb-10">
            Penugasan Kegiatan MBKM
          </h1>
          {renderAddButton()}

          {/* card */}
          {dospemServer !== undefined
            ? penugasanServer.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between mb-5 min-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
                  >
                    <NavLink to={`/penugasan/${data._id}`}>
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                        {data.judul}
                      </h5>
                      {data.tenggat && (
                        <p className="font-normal text-gray-700">
                          Tenggat: {formatDate(data.tenggat)}
                        </p>
                      )}
                    </NavLink>

                    {role === "unitmbkm" ? (
                      <div className="px-6 py-4 flex gap-5">
                        <NavLink to={`/penugasan/update/${data._id}`}>
                          <div
                            href="#"
                            className="font-medium text-blue-600 hover:underline"
                          >
                            Edit
                          </div>
                        </NavLink>

                        <div
                          onClick={() => handleDelete(data._id)}
                          className="font-medium text-red-600 hover:underline cursor-pointer"
                        >
                          Delete
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            : "Silakan melakukan Pendaftaran dan Pendataan terlebih dahulu"}
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </>
  );
}
