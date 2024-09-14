import express, { query } from "express";
import { DateTime } from "luxon";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import RateLimiter from "./src/rate_limiter/rate_limiter.js";
import Logger from "./src/logger/logger.js";

import { fetchData } from "./src/api/api_manager.js";
import MemoryStoreWithOptions from "./src/memory_store/memory_store_plus.js";
import ApiEndpoints from "./src/api/api_endpoint.js";
import { ErrorNames } from "./src/error_handler/error_handler.js";
import AuthHandler from "./src/authentication/auth_v1.js";

// Load Env file -> Load environment variables
dotenv.config({ path: "./.env" });

const PORT_NUMBER = process.env.DEVELOPMENT_PORT_NUMBER;
// Server initialization block .
const app = express();
let logger = new Logger({ date: true, time: true, prefix: "index" });
let apiLogger = new Logger({ date: true, time: true, prefix: "GET /REPO" });
let rateLimiter = new RateLimiter({
  limit: process.env.DEFAULT_RATE_LIMIT || 5,
  window_size: process.env.DEFAULT_RATE_LIMIT_DURATION || 60000,
});
let apiCacheStore = new MemoryStoreWithOptions();
let authHandler = new AuthHandler();

//Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/repo", async (req, res) => {
  logger.log(`\n> GET : /repo`);

  let rateLimitUserKey = req.ip;
  let queryString = req.query.query;
  let current_datetime = DateTime.now();
  let authorization = req.headers.authorization;
  try {
    if (authorization === undefined) {
      throw new Error(ErrorNames.authNotProvidedText);
    }
    let credential = authHandler.getCredential(authorization);
    if (credential === null) {
      throw new Error(ErrorNames.authCredentialsFormatNot);
    }
    if (
      authHandler.isAuth(credential["username"], credential["password"]) ==
      false
    ) {
      throw new Error(ErrorNames.authCredentialsNotCorrect);
    }
  } catch (error) {
    if (error.message == ErrorNames.authNotProvidedText) {
      res.status(401).json({ error: ErrorNames.authNotProvidedError });
    } else if (error.message == ErrorNames.authCredentialsNotCorrect) {
      res.status(401).json({ error: ErrorNames.authCredentialsNotCorrectText });
    } else if (error.message == ErrorNames.authCredentialsFormatNot) {
      res.status(401).json({ error: ErrorNames.authCredentialsFormatNotError });
    } else {
      res.status(500).json({ error: ErrorNames.authCredentialCheckError });
    }

    return;
  }

  try {
    apiLogger.log(`IP = ${rateLimitUserKey}`);
    apiLogger.log(`Timestamp = ${current_datetime}`);
    apiLogger.log(
      `APi limit left = ${
        rateLimiter.rateLimitStore.get(rateLimitUserKey)?.limit ?? 0
      }`
    );
    apiLogger.log(`QueryString = ${queryString}`);
    if (apiCacheStore.get(queryString) != null) {
      apiLogger.log(
        `Cache expired = ${
          apiCacheStore.isExpired(queryString, current_datetime) ?? false
        }`
      );
    }
  } catch (error) {
    res.status(500).json({ error: ErrorNames.reposFetchResText });
    return;
  }

  // Error boundary
  try {
    // Check for rate limit
    let rateLimitCheck = rateLimiter.isUnderRateLimit(rateLimitUserKey);
    if (rateLimitCheck == false) {
      throw new Error(ErrorNames.rateLimitExceededText);
    }

    // Check for response in cache
    let cacheFound = apiCacheStore.get(queryString);
    // Cache not found : Retreive it from store and set in cache with key as query String
    if (
      cacheFound == null ||
      apiCacheStore.isExpired(queryString, current_datetime) === true
    ) {
      apiLogger.log(`> Cache not found or expired`);
      let searchUrl = new URL(ApiEndpoints.githubReposStart);
      searchUrl.searchParams.append("q",queryString);

      let repositories = await fetchData(
        searchUrl,
        ApiEndpoints.options
      );
      if (repositories.hasOwnProperty("error") == true) {
        throw new Error(ErrorNames.reposFetchText);
      }
      apiCacheStore.set(queryString, repositories, {
        ttl: process.env.DEFAULT_API_CACHE_TTL,
      });
      apiLogger.log(`> Saved in memory store`);
      res.status(200).json(repositories);
    } else {
      apiLogger.log(`> Cache hit`);
      res.status(200).json(apiCacheStore.get(queryString));
    }
  } catch (error) {
    // Handle errors in above api call
    if (error.message == ErrorNames.rateLimitExceededText) {
      res.status(429).json({ error: ErrorNames.rateLimitResText }).end();
    } else {
      res.status(500).json({ error: ErrorNames.reposFetchError });
    }
  }
});

// Root address
app.get("/", (req, res) => {
  res.status(200).json({
    PORT: PORT_NUMBER,
  });
});

// Start server block .
app.listen(PORT_NUMBER, () => {
  logger.log(`Server listening at port ${PORT_NUMBER}`);

  logger.log(`> http://localhost:${PORT_NUMBER}`);
});
