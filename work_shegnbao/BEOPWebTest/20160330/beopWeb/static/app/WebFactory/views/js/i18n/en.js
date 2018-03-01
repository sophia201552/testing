var i18n_resource = {
    admin: {
        login: {
            PANE_TITLE: "Log in",
            PANE_CHECKBOX_REMEMBER: "Remember",
            PANE_PLACEHOLDER_ACCOUNT: "Please enter user name",
            PANE_PLACEHOLDER_PWD: "Please enter your password",
            LOG_IN_FAILED: "Login failed",
            LOG_IN_EMPTY: "Please enter your username and password",
        },
        welcom: {
            start: {
                TITLE: "Begin",
                NEW_PROJECT: "New project ...",
                IMPORT_PROJECT: "Import project ...",
            },
            yourProj: {
                TITLE: "Your project",
                DELETE: "Delete",
                TOP: "Sticky",
                EXPORT: "Export",
                EDIT_AUTH: 'Edit Project Authority'
            },
            newProj: {
                ADD_PROJECT: "Add items",
                PROJECT_NAME: "Project name:",
                PROJECT_CHINESE_NAME: "Project name in Chinese:",
                PROJECT_ENGLISH_NAME: "Project name in English:",
                ADD: "New",
                CANSEL: "Cancel",
                PROJECT_NAME_NEW_PLACEHOLDER: 'Please enter the project name',
                PROJECT_NAME_PLACEHOLDER: "Enter a project name",
                PROJECT_CHINESE_NAME_PLACEHOLDER: "Please enter the project name in Chinese",
                PROJECT_ENGLISH_NAME_PLACEHOLDER: "Please enter the project name in English",
                LOG_ADD: "Project name can not be empty!",
                LOG_SAME_NAME: 'The project already exists'
            },
            deleteProj: {
                DELETE_PROJECT: "Delete project",
                CONFIRM_INFO: "Please confirm whether to delete the project?",
                CONFIRM_INFO_TIP: "Please enter a password",
                SURE: "Confirm deletion",
                CANCEL: "Cancel",
                DELETE_TITLE: "Delete project",
                PASSWORD: "Password:",
                PROJECT_ENGLISH_NAME: "Project name in English:",
                PASSWORD_PLACEHOLDER: "Please enter your password",
                PROJECT_ENGLISH_NAME_PLACEHOLDER: "Please enter the Project name in English",
                OK: "OK",
            },
            importProjectModal: {
                TITLE: "Import online project",
                PROJECT_LIST_LABEL: "List of online projects",
                CONFIRM_IMPORT: "Confirm import",
                CANCEL: "Cancel"
            }
        },
        navIndex: {
            LINK_LANGUAGE: "Language"
        }
    },
    dataSource: {
        ADD_GROUP: "+ Add group",
        ADD_POINT_GROUP: "Add group",
        ADD_POINT: "Add point",
        ADD_FORMULA: "Add formula",
        RENAME: "Rename",
        REMOVE: "Delete"
    },
    toolBox: {
        TITLE: "Optional modules",
        modal: {
            HIS_CHART: "Historical figure",
            HIS_CHART_ENERGY_LINE: "History histogram (year / month / week)",
            HIS_CHART_ENERGY_BAR: "Historical energy bar graph",
            HIS_CHART_YEAR_LINE: "Year history line chart",
            HIS_CHART_YEAR_BAR: "Year history bar graph",
            REAL_TIME_CHART: "Real-time image",
            REAL_TIME_CHART_PIE_ENERGY: "Real-time pie",
            REAL_TIME_CHART_PIE_DATAROOM: "Breakdown of energy consumption data rooms pie",
            REAL_TIME_CHART_LINE_OUTDOOR: "Real-time line chart",
            REAL_TIME_CHART_LINE_PUE: "Pue trend",
            REAL_TIME_CHART_GAUGE: "Real-time dashboards",
            REAL_TIME_CHART_BAR_ENERGY: "Real-time sub-column chart",
            REAL_TIME_CHART_LINE_ENERGY: "Sub-energy line chart",
            REAL_TIME_CARBON_FOOTPRINT: "Carbon footprint emissions",
            REAL_TIME_WEATHER: "Weather trend",
            REAL_TIME_ENERGY_SAVE_RATE: "Saving rate",
            REAL_TIME_COAL_SAVE_TOTAL: "Cumulative savings of standard coal",
            REAL_TIME_CO2_SAVE_TOTAL: "Cumulative savings co₂ emissions",
            REAL_TIME_KPI_CHART: "Kpi dashboard",
            REAL_TIME_BAR: "Real-time bar graph",
            OBSERVER: "Configuration page",
            REAL_TIME_PREDICT_POINT_LINE: "Real-time prediction line chart",
            TRANSIT: "Data analysis",
            MULTIPLE: "Composite figure",
            NOTE: "Notes",
            WHIRLWIND_CHART: "Fig whirlwind",
            RANK_CHART: "Top figure",
            MIX: "Combination chart",
            MODAL_HTML: "Html module",
            MSG_MIX_NOT_ALLOW_TO_MIX: "Combination charts can not drag combination chart",
            CUSTOM_CHART: "Custom fig.",
            POINT_KPI: "Kpi exclusive edition",
            REPORT_CHAPTER: "Reports section",
            MSG_KPI_NOT_ALLOW_TO_MIX: "Kpi exclusive version can not be dragged into a combination of fig.",
            INTERACT_CHART: "Interactive trend"
        }
    },
    dashboard: {
        modalHistoryChart: {
            MAXIMUM: "Max",
            MINIMUM: "Min",
            EnergyConsumption: "Energy consumption"
        },
        modalWeather: {
            REAL_TIME_TEMPERATURE: "Real-time temperature"
        },
        modalConfig: {
            POINT_DRAG_TIP: "Please drag data points here ......",
            ERR: "Limit reached!"
        },
        resize: {
            ERR1: "Please enter a value smaller than upper limit!",
            ERR2: "Please enter a value bigger than lower limit!",
            ERR3: "Enter the value must be a number, please check the format!"
        },
        show: {
            TITLE_TIP: "Please enter a title",
            TITLE: "Title",
            SELECT_LINK: "Select link",
            TYPE: "Category",
            LINK_TO: "Link to",
            DESC: "Description",
            DESC_TIP: "Please add description here",
            WIKI_ID: "Wikiid",
            POP_ID: "Popid"
        },
        modalPointKPI: {
            PASS: "Qualified",
            UNPASS: "Not qualified",
            MONTH: "Month",
            QUARTER: "Quarter"
        },
        modalJumpPages: {
            IMPORT_PAGE: "Import to data source",
            POINT_LIST: "Data name",
            GROUP_LIST: "Select data source",
            SUCCESS_TIPS: "Success, whether to jump to the Data Analysis?",
            FAIL_TIPS: "Export failed!",
            NO_FIT_POINT: "There is no data point to import",
            SURE: "OK and jump",
            CANCEL: "OK",
            NEW_GROUP: "New data source",
            SELECT_ALL: "Select all",
            SELECT_REVERT: "Unselected",
            NEW_DS_NAME: "New data source name"
        }
    },
    analysis: {
        TITLE: "Data analysis",
        PANE_POINTS_ALL_TITLE: "All points (click to select)",
        PANE_POINTS_SELECTED_TITLE: "Points selected (click to delete)",
        MARK_SELECTED: "Selected",
        PANE_ADD_NOTE: "New notes",
        BACK_TO_HOMEPAGE: "Return to main menu",
        PANE_CONFIG: "Configure",
        PANE_FULL_SCREEN: "Full screen",
        modalType: {
            TENDENCY: "Trend",
            STACK: "Area chart",
            SPECTRUM: "Spectrogram",
            SCATTER: "Scatterplot",
            HISTORY_COMPARE: "Year history bar graph",
            HISTORY_COMPARE_LINE: "Year history line chart",
            ENERGY: "Energy bar graph",
            CLUSTER: "Pattern analysis",
            PIE_REAL_TIME: "Real-time pie",
            CLUSTER_AHU: "Ahu diagnosis",
            CLUSTER_CHILLER: "Cooler diagnosis"
        },

        paneConfig: {
            TITLE: "Configure data source",
            DATA_CONFIG_TITLE: "Data points (each up to 5)",
            DATA_DRAG_TIP: "Please drag data point here",
            LABEL_INVERAL: "Time interval",
            LABEL_TIME_START: "Start time",
            LABEL_TIME_END: "End time",
            ALIGN_MODE: "Filled way",
            ALIGN_FORWARD: "Padded forward",
            ALIGN_BACKWARD: "Padded back",
            ALIGN_LINEAR: "Linear interpolation",
            START_ANALYSIS: "Start analysis",
            FUNCTION: "Function",
            DATA_DEAL: "Data processing",
            DATA_DIVIDE: "Data classification",
            TREND_ANALYSE: "Trend analysis",
            FREQ_ANALYSE: "Spectrum analysis",
            YEAR: "Year",
            MONTH: "Month",
            DAY: "Day",
            HOUR: "Hour",
            MINUTE: "Minute",
            SECOND: "Second",
            RECFG_SRC_DATA: "Reconfigure source data",
            SEL_PT_NAME: "Selected named",
            TREND_DISTRIBUTE: "Distribution trends",
            TYPE_POINT: "Category scatter",
            TYPICAL_CONDITION: "Typical conditions",
            DIAGNOSES_RESULT: "Diagnoses",
            DATE: "Date",
            POINT_NUM: "Count",
            MISS_NUM: "The number of missing",
            MISS_RATE: "Loss rate",
            ARGUMENTS: "Parameter",
            NAME: "Name",
            DESC: "Description",
            MAX: "Max",
            MIN: "Min",
            MED: "Median",
            AVG: "Average value",
            STD: "Standard value",
            RANGE_TO: "To",
            MODE_FIXED: "Fixed period",
            MODE_RECENT: "Recent period",
            MODE_CURRENT: "Preset period",
            MODE_ACTUAL_TIME: "Real time",
            INTERVAL_MIN1: "1 minute",
            INTERVAL_MIN5: "5 minutes",
            INTERVAL_HOUR1: "1 hour",
            INTERVAL_DAY1: "1 day",
            INTERVAL_MON1: "1 month",
            TIME_RANGE_SEC: "Second",
            TIME_RANGE_MIN: "Minute",
            TIME_RANGE_HOUR: "Hour",
            TIME_RANGE_DAY: "Day",
            TIME_RANGE_MON: "Month",
            DATA_TYPE_DEFAULT: "Data points",
            ERR1: "Background data request failed",
            ERR2: "Already exists in the selected point list!",
            ERR3: "You have not select any point!",
            ERR4: "Request spectral analysis, data classification data failed!",
            ERR5: "No data in the specified period , please select again!",
            ERR6: "No historical data points:",
            ERR7: "It has been automatically removed!",
            ERR8: "Time format error: start time is later than the end of time!",
            ERR9: "Malformed time: end time is later than the current time!",
            ERR10: "Data points repeat: you drag this data point already exists!",
            ERR11: "Data error: the period of time could not find any data!",
            ERR12: "Too many data points, can not continue dragging!"
        }
    },
    modalConfig: {
        TITLE: "Configuration",
        option: {
            SEARCH: "Inquiry",
            LABEL_MODE: "Mode",
            MODE_FIXED: "Fixed period",
            MODE_RECENT: "Recent period",
            MODE_CURRENT: "Preset period",
            MODE_REAL_TIME: "Real time",
            MODE_HISTORY: "History",
            MODE_COMPARE_EASY: "Quick configuration",
            MODE_COMPARE_SENSOR: "Sensor data",
            MODE_COMPARE_METER: "Power meter data",
            MODE_GAUGE: "Dashboard",
            MODE_WEATHER: "Weather",
            LABEL_INTERVAL: "Sampling period",
            INTERVAL_MIN1: "1 minute",
            INTERVAL_MIN5: "5 minutes",
            INTERVAL_HOUR1: "1 hour",
            INTERVAL_DAY1: "1 day",
            INTERVAL_MON1: "1 month",
            LABEL_PERIOD: "Time period",
            PERIOD_DROP_DOWN_LAST_HOUR: "Past hour",
            PERIOD_DROP_DOWN_TODAY: "Past 24 hours",
            PERIOD_DROP_DOWN_YESTERDAY: "Yesterday (24 hours)",
            PERIOD_DROP_DOWN_THREE_DAY: "Last 72 hours",
            PERIOD_DROP_DOWN_THIS_WEEK: "Last 7 days",
            PERIOD_DROP_DOWN_LAST_WEEK: "Last week (7 days)",
            PERIOD_DROP_DOWN_LAST_30_DAYS: "Past 30 days",
            PERIOD_DROP_DOWN_LAST_90_DAYS: "Past 90 days",
            PERIOD_DROP_DOWN_THIS_YEAR: "Past 12 months",
            PERIOD_UNIT_SEC: "Second",
            PERIOD_UNIT_MIN: "Minute",
            PERIOD_UNIT_HOUR: "Hour",
            PERIOD_UNIT_DAY: "Day",
            PERIOD_UNIT_MON: "Month",
            LABEL_TIME_RANGE: "Time period",
            TIP_RANGE_TO: "To",
            LABEL_GAUGE_MODE: "Display mode",
            GAUGE_MODE_LOW: "Alert by low value",
            GAUGE_MODE_HIGH: "Alert by high value",
            GAUGE_GREEN: "Good",
            GAUGE_NORMAL: "Normal",
            GAUGE_RED: "Alert",
            LABEL_REAL_TIME_INTERVAL: "Refresh interval",
            REAL_TIME_INTERVAL_30_SEC: "30 seconds",
            REAL_TIME_INTERVAL_1_MIN: "1 minute",
            REAL_TIME_INTERVAL_5_MIN: "5 minutes",
            REAL_TIME_INTERVAL_10_MIN: "10 minutes",
            REAL_TIME_INTERVAL_30_MIN: "30 minutes",
            REAL_TIME_INTERVAL_1_HOUR: "1 hour",
            REAL_TIME_INTERVAL_1_DAY: "1 day",
            REAL_TIME_INTERVAL_1_MON: "1 month",
            LABEL_WEATHER: "City code",
            LABEL_COMPARE_PERIOD: "Comparative period",
            LABEL_COMPARE_DATE1: "Time 1",
            LABEL_COMPARE_DATE2: "Time 2",
            COMPARE_PERIOD_HOUR: "1 hour",
            COMPARE_PERIOD_DAY: "1 day",
            COMPARE_PERIOD_WEEK: "1 week",
            COMPARE_PERIOD_MONTH: "1 month",
            COMPARE_PERIOD_YEAR: "1 year",
            LABEL_HISTORY_RANGE: "Time limit",
            HISTORY_RANGE_HOUR: "1 hour",
            HISTORY_RANGE_DAY: "1 day",
            HISTORY_RANGE_WEEK: "1 week",
            HISTORY_RANGE_MONTH: "1 month",
            HISTORY_RANGE_YEAR: "1 year",
            LABEL_CHART_SELECT: "Chart type",
            CHART_SELECT_BAR: "Bar graph",
            CHART_SELECT_LINE: "Line chart",
            CHART_TYPE: "Chart category",
            PIE: "Pie",
            BAR: "Bar graph",
            DEFAULT_TYPE: "Default category",
            DEFAULT_LINE: "Line chart",
            DEFAULT_BAR: "Bar graph",
            MODIFY_CHART_TITLE: "Title content",
            MODIFY_CHART_YAXIS_NAME: "Ordinate name",
            MODIFY_CHART_YAXIS_UNIT: "Ordinate units",
            MODIFY_CHART_MAX: "Max",
            MODIFY_CHART_MIN: "Min",
            MODIFY_CHART_MARK: "Graduation",
            MODIFY_CHART_CONFIG: "Advanced configuration"
        },
        data: {
            DATA_CONFIG_TITLE: "Data points:",
            DATA_CONFIG_TIPS: "This configure up to 20 points for adding a new point please remove the extra items.",
            //DATA_CONFIG_TITLE_TYPE1:"Each limit 5",
            DATA_TYPE_MAX_NUM: "(upper limit <% maxnum%> a)",
            DEFAULT_NAME: "Data points",
            DASHBOARD_MULTI_BAR: "Column figure parameters",
            DASHBOARD_MULTI_LINE: "Line chart parameters",
            DASHBOARD_MULTI_AREA: "Area chart parameters",
            DASHBOARD_MULTI_CUMULATIVE_BAR: "Cumulative bar graph parameters",
            DATA_LOSE: "Lose",
            PT_UPPER: "Axis limit",
            PT_LOWER: "Axis limit",
            PT_UNIT: "Axis units",
            PT_ACCURACY: "Decimal places",
            PT_COG_SURE: "Confirm",
            PT_COG_CANCEL: "Cancel",
            PT_LINE_1: "Baseline 1",
            PT_LINE_2: "Baseline 2",
            PT_LINE_3: "Baseline 3",
            PT_LINE_4: "Baseline 4",
            PT_LINE_NAME: "Name",
            PT_LINE_VAL: "Numerical",
            DATA_SHOW: "Data",
            TIME_MODE: "Time mode"
        },
        err: {
            TYPE1: "Too many data points, can not continue dragging!",
            TYPE2: "Data points repeat: you drag this data point already exists!",
            TYPE3: "Time format error: start time is later than the end of time!",
            TYPE4: "Malformed time: end time is later than the current time!",
            TYPE5: "Dashboard parameter error: parameter size does not follow from small to large order",
            TYPE6: "No historical data!",
            TYPE7: "Time parameter is not passed database!",
            TYPE8: "Time format is not recognized!",
            TYPE9: "Value for the current time period is too long a time period the unit!",
            TYPE10: "Contains a non-numerical parameters, check!",
            TYPE11: "Some data points lost, may have been deleted!",
            TYPE12: "Data point values ​​exceed the upper range limit!"
        },
        btnStartConfig: {
            TYPE1: "Start analysis",
            TYPE2: "Determine"
        }
    },
    dataSource: {
        MONTH: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        WEEK: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        TITLE: "Data source",
        DS_CONFIG: "Data source configuration",
        PROJECT_NAME: "Project name",
        PROJECT_SEARCH: "Search",
        NUMBER: "No.",
        POINT_NAME: "Point name",
        POINT_DESC: "Note",
        POINT_ATTR: "Attributes",
        SURE: "OK",
        CANCEL: "Cancel",
        PARAM: "Parameter",
        USER_NAME: "Username",
        CUSTOM_NAME: "Custom name",
        FILTER_REPEAT_ITEM: "Filtered duplicates",
        CUSTOM_REPEAT: "Custom name duplication",
        CUSTOM_NOT_NULL: "Custom name can not be empty",
        FORMULA_TIPS: "Please enter the formula (parameter follow the parameter list parameter name input):",
        FORMULA_NAME: "Formula name",
        FORMULA_VARIABLE_NAME: "Variable name",
        FORMULA_VARIABLE_VALUE: "Actual value",
        REMOVE_CONFIRM: "Confirm deletion?",
        REMOVE_CONFIRM_TIPS: "Linked",
        REMOVE_RESULT: "Deleted",
        WORKSPACE: "Workspace",
        TIME_YESTERDAY: "Yesterday",
        TIME_TODAY: "Today",
        NO_MATCH_FOUND: "No matches were found",
        NO_SELECT_POINT: "Please select a point!",
        GROUP_SELECTED: "Selected",
        NO_SELECT_GROUP: "Please select a group!",
        INPUT_GROUP_NAME: "Please enter a group name!",
        ADD_GROUP: "+ Add group",
        POINT_TYPE_CUSTOM: "Customize",
        POINT_TYPE_SYSTEM: "System",
        POINT_TYPE_DEVICE: "Equipment",
        POINT_TYPE_TYPE: "Types of",
        ERROR: "Your data source has been deleted, the chart can not be generated!",
        ICON_SYS_HVAC: "HVAC",
        ICON_SYS_POWER: "Power",
        ICON_SYS_LIGHT: "Lighting and socket",
        ICON_SYS_CRAC: "CRAC",
        ICON_DEV_CHIL: "Chiller",
        ICON_DEV_PUMP: "Pump",
        ICON_DEV_COOL: "Cooling tower",
        ICON_DEV_AHU: "AHU",
        ICON_DEV_VAV: "VAV",
        ICON_DEV_SYS: "System",
        ICON_TYPE_TEMP: "Temperature",
        ICON_TYPE_FLOW: "Flow",
        ICON_TYPE_FREQ: "Frequency",
        ICON_TYPE_ONOFF: "OnOff",
        ICON_TYPE_ELEPOW: "Power",
        ICON_TYPE_ELEPOWMET: "Power meter",
        ICON_TYPE_THER: "Thermal energy meter",
        ICON_TYPE_PRES: "Pressure",
        ICON_TYPE_ALARM: "Alert",
        ICON_TYPE_CURFLOW: "Current",
        NAV_MINE: "Mine",
        NAV_CLOUD: "Public",
        ALREADY_EXIST: "Add duplicates have been removed",
        ADD_POINT_GROUP: "Add group",
        ADD_POINT: "Add point",
        ADD_FORMULA: "Add formulas",
        RENAME: "Rename",
        REMOVE: "Delete"
    },
    mainPanel: {
        ueserOpera: {
            CHANGE_PROJECT: "Switch project",
            RELEASE_PROJECT: "Publish project",
            CANCELLATION: "Logout"
        },
        navbar: {
            SAVE_PAGE: "Save",
            PREVIEW_PAGE: "Preview",
            UNDO: "Undo",
            REDO: "Redo",
            RELEASE_PAGE: "Publish page"
        },
        toolbar: {
            ARROW_TOOL: "Arrow tool",
            HAND_TOOL: "Hand tool",
            TEXT_TOOL: "Text widget",
            BUTTON_TOOL: "Button widget",
            HTML_TOOL: "Html container widget",
            SCREEN_TOOL: "Screen container widget",
            IMG_TOOL: "Picture widget",
            PIPE_TOOL: "Pipeline widget",
            MATERAL_TOOL: "Library widget",
            GRID_TOOL: "Show gridlines"
        },
        releaseRepeat: {
            TITLE: "Publish",
            RELEASE_INFO: "Please confirm whether to publish?",
            RELEASE_START: "Start publishing",
            RELEASE_NO: "Cancel",
            RELEASE_TITLE: "Fill description",
            PASSWORD: "Password:",
            RELEASE_TO: "Post to:",
            PASSWORD_INFO: "Please enter a release password ",
            OK: "Posted successfully!",
            NO: "Publish failed!",
            SELECT: "Please choose",
            NEW_PROJECT: "New project"
        },
        releasePage: {
            PROJECT_NAME: "Project name:",
            NAME_INFO: "Please enter the Project name in English",
            RELEASE_INFO: "Wrong password!",
            RELEASE_INFO_TIP: "Please select a project!"
        },
        releaseProject: {
            RELEASE_INFO: "Password error!"
        },
        layerPanel: {
            TITLE: "Layers",
            HTML_LAYER: "Html layers",
            BG_LAYER: "Background",
            EXPORT_INFO: "Please select a layer!",
            EXPORT_INFO_TIP: "Currently only supports export template canvas layer",
            DELETE_INFO: "Html layers and the background layer can not be deleted",
            DELETE_INFO_TIP: "You can not delete locked layer",
            DRAG_LAYER_INFO: "Please select a layer to drag and drop!",
            ADD_GROUP: "New folder",
            ADD_PAGE: "New page",
            EDIT_PAGE: "Edit page",
            LOCK_PAGE: "Lock page",
            EXPORT_PAGE_TEMPLET: "Export page template",
            IMPORT_PAGE_TEMPLET: "Import page template",
            DELETE_PAGE: "Delete page",
            ADD_LAYER: "New layer",
            EDIT_LAYER: "Edit layer",
            LOCK_LAYER: "Lock layer",
            EXPORT_LAYER_TEMPLET: "Export layer template",
            IMPORT_LAYER_TEMPLET: "Import layer template",
            DELETE_LAYER: "Delete layer"
        },
        historyPanel: {
            UNDEFINED: "Undefined action",
            CREATE_LAYER: "Create layer",
            DELETE_LAYER: "Delete layer",
            CHANGE_LAYER_NAME: "Edit layer name",
            SHOW_LAYER: "Show layer",
            HIDE_LAYER: "Hidden layer",
            UNLOCK_LAYER: "Unlock layer",
            CREATE_WIDGET: "Create widget",
            DELETE_WIDGET: "Remove widget",
            MOVE_WIDGET: "Move widget",
            RESIZE_WIDGET: "Adjust size",
            MOVE_WIDGET_OR_RESIZE_WIDGET: "Move widget or Adjust size",
            CREATE_BUTTON_WIDGET: "Create button",
            DELETE_BUTTON_WIDGET: "Delete button",
            CHANGE_BUTTON_WIDGET_TEXT: "Change button text",
            CHANGE_BUTTON_WIDGET_STYLE: "Change button style",
            ADD_BUTTON_WIDGET_IDDS: "Add button data source",
            CHANGE_BUTTON_WIDGET_ENUMERATE: "Change button enumerate",
            CHANGE_BUTTON_WIDGET_IDDS: "Change button data source",
            CHANGE_BUTTON_WIDGET_CUSTOMSTYLE: "Change button custom style",
            CREATE_TEXT_WIDGET: "Create text widget",
            DELETE_TEXT_WIDGET: "Delete text widget",
            CHANGE_TEXT_WIDGET_TEXT: "Change text",
            CHANGE_TEXT_WIDGET_STYLE: "Change text style",
            ADD_TEXT_WIDGET_IDDS: "Add text data source",
            CHANGE_TEXT_WIDGET_ENUMERATE: "Change text enumerate",
            CHANGE_TEXT_WIDGET_IDDS: "Change text data source",
            CHANGE_TEXT_WIDGET_CUSTOMSTYLE: "Change text custom style",
            CHANGE_TEXT_WIDGET_PRECISION: "change text precision",
            CREATE_HTMLCONTAINER_WIDGET: "Create HtmlContainer",
            DELETE_HTMLCONTAINER_WIDGET: "Delete HtmlContainer",
            CHANGE_HTMLCONTAINER_WIDGET_CONTENT: "Change HtmlContainer content",
            EXPORT_HTMLCONTAINER_WIDGET: "Export HtmlContainer",
            IMPORT_HTMLCONTAINER_WIDGET: "Import HtmlContainer",
            CREATE_HTMLSCREENCONTAINER_WIDGET: "Create HtmlScreenContainer",
            DELETE_HTMLSCREENCONTAINER_WIDGET: "Delete HtmlScreenContainer",
            CHANGE_HTMLSCREENCONTAINER_WIDGET_CONTENT: "Change HtmlScreenContainer content",
            CHANGE_HTMLSCREENCONTAINER_WIDGET_CUSTOMSTYLE: "Change HtmlScreenContainer custom style",
            CREATE_PIPE_WIDGET: "Create pipe",
            DELETE_PIPE_WIDGET: "Delete pipe",
            CHANGE_PIPE_WIDGET_WIDTH: "Change pipe width",
            CHANGE_PIPE_WIDGET_COLOR: "Change pipe color",
            ADD_PIPE_WIDGET_IDDS: "Add pipe data source",
            CHANGE_PIPE_WIDGET_ENUMERATE: "Change pipe enumerate",
            CHANGE_PIPE_WIDGET_IDDS: "Change pipe data source",
            CREATE_IMAGE_WIDGET: "Create image",
            DELETE_IMAGE_WIDGET: "Delete image",
            CHANGE_IMAGE_WIDGET_CONTENT: "Change image content",
            CHANGE_IMAGE_WIDGET_ANGLE: "Change image angle",
            ADD_IMAGE_WIDGET_IDDS: "Add image data source",
            CHANGE_IMAGE_WIDGET_ENUMERATE: "Change image enumerate",
            CHANGE_IMAGE_WIDGET_IDDS: "Change image data source"
        },
        exportModal: {
            EXPORT_INFO: "Enter a template name",
        },
        attrPanel: {
            attrTab: {
                TITLE: "Attributes",
                PAGE_MANAGE: "Page management",
                DATA_SOURCE: "Data source",
                HISTORY_RECORD: "History record",
                REPORT_TPL: "Report Template"
            },
            attrRepeat: {
                STYLE: "Style:",
                CONTENT: "Content:",
                DATA_SOURCE: "Data source:",
                CUSTOMSTYLE: "Custom style:",
                EDIT_CONTENT_TITLE: "Edits",
                SAVE_STYLE_TITLE: "Application",
                EXPORT_STYLE_TITLE: "Export template",
                IMPORT_STYLE_TITLE: "Import template",
                PAGE: "Page:",
                SELECT_SCREEN: "Select page"
            },
            attrText: {
                TEXT_CONDITION: "Enter text here",
                TEXT_ONE: "Body 1",
                TEXT_TWO: "Body 2",
                TITLE_ONE: "Heading 1",
                TITLE_TWO: "Heading 2",
                TITLE_THREE: "Heading 3",
                TITLE_FOUR: "Heading 4",
                TITLE_FIVE: "Heading 5",
                SUBTITLE: "Subtitle",
            },
            attrButton: {
                STYLE_ONE: "Default",
                STYLE_TWO: "Primary",
                STYLE_THREE: "Success",
                STYLE_FOUR: "Info",
                STYLE_FIVE: "Warning",
                STYLE_SIX: "Danger",
                STYLE_SEVEN: "Link",
                STYLE_EIGHT: "Pink",
                STYLE_NINE: "Blue",
                STYLE_TEN: "Green"
            },
            attrHtml: {
                TITLE: "Code editor",
                RUNCODE: "Run code",
                SAVEANDEXIT: "Save and exit",
            },
            attrImg: {
                IMAGE: "Image:",
                ROTATE: "Rotation:",
                CHOOSE: "Select",
                ENUMER_INFO: "Please enter key value"
            },
            attrPipe: {
                PIPE_WIDTH: "Length:",
                PIPE_COLOR: "Color:",
            }
        },
        materalPanel: {
            toolbar: {
                TITLE: "Library",
                PRIVATE_MATERAL: "Private",
                PAGE_MATERAL: "Page",
                LAYER_MATERAL: "Layers",
                BUTTON_MATERAL: "Button",
                PUBLIC_MATERAL: "Material"
            },
            materalRepeat: {
                USE_MODAL: "Use material",
                DELETE_OK: "Deleted successfully ",
                ADD_OK: "Added successfully",
                PHOTO: "Image",
                ANIMATION: "Animation",
                PAGE_NAME: "Name:",
                PAGE_CREATOR: "Creator:",
                PAGE_TIME: "Created:",
                FORMAT_LOG: "Format error!"
            },
            privateMateral: {
                ADD_PHOTO: "Add image from library",
                DELETE_PHOTO: "Delete",
                USE_PHOTO: "Use"
            },
            pageMateral: {
                ADD_MODAL: "New template",
                BATCH_ADD: "Batch production",
                EDIT_PAGE: "Edit page",
                DELETE_PAGE: "Delete page",
            },
            layerMateral: {
                EDIT_LAYER: "Edit layer",
                DELETE_LAYER: "Delete layer"
            },
            buttonMateral: {
                EDIT_BUTTON: "Edit button",
                DELETE_BUTTON: "Remove button",
                USE_COPY: "Whether to keep a copy?"
            },
            publicMateral: {
                UPLOAD_PHOTO: "Upload image",
                ADD_PRIVATE: "Add to private library",
                DELETE_PHOTO: "Delete public material",
                UPLOAD_INFO: "Image type should be .gif, jpg, png, jpeg",
                UPLOAD_INFO_TIP: "Image should be no greater than 600k. "
            }
        }
    },
    screen: {
        UNSAVED_PAGE_TIP: 'This page isn\'t been saved, sure to leave?'
    },
    modal: {
        memberSelected: {
            CONFIRM: 'Confirm',
            TITLE: "Please Select Members",
            INPUT_INFO: "Please Enter Members Name To Search",
            ALL: 'All',
            MEMBER_SELECTED: 'Members'
        }
    }
}