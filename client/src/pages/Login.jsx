import React, { useEffect, useState } from "react";
import mbkmLogo from "../images/logo-kampus-merdeka.webp";
import ubLogo from "../images/Logo_Universitas_Brawijaya.png";
import filkomLogo from "../images/logo_filkom.png";
import { postData } from "../utils/fetch";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(form);
    const res = await postData(`/auth/signin`, form);
    console.log(res);

    if (res?.data) {
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
    setError("");
  }, [form]);

  return (
    <>
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
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
                Masuk ke dalam akun Anda
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
                    placeholder="email@student.ub.ac.id"
                    required={true}
                    value={form?.email}
                    onChange={handleChange}
                  />
                </div>
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
                    required={true}
                    value={form?.password}
                    onChange={handleChange}
                  />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button
                  type="submit"
                  className="w-full text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Masuk
                </button>
                <p className="text-sm font-light text-gray-500">
                  Belum memiliki akun?{" "}
                  <Link
                    to={"/register"}
                    className="font-medium text-slate-500 hover:underline"
                  >
                    Daftar
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
