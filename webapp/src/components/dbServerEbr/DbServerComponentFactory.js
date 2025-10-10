import moment from "moment";
import { Link, Tooltip } from "@nutanix-ui/prism-reactjs";
import DbServerPopupContainer from "./DbServerPopupContainer.js";
class EBComponentFactory {
  constructor({ parser } = {}) {
    this.parser = parser;
    this.popupContext = {};
    this.defaultFactory = null;
  }

  setPopupContext(context) {
    this.popupContext = context;
  }

  setDefaultFactory(factory) {
    this.defaultFactory = factory;
  }

  getComponent(componentId, options = {}) {
    const { options: opts = {} } = options;
    const { entity, schema } = opts;

    switch (componentId) {
      case "popupContainer": {
        return <DbServerPopupContainer {...options} />;
      }
      case "actions": {
        return <Link>Configuration</Link>;
      }
      case "fitmentStatus": {
        return (
          <span
            className={
              entity.overall_fitment_status?.status === "Passed"
                ? "status-passed"
                : "status-failed"
            }
          >
            {entity.overall_fitment_status?.status}
          </span>
        );
      }
      default:
        if (schema?.isValidAttribute(componentId) && entity) {
          return schema.getAttributeDisplayValue(
            entity[componentId],
            componentId
          );
        }
        return this.defaultFactory?.getComponent(componentId, options);
    }
  }

  _elapsedTime(ts, defaultValue = "-") {
    if (!ts) return defaultValue;

    const formatted = moment(ts).format("MMMM Do YYYY, h:mm:ss a");
    const relative = moment(ts).fromNow();
    const display = relative.charAt(0).toUpperCase() + relative.slice(1);

    return (
      <Tooltip
        contentProps={{
          style: {
            maxWidth: 400,
          },
        }}
        content={formatted}
        key={display}
        oldTooltip={false}
      >
        <span>{display}</span>
      </Tooltip>
    );
  }

  getFilterParser() {
    return this.parser || this.defaultFactory?.getFilterParser();
  }
}

let _instance = null;

const instanceManager = {
  getInstance(options) {
    if (!_instance) {
      _instance = new EBComponentFactory(options);
    }
    return _instance;
  },
};

export default instanceManager;
