import { currentDate, currentTime } from "../utils/datetime/now.js";

class Logger {
  date;
  time;
  prefix;
  constructor({date = true, time = false, prefix = "Logger"}) {
    this.date = date;
    this.time = time;
    this.prefix = prefix;
    this.getPrefix.bind(this);
    this.log.bind(this);
  }
  getPrefix() {
    let log_this = "";
    if (this.date == true) {
      log_this = log_this.concat(`[${currentDate()}]`);
    }
    if (this.time == true) {
      if (this.date == true) {
        log_this = log_this.concat(" ");
      }
      log_this = log_this.concat(`[${currentTime()}]`);
    }
    if (this.prefix.length > 0) {
      if (log_this.length > 0) {
        log_this = log_this .concat([" "]);
      }
      log_this = log_this .concat(this.prefix);
    }
    return log_this;
  }
  log(content = "") {
    let log_this = this.getPrefix(content);
    console.log(`${log_this} - `, content);
  }
}

export default Logger;
