import React, { useEffect, useState } from "react";
import mbkmLogo from "../images/logo-kampus-merdeka.webp";
import ubLogo from "../images/Logo_Universitas_Brawijaya.png";
import filkomLogo from "../images/logo_filkom.png";
import { getData, postData } from "../utils/fetch";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [nim, setNIM] = useState("");
  const [email, setEmail] = useState("");
  const [semester, setSemester] = useState("");
  const [noHP, setNoHP] = useState("08");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [buttonProdi, setButtonProdi] = useState("hidden");
  const [prodiesServer, setProdiesServer] = useState([]);
  const [prodiSelect, setProdiSelect] = useState("Pilih Program Studi");
  const [prodi, setProdi] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleNamaLengkap = (event) => setNamaLengkap(event.target.value);
  const handleEmail = (event) => setEmail(event.target.value);
  // const handleChangeSemester = (event) => setSemester(event.target.value);
  const handleButtonProdi = () =>
    setButtonProdi((prev) => (prev === "hidden" ? "block" : "hidden"));
  const handleChangeSemester = (event) =>
    setSemester(event.target.value.replace(/\D/g, "").slice(0, 1));
  const handleChangeNIM = (event) =>
    setNIM(event.target.value.replace(/\D/g, "").slice(0, 15));
  const handleChangeNoHP = (event) => {
    const input = event.target.value.replace(/\D/g, "").slice(0, 11); // Hanya menerima maksimal 11 digit setelah menghapus karakter non-numerik
    const formattedNoHP = input.startsWith("08")
      ? input
      : "08" + input.slice(0, 9); // Pastikan awalan nomor HP adalah '08'

    setNoHP(formattedNoHP);
  };
  const handleChangeProdi = (event) => {
    setProdiSelect(event.nama);
    setProdi(event._id);
    setButtonProdi("hidden");
  };
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const fetchProdi = async () => {
    try {
      const res = await getData(`/prodi`);
      setProdiesServer(res.data.data);
    } catch (error) {
      navigate("/internal-server-error");
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.endsWith("ub.ac.id")) {
      return setError("Gunakan email ub");
    }

    if (!noHP === "08") {
      return setError("Harap isikan nomor handphone");
    }

    const res = await postData("/auth/signup", {
      nama: namaLengkap,
      noHP: noHP,
      email: email,
      password: password,
      nim: nim,
      prodi: prodi,
      semester: semester,
    });

    if (res.data) {
      const { token, authenticated, role, nama } = res.data;

      localStorage.setItem("authenticated", JSON.stringify(authenticated));
      localStorage.setItem("role", JSON.stringify(role));
      localStorage.setItem("nama", JSON.stringify(nama));
      localStorage.setItem("token", JSON.stringify(token));

      navigate("/dashboard");
    } else {
      setError(res?.response?.data?.msg || "Terjadi kesalahan pada server");
    }
  };

  useEffect(() => {
    fetchProdi();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setError("");
  }, [email, nim, prodi, noHP]);

  useEffect(() => {
    if (
      password !== "" &&
      confirmPassword !== "" &&
      password !== confirmPassword
    ) {
      setError("Password dan konfirmasi password harus sama");
    } else {
      setError("");
    }
  }, [password, confirmPassword]);

  return (
    <>
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:max-h-full lg:py-16">
          <div className="flex flex-col items-center mb-6 text-2xl font-semibold text-gray-900">
            <div className="flex">
              <img className="w-32 h-16 mr-2" src={mbkmLogo} alt="logo" />
              <img className="w-16 mr-2" src={ubLogo} alt="logo" />
              <img className="w-40 mr-2" src={filkomLogo} alt="logo" />
            </div>
            <h1 className="mt-4">MBKM Filkom Univeritas Brawijaya</h1>
          </div>
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Buat Akun
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    placeholder="Nama Lengkap"
                    required={true}
                    value={namaLengkap}
                    onChange={handleNamaLengkap}
                  />
                </div>
                <div className="flex justify-between gap-4">
                  {/* nim */}
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
                      value={nim}
                      onChange={handleChangeNIM}
                    />
                  </div>

                  {/* prodi */}
                  <div className="relative">
                    <label
                      htmlFor="prodi"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Program Studi
                    </label>
                    <button
                      id="dropdown-button"
                      data-dropdown-toggle="dropdown"
                      className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300"
                      type="button"
                      onClick={handleButtonProdi}
                    >
                      {prodiSelect}
                      <svg
                        className="w-2.5 h-2.5 ml-2"
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
                          d="m1 1 4 4 4-4"
                        />
                      </svg>
                    </button>
                    <div
                      id="dropdown"
                      className={`absolute z-50 ${buttonProdi}  bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdown-button"
                      >
                        {prodiesServer.map((prodie, index) => (
                          <li key={index}>
                            <div
                              onClick={() => handleChangeProdi(prodie)}
                              className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              {prodie.nama}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                {/* semester */}
                <div className="flex justify-between gap-4">
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
                      value={semester}
                      onChange={handleChangeSemester}
                    />
                  </div>
                  {/* no hp */}
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
                      value={noHP}
                      onChange={handleChangeNoHP}
                    />
                  </div>
                </div>
                {/* email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    placeholder="name@student.ub.ac.id"
                    required={true}
                    value={email}
                    onChange={handleEmail}
                  />
                </div>
                {/* password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required={true}
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
                {/* conf password */}
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required={true}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button
                  type="submit"
                  className="w-full text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Buat Akun
                </button>
                <p className="text-sm font-light text-gray-500">
                  Sudah memiliki akun?{" "}
                  <Link
                    to={"/"}
                    className="font-medium text-primary-600 hover:underline "
                  >
                    Masuk disini
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
