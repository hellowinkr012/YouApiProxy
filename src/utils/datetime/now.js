import { DateTime } from "luxon";

let currentDate = () => {
    return DateTime.now().toFormat("yyyy-LL-dd");
};

let currentTime = () => {
    return DateTime.now().toFormat("HH:MM:ss");
};

export {
    currentDate , 
    currentTime
};