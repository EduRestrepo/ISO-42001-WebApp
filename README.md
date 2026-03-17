# 🤖 ISO/IEC 42001:2023 Tracker - Modernized Edition

[![Version](https://img.shields.io/badge/version-1.5-blue.svg)](https://github.com/EduRestrepo/ISO-42001-WebApp)
[![Author](https://img.shields.io/badge/Author-Eduardo%20Restrepo-orange.svg)](https://github.com/EduRestrepo)
[![Standard](https://img.shields.io/badge/Standard-ISO%2FIEC%2042001%3A2023-green.svg)](https://www.iso.org/standard/81230.html)

A premium, localized, and light-weight web application designed to help organizations track their journey towards **ISO/IEC 42001:2023** compliance. This tool provides a professional dashboard for monitoring Artificial Intelligence Management Systems (AIMS).

---

## ✨ Key Features (v1.5)

### 📊 Professional Dashboard
- **Executive KPIs**: Real-time tracking of Implementation Progress, Process Maturity, and Risk Count.
- **Trend Analysis**: Moving average (PM3) visualization to identify project momentum.
- **Risk Profile**: Correlate Compliance vs. Maturity using interactive scatter plots.
- **Snapshots**: Capture historical data points to view evolution over time.

### 🛡️ Compliance Management
- **Full Annex A Coverage**: Seeded with core ISO 42001 controls (A.1 to A.16).
- **Risk & Impact Integration**: Tag controls with Risk Levels (Low to Critical) and Impact Categories.
- **Data Provenance**: Track the lineage and quality of data used in AI models.
- **RBAC (Role Based Access Control)**: Simulate Viewer, Auditor, and Admin permissions.

### 📄 Export & Reporting
- **PDF Executive Report**: Generate a professional document with a custom cover, dashboard snapshots, and prioritized "Top 5" findings.
- **Data Portability**: Export/Import your entire dataset as JSON or CSV.

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Edge, Firefox, Safari).
- An active internet connection (to load Chart.js and Tailwind-inspired premium assets via CDN).

### Installation
1. Clone the repository or download the ZIP.
2. Open `index.html` in your browser.
3. No database or server setup required — all data is persisted in your browser's `localStorage`.

---

## 🛠️ Developer Guide

### Architecture
- **Structure**: Vanilla HTML5, CSS3 (Modern design system), and ES6+ JavaScript.
- **Responsiveness**: Mobile-first design using CSS Grid and Flexbox.
- **Persistence**: `store` module wrapper for `localStorage`.
- **Charts**: Powered by [Chart.js](https://www.chartjs.org/).
- **PDF Generation**: [jsPDF](https://parall.ax/products/jspdf) + [html2canvas](https://html2canvas.hertzen.com/).

### Customization
- To change the primary colors, update the CSS variables in `:root` inside `styles.css`.
- To modify the default controls, edit the `seedControls` array in `app.js`.

---

## ✅ Compliance Checklist (ISO 42001)

When using this tracker, ensure you have documented evidence for:
- [ ] **A.1 Governance**: Roles and responsibilities defined.
- [ ] **A.2 Risk Assessment**: Impact assessments for AI systems.
- [ ] **A.3 Transparency**: System descriptions and documentation.
- [ ] **A.5 Security**: Protection of models and data integrity.
- [ ] **A.15 Ethics**: Bias mitigation and fairness checks.

---

## 👨‍💻 Author
**Eduardo Restrepo**  
*Consultant in AI Governance & Compliance*

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
*Disclaimer: This tool is for tracking purposes and does not constitute official certification. Always consult with a certified ISO 42001 auditor.*
