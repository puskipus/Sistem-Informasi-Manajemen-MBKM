import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { NavLink } from "react-router-dom";

export default function SideNav() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownVisible2, setDropdownVisible2] = useState(false);
  const [role, setRole] = useState("");

  const toggleDropdown = (dropdownNumber) => {
    if (dropdownNumber === 1) {
      setDropdownVisible(!dropdownVisible);
    } else if (dropdownNumber === 2) {
      setDropdownVisible2(!dropdownVisible2);
    }
  };

  const renderUnitMBKM = () => {
    if (role === "unitmbkm") {
      return (
        <div>
          {/* user admin */}
          <li>
            <NavLink
              to={"/admin/akun"}
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-300 flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group"
                  : "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/pendataan/unitmbkm"
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-300 flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group"
                  : "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm200-190q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z" />
              </svg>
              <span className="ms-3">Pendataan</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to={"/bagi-dospem"}
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-300 flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group"
                  : "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
              }
            >
              <div className="flex items-center text-gray-900 rounded-lg  group cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M160-80q-33 0-56.5-23.5T80-160v-440q0-33 23.5-56.5T160-680h200v-120q0-33 23.5-56.5T440-880h80q33 0 56.5 23.5T600-800v120h200q33 0 56.5 23.5T880-600v440q0 33-23.5 56.5T800-80H160Zm0-80h640v-440H600q0 33-23.5 56.5T520-520h-80q-33 0-56.5-23.5T360-600H160v440Zm80-80h240v-18q0-17-9.5-31.5T444-312q-20-9-40.5-13.5T360-330q-23 0-43.5 4.5T276-312q-17 8-26.5 22.5T240-258v18Zm320-60h160v-60H560v60Zm-200-60q25 0 42.5-17.5T420-420q0-25-17.5-42.5T360-480q-25 0-42.5 17.5T300-420q0 25 17.5 42.5T360-360Zm200-60h160v-60H560v60ZM440-600h80v-200h-80v200Zm40 220Z" />
                </svg>
                <span className="flex-1 ms-3">Pembagian Dosen Pembimbing</span>
              </div>
            </NavLink>
          </li>

          <li>
            <NavLink
              to={"/nilai-mitra/admin"}
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-300 flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group"
                  : "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
              }
            >
              <div className="flex items-center text-gray-900 rounded-lg  group cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">
                  Persetujuan Nilai Mitra
                </span>
              </div>
            </NavLink>
          </li>
        </div>
      );
    }
    return null;
  };

  const renderKaprodi = () => {
    if (role === "kaprodi") {
      return (
        <>
          <li>
            <NavLink
              to="/persetujuan"
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-300 flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group"
                  : "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 12l2 2 4-4"></path>
              </svg>
              <span className="ms-3">Persetujuan</span>
            </NavLink>
          </li>
        </>
      );
    }
    return null;
  };

  const renderMahasiswa = () => {
    if (role === "mahasiswa") {
      return (
        <div>
          <button
            type="button"
            className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 "
            aria-controls="dropdown-example"
            data-collapse-toggle="dropdown-example"
            onClick={() => toggleDropdown(1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm200-190q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z" />
            </svg>

            <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
              MBKM
            </span>
            <svg
              className="w-3 h-3"
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
          <li
            id="dropdown-example"
            className={`py-2 space-y-2 ${dropdownVisible ? "" : "hidden"}`}
          >
            <li>
              <NavLink
                to={"/pendaftaran"}
                className={({ isActive }) =>
                  isActive
                    ? "bg-gray-300 flex items-center w-full p-2 pl-11 text-gray-900 transition duration-75 rounded-lg group"
                    : "flex items-center w-full p-2 pl-11 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
                }
              >
                Pendaftaran MBKM
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "bg-gray-300 flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group"
                    : "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
                }
                to={"/pendataan"}
              >
                Pendataan MBKM
              </NavLink>
            </li>
          </li>
          <li>
            <NavLink
              to="/dospem"
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-300 flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group"
                  : "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
              </svg>
              <span className="ms-3">Dosen Pembimbing</span>
            </NavLink>
          </li>
        </div>
      );
    }
    return null;
  };

  const renderDospem = () => {
    if (role === "dospem") {
      return (
        <div>
          <li>
            <NavLink
              to="/mahasiswa-bimbingan"
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-300 flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group"
                  : "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
              }
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M5 22v-2a7 7 0 0 1 14 0v2" />
              </svg>
              <span className="ms-3">Mahasiswa Bimbingan</span>
            </NavLink>
          </li>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    setRole(JSON.parse(localStorage.getItem("role")));
  }, []);

  return (
    <>
      <Navbar />

      <aside
        id="logo-sidebar"
        className="fixed top-10 left-0 z-0 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group bg-gray-300"
                    : "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-300"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </NavLink>
            </li>

            {renderUnitMBKM()}

            {renderKaprodi()}

            {renderMahasiswa()}

            {renderDospem()}

            {role !== "kaprodi" ? (
              <li>
                <button
                  type="button"
                  className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 "
                  aria-controls="dropdown-example"
                  data-collapse-toggle="dropdown-example"
                  onClick={() => toggleDropdown(2)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 12l2 2 4-4"></path>
                  </svg>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                    Aktivitas
                  </span>
                  <svg
                    className="w-3 h-3"
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
                  id="dropdown-example"
                  className={`py-2 space-y-2 ${
                    dropdownVisible2 ? "" : "hidden"
                  }`}
                >
                  <NavLink
                    to={"/penugasan"}
                    className={({ isActive }) =>
                      isActive
                        ? "bg-gray-300 flex items-center w-full p-2 pl-11 text-gray-900 transition duration-75 rounded-lg group"
                        : "flex items-center w-full p-2 pl-11 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
                    }
                  >
                    Penugasan {role === "dospem" ? "Mahasiswa Bimbingan" : null}
                  </NavLink>
                  {role === "mahasiswa" ? (
                    <>
                      <li>
                        <NavLink
                          to={"/logbook"}
                          className={({ isActive }) =>
                            isActive
                              ? "bg-gray-300 flex items-center w-full p-2 pl-11 text-gray-900 transition duration-75 rounded-lg group"
                              : "flex items-center w-full p-2 pl-11 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
                          }
                        >
                          Logbook
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={"/nilai-mitra"}
                          className={({ isActive }) =>
                            isActive
                              ? "bg-gray-300 flex items-center w-full p-2 pl-11 text-gray-900 transition duration-75 rounded-lg group"
                              : "flex items-center w-full p-2 pl-11 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
                          }
                        >
                          Pengumpulan Nilai Mitra
                        </NavLink>
                      </li>
                    </>
                  ) : null}
                </div>
              </li>
            ) : null}
          </ul>
        </div>
      </aside>
    </>
  );
}
