# Reverse Proxy Server in Express.js

#### This project is an Express.js-based reverse proxy server designed to handle requests and forward them to another server. It interfaces with the GitHub repository search API, efficiently managing incoming requests, optimizing performance, and enhancing security.

## Key Features:
1. **Rate Limiting**: Controls the number of API requests to prevent overload and ensure fair usage.
2. **API Caching**: Implements caching to minimize unnecessary API calls, improving response times, efficiency, and reducing latency.
3. **Basic Authentication**: Secures communication with the server through authentication mechanisms.
4. **Custom Logging Module**: Provides detailed logs of server activity for monitoring, debugging, and insights.

## How to Run Locally:

1. Clone this repository to your local machine:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the root directory of the project (where the `package.json` is located):
   ```bash
   cd <repository-directory>
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the server in development mode:
   ```bash
   npm run dev
   ```

5. Update the `.env` file to configure rate limiting and API caching according to your requirements:
   ```bash
      DEFAULT_RATE_LIMIT=5               # Maximum number of requests allowed per user within the specified duration.
      DEFAULT_RATE_LIMIT_DURATION=60000  # Time window for rate limiting in milliseconds (e.g., 60 seconds).
      DEFAULT_API_CACHE_TTL=120000       # Time-to-live (TTL) for cached API responses in milliseconds (e.g., 2 minutes).
   ```

## Endpoints:

1. **Repository Search**:
   ```bash
   GET http://localhost:5000/repo?query=<search-query>
   ```
   ## Search parameters:
   1. query : String -> Any name to find repositories in github for
   ## Example Usage:
   #### In javascript : 
   ```javascript
   // Set up request headers
   const myHeaders = new Headers();
   // Base64-encode the username and password for Basic Authentication
   const base64EncodedCredentials = btoa(`${username}:${password}`);

   // Add the Authorization header using the Base64-encoded credentials
   myHeaders.append("Authorization", `Basic ${base64EncodedCredentials}`)
   // Define request options
   const requestOptions = {
     method: "GET",
     headers: myHeaders,
     redirect: "follow"
   };
   
   //Make the API request to the reverse proxy
   fetch("http://127.0.0.1:5000/repo
     query=Express", requestOptions)
   .then((response) => response.text())
   .then((result) => console.log(result))
   .catch((error) => console.error('Error:',
   error));
```
