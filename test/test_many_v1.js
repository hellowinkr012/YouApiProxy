const myHeaders = new Headers();

// It is one of credentials set in server (For test purpose)
const username = "admin";
const password = "11111111";

const base64_credential_string = btoa(`${username}:${password}`);
myHeaders.append("Authorization", `Basic ${base64_credential_string}`);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};
const requestEndpoint = new URL("http://127.0.0.1:5000/repo");
requestEndpoint.searchParams.append("query", "Express");

let queries = Array.from({ length: 15 }).map((_, id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch(requestEndpoint, requestOptions)
        .then((response) => (response.status == 200 ? resolve() : reject()))
        .catch((error) => reject(error));
    }, id * 2000);
  });
});

let promiseTest = Promise.allSettled(queries);

promiseTest
  .then((result) => {
    const frequencyCnts = result.reduce((map, item) => {
      if (map[item.status]) {
        map[item.status] += 1;
      } else {
        // If the status is not yet in the map, set its value to 1
        map[item.status] = 1;
      }
      return map;
    }, {});
    console.log(frequencyCnts);
  })
  .catch((error) => {
    console.log("Error in testing multiple endpoint calls .");
    console.log(error);
  });
