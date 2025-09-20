## NDB PreCheck – Fitment Tool

A lightweight Go service with a React UI to run pre-checks against Windows Database VMs. The backend invokes a PowerShell script remotely to collect VM/Instance/Database checks and serves a dashboard.

### Tech stack
- **Backend**: Go (Gin, Logrus)
- **Script**: PowerShell (`script.ps1` executed remotely)
- **Frontend**: React + Webpack

### Repository layout
```
Fitment_Tool/
  main.go               # Go API + static file server
  script.ps1            # PowerShell checks invoked per hostname
  webapp/               # React app (webpack)
    dist/               # Built assets (index.html, assets/*)
  build_release.sh      # Build Windows exe and package a zip
  release/
    ndb-precheck.zip    # Created by build_release.sh
```

---

## Prerequisites
- Go 1.21+ (repo uses Go modules; go.mod targets 1.23)
- Node.js 18+ and npm (for webapp dev/build)
- Windows host (for running the backend that calls `powershell.exe`)
  - The backend uses `powershell.exe` and `Invoke-Command`. Run it on Windows (or inside a Windows VM)
  - Remote target VMs must have PowerShell Remoting enabled and reachable

Note: Frontend can be developed on macOS/Linux, but the backend should run on Windows for end-to-end testing.

---

## Development workflow

### 1) Install frontend deps
```bash
cd webapp
npm install
```

### 2) Start the Go backend (Windows)
In a Windows PowerShell terminal (Administrator recommended):
```powershell
cd <path-to>\Fitment_Tool
go run .\main.go
# Server listens on http://localhost:8080
```

### 3) Start the frontend dev server (macOS/Linux/Windows)
The dev server proxies API calls to the Go backend on port 8080.
```bash
cd webapp
npm run dev
# Opens http://localhost:5173
```

Browse to `http://localhost:5173`. The SPA router is enabled and `/api/*` is proxied to `http://localhost:8080`.

---

## Production build and packaging

### Build the frontend
```bash
cd webapp
npm run build
# Outputs to webapp/dist
```

### Build Windows executable and zip bundle
Use the provided POSIX script (macOS/Linux) from repo root:
```bash
./build_release.sh
```
This creates:
- `release/ndb-precheck/` with:
  - `ndb-precheck.exe`
  - `script.ps1`
  - `webapp/dist/` (index.html, assets/*)
- `release/ndb-precheck.zip`

### Run on Windows DB VM
1. Copy `release/ndb-precheck.zip` to the VM and extract
2. In PowerShell (Run as Administrator), from the extracted folder:
```powershell
# Optional: Unblock files
Unblock-File .\ndb-precheck.exe; Unblock-File .\script.ps1

# Allow scripts for this session (if needed)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Start server
 .\ndb-precheck.exe
# Server at http://localhost:8080
```
3. Open a browser on the VM: `http://localhost:8080`

Note: The backend serves the built UI from `./webapp/dist`. Keep this structure.

---

## API quick reference
- `POST /api/check` – Start checks for CSV hostnames
  - Body: `{"hostnames":"vm1,vm2"}`
- `GET /api/progress` – Get progress `{ processed, total }`
- `GET /api/summary` – Aggregated summary for the dashboard
- `GET /api/dbservers` – VM-level view
- `GET /api/instances` – Instance-level view
- `GET /api/databases` – Database-level view

Default port: `8080` (change in `main.go` if needed).

---

## Troubleshooting
- Backend not starting on macOS/Linux: The service calls `powershell.exe`; run it on Windows.
- 404s for UI assets: Ensure you built the webapp and the extracted bundle contains `webapp/dist` next to the exe.
- Remote execution errors: Verify PowerShell Remoting is enabled and the VM is reachable: `Enable-PSRemoting -Force` (on target), firewalls allow WinRM, and appropriate credentials/context are used.


