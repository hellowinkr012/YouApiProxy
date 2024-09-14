import fs from "fs";

class Logger {
  logger_service;
  file;
  constructor(logger_service, file = "") {
    this.logger_service = logger_service;
    this.file = file;
    this.log.bind(this);
  }
  log(content = "") {
    let log_that = this.logger_service.getPrefix();
    log_that.concat(`${content}`);

    fs.writeFile(this.file, log_that, (error) => {
      if (error) {
        return false;
      } else {
        return true;
      }
    });
  }
}

export default Logger;
