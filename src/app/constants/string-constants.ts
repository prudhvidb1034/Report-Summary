import { environment } from "../../environments/environment"

export const Constants = {
    GET_LOGIN_DETAILS: 'assets/jsons/loginDetails.json',
    GET_REGISTER_DETAILS: 'assets/jsons/loginDetails.json',
    POST_TEAMS_LIST: 'assets/jsons/teamslist.json',
}

export const urls = {
    REGISTRATION_DETAILS: environment.apiUrls + 'register',
    PROJect_DETAILS: environment.apiUrls + 'projects',
     TEAMS_DETAILS: environment.apiUrls + 'teamslist',



//Real time api's handling with backend starting point below.


LOGIN_DETAILS :  'auth'+'/login',
POST_MANAGER_DETAILS: 'api'+'/managers',
CREATE_ACCOUNT :'Account',
CREATE_PROJECT: 'projects',
CREATE_PERSON:'Person',
GET_MANAGRE_DETAILS: 'Person'+'/role',
TAG_EMPLOYEE: 'Person/tag-projects'
}


