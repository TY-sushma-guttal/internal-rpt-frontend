import serviceUtil from "../utils";

const getAllTrainerDetails = async () => {
  try {
    const { data } = await serviceUtil.get(`trainer`);
    return { data };
  } catch (error) {
    return { error };
  }
};
let getAllAvailableTrainer = async () => {
  try {
    const { data } = await serviceUtil.get(`trainer/available`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const saveTrainerDetails = async (payload) => {
  try {
    const { data } = await serviceUtil.post(`trainer/`, payload);
    return { data };
  } catch (error) {
    return { error };
  }
};

const editTrainerDetails = async (payload) => {
  try {
    const { data } = await serviceUtil.post(`trainer/`, payload);
    return { data };
  } catch (error) {
    return { error };
  }
};

const getTrainerDetailsByID = async (trainerID) => {
  try {
    const { data } = await serviceUtil.get(`trainer/${trainerID}`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const deleteASingleTrainer = async (ID) => {
  try {
    const { data } = await serviceUtil.deleteById(`trainer/${ID}`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const getBatchesForMappingTheTrainer = async (status) => {
  try {
    const { data } = await serviceUtil.get(`batchs/${status}`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const mapATrainer = async (batchId, trainerId) => {
  try {
    const { data } = await serviceUtil.put(`trainer/${batchId}/${trainerId}`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const unMapTrainer = async (batchId) => {
  try {
    const { data } = await serviceUtil.put(`trainer/${batchId}`);
    return { data };
  } catch (error) {
    return { error };
  }
};

export {
  getAllTrainerDetails,
  getAllAvailableTrainer,
  deleteASingleTrainer,
  mapATrainer,
  getBatchesForMappingTheTrainer,
  unMapTrainer,
  saveTrainerDetails,
  editTrainerDetails,
  getTrainerDetailsByID,
};
