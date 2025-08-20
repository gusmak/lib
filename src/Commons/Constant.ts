declare global {
    interface Window {
        REACT_APP_API_ENDPOINT: string;
        GOONG_MAP_KEY: string;
        GOONG_API_KEY: string;
        REACT_APP_CAPTIVE_DOMAIN: string;
        CLIENT_ID: string;
        REACT_APP_ID_DOMAIN: string;
        REACT_APP_FILE_STATIC_PATH: string;
        REACT_APP_FILE_TEMP_PATH: string;
        REACT_APP_TEMPLATE_FILE_PATH: string;
        REACT_APP_I18NEXT_BACKEND: string;
        DEFAULT_PREVIEW_DOMAIN_ID: string;
    }
}

export const NORMAL_COLOR = '#000000';
export const POSITIVE_COLOR = '#3B86FF';
export const NEGATIVE_COLOR = '#ED1D25';
export const DEFAULT_RADIUS = '500';
export const MAXIMUM_RADIUS = 10000;
export const MIN_RADIUS = 100;
export const TIME_PICK_ON_MAP_DELAY = 1000;
export const USE_LOGIC_OPERATOR = 'use-logic-operator';
export const DEFAULT_LOGIC_OPERATOR = [
    { id: 'or', name: 'OR' },
    { id: 'and', name: 'AND' },
];

export const Workspaces = {
    SYSTEM: 'SYSTEM',
    ADMIN: 'ADMIN',
    ACM: 'ACM',
    AXM: 'AXM',
    CUSTOMER: 'CUSTOMER',
};

