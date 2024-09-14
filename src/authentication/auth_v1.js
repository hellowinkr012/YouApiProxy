class AuthHandler {
  users_data = {
    test: "12345678",
    admin: "11111111",
  };
  constructor() {}
  isAuth(username = "", password = "") {
    if (this.users_data.hasOwnProperty(username) == false) {
      return false;
    }
    return password == this.users_data[username];
  }
  getCredential(base64_detail) {
    let base64_authorization_string = base64_detail.replace(/Basic\s/, "");
    let auth_to_string = Buffer.from(base64_authorization_string, "base64").toString();

    let auth_detail = auth_to_string.split(":");

    if (auth_detail.length != 2) {
      return null;
    }

    return {
      username: auth_detail[0],
      password: auth_detail[1],
    };
  }
}

export default AuthHandler;
