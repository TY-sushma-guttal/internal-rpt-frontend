import serviceUtil from "../utils";

const getAllBatchDetails = async () => {
  try {
    const { data } = await serviceUtil.get(`batchs`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const getBatchDetailsById = async (ID) => {
  try {
    const { data } = await serviceUtil.get(`batch/${ID}`);
    return { data };
  } catch (error) {
    return { error };
  }
};
const saveBatchDetails = async (payload) => {
  try {
    const { data } = await serviceUtil.post(`batch`, payload);
    return { data };
  } catch (error) {
    return { error };
  }
};

const getTheCandidatesWhoAreUnmapped = async () => {
  try {
    const { data } = await serviceUtil.get(`batch-candidate`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const mapOrUnmapCandidateToABatch = async (payload, status) => {
  try {
    const { data } = await serviceUtil.post(
      `batch-candidate/${status}`,
      payload
    );
    return { data };
  } catch (error) {
    return { error };
  }
};
const unmapCandidateToABatch = async (payload) => {
  try {
    const { data } = await serviceUtil.post(`batch-candidate/false`, payload);
    return { data };
  } catch (error) {
    return { error };
  }
};

const deleteABatch = async (batchId) => {
  try {
    const { data } = await serviceUtil.deleteById(`batch/${batchId}`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const getBatchNameDropdown = async () => {
  try {
    const { data } = await serviceUtil.get(`batch-dropdown`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const getCandidatesOfABatch = async (batchId) => {
  try {
    const { data } = await serviceUtil.get(`batch/${batchId}`);
    return { data };
  } catch (error) {
    return { error };
  }
};

export {
  getAllBatchDetails,
  saveBatchDetails,
  getTheCandidatesWhoAreUnmapped,
  mapOrUnmapCandidateToABatch,
  unmapCandidateToABatch,
  getBatchDetailsById,
  deleteABatch,
  getBatchNameDropdown,
  getCandidatesOfABatch,
};
