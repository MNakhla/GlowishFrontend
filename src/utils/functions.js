import _ from "lodash";
import FreelancerDate from "./FreelancerDate";
import {
  isPast,
  isSameDay,
  isToday,
  subMinutes,
  startOfToday,
  addDays,
  getDay,
} from "date-fns";
const convertDate = (chosenDate) => {
  return `${new Date(chosenDate).getFullYear()}-${
    new Date(chosenDate).getMonth() > 8
      ? new Date(chosenDate).getMonth() + 1
      : `0${new Date(chosenDate).getMonth() + 1}`
  }-${
    new Date(chosenDate).getDate() > 9
      ? new Date(chosenDate).getDate()
      : `0${new Date(chosenDate).getDate()}`
  }`;
};

const arePointsNear = (checkPoint, centerPoint, km) => {
  let ky = 40000 / 360;

  let kx = Math.cos((Math.PI * centerPoint.latitude) / 180.0) * ky;

  let dx = Math.abs(centerPoint.longitude - checkPoint.longitude) * kx;

  let dy = Math.abs(centerPoint.latitude - checkPoint.latitude) * ky;

  return Math.sqrt(dx * dx + dy * dy) <= km;
};

const checkArrayEquality = (array1, array2) => {
  const isEqual =
    array1.length === array2.length &&
    array1.every((val) => array2.includes(val));
  return isEqual;
};

const sortSearchedFreelancersFunc = (sortBy, arrayToBeSorted) => {
  if (sortBy === "averageRating") {
    return _.orderBy(arrayToBeSorted, [sortBy], ["desc"]);
  } else if (sortBy === "price") {
    return _.orderBy(
      arrayToBeSorted,
      (freelancer) =>
        Math.min(...freelancer.services.map((service) => service.price)),
      ["asc"]
    );
  }
};

//#region Date functions
const formatDateFromString = (dateString) => {
  let date = new Date(dateString);
  date = new Date(
    date.getFullYear(), //year YYYY
    date.getMonth(), //month 0-11 0=January
    date.getDate(), //day 1-31
    0, //hours
    0, //minutes
    0, //seconds
    0 //milliseconds
  );
  return date;
};

const formatDateFromDate = (dateDate) => {
  let date = new Date(
    dateDate.getFullYear(), //year YYYY
    dateDate.getMonth(), //month 0-11 0=January
    dateDate.getDate(), //day 1-31
    0, //hours
    0, //minutes
    0, //seconds
    0 //milliseconds
  );
  return date;
};

const isDateInPast = (date) => {
  if (isPast(date) && !isToday(date))
    return true; //date-fns treats today's date as past
  else return false;
};

