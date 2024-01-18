export function getStringAfterSlash(inputString) {
  const parts = inputString.split("/");
  return parts[parts.length - 1];
}
