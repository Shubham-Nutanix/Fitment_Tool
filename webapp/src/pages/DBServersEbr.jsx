import EntityBrowserView from "../components/EntityBrowser";
import DbServerComponentFactory from "../components/dbServerEbr/DbServerComponentFactory";
import { ThemeWrapper } from "@nutanix-core/prism-ui-themes-common";
import { getDbServerConfig } from "../components/dbServerEbr/utlis";
import {
  FlexLayout,
  Alert,
  Link,
  AlertLayout,
} from "@nutanix-ui/prism-reactjs";
import { EBActionsUtil } from "@nutanix-ui/ebr-ui";
import OpsManagerActionChecker from "../components/dbServerEbr/config/DbServerActionChecker";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

EBActionsUtil.registerCapabilityChecker("opsManager", OpsManagerActionChecker);

const OpsManagerEBR = function () {
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  function getResponse() {
    return new Promise((resolve, reject) => {
      fetch("/api/dbservers")
        .then((res) => res.json())
        .then(resolve)
        .catch(reject);
    });
  }

  const config = {
    ebId: "dbserver_ebr",
    entityTypeDisplayNames: {
      dbServer: {
        singular: "DB Server",
        plural: "DB Servers",
      },
    },
    entityType: "dbServer",
    entityConfigs: getDbServerConfig({}, false),
    ebComponentFactory: DbServerComponentFactory.getInstance(),
    showFiltersPanel: true,
    showSuggestedFilters: true,
    filtersPanelCollapsed: true,
    debugStore: true,
    allowCustomFocuses: false,
    showFiltersBar: true,
    queryConfig: {
      pollingSec: 30000,
      queryProcessorName: "LocalDataUQDC",
      queryProcessorProps: {
        queryListCallback: () => {
          return new Promise((resolve) => {
            getResponse()
              .then((response) => {
                const dbServerData = response?.vms || [];

                resolve({ data: dbServerData });
              })
              .catch(() => {
                resolve({ data: [] });
              });
          });
        },
        queryResponseTimeToLiveSecs: 5 * 60,
      },
      offset: 10,
    },
  };

  return (
    <FlexLayout>
      <ThemeWrapper>
        <FlexLayout flexDirection="column" className="full-width">
          <EntityBrowserView {...config} />
        </FlexLayout>
      </ThemeWrapper>
    </FlexLayout>
  );
};

export default OpsManagerEBR;
