import { DateTime, Interval } from "luxon";
import MemoryStores from "../memory_store/memory_store.js";

class RateLimitUserObject {
  limit = 5;
  window_size = 60;
  firstRequest;
  lastRequest;
  initialLimit = 5;
  constructor(limit, window_size) {
    this.firstRequest = DateTime.now();
    this.lastRequest = DateTime.now();
    if (limit != undefined) {
      this.limit = limit;
      this.initialLimit = limit;
    }
    if (window_size != undefined) {
      this.window_size = window_size;
    }

    this.refill.bind(this);
    this.updateLastRequest.bind(this);
    this.timeDifference.bind(this);
    this.isUnderRateLimit.bind(this);
  }

  updateLastRequest(datetime) {
    this.lastRequest = datetime;
  }
  timeDifference(current_datetime) {
    let interval_value = Interval.fromDateTimes(
      this.firstRequest,
      current_datetime
    ).count();
    return interval_value;
  }
  refill() {
    this.limit = this.initialLimit;
    this.firstRequest = DateTime.now();
    this.updateLastRequest(this.firstRequest);
  }
  isUnderRateLimit() {
    let current_datetime = DateTime.now();
    if (this.timeDifference(current_datetime) < this.window_size) {
      if (this.limit > 0) {
        this.updateLastRequest(current_datetime);
        this.limit--;
        return true;
      }
      return false;
    } else {
      this.refill();
      this.limit--;
      return true;
    }
  }
}
// Make one with Database support
class RateLimiter {
  rateLimitStore = new MemoryStores();
  window_size = 60000;
  limit = 5;
  constructor({limit=5, window_size=60}) {
    if (limit != undefined) {
      this.limit = limit;
    }
    if (window_size != undefined) {
      this.window_size = window_size;
    }
  }

  isUnderRateLimit(key) {
    let userDataFound = this.rateLimitStore.get(key);
    if (userDataFound == null) {
      this.rateLimitStore.set(key, new RateLimitUserObject(this.limit,this.window_size));
      userDataFound = this.rateLimitStore.get(key);
    }

    if (userDataFound.isUnderRateLimit() == true) {
      return true;
    } else {
      return false;
    }
  }
}

export default RateLimiter;
