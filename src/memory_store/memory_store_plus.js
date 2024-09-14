import { DateTime, Interval } from "luxon";
import MemoryStores from "./memory_store.js";

class MemoryStoreOption {
  ttl = 60;
  firstRequest;
  expired = false;
  constructor(ttl) {
    this.ttl = ttl;
    this.firstRequest = DateTime.now();
    let functions = [
      this.timeDifference,
      this.reset,
      this.updateFirstRequest,
      this.isExpired,
    ];
    functions.forEach((reference, index) => reference.bind(this));
  }
  timeDifference(current_datetime) {
    let interval_value = Interval.fromDateTimes(
      this.firstRequest,
      current_datetime
    ).count();
    return interval_value;
  }
  reset() {
    this.firstRequest = DateTime.now();
  }
  updateFirstRequest(datetime) {
    this.firstRequest = datetime;
  }
  isExpired(current_datetime) {
    if (this.expired == false) {
      this.expired = this.timeDifference(current_datetime) >= this.ttl;
    }
    return this.expired;
  }
}
class MemoryStoreWithOptions {
  store = new MemoryStores();
  detail = new MemoryStores();
  constructor() {
    let functions = [this.set, this.get];
    functions.forEach((reference, index) => reference.bind(this));
  }
  set(key, value, options = { ttl: 60 * 1000 }) {
    this.store.set(key, value);
    let memoryStoreOption = new MemoryStoreOption(options.ttl);
    this.detail.set(key, memoryStoreOption);
  }
  get(key) {
    return this.store.get(key);
  }
  isExpired(key, current_datetime) {
    if (this.store.get(key) == null) {
      return false;
    }
    return this.detail.get(key).isExpired(current_datetime);
  }
}

export default MemoryStoreWithOptions;