export const Constants = {
    API_ENDPOINT: window.REACT_APP_API_ENDPOINT,
    ID_DOMAIN: window.REACT_APP_ID_DOMAIN,

    // Notification
    ALL: 'All',
    ALL_STATUS: undefined,
    UNREAD: 'Unread',
    UNREAD_STATUS: 0,
    SELECT_ALL: 'SelectAll',
    NOTIFICATIONS_PATH: 'Notifications',
    NOTIFICATION_SETTING_SCREEN_PATH: 'Notification',
    CLIENT_ID: window.CLIENT_ID,
    // End  Notification
    MAX_NUMBER: 32767,
    /* Page */
    PAGE_INDEX_DEFAULT: 0,
    PAGE_SIZE_DEFAULT: 10,
    DEFAULT_ROWS_PER_PAGE: [10, 20, 30],
    /* End Page */
    NUMBER_DOMAIN_FAVORITE: 10,
    PLACE_GROUP_SYSTEM: '58',
    FAVORITE_DOMAIN: 'FavoriteDomain',
    DOMAIN_ID_KEY: 'DomainId',
    HOME_PATH: '/',
    SET_SSID: 'SetSSID',
    SET_LOGOUT: 'SetLogout',
    PROFILE_PATH: 'Profile',
    USER_PROFILE_INFO: 'Info',
    CLIENT_AUTHEN: {
        TOKEN_KEY: 'token',
        RETURN_URL_KEY: 'returnUrl',
        CLIENT_ID_KEY: 'clientId',
    },
    LOGIN_PATH: 'Login',
    LOGOUT_PATH: 'Logout',
    ERROR_PATH: 'Error',
    ERROR_403_PATH: 'Error403',
    LOCAL_STORAGE_USER: 'AWING_ACM_User',

    DIRECTORY_PATH: 'Directory',
    SHARING_CONFIG_PATH: 'Config',
    DIRECTORY_PERMISSION_PATH: 'Permission',
    DIRECTORY_CREATE_DIRECTORY_PATH: 'CreateDirectory',
    DIRECTORY_ADD_PERMISSION_PATH: 'AddPermission',
    DIRECTORY_EDIT_PERMISSION_PATH: 'EditPermission',
    DIRECTORY_ADD_PERMISSION_ADD_NEWAUTHEN_PATH: 'AddNewAuthen',
    SYSTEM_DIRECTORY_PERMISSION_PATH: 'SystemPermission',
    MENU_DIRECTORY_PERMISSION_PATH: 'MenuPermission',
    MENU_DIRECTORY_ADD_PERMISSION: 'MenuAddPermission',
    CREATE_DIRECTORY: 'Create',
    EDIT_DIRECTORY: 'Edit',
    DIRECTORY: 'Directory',

    CAMPAIGN_PATH: 'Campaign',
    CAMPAIGN_CREATE_DIRECTORY: 'CreateDirectory',
    CAMPAIGN_CREATE: 'Create',
    CAMPAIGN_CREATE_WITH_WIZARD: 'Create/FromWizard',
    CAMPAIGN_DETAIL: 'Detail',
    CAMPAIGN_CLONE: 'Clone',
    CAMPAIGN_INFORMATION: 'Information',
    CAMPAIGN_DISPLAY: 'Display',
    CAMPAIGN_LOCATION: 'Location',
    CAMPAIGN_ADVANCED: 'Advanced',
    CAMPAIGN_PARTNER: 'Partner',
    CAMPAIGN_SELECT_PAGE: 'SelectPage',
    CAMPAIGN_GENERAL_WEIGHT: 'GeneralWeight',
    CAMPAIGN_CREATE_GROUP: 'CreateGroup',
    CAMPAIGN_EDIT_GROUP: 'EditGroup',
    CAMPAIGN_EDIT_WEIGHT: 'EditWeight',
    CAMPAIGN_UPDATE_EXPRESSION: 'UpdateExpression',
    CAMPAIGN_ADD_RULE: 'AddRule',
    CAMPAIGN_EDIT_RULE: 'EditRule',
    CAMPAIGN_ADD_PERMISSION: 'AddPermission',
    CAMPAIGN_EDIT_PAGE: 'EditPage',
    CAMPAIGN_MATCH_RATE: 'CampaignMatchRate',
    CAMPAIGN_SUBCAMPAIGN: 'SubCampaign',
    CAMPAIGN_STATISTICS: 'Statistics',
    CAMPAIGN_CONNECT: 'Connect',
    CAMPAIGN_PERMISSION: 'Permission',
    CAMPAIGN_APPROVE: 'Approve',
    CAMPAIGN_WIZARD: 'Wizard',

    CAPTIVE_DOMAIN: (window as any).REACT_APP_CAPTIVE_DOMAIN,
    CAMPAIGN_PREVIEW: 'Preview/Campaign',
    DOMAIN_PREVIEW: 'Preview/Domain',
    PAGE_LOGIN_PREVIEW: 'Preview/Page',
    TEMPLATE_PREVIEW: 'Preview/Template',

    PAGE_LOGIN: '/Page/Login',
    PAGE_WELCOME: '/Page/Welcome',

    USER_PATH: 'User',
    USER_GROUP_PATH: 'UserGroup',
    ADD_USER_TO_GROUP_PATH: 'AddUserToGroup',
    AUTHENTICATION_PROFILE_PATH: 'AuthenticationProfile',

    HOLIDAY_PATH: 'Holiday',
    HOLIDAY_CREATE: 'HolidayCreate',
    HOLIDAY_EDIT: 'HolidayEdit',
    HOLIDAY_DETAIL: 'HolidayDetail',
    HOLIDAY_DETAIL_CREATE: 'HolidayCreateDate',
    HOLIDAY_DETAIL_EDIT: 'HolidayDetailEdit',

    TEMPLATE_MANAGEMENT_PATH: 'Template',
    PLACE_PATH: 'Place',

    MONITOR_CAPTIVE_PATH: 'MonitorCaptive',

    SCHEDULE_PLAN_PATH: 'SchedulePlan',
    SCHEDULE_COMPLETION_RATE_PATH: '/Schedule/ScheduleCompletionRate',
    STATISTIC_SCHEDULE_PLAN_PATH: 'StatisticSchedulePlan',
    CAMPAIGN_SCHEDULE_PATH: 'CampaignSchedulePlan',
    CAMPAIGN_STATISTIC_PATH: 'CampaignStatistic',
    STATISTICS_TOTAL_PATH: 'StatisticsTotal',
    STATISTICS_BY_TOTAL_NETWORK_PATH: 'StatisticsByTotalNetWork',
    STATISTICS_COMPARE: 'StatisticsCompare',
    STATISTICS_BY_PLACE: 'StatisticsByPlace',
    TRAFFIC_CALCULATOR_PATH: 'TrafficCalculator',
    PROVINCE_PATH: 'Province',
    AUDIENCE_OVERVIEW_PATH: 'AudienceOverview',
    AUDIENCE_DEMOGRAPHIC_PATH: 'AudienceDemographic',
    TASK_SCHEDULER_PATH: 'TaskScheduler',
    DOMAINS_PATH: 'Domain',
    UPDATE_CAMPAIGN_DEFAULT_PATH: 'UpdateCampaignDefault',
    TRANSACTION_LOG_PATH: 'TransactionLog',
    DETAIL_PATH: 'Detail',
    PLACE_CUSTOMER_INFO_PATH: 'PlaceCustomerInfo',
    ACCESS_POINT: 'Ap',
    PLACE_GROUP_POINT: 'PlaceGroup',
    WIZARD_PATH: 'Wizard',
    PLACE_STAT_PATH: 'PlaceStat',
    NETWORK_REQUEST_PATH: 'NetworkRequest',
    ATTRIBUTE_TYPE_PATH: 'AttributeType',
    ATTRIBUTES_PATH: 'Attribute',
    NETWORK_PATH: 'Network',

    ADD_EXISTED_USER: 'AddExistedUser',
    ADD_USER_TO_GROUP: 'AddUserToGroup',
    CREATE_PATH: 'Create',
    CREATE_ALL_PATH: 'CreateAll',
    IMPORT_PATH: 'Import',
    EDIT_PATH: 'Edit',
    CLONE_PATH: 'Clone',
    DEBOUNCE_TIME: 700,
    DEBOUNCE_TIME_500: 500,
    DEBOUNCE_TIME_300: 300,

    ACM_TEMPLATE_PATH: '{acmTemplatePath}',

    PAGE: 'Page',
    PAGE_CREATE_DIRECTORY: 'CreateDirectory',
    PERMISSION_CODE: {
        FULL_CONTROL: 31,
        MODIFY: 15,
        WRITE: 4,
        READ_AND_EXECUTE: 3,
        READ: 2,
        LIST_FOLDER_CONTENTS: 1,
    },
    CONFIG_FILTER: 'ConfigFilter',
};

/**
 *  ValueAnalyticType  dùng để truy xuất dữ liệu trong các file "runs" và "expecteds" filter phần thống kê.
 **/
export const ValueAnalyticType = {
    VIEW: 'View',
    AUTHENTICATION: 'Authentication',
    CLICK: 'Click',
};

/**
 *  TypeView kịch bản filter trong phần thống kê.
 *  billingUnit: 0, // Đơn vị tính, dựa vào trường "billingUnit" => 1: "Authentication", 2: "Click"
 *  impression: 1, // Lượt hiển thị, "View"
 **/
export const TypeView = {
    billingUnit: 0, // Đơn vị tính
    impression: 1, // Lượt hiển thị
};