const isDateInFuture = (date) => {
  if (!isDateInPast(date) && !isToday(date)) return true;
  else return false;
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const dateDayStringToInt = (dayString) => {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let dayInt = weekDays.findIndex((weekDay) => weekDay === dayString);
  return dayInt;
};

const dateDayIntToString = (dayInt) => {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let dayString = weekDays[dayInt];
  return dayString;
};

const dateDayIntToFullString = (dayInt) => {
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let dayString = weekDays[dayInt];
  return dayString;
};

const getTimeDisplay = (mins) => {
  const hour = Math.floor(mins / 60);
  const min = mins % 60;
  return hour === 0
    ? min + " min"
    : min === 0
    ? hour + " hr"
    : hour + " hr " + min + " min";
};

const getDateDisplay = (date) => {
  const dayString = dateDayIntToFullString(getDay(date));
  return (
    dayString +
    " " +
    date.getDate() +
    "." +
    (date.getMonth() + 1) +
    "." +
    date.getFullYear()
  );
};

//#endregion

//#region schedule functions

const getFreelancerDefaultSchedule = (
  defaultWorkingHours,
  defaultLunchBreak
) => {
  //day must not be an offDay, ie it must have a value for defaultWorkingHours
  //but lunch break could be null
  //defaultWorkingHours & defaultLunchBreak startTime and endTime must be rounded to the nearest 15 min
  //ie. accepted values: 08:00, 08:15, 08:30, 08:45, 09:00, 09:15 ..etc
  //check >> https://date-fns.org/v2.28.0/docs/roundToNearestMinutes
  //and must be within the hours of the day ofcourse 00:00->23:00
  let dayStartIndex = translateSlotTimeStringToScheduleSlotIndex(
    defaultWorkingHours.startTime
  );
  let dayEndIndex = translateSlotTimeStringToScheduleSlotIndex(
    getPrevSlotTimeStringFromSlotTimeString(defaultWorkingHours.endTime)
  );
  let lunchStartIndex = null;
  let lunchEndIndex = null;
  if (defaultLunchBreak !== null) {
    lunchStartIndex = translateSlotTimeStringToScheduleSlotIndex(
      defaultLunchBreak.startTime
    );
    lunchEndIndex = translateSlotTimeStringToScheduleSlotIndex(
      getPrevSlotTimeStringFromSlotTimeString(defaultLunchBreak.endTime)
    );
  }
  let schedule = [];
  for (let i = 0; i <= 23; i++) {
    let slotHour = [];
    for (let j = 0; j < 4; j++) {
      let slotStatus = "available";
      if (
        i < dayStartIndex[0] ||
        (i === dayStartIndex[0] && j < dayStartIndex[1])
      ) {
        //before start of working hours
        slotStatus = "disabled";
      }
      if (i > dayEndIndex[0] || (i === dayEndIndex[0] && j > dayEndIndex[1])) {
        //after end of working hours
        slotStatus = "disabled";
      }
      if (
        defaultLunchBreak != null &&
        (i > lunchStartIndex[0] ||
          (i === lunchStartIndex[0] && j >= lunchStartIndex[1])) &&
        (i < lunchEndIndex[0] ||
          (i === lunchEndIndex[0] && j <= lunchEndIndex[1]))
      ) {
        //within lunch break
        slotStatus = "disabled";
      }
      slotHour.push(slotStatus);
    }
    schedule.push(slotHour);
  }
  return schedule;
};

const getFreelancerOffDaySchedule = () => {
  let schedule = [];
  for (let i = 0; i <= 23; i++) {
    let slotHour = [];
    for (let j = 0; j < 4; j++) {
      let slotStatus = "disabled";
      slotHour.push(slotStatus);
    }
    schedule.push(slotHour);
  }
  return schedule;
};

//TODO: test this function
const getPrevSlotTimeStringFromSlotTimeString = (slotTimeString) => {
  let [currSlotHour, currSlotMin] = slotTimeString.split(":");
  currSlotHour = parseInt(currSlotHour);
  currSlotMin = parseInt(currSlotMin);
  let prevSlotHour = subMinutes(
    new Date(2014, 6, 10, currSlotHour, currSlotMin),
    15
  ).getHours();
  let prevSlotMin = subMinutes(
    new Date(2014, 6, 10, currSlotHour, currSlotMin),
    15
  ).getMinutes();
  return prevSlotHour + ":" + prevSlotMin;
};

const isScheduleFullyBooked = (schedule) => {
  let availableHour = schedule.find((hour) => !isHourFullyBooked(hour));
  if (availableHour) return false;
  else return true;
};

const isHourFullyBooked = (hour) => {
  let fullyBooked = hour.includes("available") ? false : true;
  return fullyBooked;
};

const isHourEdittable = (hour) => {
  return hour.includes("available") || hour.includes("disabled");
};

const getAvailableSlotIndeces = (schedule) => {
  // returns an array of each 15 min slot's index [hour,slot] in the schedule 2D array
  let availableSlotIndeces = [];

  schedule.forEach((hour, i) => {
    hour.forEach((slot, j) => {
      if (slot === "available") {
        availableSlotIndeces.push([i, j]);
      }
    });
  });

  return availableSlotIndeces;
};

const getAvailableStartSlotIndecesForAppointment = (
  schedule,
  appointmentTime
) => {
  //appointmentTime is in min and must be divisable by 15
  //ie. accepted values: 15,30,45,60,75,90,105..etc
  //return an array of the indeces of the start slots [hour,slot] for every group of consecutive slots that fit the appointment
  if (!schedule) return [];
  if (isScheduleFullyBooked(schedule)) return [];
  let numConsecutiveSlots = appointmentTime / 15;
  let scheduleAvailableSlots = getAvailableSlotIndeces(schedule);

  let startSlots = [];
  let i = 0;
  let j = 0;
  let prevSlot = scheduleAvailableSlots[i];
  let currSlot = scheduleAvailableSlots[j];
  let runningLength = 1;
  while (
    i < scheduleAvailableSlots.length &&
    j < scheduleAvailableSlots.length
  ) {
    let startSlot = scheduleAvailableSlots[i];
    if (runningLength === numConsecutiveSlots) {
      i += 1;
      j = i;
      runningLength = 1;
      startSlots.push([...startSlot]);
    } else {
      j++;
      if (j < scheduleAvailableSlots.length) {
        prevSlot = scheduleAvailableSlots[j - 1];
        currSlot = scheduleAvailableSlots[j];
        if (isSlotPairIndecesConsecutive(prevSlot, currSlot)) runningLength++;
        else {
          i = j;
          runningLength = 1;
        }
      }
    }
  }
  return startSlots;
};

const isSlotPairIndecesConsecutive = (slotIndex1, slotIndex2) => {
  let [hour1, slot1] = slotIndex1;
  let [hour2, slot2] = slotIndex2;
  if (hour1 === hour2 && slot2 - slot1 === 1)
    return true; //two consecutive slots in the same hour
  else if (hour2 - hour1 === 1 && slot2 === 0 && slot1 === 3)
    return true; //two slot across two consecutive hours, one at the end of the first hour, and one at the beginning of the second hour
  else return false;
};

const translateScheduleSlotIndexToSlotTimeString = (slotIndex) => {
  let [hour, slot] = slotIndex;
  const mins = ["00", "15", "30", "45"];
  const hours = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];
  return "" + hours[hour] + ":" + mins[slot] + "";
};

