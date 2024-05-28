import ThemeReducer from "./ThemeReducer"
import AuthenReducer from "./AuthenReducer"
import { combineReducers } from "redux"

const rootReducer = combineReducers({ThemeReducer, AuthenReducer})

export default rootReducer