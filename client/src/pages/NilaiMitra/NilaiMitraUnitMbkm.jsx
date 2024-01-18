import React, { useEffect, useState } from "react";
import SideNav from "../../components/SideNav";
import { Link, useNavigate } from "react-router-dom";
import { getData } from "../../utils/fetch";
import debounce from "debounce-promise";
import { formatDate } from "../../utils/formatDate";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Pagination from "../../components/Pagination";

export default function NilaiMitraUnitMbkm() {
  const navigate = useNavigate();

  const [prodiesServer, setProdiesServer] = useState([]);
  const [daftarServer, setDaftarServer] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formSearch, setFormSearch] = useState({
    status: "",
    prodi: "",
    nama: "",
    page: 1,
  });

  const handleChangeProdiSearch = (event) => {
    setFormSearch({ ...formSearch, prodi: event.target.value, page: 1 });
  };
  const handleChangeSearch = (e) => {
    setFormSearch({ ...formSearch, [e.target.name]: e.target.value, page: 1 });
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
      const res = await getData(`/nilai-mitra/unitmbkm`, formSearch);
      setDaftarServer(res.data.data);
    } catch (error) {
      navigate("/internal-server-error");

      setError(error);
      console.log(error);
    }
    setLoading(false);
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

  return (
    <>
      <SideNav />

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
          <h1 className="text-2xl text-blue-500 font-bold mb-10">
            Persetujuan Nilai Mitra
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
                    Tanggal Pengajuan
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
                ) : daftarServer.result && daftarServer.result.length > 0 ? (
                  daftarServer.result.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <Link to={`/nilai-mitra/${data._id}`}>
                        <td className="px-6 py-4">{data.idMahasiswa.nama}</td>
                      </Link>
                      <td className="px-6 py-4">{data.idMahasiswa.email}</td>
                      <td className="px-6 py-4">
                        {data.idMahasiswa.prodi.nama}
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(data.createdAt)}
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
          </div>
        </div>
      </div>
    </>
  );
}
