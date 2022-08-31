import moment from "moment";

/**
 * Function to get the formatted date
 * @param {Object} date - To get selected date
 */
const getFormattedDate = (date, format = "MM/DD/YYYY") => {
    return date && moment(date).format(format);
};

export { getFormattedDate };