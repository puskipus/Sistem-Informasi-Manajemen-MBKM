import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import GuestOnlyRoute from "../components/GuestOnlyRoute";
import GuardRoute from "../components/GuardRoute";
import LoginAdmin from "../pages/LoginAdmin";
import UserAdmin from "../pages/UserAdmin";
import Forbidden from "../pages/Forbidden";
import InformasiCreate from "../pages/Informasi/InformasiCreate";
import SideNav from "../components/SideNav";
import InformasiUpdate from "../pages/Informasi/InformasiUpdate";
import PenugasanIndex from "../pages/Penugasan/PenugasanIndex";
import PenugasanCreate from "../pages/Penugasan/PenugasanCreate";
import PenugasanDetail from "../pages/Penugasan/PenugasanDetail";
import PenugasanUpdate from "../pages/Penugasan/PenugasanUpdate";
import PendaftaranIndex from "../pages/Pendaftaran/PendaftaranIndex";
import PendaftaranCreate from "../pages/Pendaftaran/PendaftaranCreate";
import PendaftaranDetail from "../pages/Pendaftaran/PendaftaranDetail";
import PersetujuanIndex from "../pages/Persetujuan/PersetujuanIndex";
import PendataanIndex from "../pages/Pendataan/PendataanIndex";
import PendataanCreate from "../pages/Pendataan/PendataanCreate";
import PendataanDetail from "../pages/Pendataan/PendataanDetail";
import PendataanUnitMbkm from "../pages/Pendataan/PendataanUnitMbkm";
import BagiDospemIndex from "../pages/BagiDospem/BagiDospemIndex";
import DospemIndex from "../pages/Dospem/DospemIndex";
import MahasiswaBimbinganIndex from "../pages/MahasiswaBimbingan/MahasiswaBimbinganIndex";
import LogbookIndex from "../pages/Logbook/LogbookIndex";
import LogbookCreate from "../pages/Logbook/LogbookCreate";
import LogbookMahasiswaDetail from "../pages/Logbook/LogbookMahasiswaDetail";
import NilaiMitraIndex from "../pages/NilaiMitra/NilaiMitraIndex";
import NilaiMitraCreate from "../pages/NilaiMitra/NilaiMitraCreate";
import NilaiMitraDetail from "../pages/NilaiMitra/NilaiMitraDetail";
import NilaiMitraUnitMbkm from "../pages/NilaiMitra/NilaiMitraUnitMbkm";
import AccountIndex from "../pages/Account/AccountIndex";
import { InternalServerError } from "../pages/InternalServerError";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <GuestOnlyRoute>
            <Login />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <GuestOnlyRoute>
            <LoginAdmin />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnlyRoute>
            <Register />
          </GuestOnlyRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <GuardRoute>
            <Dashboard />
          </GuardRoute>
        }
      />

      <Route
        path="/admin/akun"
        element={
          <GuardRoute>
            <UserAdmin />
          </GuardRoute>
        }
      />

      <Route
        path="/informasi/create"
        element={
          <GuardRoute>
            <SideNav />
            <InformasiCreate />
          </GuardRoute>
        }
      />

      <Route
        path="/informasi/update/:id"
        element={
          <GuardRoute>
            <SideNav />
            <InformasiUpdate />
          </GuardRoute>
        }
      />

      <Route
        path="/penugasan"
        element={
          <GuardRoute>
            <SideNav />
            <PenugasanIndex />
          </GuardRoute>
        }
      />

      <Route
        path="/penugasan/:id"
        element={
          <GuardRoute>
            <SideNav />
            <PenugasanDetail />
          </GuardRoute>
        }
      />

      <Route
        path="/penugasan/create"
        element={
          <GuardRoute>
            <SideNav />
            <PenugasanCreate />
          </GuardRoute>
        }
      />

      <Route
        path="/penugasan/update/:id"
        element={
          <GuardRoute>
            <SideNav />
            <PenugasanUpdate />
          </GuardRoute>
        }
      />

      <Route
        path="/pendaftaran"
        element={
          <GuardRoute>
            <SideNav />
            <PendaftaranIndex />
          </GuardRoute>
        }
      />

      <Route
        path="/pendaftaran/create"
        element={
          <GuardRoute>
            <SideNav />
            <PendaftaranCreate />
          </GuardRoute>
        }
      />

      <Route
        path="/pendaftaran/:id"
        element={
          <GuardRoute>
            <SideNav />
            <PendaftaranDetail />
          </GuardRoute>
        }
      />

      <Route
        path="/persetujuan"
        element={
          <GuardRoute>
            <SideNav />
            <PersetujuanIndex />
          </GuardRoute>
        }
      />

      <Route
        path="/pendataan"
        element={
          <GuardRoute>
            <SideNav />
            <PendataanIndex />
          </GuardRoute>
        }
      />

      <Route
        path="/pendataan/create"
        element={
          <GuardRoute>
            <SideNav />
            <PendataanCreate />
          </GuardRoute>
        }
      />

      <Route
        path="/pendataan/:id"
        element={
          <GuardRoute>
            <SideNav />
            <PendataanDetail />
          </GuardRoute>
        }
      />

      <Route
        path="/pendataan/unitmbkm"
        element={
          <GuardRoute>
            <SideNav />
            <PendataanUnitMbkm />
          </GuardRoute>
        }
      />

      <Route
        path="/bagi-dospem"
        element={
          <GuardRoute>
            <SideNav />
            <BagiDospemIndex />
          </GuardRoute>
        }
      />

      <Route
        path="/dospem"
        element={
          <GuardRoute>
            <SideNav />
            <DospemIndex />
          </GuardRoute>
        }
      />

      <Route
        path="/mahasiswa-bimbingan"
        element={
          <GuardRoute>
            <SideNav />
            <MahasiswaBimbinganIndex />
          </GuardRoute>
        }
      />

      <Route
        path="/logbook"
        element={
          <GuardRoute>
            <SideNav />
            <LogbookIndex />
          </GuardRoute>
        }
      />

      <Route
        path="/logbook/create"
        element={
          <GuardRoute>
            <SideNav />
            <LogbookCreate />
          </GuardRoute>
        }
      />

      <Route
        path="/logbook-mahasiswa/:id"
        element={
          <GuardRoute>
            <SideNav />
            <LogbookMahasiswaDetail />
          </GuardRoute>
        }
      />

      <Route
        path="/nilai-mitra"
        element={
          <GuardRoute>
            <SideNav />
            <NilaiMitraIndex />
          </GuardRoute>
        }
      />

      <Route
        path="/nilai-mitra/create"
        element={
          <GuardRoute>
            <SideNav />
            <NilaiMitraCreate />
          </GuardRoute>
        }
      />

      <Route
        path="/nilai-mitra/admin"
        element={
          <GuardRoute>
            <SideNav />
            <NilaiMitraUnitMbkm />
          </GuardRoute>
        }
      />

      <Route
        path="/nilai-mitra/:id"
        element={
          <GuardRoute>
            <SideNav />
            <NilaiMitraDetail />
          </GuardRoute>
        }
      />

      <Route
        path="/account"
        element={
          <GuardRoute>
            <SideNav />
            <AccountIndex />
          </GuardRoute>
        }
      />

      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="/internal-server-error" element={<InternalServerError />} />
    </Routes>
  );
}