const translateSlotTimeStringToScheduleSlotIndex = (timeString) => {
  const [hour, min] = timeString.split(":");
  const mins = ["00", "15", "30", "45"];
  const hours = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];
  return [hours.indexOf(hour), mins.indexOf(min)];
};

const getSlotTimeStringArray = () => {
  let slotTimeStringArray = [];
  const mins = ["00", "15", "30", "45"];
  const hours = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];

  hours.forEach((hour) => {
    mins.forEach((min) => {
      slotTimeStringArray.push(hour + ":" + min);
    });
  });
  return slotTimeStringArray;
};

//#endregion

//#region FreelancerDate functions

const getFreelancerDate = (freelancer, inputDate) => {
  const freelancerDate = new FreelancerDate();
  let date = formatDateFromDate(inputDate);
  freelancerDate.date = date;
  freelancerDate.freelancerId = freelancer._id;

  freelancerDate.bHasPassed = isDateInPast(date);
  freelancerDate.bIsToday = isToday(date);

  let specificDateAvailability = freelancer.specificDateAvailability.find(
    (specDate) => isSameDay(formatDateFromString(specDate.date), date)
  );

  if (!specificDateAvailability) {
    //is it a default or specific date?
    freelancerDate.bDefault = true;
    freelancerDate.bHasAppointments = false;
    let defaultAvailability = freelancer.defaultAvailability;
    freelancerDate.bOffDay = defaultAvailability.offDays.includes(
      dateDayIntToString(date.getDay())
    );
    if (!freelancerDate.bOffDay) {
      freelancerDate.areaRadius = defaultAvailability.areaRadius;
      freelancerDate.centerLocation = { ...defaultAvailability.centerLocation };
      freelancerDate.defaultLunchBreak =
        defaultAvailability.lunchBreakHours !== null
          ? {
              ...defaultAvailability.lunchBreakHours,
            }
          : null;
      freelancerDate.defaultWorkingHours = {
        ...defaultAvailability.workingHours,
      };
      freelancerDate.locationStatus = defaultAvailability.locationStatus;
      freelancerDate.schedule = getFreelancerDefaultSchedule(
        freelancerDate.defaultWorkingHours,
        freelancerDate.defaultLunchBreak
      );
      freelancerDate.bFullyBooked = isScheduleFullyBooked(
        freelancerDate.schedule
      );
    } else {
      freelancerDate.schedule = getFreelancerOffDaySchedule();
      freelancerDate.bFullyBooked = false;
    }
  } else {
    freelancerDate.bDefault = false;
    freelancerDate.specificDateAvailabilityId = specificDateAvailability._id;
    freelancerDate.bOffDay = specificDateAvailability.offDay;
    freelancerDate.areaRadius = specificDateAvailability.areaRadius;
    freelancerDate.centerLocation = {
      ...specificDateAvailability.centerLocation,
    };
    freelancerDate.locationStatus = specificDateAvailability.locationStatus;
    freelancerDate.schedule = [...specificDateAvailability.schedule];
    freelancerDate.bHasAppointments =
      specificDateAvailability.schedule.find((hour) =>
        hour.includes("booked")
      ) !== undefined;
    let activeAppointments = freelancer.appointments.filter(
      (app) =>
        isSameDay(formatDateFromString(app.date), formatDateFromDate(date)) &&
        !app.cancelled
    );
    if (activeAppointments.length > 0) {
      freelancerDate.activeAppointments = activeAppointments.map((app) => {
        return {
          appointmentId: app.id,
          startTime: app.startTime,
          endTime: app.endTime,
        };
      });
      freelancerDate.bFullyBooked = isScheduleFullyBooked(
        specificDateAvailability.schedule
      );
    } else {
      freelancerDate.bFullyBooked = isScheduleFullyBooked(
        specificDateAvailability.schedule
      );
    }
  }
  return freelancerDate;
};

