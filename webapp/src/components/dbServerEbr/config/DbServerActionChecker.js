import { EBActionsUtil } from "@nutanix-ui/ebr-ui";

const OpsManagerActionChecker = {
  onlyOneSelected: EBActionsUtil.onlyOneSelected,

  canWrite(action, entityType, selectedEntities) {
    if (selectedEntities && selectedEntities.length > 0) {
      const entity = selectedEntities[0];
      if (entity.status === "HEALTHY") {
        return { state: "enabled" };
      }
      return { state: "disabled" };
    }
    return { state: "disabled" };
  },

  canDelete(action, entityType, selectedEntities) {
    if (selectedEntities && selectedEntities.length > 0) {
      const entity = selectedEntities[0];
      if (entity?.associatedDBCount < 1) {
        return { state: "enabled" };
      }
      return {
        state: "disabled",
        reason: "DB Server is associated with at least one database",
      };
    }
  },
};

export default OpsManagerActionChecker;
