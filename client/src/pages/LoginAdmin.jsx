import React, { useEffect, useState } from "react";
import mbkmLogo from "../images/logo-kampus-merdeka.webp";
import ubLogo from "../images/Logo_Universitas_Brawijaya.png";
import filkomLogo from "../images/logo_filkom.png";
import { postData } from "../utils/fetch";
import { useNavigate } from "react-router-dom";

export default function LoginAdmin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [RoleSelect, setRoleSelect] = useState("Masuk sebagai");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeRole = (event) => {
    let roleValue;

    setRoleSelect(event);

    if (event === "Unit MBKM") {
      roleValue = "unitmbkm";
    } else if (event === "Dosen Pembimbing") {
      roleValue = "dospem";
    } else if (event === "Ketua Program Studi") {
      roleValue = "kaprodi";
    }

    setForm({ ...form, role: roleValue });
    toggleDropdown();
  };

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.role === "") {
      setError("Pilih role Anda!");
    }

    try {
      const res = await postData(`/admin/auth/signin`, form);

      if (res?.data) {
        const { token, authenticated, role, nama } = res.data;

        localStorage.setItem("authenticated", JSON.stringify(authenticated));
        localStorage.setItem("role", JSON.stringify(role));
        localStorage.setItem("nama", JSON.stringify(nama));
        localStorage.setItem("token", JSON.stringify(token));

        navigate("/dashboard");
      } else {
        console.log(res);
        setError(res?.response?.data?.msg || "Terjadi kesalahan pada server");
      }
    } catch (error) {
      navigate("/internal-server-error");
    }
  };

  useEffect(() => {
    if (form.role !== "") {
      setError("");
    }
  }, [form.role]);

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
                <div className="relative">
                  <button
                    id="dropdown-button"
                    data-dropdown-toggle="dropdown"
                    className="flex-shrink-0 flex items-center justify-between w-full z-10 py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300"
                    type="button"
                    onClick={toggleDropdown}
                  >
                    <span className="flex items-center">{RoleSelect}</span>
                    <svg
                      className="w-2.5 h-2.5"
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
                    className={`absolute z-50 ${
                      dropdownVisible ? "" : "hidden"
                    } bg-white divide-y divide-gray-100 rounded-lg shadow w-full top-10 dark:bg-gray-700`}
                  >
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdown-button"
                    >
                      <li>
                        <div
                          onClick={() => handleChangeRole("Unit MBKM")}
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          Unit MBKM
                        </div>
                        <div
                          onClick={() => handleChangeRole("Dosen Pembimbing")}
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          Dosen Pembimbing
                        </div>
                        <div
                          onClick={() =>
                            handleChangeRole("Ketua Program Studi")
                          }
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          Ketua Program Studi
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
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
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
