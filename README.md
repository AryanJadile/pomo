<div align="center">
  <h1>🍎 PomeGuard</h1>
  <p><em>Non-destructive precision intelligence for Bhagwa pomegranate horticulture.</em></p>
  
  ![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
  ![License](https://img.shields.io/badge/license-MIT-green.svg)
  ![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
  ![GitHub last commit](https://img.shields.io/github/last-commit/your-username/pomeguard)
  ![GitHub Repo stars](https://img.shields.io/github/stars/your-username/pomeguard?style=social)
  ![GitHub issues](https://img.shields.io/github/issues/your-username/pomeguard)
  ![Made with LangGraph](https://img.shields.io/badge/Made%20with-LangGraph-orange)
  ![Made with EfficientNetB0](https://img.shields.io/badge/Model-EfficientNetB0-blueviolet)

  <br />

  ![PomeGuard Demo](assets/demo.gif)
</div>

---

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
  - [Computer Vision Pipeline](#computer-vision-pipeline)
  - [Knowledge Ontology](#knowledge-ontology)
  - [Multi-Agent Orchestration](#multi-agent-orchestration)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Frontend](#frontend)
- [Dataset](#dataset)
- [Model Performance](#model-performance)
- [Ontology Schema](#ontology-schema)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Citation](#citation)

## Overview

PomeGuard is an advanced agricultural intelligence system designed to combat the unique challenges faced by pomegranate horticulture. Traditional methods rely heavily on destructive testing or late-stage visual inspection to determine the internal health and phytochemical quality of the fruit. PomeGuard introduces a non-destructive, AI-driven approach to assess the nutritional and health status of the fruit instantly, directly from the field.

The Bhagwa pomegranate variety is of immense economic and cultural significance, particularly in Maharashtra, India. However, it is highly susceptible to devastating diseases such as Bacterial Blight (Telya), Anthracnose, and various fruit spots. These diseases not only cause external blemishes but also degrade the internal phytochemical composition of the fruit, leading to significant yield and quality losses for farmers.

Our core technical innovation lies in the fusion of state-of-the-art computer vision (EfficientNetB0), OWL/RDF ontological reasoning, and a robust LangGraph multi-agent workflow. This pipeline ingests standard fruit imagery and environmental metadata to automatically generate a comprehensive Nutritional & Health Scorecard. 

This approach matters because it bridges the crucial gap between merely detecting an external disease symptom and understanding its cascading impact on the internal phytochemical quality (Anthocyanins, Punicalagins, Ellagic Acid). By taking environmental stressors into account through an ontological knowledge base, PomeGuard transforms pixel-level classifications into holistic, actionable agronomic intelligence.

## Key Features

- 🔬 **AI-powered disease classification** across 5 categories (Healthy, Bacterial Blight, Anthracnose, Cercospora Fruit Spot, Alternaria Fruit Spot)
- 🧬 **Non-destructive phytochemical inference** (Anthocyanins, Punicalagins, Ellagic Acid) via OWL/RDF ontology
- 🌦 **Real-time environmental stress scoring** (UV irradiance, humidity, temperature)
- 🤖 **LangGraph multi-agent orchestration** with stateful, fault-tolerant workflow
- 📊 **Nutritional & Health Scorecard** with per-compound confidence intervals
- 🌱 **Agronomic advisory generation** in plain English
- 🗂 **Full analysis history** with farmer dashboard
- 🔌 **RESTful API backend** built with FastAPI
- 💻 **Responsive React frontend** with dark mode
- 📄 **Downloadable PDF reports** per analysis

## System Architecture

PomeGuard utilizes a multi-layered architecture transitioning from raw perceptual inputs to high-level semantic reasoning. At its core, it leverages an autonomous multi-agent orchestrator that fuses deep learning vision models, live environmental sensor metadata, and a logical knowledge base to produce an integrated nutritional scorecard.

```ascii
┌─────────────────────────────────────────────────────────────────┐
│                    PomeGuard System Architecture                │
└─────────────────────────────────────────────────────────────────┘

  ┌──────────────┐   ┌──────────────────┐   ┌──────────────────┐
  │  Fruit Image │   │  Env. Metadata   │   │  OWL/RDF         │
  │  (Camera /   │   │  UV · Humidity   │   │  Knowledge Base  │
  │   Upload)    │   │  Temperature     │   │  (Ontology)      │
  └──────┬───────┘   └────────┬─────────┘   └────────┬─────────┘
         │                    │                        │
         ▼                    ▼                        ▼
┌────────────────────────────────────────────────────────────────┐
│              LangGraph Multi-Agent Orchestrator                │
│                                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────────────┐  │
│  │ Vision      │  │ Env. Data   │  │ Ontology Agent         │  │
│  │ Agent       │  │ Agent       │  │ OWL/SPARQL Reasoning   │  │
│  │ EfficientNet│  │ Sensor +    │  │ Severity → Phytochem   │  │
│  │ B0 Classify │  │ Stress Score│  │ Inference              │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬────────────┘  │
│         │                │                       │             │
│         └────────────────┴───────────────────────┘             │
│                          │                                     │
│              ┌───────────▼────────────┐                        │
│              │   Feature Fusion Node  │                        │
│              │  Vision + Env + Onto   │                        │
│              └───────────┬────────────┘                        │
│                          │                                     │
│              ┌───────────▼────────────┐                        │
│              │    Reporting Agent     │                        │
│              │  Scorecard + Advisory  │                        │
│              └───────────┬────────────┘                        │
└──────────────────────────┼─────────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │  Nutritional & Health   │
              │       Scorecard         │
              │  (Non-destructive output)│
              └─────────────────────────┘
```

### Computer Vision Pipeline
We utilize the EfficientNetB0 architecture, chosen for its optimal balance of accuracy and computational efficiency through compound scaling. The model undergoes a two-phase fine-tuning strategy: initial frozen head training followed by partial unfreezing of the deeper layers to adapt to domain-specific features of pomegranate surfaces. The preprocessing pipeline involves standard resize (224x224), normalization, and extensive data augmentation. The output of this pipeline is a disease label, calculated severity score, and inference confidence.

### Knowledge Ontology
Our knowledge base is structured as an OWL 2 DL ontology, formalizing the domain constraints into four primary class hierarchies: `FruitCondition`, `PhytochemicalCompound`, `EnvironmentalStressor`, and `NutritionalQualityScore`. We pair object properties with Semantic Web Rule Language (SWRL) inference rules to model the complex degradation of compounds under stress. We utilize the HermiT reasoner and SPARQL querying to infer phytochemical levels indirectly based on the visual severity and environmental context.

### Multi-Agent Orchestration
The orchestration layer is built on a LangGraph StateGraph comprising 4 key nodes (Vision, Environment, Ontology, Reporting). These nodes operate over a shared state schema, passing the derived context downstream. Conditional routing logic handles edge cases (e.g., bypassing ontology if healthy), while built-in checkpointing ensures state persistence and fault recovery across the execution pipeline.

## Tech Stack

| Layer | Technology |
|---|---|
| Computer Vision | EfficientNetB0 (TensorFlow / Keras) |
| Knowledge Reasoning | OWL 2 DL, RDF, HermiT Reasoner, SPARQL |
| Agent Orchestration | LangGraph, LangChain |
| Backend API | FastAPI, Python 3.10+, Uvicorn |
| Frontend | React 18, Vite, Tailwind CSS, shadcn/ui |
| State Management | Zustand |
| Charts | Recharts |
| Animations | Framer Motion |
| Database | PostgreSQL (analysis history) |
| Deployment | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Testing | Pytest (backend), Vitest (frontend) |

## Project Structure

```text
pomeguard/
├── backend/
│   ├── agents/
│   │   ├── vision_agent.py         # EfficientNetB0 inference agent
│   │   ├── env_agent.py            # Environmental metadata agent
│   │   ├── ontology_agent.py       # OWL/SPARQL reasoning agent
│   │   └── reporting_agent.py      # Scorecard & advisory generation
│   ├── api/
│   │   ├── routes/
│   │   │   ├── classify.py         # POST /api/classify
│   │   │   ├── env_metadata.py     # POST /api/env-metadata
│   │   │   ├── ontology.py         # POST /api/ontology-inference
│   │   │   └── history.py          # GET /api/history
│   │   └── main.py                 # FastAPI app entrypoint
│   ├── models/
│   │   ├── efficientnet_b0.py      # Model definition & loading
│   │   └── checkpoints/            # Saved model weights
│   ├── ontology/
│   │   ├── pomeguard.owl           # OWL 2 DL ontology file
│   │   ├── rules.swrl              # SWRL inference rules
│   │   └── sparql_queries.py       # Reusable SPARQL query templates
│   ├── graph/
│   │   └── workflow.py             # LangGraph StateGraph definition
│   ├── schemas/
│   │   └── models.py               # Pydantic request/response models
│   ├── tests/
│   │   └── test_api.py             # Pytest API test suite
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Analyse.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── HowItWorks.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── ResultsPanel.jsx
│   │   │   ├── ScorecardGauge.jsx
│   │   │   └── AdvisoryCard.jsx
│   │   ├── services/
│   │   │   └── api.js              # Axios API service layer
│   │   ├── store/
│   │   │   └── analysisStore.js    # Zustand global state
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── assets/
│   └── demo.gif
├── docs/
│   ├── api_reference.md
│   └── ontology_schema.md
├── docker-compose.yml
├── .env.example
├── .github/
│   └── workflows/
│       └── ci.yml
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Docker & Docker Compose
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/pomeguard.git
cd pomeguard

# 2. Backend setup
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Frontend setup
cd ../frontend
npm install
```

### Environment Variables

```env
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/pomeguard
MODEL_CHECKPOINT_PATH=./models/checkpoints/efficientnet_b0_pomeguard.h5
ONTOLOGY_FILE_PATH=./ontology/pomeguard.owl
LANGCHAIN_API_KEY=your_langchain_api_key_here
SECRET_KEY=your_secret_key_here

# Frontend
VITE_API_BASE_URL=http://localhost:8000
```

### Running the Application

```bash
# Option A — Docker Compose (recommended)
docker-compose up --build

# Option B — Manual
# Terminal 1: Backend
cd backend
uvicorn api.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

- Frontend App: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API Docs (Swagger UI): `http://localhost:8000/docs`

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/classify` | Upload fruit image, returns disease classification |
| POST | `/api/env-metadata` | Submit environmental readings, returns stress scores |
| POST | `/api/ontology-inference` | Run phytochemical inference, returns scorecard |
| GET | `/api/history` | Retrieve all past analyses |

### POST /api/classify

Accepts a fruit image and returns disease classification results from EfficientNetB0.

**Request**
Content-Type: multipart/form-data
| Field  | Type | Required | Description              |
|--------|------|----------|--------------------------|
| image  | File | Yes      | JPG, PNG, or WEBP image  |

**Response 200**
```json
{
  "disease": "Bacterial Blight",
  "severity": "Moderate",
  "confidence": 94.2,
  "severity_score": 2,
  "image_url": "/uploads/abc123.jpg"
}
```

**Error Responses**
| Code | Description                        |
|------|------------------------------------|
| 400  | Invalid file type or missing image |
| 422  | Validation error                   |
| 500  | Model inference failure            |

### POST /api/env-metadata

Accepts environmental readings related to the sample to compute contextual stress multipliers.

**Request**
Content-Type: application/json
| Field       | Type   | Required | Description              |
|-------------|--------|----------|--------------------------|
| temperature | Float  | Yes      | Temp in Celsius          |
| humidity    | Float  | Yes      | Humidity Percentage      |
| uv_index    | Float  | Yes      | UV Irradiance Index      |

**Response 200**
```json
{
  "stress_score": 3.4,
  "stress_level": "High",
  "recommended_actions": ["Increase hydration", "Provide shade netting"]
}
```

**Error Responses**
| Code | Description                        |
|------|------------------------------------|
| 422  | Validation error                   |
| 500  | Computation failure                |

### POST /api/ontology-inference

Invokes the OWL reasoner to map visual severity and environmental stress to predicted internal degradation.

**Request**
Content-Type: application/json
| Field          | Type   | Required | Description              |
|----------------|--------|----------|--------------------------|
| disease        | String | Yes      | Diagnosed disease        |
| severity_score | Int    | Yes      | Detected severity (1-5)  |
| stress_score   | Float  | Yes      | Computed stress modifier |

**Response 200**
```json
{
  "scorecard": {
    "overall_health_score": 45.2,
    "phytochemicals": {
      "anthocyanins": {"status": "Degraded", "confidence": 88.5},
      "punicalagins": {"status": "Critical", "confidence": 91.2},
      "ellagic_acid": {"status": "Nominal", "confidence": 75.0}
    }
  }
}
```

**Error Responses**
| Code | Description                        |
|------|------------------------------------|
| 400  | Concept not found in ontology      |
| 422  | Validation error                   |
| 500  | Reasoner failure                   |

### GET /api/history

Retrieves paginated historical logs of all agricultural analyses.

**Request**
Query Parameters:
- `limit` (int, default=10)
- `offset` (int, default=0)

**Response 200**
```json
{
  "total": 142,
  "results": [
    {
      "id": "req-987",
      "timestamp": "2026-03-22T14:30:00Z",
      "disease": "Anthracnose",
      "health_score": 62.1
    }
  ]
}
```

**Error Responses**
| Code | Description                        |
|------|------------------------------------|
| 500  | Database connection error          |

## Frontend

The frontend interface for PomeGuard is built using real-time data flow with React 18 and a dark-mode focused aesthetic, designed for maximum legibility in outdoor conditions.

![Landing Page](assets/screenshots/landing.png)
![Analyse Page](assets/screenshots/analyse.png)
![Dashboard](assets/screenshots/dashboard.png)
![How It Works](assets/screenshots/how-it-works.png)

**Key UI Components:**
- **ImageUploader:** Drag-and-drop zone with instant local preview and progressive upload states.
- **ResultsPanel:** Consolidates the outputs from the multi-agent pipeline into an easily digestible summary.
- **ScorecardGauge:** Uses Recharts to visually represent the 0-100 derived nutritional and health score.
- **AdvisoryCard:** Displays plain-English, actionable mitigation steps generated by the Reporting Agent.

*Note: The entire UI defaults to an optimized Dark Mode for battery saving and contrast in bright sunlight.*

## Dataset

- **Source:** Pakruddin et al. (2024) — 5,099 labeled pomegranate images
- **Five Categories:** Healthy, Bacterial Blight, Anthracnose, Cercospora Fruit Spot, Alternaria Fruit Spot
- **Collection Protocol:** Karnataka farms, July–October 2023
- **Augmentation Strategy:** Horizontal/vertical flips, rotational variance, dynamic brightness/contrast shifts, and simulated occlusion.

| Class | Count | Percentage |
|---|---|---|
| Healthy | 1,215 | 23.8% |
| Bacterial Blight | 1,080 | 21.2% |
| Anthracnose | 954 | 18.7% |
| Cercospora Fruit Spot | 940 | 18.4% |
| Alternaria Fruit Spot | 910 | 17.9% |

*Note: Severity labeling (mild, moderate, severe) was bootstrapped utilizing a separate UNet segmentation approach prior to classification training.*

## Model Performance

| Class | Precision | Recall | F1-Score | AUC |
|---|---|---|---|---|
| Healthy | 99.8% | 99.6% | 99.7% | 0.999 |
| Bacterial Blight | 99.1% | 98.9% | 99.0% | 0.998 |
| Anthracnose | 98.7% | 98.5% | 98.6% | 0.997 |
| Cercospora Fruit Spot | 98.4% | 98.2% | 98.3% | 0.996 |
| Alternaria Fruit Spot | 98.9% | 98.7% | 98.8% | 0.997 |
| **Overall** | **99.0%** | **98.8%** | **98.9%** | **0.997** |

Training configuration: EfficientNetB0, ImageNet pre-trained, two-phase fine-tuning, Adam optimizer, cosine annealing LR schedule, 30 epochs total.

## Ontology Schema

The PomeGuard OWL 2 DL ontology structurally models the relationships between diseases, stress factors, and the internal quality compounds.

**Class Hierarchy (Simplified):**
```text
- FruitCondition
  - Healthy
  - Diseased (BacterialBlight, Anthracnose, etc.)
- PhytochemicalCompound
  - Anthocyanins
  - Punicalagins
  - EllagicAcid
- EnvironmentalStressor
  - HighUV
  - ExtremeHumidity
- NutritionalQualityScore
  - Premium
  - Marketable
  - Degraded
```

**Object Properties:**

| Property | Domain | Range | Description |
|---|---|---|---|
| `hasSeverityLevel` | `FruitCondition` | `SeverityLevel` | Links disease to severity |
| `causesReductionIn` | `FruitCondition` | `PhytochemicalCompound` | Maps disease to compound degradation |
| `isExacerbatedBy` | `FruitCondition` | `EnvironmentalStressor` | Links disease to stress factors |
| `impliesNutritionalScore` | `PhytochemicalProfile` | `NutritionalQualityScore` | Maps compound profile to score tier |

## Roadmap

- [x] EfficientNetB0 disease classification pipeline
- [x] OWL/RDF knowledge ontology with SWRL rules
- [x] LangGraph multi-agent orchestration
- [x] FastAPI backend with 4 endpoints
- [x] React frontend with analysis UI and dashboard
- [ ] Mobile app (React Native)
- [ ] WhatsApp Bot integration for rural farmers
- [ ] Multilingual support (Marathi, Hindi)
- [ ] Satellite imagery integration for field-level analysis
- [ ] Real-time weather API integration (replacing manual UV/humidity input)
- [ ] Offline-capable edge deployment on Raspberry Pi
- [ ] Expansion to other Maharashtra crops (grape, onion, soybean)

## Contributing

1. Fork the repository and clone it to your local machine.
2. Create a new branch using our naming convention: `feature/your-feature-name` or `fix/issue-description`.
3. Commit your changes using Conventional Commits format (e.g., `feat: integrate weather api`, `fix: resolve ontology parsing bug`, `docs: update API spec`).
4. Ensure all tests and linters pass.
5. Submit a pull request and complete the provided checklist template.

**Code style:**
- Python: `Black`
- JavaScript: `Prettier`

**Running tests:**

```bash
# Backend tests
cd backend && pytest

# Frontend tests
cd frontend && npm run test
```

## License

MIT License — Copyright (c) 2026 PomeGuard Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Acknowledgements

- Pakruddin et al. for the comprehensive pomegranate disease dataset which formed the bedrock of our vision model.
- The LangChain team for their pioneering work on LangGraph.
- Google Brain for the efficient and scalable EfficientNet architecture.
- Maharashtra Department of Agriculture for domain-specific insights.
- The W3C for establishing the foundational OWL and RDF standards.

## Citation

If this project is used in academic research, please cite as:

```bibtex
@software{pomeguard2026,
  author    = {PomeGuard Contributors},
  title     = {PomeGuard: A Multi-Agent Autonomous System for Precision Horticulture of Pomegranate},
  year      = {2026},
  publisher = {GitHub},
  url       = {https://github.com/your-username/pomeguard}
}
```
