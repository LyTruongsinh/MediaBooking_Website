import axios from "../axios";
const handleLoginApi = async (useremail, userpassword) => {
    return axios.post("/api/login", {
        email: useremail,
        password: userpassword,
    });
};
const getAllUsers = async (inputid) => {
    return axios.get(`/api/get-all-users?id=${inputid}`);
};
const createNewUserService = (data) => {
    console.log("check", data);
    return axios.post("/api/create-new-user", data);
};
const deteleUserService = (userid) => {
    return axios.delete(`/api/delete-user`, {
        data: {
            id: userid,
        },
    });
};
const editUserService = (inputdata) => {
    return axios.put("/api/edit-user", inputdata);
};
const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode/?type=${inputType}`);
};
const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`);
};
const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctors`);
};
export {
    handleLoginApi,
    getAllUsers,
    createNewUserService,
    deteleUserService,
    editUserService,
    getAllCodeService,
    getTopDoctorHomeService,
    getAllDoctors,
};
