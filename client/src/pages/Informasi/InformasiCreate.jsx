import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DateRange } from "react-date-range";
import { postData } from "../../utils/fetch";
import Swal from "sweetalert2";

export default function InformasiCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    aktivitas: "",
    pelaksana: "",
    waktu: "",
  });
  const [error, setError] = useState("");

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection]);

    const startDate = ranges.selection.startDate;
    const endDate = ranges.selection.endDate;

    let formattedDate = "";

    // Convert to Indonesia time
    const startIndonesiaTime = startDate.toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });
    const endIndonesiaTime = endDate.toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });

    // Format the dates
    const formattedStartDate = startIndonesiaTime.split(",")[0];
    const formattedEndDate = endIndonesiaTime.split(",")[0];

    if (formattedStartDate === formattedEndDate) {
      formattedDate = formattedStartDate; // Use only one date if start and end are the same
    } else {
      formattedDate = `${formattedStartDate} - ${formattedEndDate}`; // Use range if different dates
    }

    setForm({
      ...form,
      waktu: formattedDate,
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Display a confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Apakah akan tambah informasi ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    // Check the result of the confirmation dialog
    if (result.isConfirmed) {
      try {
        const res = await postData(`/informasi`, form);

        if (res?.data) {
          toast.success("Berhasil Tambah Informasi", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate("/dashboard");
        } else {
          navigate("/internal-server-error");
          console.log(res);
          setError(res?.response?.data?.msg || "Terjadi kesalahan pada server");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setError("Terjadi kesalahan pada server");
      }
    }
  };

  useEffect(() => {
    setError("");
  }, [form]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("role")) !== "unitmbkm") {
      navigate("/forbidden");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 sm:ml-64">
      <div className="w-full p-4 border-2 border-gray-200 border-dashed rounded-lg mt-20 sm:mt-24">
        <h1 className="text-2xl text-blue-500 font-bold mb-10">
          Buat Informasi
        </h1>

        {/* form */}
        <form
          className="space-y-4 md:space-y-6 md:w-1/2"
          onSubmit={handleSubmit}
        >
          {/* aktivitas */}
          <div>
            <label
              htmlFor="aktivitas"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Aktivitas
            </label>
            <input
              type="text"
              name="aktivitas"
              id="aktivitas"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
              required={true}
              value={form?.aktivitas}
              onChange={handleChange}
            />
          </div>

          {/* Pelaksana */}
          <div>
            <label
              htmlFor="pelaksana"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Pelaksana
            </label>
            <input
              type="text"
              name="pelaksana"
              id="pelaksana"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
              value={form?.pelaksana}
              onChange={handleChange}
            />
          </div>
          <DateRange
            className="lg:mx-28 mt-10"
            ranges={dateRange}
            onChange={handleDateChange}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type="submit"
            className="w-full text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Buat
          </button>
        </form>
      </div>
    </div>
  );
}
