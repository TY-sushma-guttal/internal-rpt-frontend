import serviceUtil from "../utils";

const getCandidateInfo = async () => {
  try {
    const { data } = await serviceUtil.get(`candidateInfo/${0}`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const getCandidateInfoById = async (id) => {
  try {
    const { data } = await serviceUtil.get(`candidateInfo/${id}`);
    return { data };
  } catch (error) {
    return { error };
  }
};

const getCandidateDetailsDropdown = async ()=>{
  try {
    const { data } = await serviceUtil.get(`/candidateInfo/dropDown`);
    return { data };
  } catch (error) {
    return { error };
  }
}


const postCandidateInfo = async (payload) => {
  try {
    const { data } = await serviceUtil.post(`candidateInfo`, payload);
    return { data };
  } catch (error) {
    return { error };
  }
};
export { getCandidateInfo, postCandidateInfo,getCandidateDetailsDropdown, getCandidateInfoById };
