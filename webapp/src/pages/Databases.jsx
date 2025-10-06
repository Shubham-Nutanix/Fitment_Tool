import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Title,
  Separator,
  BackIcon,
  VerticalSeparator,
  Tabs,
} from "@nutanix-ui/prism-reactjs";

function Databases() {
  const [databases, setDatabases] = useState([]);
  const [filter, setFilter] = useState("all");
  const [activeTabKey, setActiveTabKey] = useState("Databases");

  const navigate = useNavigate();
  const tabs = [
    { title: "Summary", key: "summary", route: "/summary" },
    { title: "Database Servers", key: "Dbservers", route: "/dbservers" },
    { title: "Instances", key: "Instances", route: "/instances" },
    { title: "Databases", key: "Databases", route: "/databases" },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/databases");
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        setDatabases(json.databases || []);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return databases;
    return databases.filter(
      (db) => (db.overall_fitment_status?.status || "").toLowerCase() === filter
    );
  }, [databases, filter]);

  return (
    <div>
      <Separator
        className="tab-class-home"
        separator={<VerticalSeparator size="large" />}
        spacing="spacing-20px"
      >
        <BackIcon onClick={() => navigate("/")} />
        <Title data-test-id="size-h2" size="h2">
          Fitment Report
        </Title>
        <Tabs
          data={tabs}
          activeKey={activeTabKey}
          onTabClick={(key) => {
            setActiveTabKey(key);
            const tab = tabs.find((t) => t.key === key);
            if (tab) navigate(tab.route);
          }}
          panelIdPrefix={new Date().getTime()}
          padding="0px"
          underline={true}
          id="without-underline-pattern"
        />
      </Separator>

      <div className="container">
        <div className="filter-section">
          <label htmlFor="filter">Filter:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="passed">Database Fitment = Passed</option>
            <option value="failed">Database Fitment = Failed</option>
          </select>
        </div>

        <div className="table-heading">{`Viewing ${
          filter === "all" ? "All" : filter[0].toUpperCase() + filter.slice(1)
        } Databases (${filtered.length})`}</div>

        <table id="table">
          <thead>
            <tr>
              <th>Entity Name</th>
              <th>Database VM</th>
              <th>Fitment Status</th>
              <th>Instance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="tableBody">
            {filtered.map((db) => (
              <tr key={db.entity_name}>
                <td>{db.entity_name}</td>
                <td>{db.type}</td>
                <td
                  className={
                    db.overall_fitment_status?.status === "Passed"
                      ? "status-passed"
                      : "status-failed"
                  }
                >
                  {db.overall_fitment_status?.status}
                </td>
                <td>{db.parent_instance}</td>
                <td>
                  <span className="action-link">Configuration</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Databases;
