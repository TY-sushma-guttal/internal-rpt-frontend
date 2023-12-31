const regex = {
  nameRegex: /^[A-Za-z]+$/,
  mobileRegex: /^(\+|\d)[0-9]{7,16}$/,
  emailRegex: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+(\.\w{2,3})$/,
  notAllowSpecialChar: /[^a-zA-Z0-9]/,
  nameWithSpaces: /^[a-zA-Z ]*$/,
  nameWithSpacesAndNumbers: /^[a-zA-Z0-9 ]*$/,
  pancardNumberRegex: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
  indianMobileNumberRegex: /^[6-9]\d{9}$/,
  adhaarNumberRegex: /^[2-9]\d{3}\s?\d{4}\s?\d{4}$/,
  numberRegex: /^[0-9]+$/,
  percentageRegex: /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/,
  cgpaRegex: /^(?:10\.0|\d(?:\.\d{1,2})?)$/,
};

export { regex };
