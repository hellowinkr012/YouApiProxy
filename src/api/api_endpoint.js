class ApiEndpoints {
  static githubReposTest =
    "https://api.github.com/search/repositories?q=React&sort=stars&order=desc";
  static githubReposStart = "https://api.github.com/search/repositories";

  static options = {
    accept: "application/vnd.github+json",
  };
}

export default ApiEndpoints;
