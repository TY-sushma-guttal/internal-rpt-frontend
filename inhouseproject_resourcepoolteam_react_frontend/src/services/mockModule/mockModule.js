import serviceUtil from "../utils";

const getAllMockDetails = async () => {
  try {
    const { data } = await serviceUtil.get(`mocks`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const getMockDetailsById = async (id) => {
  try {
    const { data } = await serviceUtil.get(`mock/${id}`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const getPanelMembers = async () => {
  try {
    const { data } = await serviceUtil.get(`mentors`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const postMockDetails = async (payload) => {
  try {
    const { data } = await serviceUtil.post(`mock`, payload);
    return { data };
  } catch (error) {
    return { error };
  }
};

const deleteMockById = async (url) => {
  try {
    const { data } = await serviceUtil.deleteById(url);
    return { data };
  } catch (error) {
    return { error };
  }
};

const postMockFeedback = async (payload, id) => {
  try {
    const { data } = await serviceUtil.post("mock/feedback", payload, {
      headers: { candidateId: id },
    });
    return { data };
  } catch (error) {
    return { error };
  }
};

export {
  getAllMockDetails,
  getPanelMembers,
  postMockDetails,
  deleteMockById,
  getMockDetailsById,
  postMockFeedback,
};
