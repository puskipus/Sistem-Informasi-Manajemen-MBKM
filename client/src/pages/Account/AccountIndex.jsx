import React, { useEffect, useState } from "react";
import { getData, putData } from "../../utils/fetch";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AccountIndex() {
  const navigate = useNavigate();

  const [accountServer, setaccountServer] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [formUpdate, setFormUpdate] = useState({
    nama: "",
    nim: "",
    nip: "",
    semester: "",
    prodi: "",
    noHP: "",
  });
  const handleChangeUpdate = (e) => {
    setFormUpdate({ ...formUpdate, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditMode(true);
    const { nama, nim, nip, semester, prodi, noHP } = accountServer;
    setFormUpdate({ nama, nim, nip, semester, prodi: prodi?.nama, noHP });
  };
  const handleCancelEdit = () => {
    setEditMode(false);
    setFormUpdate("");
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah akan update detail akun?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    // // Check the result of the confirmation dialog
    if (result.isConfirmed) {
      try {
        const res = await putData(`/account/detail`, formUpdate);

        if (res?.data) {
          toast.success("Berhasil update detail akun", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setEditMode(false);
          fetch();
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

  const fetch = async () => {
    try {
      const res = await getData(`/account`);
      setaccountServer(res.data.data);
    } catch (error) {
      navigate("/internal-server-error");
      console.log(error);
    }
  };

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("role"));
    setRole(role);
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Display a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah akan update password?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    // // Check the result of the confirmation dialog
    if (result.isConfirmed) {
      try {
        const res = await putData(`/account`, form);

        if (res?.data) {
          toast.success("Berhasil update password", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          toggleModal();
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
          <div className="relative p-4 bg-white rounded-lg shadow  sm:p-5 w-full md:w-1/2 lg:w-1/3">
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
              <h3 className="text-lg font-semibold text-gray-9">
                Ubah Password
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

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {/* old password */}
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Password Lama
                </label>
                <input
                  type="text"
                  name="oldPassword"
                  id="oldPassword"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
                  required={true}
                  value={form?.oldPassword}
                  onChange={handleChange}
                />
              </div>

              {/* new password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Password Baru
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
                  required={true}
                  value={form?.newPassword}
                  onChange={handleChange}
                />
              </div>

              {/* confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Confirm Password Baru
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
                  required={true}
                  value={form?.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {error && <p style={{ color: "red" }}>{error}</p>}

              <button
                type="submit"
                className="w-full text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Ubah Password
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (
      form.newPassword !== "" &&
      form.confirmPassword !== "" &&
      form.newPassword !== form.confirmPassword
    ) {
      setError("Password baru dan konfirmasi password harus sama");
    } else {
      setError("");
    }
  }, [form.newPassword, form.confirmPassword]);

  const renderAccountDetails = () => {
    if (editMode) {
      return (
        <div>
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={handleUpdateAccount}
          >
            {/* nama */}
            <div>
              <label
                htmlFor="nama"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                id="nama"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full lg:w-1/3 p-2.5 "
                placeholder="Nama Lengkap"
                required={true}
                value={formUpdate.nama}
                onChange={handleChangeUpdate}
              />
            </div>

            <div className="flex gap-4">
              {/* semester */}
              {role === "mahasiswa" && (
                <div>
                  <label
                    htmlFor="semester"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Semester
                  </label>
                  <input
                    type="text"
                    name="semester"
                    id="semester"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required={true}
                    value={formUpdate.semester}
                    onChange={handleChangeUpdate}
                  />
                </div>
              )}

              {/* nip */}
              {(role === "dospem" || role === "kaprodi") && (
                <div>
                  <label
                    htmlFor="nip"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    NIP
                  </label>
                  <input
                    type="text"
                    name="nip"
                    id="nip"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required={true}
                    value={formUpdate.nip}
                    onChange={handleChangeUpdate}
                  />
                </div>
              )}

              {/* prodi */}
              {formUpdate.prodi && (
                <div className="relative">
                  <label
                    htmlFor="prodi"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Program Studi
                  </label>
                  <select
                    value={formUpdate?.prodi}
                    onChange={handleChangeUpdate}
                    id="prodi"
                    name="prodi"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required={true}
                  >
                    <option value="Teknik Informatika">
                      Teknik Informatika
                    </option>
                    <option value="Teknik Komputer">Teknik Komputer</option>
                    <option value="Sistem Informasi">Sistem Informasi</option>
                    <option value="Teknologi Informasi">
                      Teknologi Informasi
                    </option>
                    <option value="Pendidikan Teknologi Informasi">
                      Pendidikan Teknologi Informasi
                    </option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              {/* nim */}
              {role === "mahasiswa" && (
                <div>
                  <label
                    htmlFor="nim"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Nomor Induk Mahasiswa
                  </label>
                  <input
                    type="text"
                    name="nim"
                    id="nim"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required={true}
                    value={formUpdate.nim}
                    onChange={handleChangeUpdate}
                  />
                </div>
              )}

              {(role === "mahasiswa" || role === "dospem") && (
                <div>
                  <label
                    htmlFor="noHP"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Nomor Handphone
                  </label>
                  <input
                    type="text"
                    name="noHP"
                    id="noHP"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    placeholder="08**********"
                    required={true}
                    value={formUpdate.noHP}
                    onChange={handleChangeUpdate}
                  />
                </div>
              )}
              {/* no hp */}
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button
              onClick={handleCancelEdit}
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
            >
              Cancel
            </button>
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
              type="submit"
            >
              Save
            </button>
          </form>
        </div>
      );
    } else {
      return (
        <div className="my-5 min-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            Nama : {accountServer?.nama}
          </p>
          {accountServer?.nim && (
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              NIM : {accountServer?.nim}
            </p>
          )}
          {accountServer?.nip && (
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              NIP : {accountServer?.nip}
            </p>
          )}
          {accountServer?.semester && (
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Semester : {accountServer?.semester}
            </p>
          )}
          {accountServer?.prodi?.nama && (
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Program Studi : {accountServer?.prodi?.nama}
            </p>
          )}

          <p className="mb-2 text-gray-500 dark:text-gray-400">
            Email : {accountServer?.email}
          </p>
          {accountServer?.noHP && (
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              No. Handphone : {accountServer?.noHP}
            </p>
          )}

          <div className="mt-10">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
              onClick={toggleModal}
            >
              Ubah Password
            </button>

            <button
              type="button"
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
              onClick={handleEdit}
            >
              Update Akun
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
        <h1 className="text-2xl text-blue-500 font-bold mb-10">
          Detail Akun Anda
        </h1>

        {renderAccountDetails()}

        {modalVisible && modal()}
      </div>
    </div>
  );
}
