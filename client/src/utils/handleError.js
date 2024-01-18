import { toast } from "react-toastify";

const handleError = (error) => {
  if (error.response.data.msg === "jwt expired") {
    toast.info("Sesi Anda telah habis, silakan login ulang", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    if (JSON.parse(localStorage.getItem("role")) === "mahasiswa") {
      window.location.href = "/";
    } else {
      window.location.href = "/admin";
    }
    localStorage.clear();
  }

  return error;
};

export default handleError;
