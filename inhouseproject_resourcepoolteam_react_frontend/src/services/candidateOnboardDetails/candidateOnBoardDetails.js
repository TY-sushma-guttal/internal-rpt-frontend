import serviceUtil from "../utils";

const getCandidateDetails = async () => {
  try {
    const { data } = await serviceUtil.get(`/onboards`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const getCandidateDetailsById = async (candidateId) => {
  try {
    const { data } = await serviceUtil.get(`onboard/${candidateId}`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const postCandidateDetails = async (payload) => {
  try {
    const { data } = await serviceUtil.post(`onboard`, payload);
    return { data };
  } catch (error) {
    return { error };
  }
};

const deleteCandidateById = async (url) => {
  try {
    const { data } = await serviceUtil.deleteById(url);
    return { data };
  } catch (error) {
    return { error };
  }
};

const fetchCandidateIdsForDropdown = async () => {
  try {
    const { data } = await serviceUtil.get("candidateInfo/dropDown");
    return { data };
  } catch (error) {
    return { error };
  }
};
export {
  getCandidateDetails,
  postCandidateDetails,
  getCandidateDetailsById,
  deleteCandidateById,
  fetchCandidateIdsForDropdown,
};
