import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Title,
  StackingLayout,
  TextLabel,
} from "@nutanix-ui/prism-reactjs";
import reportsIcon from "../assets/reports.svg";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vmInput, setVmInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progressText, setProgressText] = useState("Checks started...");
  const [progressPct, setProgressPct] = useState(0);

  const navigate = useNavigate();

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
        } catch {}
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
    <div className="app-container">
      <nav className="tabs">
        <button className="tab active">Fitment Check</button>
        <Link className="tab" to="/summary">
          Report
        </Link>
      </nav>

      <StackingLayout
        className="content"
        id="mainContent"
        style={{ display: processing ? "none" : "flex" }}
      >
        <Title data-test-id="size-h1">
          Generate Fitment Report for your Database Servers
        </Title>
        <p className="description">
          sample description text will be added here based on review with PM
        </p>
        <div className="icon-placeholder">
          <img src={reportsIcon} alt="Clipboard Icon" />
        </div>
        <Title data-test-id="sub-text" size={Title.TitleSizes.H3}>
          Insert VMs Details and get detailed reports
        </Title>
        <TextLabel type={"primary"}>
          You can insert either in the form of CSV, JSON format
        </TextLabel>
        <p className="prereq">
          Before getting started go through these prerequisites{" "}
          <a href="#">View Prerequisites</a>.
        </p>
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
              Please wait while we execute checks on your database servers...
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3>Generate Fitment Report</h3>
              <div className="modal-actions">
                <span className="help">?</span>
                <span
                  className="close-modal"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </span>
              </div>
            </header>
            <div className="modal-body">
              <p>
                Add list of VMs for which you want to generate the fitment
                report. You can choose to manually add the details.
              </p>
              <div className="form-row">
                <label htmlFor="vmInput">VMs</label>
                <textarea
                  id="vmInput"
                  placeholder="Enter VM names separated by commas (e.g., VM1, VM2, VM3)"
                  value={vmInput}
                  onChange={(e) => setVmInput(e.target.value)}
                />
              </div>
            </div>
            <footer className="modal-footer">
              <button
                className="modal-cancel"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button className="modal-generate" onClick={startGeneration}>
                Generate Now
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
