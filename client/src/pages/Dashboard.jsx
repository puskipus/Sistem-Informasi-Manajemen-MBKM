import React, { useEffect, useState } from "react";
import SideNav from "../components/SideNav";
import { NavLink } from "react-router-dom";
import { deleteData, getData } from "../utils/fetch";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useNavigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function Dashboard() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [informasiServer, setInformasiServer] = useState([]);
  const [totalPendaftarServer, settotalPendaftarServer] = useState([]);
  const [totalDiterimaServer, settotalDiterimaServer] = useState([]);
  const [totalTugasServer, settotalTugasServer] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleDelete = async (data) => {
    // Display a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah menghapus informasi ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    // Check the result of the confirmation dialog
    if (result.isConfirmed) {
      try {
        const res = await deleteData(`/informasi/${data}`);

        if (res?.data) {
          toast.success("Berhasil Hapus Informasi", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          fetchInformasi();
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

  const fetchInformasi = async () => {
    try {
      const res = await getData(`/informasi`);
      setInformasiServer(res.data.data);
    } catch (error) {
      navigate("/internal-server-error");
      console.log(error);
    }
  };

  const fetchTotalPendaftar = async () => {
    try {
      const res = await getData("/daftarmbkm/total");
      settotalPendaftarServer(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalDiterima = async () => {
    try {
      const res = await getData("/daftarulang/total");
      settotalDiterimaServer(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTugas = async () => {
    try {
      const res = await getData("/tugas");
      console.log(res.data);
      settotalTugasServer(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("role"));
    setRole(role);
    fetchInformasi();
    if (role === "unitmbkm") {
      fetchTotalPendaftar();
      fetchTotalDiterima();
      fetchTugas();
    }
  }, []);

  const renderAddButton = () => {
    if (role === "unitmbkm") {
      return (
        <NavLink
          to={"/informasi/create"}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Tambah
        </NavLink>
      );
    }
    return null;
  };

  Chart.register(CategoryScale);

  const renderChart = () => {
    if (role === "unitmbkm") {
      const dataPendaftar = {
        labels: [
          "Teknik Informatika",
          "Teknik Komputer",
          "Sistem Informasi",
          "Teknologi Informasi",
          "Pendidikan Teknologi Informasi",
        ],
        datasets: [
          {
            label: "Jumlah Pendaftar MBKM Berdasarkan Prodi",
            data: [
              totalPendaftarServer.tif,
              totalPendaftarServer.tekom,
              totalPendaftarServer.si,
              totalPendaftarServer.ti,
              totalPendaftarServer.pti,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(255, 206, 86, 0.5)",
              "rgba(75, 192, 192, 0.5)",
              "rgba(153, 102, 255, 0.5)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };

      const dataPendaftarByDpt = {
        labels: [
          "Departemen Teknik Informatika",
          "Departemen Sistem Informasi",
        ],
        datasets: [
          {
            label: "Jumlah Pendaftar MBKM Berdasarkan Departemen",
            data: [totalPendaftarServer.dtif, totalPendaftarServer.dsi],
            backgroundColor: [
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      };

      const dataPendaftarByJenisKegiatan = {
        labels: [
          "Bangkit Academy",
          "Studi Independen",
          "Magang Merdeka",
          "Magang Mitra FILKOM",
        ],
        datasets: [
          {
            label: "Jumlah Pendaftar MBKM Berdasarkan Jenis Kegiatan",
            data: [
              totalPendaftarServer.bangkit,
              totalPendaftarServer.stupen,
              totalPendaftarServer.magang,
              totalPendaftarServer.mitraFilkom,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(255, 206, 86, 0.5)",
              "rgba(75, 192, 192, 0.5)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };

      const chartOptions = {
        scales: {
          y: {
            ticks: {
              stepSize: 1, // Set the step size for the y-axis ticks
            },
          },
        },
      };

      return (
        <div className="mb-10">
          <h1 className="text-2xl text-blue-500 font-bold mb-5">
            Jumlah Pendaftar MBKM
          </h1>
          <Bar data={dataPendaftar} options={chartOptions} />
          <Bar
            className="my-10"
            data={dataPendaftarByDpt}
            options={chartOptions}
          />
          <Bar data={dataPendaftarByJenisKegiatan} options={chartOptions} />
          <h2
            className="cursor-pointer my-10 text-blue-400 hover:text-blue-500 hover:underline"
            onClick={() =>
              downloadDiterimaExcel(
                "http://localhost:9000/api/v1/daftarmbkm/convert"
              )
            }
          >
            Download data pendaftar (excel)
          </h2>
        </div>
      );
    }
    return null;
  };

  const downloadDiterimaExcel = async (api) => {
    try {
      const token = localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : {};
      const response = await fetch(api, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const blob = await response.blob();

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.xlsx");

      // Append link to the body and simulate a click to trigger download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  };

  const renderChartDiterima = () => {
    if (role === "unitmbkm") {
      const dataDiterima = {
        labels: [
          "Teknik Informatika",
          "Teknik Komputer",
          "Sistem Informasi",
          "Teknologi Informasi",
          "Pendidikan Teknologi Informasi",
        ],
        datasets: [
          {
            label: "Jumlah Diterima MBKM Berdasarkan Prodi",
            data: [
              totalDiterimaServer.tif,
              totalDiterimaServer.tekom,
              totalDiterimaServer.si,
              totalDiterimaServer.ti,
              totalDiterimaServer.pti,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(255, 206, 86, 0.5)",
              "rgba(75, 192, 192, 0.5)",
              "rgba(153, 102, 255, 0.5)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };

      const dataDiterimaByDpt = {
        labels: [
          "Departemen Teknik Informatika",
          "Departemen Sistem Informasi",
        ],
        datasets: [
          {
            label: "Jumlah Diterima MBKM Berdasarkan Departemen",
            data: [totalDiterimaServer.dtif, totalDiterimaServer.dsi],
            backgroundColor: [
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      };

      const dataDiterimaByJenisKegiatan = {
        labels: [
          "Bangkit Academy",
          "Studi Independen",
          "Magang Merdeka",
          "Magang Mitra FILKOM",
        ],
        datasets: [
          {
            label: "Jumlah Diterima MBKM Berdasarkan Jenis Kegiatan",
            data: [
              totalDiterimaServer.bangkit,
              totalDiterimaServer.stupen,
              totalDiterimaServer.magang,
              totalDiterimaServer.mitraFilkom,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(255, 206, 86, 0.5)",
              "rgba(75, 192, 192, 0.5)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };

      const chartOptions = {
        scales: {
          y: {
            ticks: {
              stepSize: 1, // Set the step size for the y-axis ticks
            },
          },
        },
      };

      return (
        <div className="mb-10">
          <h1 className="text-2xl text-blue-500 font-bold mb-5">
            Jumlah Diterima MBKM
          </h1>
          <Bar data={dataDiterima} options={chartOptions} />
          <Bar
            className="my-10"
            data={dataDiterimaByDpt}
            options={chartOptions}
          />
          <Bar data={dataDiterimaByJenisKegiatan} options={chartOptions} />
          <h2
            className="cursor-pointer my-10 text-blue-400 hover:text-blue-500 hover:underline"
            onClick={() =>
              downloadDiterimaExcel(
                "http://localhost:9000/api/v1/daftarulang/convert"
              )
            }
          >
            Download data diterima (excel)
          </h2>
        </div>
      );
    }
    return null;
  };

  const renderTableTugas = () => {
    if (role === "unitmbkm") {
      const penugasan = totalTugasServer.penugasan || [];
      const headerCells = penugasan.map((item) => item.judul);

      return (
        <div className="mb-10">
          <h1 className="text-2xl text-blue-500 font-bold mb-5">
            Nilai Penugasan Mahasiswa
          </h1>

          {/* tabel */}
          <div className="my-10 border-2 relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="border-b-2 text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Nama
                  </th>
                  {headerCells.map((judul, index) => (
                    <th
                      key={`headerTugas${index}`}
                      scope="col"
                      className="px-6 py-3"
                    >
                      {judul}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading
                  ? Array.from(Array(10), (v, i) => (
                      <SkeletonTheme
                        key={i}
                        color="#202020"
                        highlightColor="#444"
                      >
                        <tr>
                          <td>
                            <Skeleton count={1} width={"100%"} height={20} />
                          </td>
                          <td>
                            <Skeleton count={1} width={"100%"} height={20} />
                          </td>
                        </tr>
                      </SkeletonTheme>
                    ))
                  : !loading &&
                    totalTugasServer.data &&
                    Object.keys(totalTugasServer.data).map((key, index) => {
                      const userData = totalTugasServer.data[key];
                      return (
                        <tr
                          key={index}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">{key}</td>
                          {/* Render tasks and values in separate cells */}
                          {headerCells.map((judul, dataIndex) => {
                            const matchingData = userData.find(
                              (data) => data.Tugas === judul
                            );
                            return (
                              <td key={dataIndex} className="px-6 py-4">
                                {matchingData ? matchingData["Nilai Tugas"] : 0}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
              </tbody>
            </table>

            {/* {userServer?.pages !== 1 && userServer?.result?.length > 0 && (
              <Pagination
                pages={userServer.pages}
                handlePageClick={({ selected }) =>
                  setFormSearch({ ...formSearch, page: selected + 1 })
                }
              />
            )} */}
          </div>

          <h2
            className="cursor-pointer my-10 text-blue-400 hover:text-blue-500 hover:underline"
            onClick={() =>
              downloadDiterimaExcel(
                "http://localhost:9000/api/v1/tugas/convert"
              )
            }
          >
            Download data nilai penugasan (excel)
          </h2>
        </div>
      );
    }
  };

  return (
    <>
      <SideNav />

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
          <h1 className="text-2xl text-blue-500 font-bold mb-10">
            Informasi Kegiatan MBKM
          </h1>
          {renderAddButton()}

          {/* tabel */}
          <div className="my-10 border-2 relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="border-b-2 text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Aktivitas
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Pelaksana
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Waktu
                  </th>
                  {role === "unitmbkm" ? (
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  ) : null}
                </tr>
              </thead>
              {informasiServer.map((data, index) => (
                <tbody key={index}>
                  <tr className="bg-white border-b font-medium hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {data.aktivitas}
                    </td>
                    <td className="px-6 py-4">
                      {data.pelaksana ? data.pelaksana : ""}
                    </td>
                    <td className="px-6 py-4">
                      {data.waktu ? data.waktu : ""}
                    </td>
                    {role === "unitmbkm" ? (
                      <td className="px-6 py-4 flex gap-5">
                        <NavLink to={`/informasi/update/${data._id}`}>
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
                      </td>
                    ) : null}
                  </tr>
                </tbody>
              ))}
            </table>
          </div>

          {renderChart()}
          {renderChartDiterima()}

          {renderTableTugas()}
        </div>
      </div>
    </>
  );
}
