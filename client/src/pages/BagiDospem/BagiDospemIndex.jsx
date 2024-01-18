import React, { useEffect, useState } from "react";
import SideNav from "../../components/SideNav";
import { useNavigate } from "react-router-dom";
import { getData, putData } from "../../utils/fetch";
import debounce from "debounce-promise";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Pagination from "../../components/Pagination";

export default function BagiDospemIndex() {
  const navigate = useNavigate();

  const [prodiesServer, setProdiesServer] = useState([]);
  const [daftarServer, setDaftarServer] = useState([]);
  const [dospemServer, setDospemServer] = useState([]);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formSearch, setFormSearch] = useState({
    status: "",
    prodi: "",
    nama: "",
    page: 1,
  });

  const [formDospem, setFormDospem] = useState({
    nama: "",
    idMahasiswa: "",
    idDospem: "",
  });

  const handleChangeProdiSearch = (event) => {
    setFormSearch({ ...formSearch, prodi: event.target.value, page: 1 });
  };
  const handleChangeSearch = (e) => {
    setFormSearch({ ...formSearch, [e.target.name]: e.target.value, page: 1 });
  };

  const handleChangeDospem = (e) => {
    setFormDospem({ ...formDospem, [e.target.name]: e.target.value });
  };

  const fetchProdi = async () => {
    try {
      const res = await getData(`/prodi`);
      setProdiesServer(res.data.data);
    } catch (error) {
      navigate("/internal-server-error");
      console.log(error);
    }
  };

  const fetchDaftar = async () => {
    try {
      const res = await getData(`/bagidospem`, formSearch);
      setDaftarServer(res.data.data);
    } catch (error) {
      navigate("/internal-server-error");
      setError(error);
      console.log(error);
    }
    setLoading(false);
  };

  const fetchDospem = async () => {
    try {
      const res = await getData(`/dospem`, formDospem);
      setDospemServer(res.data.data);
    } catch (error) {
      navigate("/internal-server-error");
      setError(error);
      console.log(error);
    }
  };

  const toggleModal = (id) => {
    if (!modalVisible) {
      setFormDospem({ ...formDospem, idMahasiswa: id });
    } else {
      setFormDospem({ ...formDospem, idMahasiswa: "", idDospem: "", nama: "" });
      setDospemServer([]);
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
          <div className="relative p-4 bg-white rounded-lg shadow sm:p-5 w-full md:w-1/3 md:h-1/3">
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
              <h3 className="text-lg font-semibold text-gray-9">
                Tambahkan Dosen Pembimbing
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
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="nama"
                name="nama"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Nama ..."
                value={formDospem?.nama}
                onChange={handleChangeDospem}
              />
            </div>

            {/* tabel */}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="border-b-2 text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Nama
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Prodi
                  </th>
                </tr>
              </thead>
              {dospemServer && dospemServer.length > 0 ? (
                dospemServer.map((data, index) => (
                  <tbody
                    onClick={() => handleClickDospem(data._id)}
                    key={index}
                    className="cursor-pointer"
                  >
                    <tr className="bg-white border-b hover:bg-gray-200">
                      <td className="px-6 py-4">{data.nama}</td>
                      <td className="px-6 py-4">{data.prodi.nama}</td>
                    </tr>
                  </tbody>
                ))
              ) : (
                <tbody className="text-xl font-bold text-center">
                  Data tidak ditemukan
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    );
  };

  const handleClickDospem = async (idDospem) => {
    let formUpdate = { ...formDospem, idDospem: idDospem };

    // Display a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah akan memilih Dospem ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    // Check the result of the confirmation dialog
    if (result.isConfirmed) {
      try {
        const res = await putData(`/bagidospem/`, formUpdate);

        if (res?.data) {
          toast.success("Berhasil Update Pembagian Dospem", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          toggleModal();
          fetchDaftar();
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
    if (JSON.parse(localStorage.getItem("role")) !== "unitmbkm") {
      navigate("/forbidden");
    }
    setTimeout(() => {
      fetchProdi();
      fetchDaftar();
    }, 3000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);

    const fetchDaftarDebounced = debounce(fetchDaftar, 1000);

    fetchDaftarDebounced();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSearch]);

  useEffect(() => {
    if (formDospem.nama !== "") {
      const fetchDospemDebounced = debounce(fetchDospem, 1000);

      fetchDospemDebounced();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDospem.nama]);

  return (
    <>
      <SideNav />

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
          <h1 className="text-2xl text-blue-500 font-bold mb-10">
            Pembagian Dosen Pembimbing
          </h1>

          {/* filter */}
          <div className="relative mt-10 flex gap-5">
            {/* filter nama */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="nama"
                name="nama"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Nama ..."
                value={formSearch?.nama}
                onChange={handleChangeSearch}
              />
            </div>

            {/* filter email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="email"
                name="email"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Email ..."
                value={formSearch?.email}
                onChange={handleChangeSearch}
              />
            </div>

            {/* filter prodi */}
            <select
              value={formSearch.prodi}
              onChange={handleChangeProdiSearch}
              id="roleSearch"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4 p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">Prodi</option>
              {prodiesServer.map((prodi, index) => (
                <option key={index} value={prodi._id}>
                  {prodi.nama}
                </option>
              ))}
            </select>
          </div>

          {/* tabel */}
          <div className="my-10 border-2 relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="border-b-2 text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Nama
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Prodi
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Dospem
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="cursor-pointer">
                {loading ? (
                  Array.from(Array(10), (v, i) => (
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
                        <td>
                          <Skeleton count={1} width={"100%"} height={20} />
                        </td>
                        <td>
                          <Skeleton count={1} width={"100%"} height={20} />
                        </td>
                        <td>
                          <Skeleton count={1} width={"100%"} height={20} />
                        </td>
                      </tr>
                    </SkeletonTheme>
                  ))
                ) : daftarServer?.result && daftarServer?.result.length > 0 ? (
                  daftarServer?.result.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">{data.idMahasiswa.nama}</td>
                      <td className="px-6 py-4">{data.idMahasiswa.email}</td>
                      <td className="px-6 py-4">
                        {data.idMahasiswa.prodi.nama}
                      </td>
                      <td className="px-6 py-4">
                        {data?.idMahasiswa?.dospem?.nama
                          ? data?.idMahasiswa?.dospem?.nama
                          : "Belum ada dospem"}
                      </td>
                      <td className="px-6 py-4 flex gap-5">
                        <div
                          onClick={() => toggleModal(data.idMahasiswa._id)}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Edit Dospem
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-xl font-bold text-center">
                    Data tidak ditemukan
                  </tr>
                )}
              </tbody>
            </table>

            {/* pagination */}
            {daftarServer?.pages !== 1 && daftarServer?.result?.length > 0 && (
              <Pagination
                pages={daftarServer.pages}
                handlePageClick={({ selected }) =>
                  setFormSearch({ ...formSearch, page: selected + 1 })
                }
              />
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {modalVisible && modal()}
          </div>
        </div>
      </div>
    </>
  );
}
