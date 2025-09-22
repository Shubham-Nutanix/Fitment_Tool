import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Title,
  StackingLayout,
  TextLabel,
  Separator,
  VerticalSeparator,
  Tabs,
  Link,
  Modal,
  FlexLayout,
  TextArea,
} from "@nutanix-ui/prism-reactjs";
import reportsIcon from "../assets/reports.svg";
import "./home.css";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vmInput, setVmInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progressText, setProgressText] = useState("Checks started...");
  const [progressPct, setProgressPct] = useState(0);

  const navigate = useNavigate();

  const tabs = [{ title: "Report", key: "report" }];

  useEffect(() => {
    let timer;
    if (processing) {
      const poll = async () => {
        try {
          const res = await fetch("/api/progress");
          if (res.ok) {
            const json = await res.json();
            const total = json.total || 0;
            const processed = json.processed || 0;
            const pct = total > 0 ? Math.floor((processed / total) * 100) : 0;
            setProgressText(`${processed} / ${total} VMs complete`);
            setProgressPct(pct);
            if (processed >= total && total > 0) {
              setProgressText("Report generated successfully!");
              setProgressPct(100);
              setTimeout(() => navigate("/summary"), 800);
              return;
            }
          }
        } catch { }
        timer = setTimeout(poll, 1000);
      };
      poll();
    }
    return () => timer && clearTimeout(timer);
  }, [processing, navigate]);

  const startGeneration = async () => {
    const value = vmInput.trim();
    if (!value) {
      alert("Please enter VM names");
      return;
    }
    setIsModalOpen(false);
    setProcessing(true);
    setProgressText("0%");
    setProgressPct(0);
    try {
      const resp = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostnames: value }),
      });
      if (!resp.ok) throw new Error("Failed to start");
    } catch (e) {
      alert("Failed to start report");
      setProcessing(false);
    }
  };

  return (
    <>
      <Separator
        className="tab-class-home"
        separator={<VerticalSeparator size="large" />}
        spacing="spacing-20px"
      >
        <Title data-test-id="size-h2" size="h2">
          Fitment Check
        </Title>
        <Tabs
          data={tabs}
          defaultActiveKey="report"
          panelIdPrefix={new Date().getTime()}
          padding="0px"
          underline={false}
          id="without-underline-pattern"
        />
      </Separator>
      <div className="app-container home-page">
        <div className="home-page-content">
          <StackingLayout
            className="content"
            id="mainContent"
            style={{ display: processing ? "none" : "flex" }}
          >
            <Title data-test-id="size-h1">
              Generate Fitment Report for your Database Servers
            </Title>
            <TextLabel type={"primary"}>
              sample description text will be added here based on review with PM
            </TextLabel>
            <StackingLayout className="content-stacking" itemGap="L">
              <div className="icon-placeholder">
                <img src={reportsIcon} alt="Clipboard Icon" />
              </div>
              <Title data-test-id="sub-text" size={Title.TitleSizes.H3}>
                Insert VMs Details and get detailed reports
              </Title>
              <TextLabel type={"primary"} multiLine={true}>
                You can insert either in the form of CSV, JSON format
              </TextLabel>
            </StackingLayout>
            <TextLabel type={"primary"} multiLine={true}>
              Before getting started go through these prerequisites{" "}
              <Link href="#">View Prerequisites</Link>
            </TextLabel>
            <Button onClick={() => setIsModalOpen(true)}>
              Create a new report
            </Button>
          </StackingLayout>

          {processing && (
            <div className="processing-screen">
              <div className="processing-content">
                <div className="spinner"></div>
                <h2>Processing Your Request</h2>
                <p>
                  Please wait while we execute checks on your database
                  servers...
                </p>
                <div className="progress-info">
                  <p>{progressText}</p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progressPct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Modal
            visible={isModalOpen}
            title={<Title size="h3">Generate Fitment Report</Title>}
            width={600}
            onClose={() => setIsModalOpen(false)}
            restoreFocus={true}
            closeOnEscape={true}
            footer={[
              <Button
                type={Button.ButtonTypes.SECONDARY}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>,
              <Button
                type={Button.ButtonTypes.PRIMARY}
                onClick={startGeneration}
              >
                Generate Now
              </Button>
            ]}
          >
            <FlexLayout
              padding="20px"
              itemGap="L"
              className="full-width"
              flexDirection="column"
            >
              <TextLabel type="primary" multiLine={true}>
                Add list of VMs for which you want to generate the fitment
                report. You can choose to manually add the details.
              </TextLabel>

              <FlexLayout flexDirection="column" itemGap="S">
                <TextLabel type="primary">VMs</TextLabel>
                <TextArea
                  id="vmInput"
                  placeholder="Enter VM names separated by commas (e.g., VM1, VM2, VM3)"
                  value={vmInput}
                  onChange={(e) => setVmInput(e.target.value)}
                  rows={18}
                  style={{ width: "100%" }}
                />
              </FlexLayout>
            </FlexLayout>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Home;
