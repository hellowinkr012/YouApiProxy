
let fetchData = async (url, options) => {
  try {
    let request = await fetch(url, (options = options));
    let json_data = await request.json();
    return json_data;
  } catch (error) {
    return {"error":"Data failed to fetch."};
  }
};

export {
    fetchData
};
