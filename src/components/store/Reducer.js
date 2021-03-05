import { useHistory } from "react-router-dom";

const Reducer = (state, action) => {
    switch (action.type) {
        case "SET_QUESTIONSET":
            return {...state, questionSet:action.payload};
        case "SELECT_QUESTIONSET":
            return {...state, questionSetSelected:action.payload};
        case "SET_QUESTIONLIST":
            return {...state, questionList:action.payload};
        case "SELECT_QUESTION":
            return {...state, questionSelected:action.payload};
        case "SIGN_IN":
            localStorage.setItem('user', action.payload.username)
            localStorage.setItem('user_token', action.payload.id)
            return {...state, user:action.payload, userToken:action.payload.id};
        case "LOG_OUT":
            localStorage.removeItem('user')
            localStorage.removeItem('user_token')
            return {
                checked:false,
                user: localStorage.getItem("user"),
                userToken: localStorage.getItem("user_token"),
                questionSet: [],
                questionSetSelected: null,
                questionList: [],
                questionSelected: null
            };
        default:
            return state;
    }
};

export default Reducer;