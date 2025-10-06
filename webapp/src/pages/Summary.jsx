import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Title,
  StackingLayout,
  TextLabel,
  Separator,
  BackIcon,
  VerticalSeparator,
  Tabs,
  DashboardWidgetHeader,
  FlexLayout,
  DashboardWidgetLayout,
  WidgetTable,
  ChevronDownIcon,
  ChevronUpIcon,
  Button,
} from "@nutanix-ui/prism-reactjs";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "@nutanix-ui/recharts";
import "./summary.css";

function Summary() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("Database Server");
  const [expandedRows, setExpandedRows] = useState([]);

  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = useState("summary");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/summary");
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const tabs = [
    { title: "Summary", key: "summary", route: "/summary" },
    { title: "Database Servers", key: "Dbservers", route: "/dbservers" },
    { title: "Instances", key: "Instances", route: "/instances" },
    { title: "Databases", key: "Databases", route: "/databases" },
  ];

  const entity = data?.summary?.entity_wise || {};
  const checkWise = data?.summary?.check_wise || [];

  const entityBlocks = [
    {
      label: "Servers",
      total: entity.total_vms || 0,
      failed: entity.failed_vms || 0,
      title: "Check Status by Database Servers",
    },
    {
      label: "Instances",
      total: entity.total_instances || 0,
      failed: entity.failed_instances || 0,
      title: "Check Status by Instances",
    },
    {
      label: "Databases",
      total: entity.total_databases || 0,
      failed: entity.failed_databases || 0,
      title: "Check Status by Databases",
    },
  ];

  const checkWiseTableData = (
    checkWise.find((x) => x.type === activeTab)?.categories || []
  ).map((cat) => ({
    key: cat.category_name,
    checks: cat.category_name,
    passed: cat.passed,
    failed: cat.failed,
    _children: (cat.check || []).map((ch) => ({
      key: `${cat.category_name}-${ch.check_name}`,
      checks: ch.check_name,
      passed: ch.passed,
      failed: ch.failed,
    })),
  }));

  const handleExpand = (expanded, rowData) => {
    setExpandedRows((prev) =>
      expanded
        ? [...prev, rowData.key]
        : prev.filter((k) => k !== rowData.key)
    );
  };

  return (
    <>
      {/* Header */}
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
          underline={false}
          id="without-underline-pattern"
        />
      </Separator>

      <FlexLayout className="summary-layout" padding="20px">
        {/* Entities Wise Summary*/}
          <DashboardWidgetLayout
            className="summary-card"
            header={
              <DashboardWidgetHeader
                title="Entities Wise Summary"
                showCloseIcon={false}
              />
            }
            bodyContent={
              <StackingLayout>
                {entityBlocks.map((block) => (
                  <FlexLayout
                    key={block.label}
                    className="entity-block"
                  >
                    <StackingLayout
                      className="entity-count-container"
                    >
                      <Title size="h1" className="entity-total-count">
                        {block.total}
                      </Title>
                      <TextLabel type="secondary">Total</TextLabel>
                      <TextLabel type="secondary">{block.label}</TextLabel>
                      <TextLabel type="secondary">Checked</TextLabel>
                    </StackingLayout>

                    <div className="chart-section">
                      <Title size="h5">{block.title}</Title>

                      <div className="chart-container">
                        <ResponsiveContainer width="100%" height={80}>
                          <BarChart
                            data={[
                              {
                                name: block.label,
                                failed: block.failed,
                                passed: block.total - block.failed,
                              },
                            ]}
                            layout="vertical"
                            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                            compact
                          >
                            <XAxis
                              type="number"
                              domain={[0, block.total || 1]}
                              hide
                            />
                            <YAxis type="category" dataKey="name" hide />

                            <Bar
                              dataKey="failed"
                              stackId="a"
                              fill="#E4677C"
                              barSize={20}
                              isAnimationActive={false}
                            />
                            <Bar
                              dataKey="passed"
                              stackId="a"
                              fill="#93D1B2"
                              barSize={20}
                              isAnimationActive={false}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <TextLabel type="secondary">
                        <span className="failed-count">{block.failed}</span>{" "}
                        / <span>{block.total}</span> Failed
                      </TextLabel>
                    </div>
                  </FlexLayout>
                ))}

                <FlexLayout
                  justifyContent="center"
                  itemGap="XL"
                  className="legend-container"
                >
                  <TextLabel type="secondary">
                    <span className="legend-failed">▲ Failed</span>
                  </TextLabel>
                  <TextLabel type="secondary">
                    <span className="legend-passed">✔ Passed</span>
                  </TextLabel>
                </FlexLayout>
              </StackingLayout>
            }
          />

          <DashboardWidgetLayout
            className="summary-card"
            header={
              <DashboardWidgetHeader
                title="Check Wise Summary"
                showCloseIcon={false}
              />
            }
            bodyContent={
              <StackingLayout itemGap="0px">
                <Tabs
                  data={[
                    { title: "Database Server Checks", key: "Database Server" },
                    { title: "Instance Checks", key: "Instance" },
                    { title: "Database Checks", key: "Database" },
                  ]}
                  onTabClick={(tabKey) => setActiveTab(tabKey)}
                  defaultActiveKey={"Database Server"}
                  activeKey={activeTab}
                  panelIdPrefix="checkwise-tabs"
                  id="checkwise-summary"
                />

                <FlexLayout padding="0px 20px">
                  <StackingLayout itemGap="0px">
                    <WidgetTable
                      rowKey="key"
                      dataSource={checkWiseTableData}
                      columns={[
                        { title: "Checks", key: "checks", dataIndex: "checks" },
                        {
                          title: "Passed",
                          key: "passed",
                          dataIndex: "passed",
                          render: (val) => (
                            <span className="table-passed">✔ {val}</span>
                          ),
                        },
                        {
                          title: "Failed",
                          key: "failed",
                          dataIndex: "failed",
                          render: (val) => (
                            <span className="table-failed">✘ {val}</span>
                          ),
                        },
                        {
                          title: "",
                          key: "action",
                          render: (_, rowData) => {
                            const isExpanded = expandedRows.includes(rowData.key);
                            return (
                              <Button
                                appearance="mini"
                                aria-label="Expand/Collapse"
                                onClick={() =>
                                  handleExpand(!isExpanded, rowData)
                                }
                              >
                                {isExpanded ? (
                                  <ChevronUpIcon aria-hidden="true" />
                                ) : (
                                  <ChevronDownIcon aria-hidden="true" />
                                )}
                              </Button>
                            );
                          },
                        },
                      ]}
                      background="base"
                      structure={{
                        columnWidths: {
                          checks: "64%",
                          passed: "15%",
                          failed: "15%",
                          action: "6%",
                        },
                        showHeader: true,
                      }}
                    />

                    {checkWiseTableData.map((rowData, index) => {
                      const isExpanded = expandedRows.includes(rowData.key);
                      if (!isExpanded) return null;

                      return (
                        <div
                          key={`expanded-${rowData.key}`}
                          className="expanded-row"
                        >
                          {rowData._children.map((child) => (
                            <FlexLayout
                              key={child.key}
                              alignItems="center"
                              className="expanded-row-item"
                            >
                              <span className="expanded-check-name">
                                {child.checks}
                              </span>

                              <span className="expanded-passed">
                                ✔ {child.passed}
                              </span>
                              <span className="expanded-failed">
                                ✘ {child.failed}
                              </span>
                              <span className="expanded-spacer"></span>
                            </FlexLayout>
                          ))}
                        </div>
                      );
                    })}
                  </StackingLayout>
                </FlexLayout>
              </StackingLayout>
            }
          />
      </FlexLayout>
    </>
  );
}

export default Summary;
