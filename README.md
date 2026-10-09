# Dream Book Shop — Data Analysis System

A responsive Progressive Web Application (PWA) for the Unit 20 Dream Book Shop dataset-analysis assignment.

## What is included

- React + Vite frontend
- Django + Django REST Framework backend
- pandas dataset processing
- Chart.js visualisations through `react-chartjs-2`
- Framer Motion menu/interaction transitions
- Drag-and-drop uploads with `react-dropzone`
- PDF analysis reports generated with ReportLab + Matplotlib
- Light/dark mode
- PWA installation support
- Supplied `Dataset Books.csv` automatically used as the sample dataset
- Upload support for CSV, TSV, XLSX, XLS and JSON

## Required analysis modules

1. Publication Trends Over Time
2. Top Authors
3. Language Distribution
4. Publisher Analysis
5. Missing ISBN Analysis
6. Books per Year by Language

## Fastest setup on Windows

Prerequisites:

- Python 3.11 or newer
- Node.js 20 or newer (Node 22 is also fine)
- VS Code

Open the project folder in VS Code. Open **Terminal > New Terminal**, then run:

```bat
setup_windows.bat
```

When setup finishes, open **two VS Code terminals**.

Terminal 1:

```bat
run_backend.bat
```

Terminal 2:

```bat
run_frontend.bat
```

Open the address printed by Vite, normally:

```text
http://localhost:5173
```

Do not open `index.html` directly. React is served by Vite and the API is served by Django.

## Manual Windows setup (recommended for learning)

### 1. Open the project

In VS Code choose **File > Open Folder** and select this project folder.

### 2. Create a Python virtual environment

From the project root:

```powershell
python -m venv .venv
```

Activate it in PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks the activation script, run this once in the same terminal:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then activate again.

### 3. Install Django/backend libraries

```powershell
python -m pip install --upgrade pip
pip install -r backend\requirements.txt
```

This installs:

- Django — backend web framework
- Django REST Framework — API endpoints used by React
- django-cors-headers — allows the React dev server to communicate with Django
- pandas — dataset analysis
- openpyxl — `.xlsx` files
- xlrd — legacy `.xls` files
- ReportLab — PDF report generation
- Matplotlib — server-side chart image used inside PDF reports

### 4. Prepare Django

```powershell
python backend\manage.py migrate
```

This initializes Django's local SQLite database infrastructure. The current application does not require custom database tables for the analyses, but running migrations is the normal Django setup step.

### 5. Start Django

```powershell
python backend\manage.py runserver 127.0.0.1:8000
```

Keep this terminal running. Django is now the backend API.

You can test it in your browser:

```text
http://127.0.0.1:8000/api/health/
```

You should see JSON similar to:

```json
{"status":"ok","service":"Dream Book Shop API"}
```

### 6. Install React/frontend libraries

Open a **second** VS Code terminal, return to the project root and run:

```powershell
cd frontend
npm install
```

The main frontend packages are:

- React
- React Router DOM
- Chart.js
- react-chartjs-2
- Framer Motion
- Lucide React
- React Dropzone
- Sonner notifications
- vite-plugin-pwa

### 7. Start React

Still inside the `frontend` folder:

```powershell
npm run dev
```

Vite normally prints:

```text
http://localhost:5173
```

Open that address in Chrome/Edge.

## How Django and React work together

The browser loads the React interface from Vite on port `5173`.

React requests data using URLs such as:

```text
/api/datasets/sample/
/api/datasets/upload/
/api/analyses/publication-trends/
/api/reports/analysis/
```

During development, Vite proxies `/api` requests to Django on port `8000`. Django then uses pandas and the analysis classes to calculate the result and returns JSON. React takes that JSON and draws the visualisation with Chart.js.

In simple terms:

```text
User -> React UI -> Django API -> pandas analysis -> JSON -> React -> Chart.js
```

For a PDF report:

```text
User -> React -> Django -> analysis service -> Matplotlib + ReportLab -> PDF download
```

## Backend structure

```text
backend/
  api/                    HTTP endpoints only
  analytics/
    loader.py             file reading + column normalization
    storage.py            sample/upload dataset storage
    metadata.py           dashboard statistics
    factory.py            selects an analysis strategy
    report_service.py     PDF generation
    analyses/
      base.py
      publication_trends.py
      top_authors.py
      language_distribution.py
      publisher_analysis.py
      missing_isbn.py
      year_language.py
  data/sample_books.csv   automatically loaded sample dataset
```

This separation is intentional for the assignment: UI/API concerns are kept away from the individual analysis classes, which makes the application easier to explain using OOP, SOLID and design-pattern terminology.

## Frontend structure

```text
frontend/src/
  components/             reusable UI pieces
  context/                theme and active-dataset state
  pages/                  Home, About, Dashboard, Analysis
  utils/analyses.js       six analysis definitions
  styles.css              complete responsive theme
```

## Dataset expectations

The supplied dataset is already bundled and is automatically selected on first load.

New files may be CSV, TSV, XLSX, XLS or JSON. The loader recognizes common column-name variants, but the data should provide these meanings:

- book/title (optional — a placeholder is created if missing)
- author
- publication date or publication year
- language
- publisher
- ISBN
- BNB ID/record ID (optional — a generated row ID is created if missing)

The upload limit in development is 25 MB.

## PWA installation

Run the application normally and open it in a Chromium-based browser such as Chrome or Edge. On `localhost`, PWA features are allowed for development. When the browser fires the installation event, the **Install App** button in the navigation becomes active.

If the button is temporarily disabled, use the browser's install icon/menu once the service worker has been registered. PWA install availability is controlled by the browser.

## Building the React production bundle

From `frontend`:

```powershell
npm run build
```

The production frontend is created in `frontend/dist`.

The supplied project is configured primarily for coursework/local development with separate Django and Vite servers. Deployment can be added later after the application is complete.

## Common beginner problems

**`python` is not recognized** — reinstall Python and tick **Add Python to PATH**.

**`npm` is not recognized** — install Node.js LTS and restart VS Code.

**Page loads but no data appears** — check that Django is running on `127.0.0.1:8000` and React is running on `localhost:5173`.

**Port already in use** — close the old terminal/server or run Django on another port and update the proxy in `frontend/vite.config.js`.

**Upload error: missing columns** — your custom dataset does not contain enough of the required book-data fields. Read the error message and rename/add the required columns.

**Install App is disabled** — PWA installation depends on browser installability checks and may take a refresh after the service worker registers.
