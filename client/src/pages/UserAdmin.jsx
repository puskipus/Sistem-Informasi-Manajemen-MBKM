import React, { useEffect, useState } from "react";
import SideNav from "../components/SideNav";
import { useNavigate } from "react-router-dom";
import { deleteData, getData, postData } from "../utils/fetch";
import ConfirmAlert from "../components/ConfirmAlert";
import { toast } from "react-toastify";
import debounce from "debounce-promise";
import Swal from "sweetalert2";
import Pagination from "../components/Pagination";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function UserAdmin() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [prodiesServer, setProdiesServer] = useState([]);
  const [roleServer, setRoleServer] = useState([]);
  const [userServer, setUserServer] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "",
    nip: "",
    prodi: "",
  });
  const [formSearch, setFormSearch] = useState({
    role: "",
    prodi: "",
    nama: "",
    email: "",
    page: 1,
  });

  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleChangeRole = (event) => {
    setForm({ ...form, role: event.target.value });
  };
  const handleChangeRoleSearch = (event) => {
    setFormSearch({ ...formSearch, role: event.target.value, page: 1 });
  };
  const handleChangeProdi = (event) => {
    setForm({ ...form, prodi: event.target.value });
  };
  const handleChangeProdiSearch = (event) => {
    setFormSearch({ ...formSearch, prodi: event.target.value, page: 1 });
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleChangeSearch = (e) => {
    setFormSearch({ ...formSearch, [e.target.name]: e.target.value, page: 1 });
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const handleCancel = () => {
    setShowAlert(false);
  };
  const handleConfirm = async (e) => {
    setShowAlert(false);
    e.preventDefault();

    if (error === "") {
      try {
        const res = await postData(`/admin/auth/signup`, form);
        console.log(res);

        if (res?.data) {
          toast.success("Berhasil Menambahkan Akun", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          toggleModal();
          setForm({
            nama: "",
            email: "",
            password: "",
            role: "",
            nip: "",
            prodi: "",
          });
          setConfirmPassword("");
          fetchUser();
        } else {
          setError(res?.response?.data?.msg);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      (form.role === "dospem" || form.role === "kaprodi") &&
      form.prodi === ""
    ) {
      setError("Pilih Program Studi (Prodi)");
      return;
    }

    setShowAlert(true); // Show the confirmation alert
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
          <div className="relative p-4 bg-white rounded-lg shadow sm:p-5 md:w-1/3 md:h-1/3">
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
              <h3 className="text-lg font-semibold text-gray-9">
                Buat Akun Admin
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
            <label
              htmlFor="category"
              className="block mb-2 text-sm font-medium text-gray-9"
            >
              Jenis akun
            </label>
            <select
              value={form.role}
              onChange={handleChangeRole}
              id="category"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  "
            >
              <option disabled hidden value="">
                Pilih jenis akun
              </option>
              <option value="unitmbkm">Unit MBKM</option>
              <option value="dospem">Dosen Pembimbing</option>
              <option value="kaprodi">Kepala Program Studi</option>
            </select>
            {formByRole()}
          </div>
        </div>
      </div>
    );
  };

  const formByRole = () => {
    if (form.role !== "") {
      return (
        <>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4">
              <div className="mt-4">
                <label
                  htmlFor="nama"
                  className="block mb-2 text-sm font-medium text-gray-9"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="nama"
                  id="nama"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                  placeholder="Nama Lengkap"
                  required={true}
                  value={form?.nama}
                  onChange={handleChange}
                />
              </div>

              {form.role === "dospem" || form.role === "kaprodi" ? (
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-9 mb-2"
                  >
                    Prodi
                  </label>
                  <select
                    value={form.prodi}
                    onChange={handleChangeProdi}
                    id="category"
                    className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                  >
                    <option disabled hidden value="">
                      Pilih Prodi
                    </option>
                    {prodiesServer.map((prodie, index) => (
                      <option key={index} value={prodie._id}>
                        {prodie.nama}
                      </option>
                    ))}
                  </select>

                  <div>
                    <label
                      htmlFor="nip"
                      className="block mb-2 text-sm font-medium text-gray-9"
                    >
                      NIP
                    </label>
                    <input
                      pattern="[0-9]*"
                      type="number"
                      name="nip"
                      id="nip"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                      placeholder="NIP"
                      required={true}
                      value={form?.nip}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ) : null}

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-9"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                  placeholder="example@email.com"
                  required={true}
                  value={form?.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-9"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                  placeholder="••••••••"
                  required={true}
                  value={form?.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-9"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                  placeholder="••••••••"
                  required={true}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
              </div>
            </div>

            {showAlert && (
              <ConfirmAlert
                title="Buat Akun Admin"
                message="Apakah Anda Yakin?"
                onCancel={handleCancel}
                onConfirm={handleConfirm}
              />
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button
              type="submit"
              className="mt-4 text-white inline-flex items-center bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-[#93c5fd] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              <svg
                className="mr-1 -ml-1 w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Buat Akun
            </button>
          </form>
        </>
      );
    }
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

  const fetchRole = async () => {
    try {
      const res = await getData(`/role`);
      setRoleServer(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await getData(`/admin/auth/account`, formSearch);
      setUserServer(res.data.data);
    } catch (error) {
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
      fetchRole();
      fetchUser();
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      form.password !== "" &&
      confirmPassword !== "" &&
      form.password !== confirmPassword
    ) {
      setError("Password dan konfirmasi password harus sama");
    } else {
      setError("");
    }
  }, [form.password, confirmPassword]);

  useEffect(() => {
    setError("");
  }, [form.prodi, form.email]);

  useEffect(() => {
    setLoading(true);
    const fetchUserDebounced = debounce(fetchUser, 1000);

    fetchUserDebounced();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSearch]);

  const handleDelete = async (id, role) => {
    // Display a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah menghapus akun ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    // Check the result of the confirmation dialog
    if (result.isConfirmed) {
      try {
        const res = await deleteData(`/admin/auth/account/${role}/${id}`);
        console.log(res);
        if (res?.data) {
          toast.success("Berhasil Hapus akun", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          fetchUser();
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

  return (
    <>
      <SideNav />

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
          <h1 className="text-2xl text-blue-500 font-bold mb-10">List User</h1>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={toggleModal}
          >
            Tambah
          </button>

          {/* filter */}
          <div className="relative mt-10 flex gap-5">
            <select
              value={formSearch.role}
              onChange={handleChangeRoleSearch}
              id="roleSearch"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4 p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">Role</option>
              {roleServer.map((role, index) => (
                <option key={index} value={role._id}>
                  {role.nama}
                </option>
              ))}
            </select>
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
          </div>

          {/* tabel */}
          <div className="my-10 border-2 relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="border-b-2 text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Prodi
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nama
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
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
                  : userServer?.result?.map((user, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">{user.role.nama}</td>
                        <td className="px-6 py-4">
                          {user.prodi && user.prodi.nama ? user.prodi.nama : ""}
                        </td>
                        <td className="px-6 py-4">{user.nama}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4 flex gap-5">
                          <div
                            onClick={() =>
                              handleDelete(user._id, user.role.nama)
                            }
                            className="cursor-pointer font-medium text-red-600 hover:underline"
                          >
                            Delete
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>

            {/* pagination */}
            {userServer?.pages !== 1 && userServer?.result?.length > 0 && (
              <Pagination
                pages={userServer.pages}
                handlePageClick={({ selected }) =>
                  setFormSearch({ ...formSearch, page: selected + 1 })
                }
              />
            )}
          </div>
        </div>
      </div>

      {modalVisible && modal()}
    </>
  );
}
