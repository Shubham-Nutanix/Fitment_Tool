import { PROPS } from "../constant.js";

export const dbServerSchemas = {
  idAttribute: PROPS.ENTITY_NAME,
  nameAttribute: PROPS.ENTITY_NAME,
  attributes: {
    [PROPS.ENTITY_NAME]: {
      type: "string",
      displayName: "Server Name",
    },
    [PROPS.INSTANCES_COUNT]: {
      type: "string",
      displayName: "Instances",
    },
    [PROPS.DATABASES_COUNT]: {
      type: "string",
      displayName: "Databases",
    },
    [PROPS.OVERALL_FITMENT_STATUS]: {
      type: "string",
      displayName: "Server Fitment Status",
    },
    [PROPS.ACTIONS]: {
      type: "string",
      displayName: "Actions",
    },
  },
};
