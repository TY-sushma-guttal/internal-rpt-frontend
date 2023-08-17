import serviceUtil from "../utils";

const getAllTheBatches = async () => {
  try {
    const { data } = await serviceUtil.get(`batchs`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const getFeedbackDetailsOfAParticularBatch = async (batchId) => {
  try {
    const { data } = await serviceUtil.get(`feedback/batch/${batchId}`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const saveTheFeedbackOfTheBatch = async (payload) => {
  try {
    const { data } = await serviceUtil.post(`feedbacks`, payload, {
      headers: {
        userId: 1,
        candidateId: 1,
      },
    });
    return { data };
  } catch (error) {
    return { error };
  }
};

const saveIndividualFeedback = async (payload) => {
  try {
    const { data } = await serviceUtil.put(`feedback`, payload, {
      headers: {
        userId: 1,
        candidateId: 1,
      },
    });
    return { data };
  } catch (error) {
    return { error };
  }
};

export {
  getAllTheBatches,
  getFeedbackDetailsOfAParticularBatch,
  saveTheFeedbackOfTheBatch,
  saveIndividualFeedback,
};
