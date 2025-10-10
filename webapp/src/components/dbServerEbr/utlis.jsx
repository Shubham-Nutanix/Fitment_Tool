import { EBActionsUtil } from "@nutanix-ui/ebr-ui";
import { dbServerSchemas } from "./config/DbServerSchemas";
import { dbServerActions } from "./config/DbServerActions";
import { dbServerPerspectives } from "./config/DbServerPerspective";
import { ENTITY_TYPE, ACTIONS_PROPS } from "./constant";

/**
 *
 * @param {object} filters - The filters object
 * @returns Object - The host configuration object for Host EBR
 */
export const getDbServerConfig = () => {
  return {
    [ENTITY_TYPE]: {
      schema: dbServerSchemas,
      //  actions: EBActionsUtil.processActionsConfig(dbServerActions),
      perspectives: dbServerPerspectives(),
      filters: {},
    },
  };
};
