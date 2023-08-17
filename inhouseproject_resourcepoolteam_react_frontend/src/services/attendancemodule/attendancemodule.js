import serviceUtil from "../utils";

const getBatchesInfo = async (status) => {
  try {
    const { data } = await serviceUtil.get(`batchs/${status}`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const getAttendanceDetails = async (payload) => {
  try {
    const { data } = await serviceUtil.post(`candidates-attendance`, payload);
    return { data };
  } catch (error) {
    return { error };
  }
};

const saveAttendance = async (payload) => {
  try {
    const { data } = await serviceUtil.post(`attendance`, payload);
    return { data };
  } catch (error) {
    return { error };
  }
};

const markAsHoliday = async (payload) => {
  try {
    const { data } = await serviceUtil.post(`attendance-holiday`, payload);
    return { data };
  } catch (error) {
    return { error };
  }
};

const getQrCodeOfAParticularBatch = async (trainerId) => {
  try {
    const { data } = await serviceUtil.post(`attendance-qr`, null, {
      headers: {
        candidateId: trainerId,
      },
    });
    return { data };
  } catch (error) {
    return { error };
  }
};

export {
  getBatchesInfo,
  getAttendanceDetails,
  saveAttendance,
  markAsHoliday,
  getQrCodeOfAParticularBatch,
};
