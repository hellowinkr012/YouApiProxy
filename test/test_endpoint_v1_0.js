const myHeaders = new Headers();

// It is one of credentials set in server (For test purpose)
const username = "admin";
const password = "11111111";

const base64_credential_string= btoa(`${username}:${password}`);
myHeaders.append("Authorization", `Basic ${base64_credential_string}`);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};
const requestEndpoint =new URL("http://127.0.0.1:5000/repo");
requestEndpoint.searchParams.append("query","Express");

fetch(requestEndpoint, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error))