const getAllFreelancerDatesPerMonth = (freelancer, month, year) => {
  let daysInMonth = getDaysInMonth(year, month);

  let monthFreelancerDates = [];

  for (let i = 1; i <= daysInMonth; i++) {
    let date = new Date(year, month, i, 0, 0, 0, 0);
    monthFreelancerDates.push(getFreelancerDate(freelancer, date));
  }
  return monthFreelancerDates;
};

const getAllFreelancerDatesThisWeek = (freelancer) => {
  let weekFreelancerDates = [];
  for (let i = 0; i < 7; i++) {
    let date = addDays(startOfToday(), i);
    weekFreelancerDates.push(getFreelancerDate(freelancer, date));
  }
  return weekFreelancerDates;
};

const getFreelancerDateDefaults = (freelancer, inputDate) => {
  //returns a freelancerDate where the inputDate is not in the specificDateAvailability
  let updatedFreelancer = { ...freelancer };
  let updatedSpecificDateAvailability =
    freelancer.specificDateAvailability.filter(
      (oldSpec) => !isSameDay(formatDateFromString(oldSpec.date), inputDate)
    );
  updatedFreelancer.specificDateAvailability = updatedSpecificDateAvailability;
  const defaultFreelancerDate = getFreelancerDate(updatedFreelancer, inputDate);
  return defaultFreelancerDate;
};

const transformFreelancerWorkingDateDefaultAvailabilityIntoSpecific = (
  freelancer,
  inputDate
) => {
  //inputDate must be a default working date
  const freelancerDate = getFreelancerDate(freelancer, inputDate);
  // if (freelancerDate.bDefault === false || freelancerDate.bOffDay === true) {
  //   console.log(
  //     "couldn't transformFreelancerDateDefaultAvailabilityIntoSpecific"
  //   );
  //   console.log("inputDate must be a default working date");
  // }
  const specificDateAvailability = {
    freelancer: freelancerDate.freelancerId,
    schedule: freelancerDate.schedule,
    centerLocation: freelancerDate.centerLocation,
    areaRadius: freelancerDate.areaRadius, //km
    date: inputDate,
    locationStatus: freelancerDate.locationStatus,
    offDay: freelancerDate.offDay,
  };
  return specificDateAvailability;
};
//#endregion

export {
  convertDate,
  arePointsNear,
  checkArrayEquality,
  formatDateFromDate,
  formatDateFromString,
  getDaysInMonth,
  isDateInPast,
  isDateInFuture,
  dateDayIntToString,
  dateDayIntToFullString,
  dateDayStringToInt,
  translateScheduleSlotIndexToSlotTimeString,
  translateSlotTimeStringToScheduleSlotIndex,
  isSlotPairIndecesConsecutive,
  getAvailableStartSlotIndecesForAppointment,
  getAvailableSlotIndeces,
  isHourFullyBooked,
  isHourEdittable,
  isScheduleFullyBooked,
  getPrevSlotTimeStringFromSlotTimeString,
  getFreelancerDefaultSchedule,
  getFreelancerOffDaySchedule,
  getFreelancerDateDefaults,
  transformFreelancerWorkingDateDefaultAvailabilityIntoSpecific,
  getFreelancerDate,
  getAllFreelancerDatesPerMonth,
  getTimeDisplay,
  getDateDisplay,
  getAllFreelancerDatesThisWeek,
  getSlotTimeStringArray,
  sortSearchedFreelancersFunc,
};
