import { ACTIONS_PROPS } from "../constant.js";

export const dbServerActions = {
  actions: {
    primary: [ACTIONS_PROPS.CREATE_DB_SERVER],
    secondary: [ACTIONS_PROPS.UPDATE, ACTIONS_PROPS.DELETE],
  },

  actionProps: {
    [ACTIONS_PROPS.CREATE_DB_SERVER]: {
      id: ACTIONS_PROPS.CREATE_DB_SERVER,

      label: "Add",

      componentProps: {
        color: "danger",
      },

      criteria: {
        checks: [],

        match: "all",
      },
    },

    [ACTIONS_PROPS.UPDATE]: {
      id: ACTIONS_PROPS.UPDATE,

      label: "Update",

      componentProps: {
        color: "danger",
      },

      criteria: {
        checks: ["onlyOneSelected"],

        match: "all",
      },
    },

    [ACTIONS_PROPS.DELETE]: {
      id: ACTIONS_PROPS.DELETE,
      label: "Remove",
      componentProps: {
        color: "danger",
      },

      criteria: {
        checks: ["onlyOneSelected", "canDelete"],

        match: "all",
      },
    },
  },
};
