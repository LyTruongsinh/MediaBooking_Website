import actionTypes from "../actions/actionTypes";

const initialState = {
    isLoadingGender: false,
    genders: [],
    roles: [],
    positions: [],
    users: [],
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            state.isLoadingGender = true;
            console.log("check fetch gender start", action);
            return {
                ...state,
            };
        case actionTypes.FETCH_GENDER_SUCCESS:
            state.genders = action.data;
            state.isLoadingGender = false;
            console.log("check fetch gender success", action);
            return {
                ...state,
            };
        case actionTypes.FETCH_GENDER_FAILDED:
            state.genders = [];
            state.isLoadingGender = false;
            console.log("check fetch gender faild", action);
            return {
                ...state,
            };

        case actionTypes.FETCH_POSITION_SUCCESS:
            state.positions = action.data;
            console.log("check fetch position success", action);
            return {
                ...state,
            };
        case actionTypes.FETCH_POSITION_FAILDED:
            state.positions = [];
            console.log("check fetch position faild", action);
            return {
                ...state,
            };
        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data;
            console.log("check fetch role success", action);
            return {
                ...state,
            };
        case actionTypes.FETCH_ROLE_FAILDED:
            state.roles = [];
            console.log("check fetch role faild", action);
            return {
                ...state,
            };
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            state.users = action.users;
            console.log("check fetch all users success", action);
            return {
                ...state,
            };
        case actionTypes.FETCH_ALL_USERS_FAILDED:
            state.users = [];
            console.log("check fetch all users faild", action);
            return {
                ...state,
            };
        default:
            return state;
    }
};

export default adminReducer;
