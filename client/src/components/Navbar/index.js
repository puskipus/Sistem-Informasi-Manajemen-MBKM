import React from "react";
import { Dropdown, Navbar as Navbarflowbite } from "flowbite-react";
import mbkmLogo from "../../images/logo-kampus-merdeka.png";
import ubLogo from "../../images/Logo_Universitas_Brawijaya.png";
import filkomLogo from "../../images/logo_filkom.png";
import { useNavigate, Link, NavLink } from "react-router-dom";
import Swal from "sweetalert2";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah akan logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (result.isConfirmed) {
      if (JSON.parse(localStorage.getItem("role")) !== "mahasiswa") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      localStorage.clear();
    }
  };

  const role = JSON.parse(localStorage.getItem("role"));

  return (
    <Navbarflowbite
      fluid
      rounded
      style={{
        backgroundColor: "#0154a6",
        position: "fixed",
        width: "100%",
        zIndex: 10,
      }}
    >
      <Navbarflowbite.Brand href="/dashboard">
        <img className="w-16 md:w-32 mr-2" src={mbkmLogo} alt="logo" />
        <img className="w-16 md:w-16 mr-2" src={ubLogo} alt="logo" />
        <img className="w-28 md:w-40 mr-2" src={filkomLogo} alt="logo" />
      </Navbarflowbite.Brand>
      <div className="flex md:order-2 max-w-full gap-5 text-white p-2">
        <Dropdown
          arrowIcon={true}
          inline
          label={
            localStorage.getItem("nama")?.split(" ")[0].replace(/["']/g, "") ||
            ""
          }
          className="truncate ..."
        >
          <Dropdown.Item>
            <Link to={"/account"}>Account</Link>
          </Dropdown.Item>
          <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbarflowbite.Toggle />
      </div>
      <Navbarflowbite.Collapse className="md:hidden">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group bg-blue-300"
              : "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-blue-300"
          }
        >
          <span>Dashboard</span>
        </NavLink>
        {role === "mahasiswa" ? (
          <>
            <NavLink
              to={"/pendaftaran"}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group bg-blue-300"
                  : "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-blue-300"
              }
            >
              Pendaftaran MBKM
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group bg-blue-300"
                  : "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-blue-300"
              }
              to={"/pendataan"}
            >
              Pendataan MBKM
            </NavLink>
            <NavLink
              to="/dospem"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group bg-blue-300"
                  : "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-blue-300"
              }
            >
              <span>Dosen Pembimbing</span>
            </NavLink>
            <NavLink
              to={"/logbook"}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group bg-blue-300"
                  : "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-blue-300"
              }
            >
              Logbook
            </NavLink>
            <NavLink
              to={"/nilai-mitra"}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group bg-blue-300"
                  : "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-blue-300"
              }
            >
              Pengumpulan Nilai Mitra
            </NavLink>
          </>
        ) : null}

        {role === "unitmbkm" ? (
          <>
            <NavLink
              to={"/admin/akun"}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group bg-blue-300"
                  : "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-blue-300"
              }
            >
              <span>Users</span>
            </NavLink>
            <NavLink
              to="/pendataan/unitmbkm"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group bg-blue-300"
                  : "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-blue-300"
              }
            >
              <span>Pendataan</span>
            </NavLink>
            <NavLink
              to={"/bagi-dospem"}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group bg-blue-300"
                  : "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-blue-300"
              }
            >
              <span>Pembagian Dosen Pembimbing</span>
            </NavLink>
            <NavLink
              to={"/nilai-mitra/admin"}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group bg-blue-300"
                  : "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-blue-300"
              }
            >
              <span>Persetujuan Nilai Mitra</span>
            </NavLink>
          </>
        ) : null}

        {role === "dospem" ? (
          <NavLink
            to="/mahasiswa-bimbingan"
            className={({ isActive }) =>
              isActive
                ? "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group bg-blue-300"
                : "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-blue-300"
            }
          >
            <span>Mahasiswa Bimbingan</span>
          </NavLink>
        ) : null}

        {role === "unitmbkm" || role === "mahasiswa" || role === "dospem" ? (
          <>
            <NavLink
              to={"/penugasan"}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group bg-blue-300"
                  : "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-blue-300"
              }
            >
              Penugasan {role === "dospem" ? "Mahasiswa Bimbingan" : null}
            </NavLink>
          </>
        ) : null}

        {role === "kaprodi" ? (
          <NavLink
            to="/persetujuan"
            className={({ isActive }) =>
              isActive
                ? "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group bg-blue-300"
                : "flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-blue-300"
            }
          >
            <span>Persetujuan</span>
          </NavLink>
        ) : null}
      </Navbarflowbite.Collapse>
    </Navbarflowbite>
  );
}
