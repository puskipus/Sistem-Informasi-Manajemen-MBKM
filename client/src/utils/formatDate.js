export function formatDate(dateString) {
  const date = new Date(dateString);

  // Get date components
  const day = date.toLocaleDateString("id-ID", { day: "2-digit" });
  const month = date.toLocaleDateString("id-ID", { month: "2-digit" });
  const year = date.toLocaleDateString("id-ID", { year: "numeric" });

  // Get time component
  const time = date.toLocaleTimeString("id-ID", { timeStyle: "short" });

  // Combine date and time
  const formattedDate = `${day}-${month}-${year}, ${time}`;

  return formattedDate;
}

export function formatDateNoTime(dateString) {
  const date = new Date(dateString);

  // Get date components
  const day = date.toLocaleDateString("id-ID", { day: "2-digit" });
  const month = date.toLocaleDateString("id-ID", { month: "2-digit" });
  const year = date.toLocaleDateString("id-ID", { year: "numeric" });

  // Combine date and time
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}
