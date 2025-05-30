import { environment } from "../../environments/environment"

export const Constants = {
    GET_LOGIN_DETAILS: 'assets/jsons/loginDetails.json',
    GET_REGISTER_DETAILS: 'assets/jsons/loginDetails.json',
    POST_TEAMS_LIST: 'assets/jsons/teamslist.json',
}

export const urls = {
    REGISTRATION_DETAILS: environment.apiUrls + 'register',
    PROJect_DETAILS: environment.apiUrls + 'projects',
    TEAMS_DETAILS: environment.apiUrls + 'teamslist'
}