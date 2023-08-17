import moment from "moment/moment";

const returnProperDate = (aDate) => {
  return `${aDate.getDate() >= 10 ? aDate.getDate() : `0${aDate.getDate()}`}-${
    aDate.getMonth() + 1 >= 10
      ? aDate.getMonth() + 1
      : `0${aDate.getMonth() + 1}`
  }-${aDate.getFullYear()}`;
};

const returnProperTime = (time) => {
  let hour =
    time.hour() === 0
      ? "12"
      : time.hour() <= 9
      ? `0${time.hour()}`
      : time.hour();
  let minute =
    time.minute() === 0
      ? `0${time.minute()}`
      : time.minute() <= 9
      ? `0${time.minute()}`
      : time.minute();
  return `${hour}:${minute}:00`;
};

const changeDate = (aDate) => {
  console.log(aDate, "change");
  const date = new Date(aDate);
  console.log(date, "change");
  let getdate = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
  let getmonth =
    date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  let year = date.getFullYear();

  return `${getdate}-${getmonth}-${year}`;
};
// export { returnProperDate, returnProperTime, changeDate };
// formatDate To DatePicker format
let datePickerFormat = (val) => {
  let formattedEndDate = val.split(" ")[0];
  let formatDatePicker = formattedEndDate.split("-");
  let requiredDate = `${formatDatePicker[1]}-${formatDatePicker[0]}-${formatDatePicker[2]}`;
  return requiredDate;
};

// format date to backend format
let formatDateToBackEndReqirement = (val) => {
  let data = moment(val).format("DD-MM-YYYY");
  return data;
};

let getLocalTime = () => {
  let eventTime = moment.utc().local().format("YYYY-MM-DDTHH:mm:ss").split("T");
  return eventTime[1];
};

export {
  returnProperDate,
  datePickerFormat,
  formatDateToBackEndReqirement,
  getLocalTime,
  returnProperTime,
  changeDate,
};
