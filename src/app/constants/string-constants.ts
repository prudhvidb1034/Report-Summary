import { environment } from "../../environments/environment"

export const Constants = {
    GET_LOGIN_DETAILS: 'assets/jsons/loginDetails.json',
    GET_REGISTER_DETAILS: 'assets/jsons/loginDetails.json',
    POST_TEAMS_LIST: 'assets/jsons/teamslist.json',
    GET_WEEKLY_SUMMARY: 'api' + '/weekly-summary/all?',
    ROLE_MANAGER: 'Person/role/MANAGER',
    ROLE_EMPLOYEE: 'Person/role/EMPLOYEE',


}

export const urls = {
    REGISTRATION_DETAILS: environment.apiUrls + 'register',
    PROJect_DETAILS: environment.apiUrls + 'projects',
    TEAMS_DETAILS: environment.apiUrls + 'teamslist',



    //Real time api's handling with backend starting point below.


    LOGIN_DETAILS: 'auth' + '/login',
    POST_MANAGER_DETAILS: 'api' + '/managers',
    CREATE_ACCOUNT: 'Account',
    CREATE_PROJECT: 'projects',
    CREATE_PERSON: 'Person',
    GET_MANAGRE_DETAILS: 'Person' + '/role',
    TAG_EMPLOYEE: 'Person/tag-projects',
    PROJECT_SEARCH: 'projects/search',
    CREATE_SPRINT: 'api/sprints/createSprint',
    CREATE_INCIENT: 'api/releases/save',

    GET_QUATERLY_REPORT: '/assets/jsons/quaterlylist.json',
    CREATE_QUATERLY_REPORT: '/assets/jsons/quaterlylist.json',
    UPDATE_QUATERLY_REPORT: '/assets/jsons/quaterlylist.json',
    REMOVE_QUATERLY_REPORT: '/assets/jsons/quaterlylist.json',
    GET_RESOURCES_DETAILS:'/assets/jsons/resources.json',
    GET_DEPENDECY_DETAILS:'/assets/jsons/dependecies.json',
    GET_PIPROGRESS_URL:'/assets/jsons/pi-progress.json',



}


