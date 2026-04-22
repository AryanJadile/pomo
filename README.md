<div align="center">

# 🍎 PomeGuard

**A simple way to check if a pomegranate is healthy — just by taking a photo of it.**

In plain English: PomeGuard is a smart tool that looks at a picture of a pomegranate and tells you if the fruit is sick or healthy. If it's sick, it also estimates what's happening *inside* the fruit — like how much of the good nutrients are still there — without ever needing to cut it open.

Think of it like a doctor's checkup, but for pomegranates. 🩺🍎

</div>

---

## At a Glance

| Aspect | Details |
|--------|---------|
| ✅ Difficulty Level | Beginner-friendly |
| ⏱️ Time to Setup | 10–15 minutes |
| 💻 Requirements | A computer, Python, Node.js, and a web browser |
| 💰 Cost | 100% Free and Open Source |

### Quick Benefits

- ✅ **Instant Disease Detection** — Upload a photo, get a diagnosis in seconds
- ✅ **No Fruit Harmed** — Estimates internal nutrition without cutting the fruit
- ✅ **Weather-Aware** — Factors in sunlight, humidity, and temperature automatically
- ✅ **Full History** — Every scan is saved so you can track your orchard over time
- ✅ **AI Chat Assistant** — Ask questions about any scan result and get expert advice

---

## 📖 Table of Contents

1. [What Problem Does This Solve?](#1--what-problem-does-this-solve)
2. [How It Works (Simple Explanation)](#2--how-it-works-simple-explanation)
3. [Key Features](#3--key-features)
4. [Before You Start](#4--before-you-start)
5. [Getting Started (Installation)](#5--getting-started-installation)
6. [How to Use (Step-by-Step)](#6--how-to-use-step-by-step)
7. [Examples & Use Cases](#7--examples--use-cases)
8. [Frequently Asked Questions](#8--frequently-asked-questions)
9. [Troubleshooting](#9--troubleshooting)
10. [Contributing & Support](#10--contributing--support)
11. [What's Next?](#11--whats-next)
12. [Tech Stack (For the Curious)](#12--tech-stack-for-the-curious)
13. [License](#license)
14. [Citation](#citation)

---

## 1. 🧩 What Problem Does This Solve?

### The Problem (Before)

Imagine you're a pomegranate farmer in Maharashtra, India. You have thousands of Bhagwa pomegranate trees in your orchard. Some fruits look perfectly fine on the outside, but when you cut them open at market, the inside is ruined — the nutrients are gone, the color is off, and the buyer rejects them.

Other fruits have tiny spots or marks on the skin. Are they dangerous diseases? Or just cosmetic blemishes? By the time you figure it out manually, the disease has already spread to nearby trees.

**The old way:**
- 👀 Stare at each fruit and guess what's wrong
- 🔪 Cut fruits open to check inside (destroying them)
- ⏰ Wait weeks for lab test results
- 💸 Lose money from rejected, diseased batches

### The Solution (After)

With PomeGuard, you simply **take a photo** of the pomegranate with your phone or camera. The app:

1. **Identifies the disease** (if any) in seconds — with over 99% accuracy
2. **Checks the weather** around your farm automatically
3. **Estimates the internal nutrition** without cutting the fruit open
4. **Gives you a health score** from 0 to 100
5. **Tells you exactly what to do** — in plain language

### Why It Matters

- 🕐 **Save time** — Get answers in seconds, not weeks
- 🍎 **Save fruit** — No more cutting open good pomegranates to test them
- 💰 **Save money** — Catch diseases early before they spread
- 📊 **Stay organized** — Track every scan in your personal dashboard

---

## 2. 🔍 How It Works (Simple Explanation)

Think of PomeGuard like a **vending machine with three windows**:

```
┌─────────────────────────────────────────────────────┐
│                  How PomeGuard Works                │
└─────────────────────────────────────────────────────┘

  YOU PROVIDE:                     YOU GET BACK:
  ─────────────                    ──────────────

  📸 A photo of        ──►   🏥 Disease name
     your pomegranate            (e.g. "Bacterial Blight")

  🌡️ Weather info      ──►   ⚠️ Environmental stress
     (auto-detected)            (e.g. "High UV is bad")

  Both of the above     ──►   📊 Nutritional Score (0–100)
     combined                    + What to do about it
```

### Step-by-Step Flow

Here's what happens behind the scenes when you upload a photo:

1. **📸 You upload a photo** — The app sends your image to a smart model called EfficientNetB0 (think of it as a robot that has studied thousands of pomegranate photos and learned to spot diseases).

2. **🌡️ Weather is checked** — The app detects your location and fetches live weather data (temperature, humidity, UV sunlight). These factors affect fruit health.

3. **🧠 The "brain" thinks** — A knowledge base (like an encyclopedia about pomegranate diseases) combines the disease result + weather data to estimate what's happening *inside* the fruit — specifically, how much of three key nutrients are left:
   - **Anthocyanins** — the compounds that make pomegranates red
   - **Punicalagins** — powerful antioxidants unique to pomegranates
   - **Ellagic Acid** — a nutrient linked to health benefits

4. **📋 You get a scorecard** — A health score from 0-100, a quality grade (Optimal / Reduced / Depleted), and plain-English advice on what to do.

> 💡 **Tip**: You don't need to understand any of the science. Just upload a photo and PomeGuard handles the rest!

---

## 3. ✨ Key Features

### 🔬 Disease Detection
Upload a photo and PomeGuard identifies which of 5 conditions your pomegranate has:
- ✅ Healthy
- 🦠 Bacterial Blight (locally called "Telya")
- 🍄 Anthracnose
- 🟤 Cercospora Fruit Spot
- ⚫ Alternaria Fruit Spot

_Accuracy: 99%+ across all categories._

### 🧬 Non-Destructive Nutritional Scoring
"Non-destructive" means we estimate what's inside the fruit **without cutting it open**. The app uses a knowledge base to calculate how much disease and weather have degraded the internal nutrients.

### 🌦️ Live Weather Integration
Tap "Fetch Weather" and the app automatically detects your location and pulls real-time temperature, humidity, and solar radiation data. No typing needed.

### 📍 Location Tagging
Tag your GPS coordinates so you can build a map of disease hotspots across your orchard over time.

### 💬 AI Chat Assistant
After each scan, you can chat with an AI assistant about your results. Ask things like "What fungicide should I use?" or "Is this fruit still marketable?" and get informed answers based on your specific scan data.

### 📊 Personal Dashboard
View all your past scans in one place. See detailed results, download reports, and track trends.

### 🌓 Light & Dark Mode
Switch between light and dark themes. Dark mode is great for outdoor use in bright sunlight (easier to read on your phone screen).

### 🔐 Secure & Private
Each user has their own account. Your scans are private — nobody else can see them.

---

## 4. 📋 Before You Start

Before setting up PomeGuard, make sure you have these things installed on your computer. Don't worry — we explain what each one is and how to get it!

### What You Need

| Tool | What Is It? | Why PomeGuard Needs It | How to Get It |
|------|-------------|----------------------|---------------|
| **Python 3.10+** | A programming language. Think of it as the language the backend "brain" of PomeGuard speaks. | The server that processes your photos is written in Python. | [Download Python](https://www.python.org/downloads/) |
| **Node.js 18+** | A tool that runs JavaScript code outside of a browser. | The user interface (the part you see and click) needs it to run. | [Download Node.js](https://nodejs.org/) |
| **Git** | A tool for downloading code projects. Think of it as a "smart copy-paste" for code. | You'll use it to get PomeGuard's code onto your computer. | [Download Git](https://git-scm.com/downloads) |
| **A web browser** | Chrome, Firefox, Edge, Safari, etc. | To view and use PomeGuard's interface. | You already have one! 🎉 |

### Optional (But Helpful)

| Tool | What Is It? | Why It's Useful |
|------|-------------|----------------|
| **Supabase Account** | A free cloud database service. Like Google Sheets, but for apps. | Stores your user accounts and scan history in the cloud. |
| **Cloudinary Account** | A free image storage service. Like Google Photos, but for apps. | Stores the photos you upload for permanent access. |

> ⚠️ **Important**: PomeGuard will work for local testing without Supabase and Cloudinary, but logging in, saving scans, and uploading images to the cloud require these services to be configured.

### Estimated Setup Time
- **First time with these tools**: ~30 minutes (most of this is downloading and installing)
- **If you already have Python & Node.js**: ~10 minutes

---

## 5. 🚀 Getting Started (Installation)

### Option 1: The Step-by-Step Way (Recommended for Beginners)

#### Step 1: Download the project code

Open your **Terminal** (Mac/Linux) or **PowerShell** (Windows). Then type:

```bash
git clone https://github.com/your-username/pomeguard.git
cd pomeguard
```

> ❓ **What does this do?** It downloads all of PomeGuard's files to a new folder called `pomeguard` on your computer, then moves you into that folder.

> 💡 **Tip**: On Windows, you can also open PowerShell by right-clicking in a folder and selecting "Open in Terminal".

#### Step 2: Set up the Backend (the "brain")

The backend is the part that analyses your photos. It's written in Python.

```bash
cd api
pip install -r requirements.txt
```

> ❓ **What does this do?**
> - `cd api` — Moves into the backend folder
> - `pip install -r requirements.txt` — Installs all the tools the backend needs (like plug-ins for Python)

> ⚠️ **Important**: If `pip` doesn't work, try `pip3` instead. This depends on how Python was installed on your computer.

✅ **Check**: If you see several lines of text ending with "Successfully installed ...", you're good!

#### Step 3: Set up the Frontend (the website you see)

```bash
cd ../frontend
npm install
```

> ❓ **What does this do?**
> - `cd ../frontend` — Goes back up one folder, then into the frontend folder
> - `npm install` — Installs all the tools the website interface needs

✅ **Check**: If you see a message like "added 200 packages", you're good!

#### Step 4: Configure your environment variables

Environment variables are like secret settings that tell the app where to find its services.

**4a. Create the backend settings file:**

Create a file called `.env` in the **root** `pomeguard/` folder with these contents:

```env
# Supabase — Your cloud database
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Cloudinary — Image storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gemini AI — Powers the chat assistant
GEMINI_API_KEY=your_gemini_api_key_here
```

**4b. Create the frontend settings file:**

Create a file called `.env` in the `frontend/` folder:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_BASE_URL=http://localhost:8000
```

> 💡 **Tip**: You can find your Supabase URL and keys by logging into [supabase.com](https://supabase.com), opening your project, and going to **Project Settings → API**.

> ⚠️ **Important**: The frontend `.env` uses `VITE_` before each variable name. This is required — without the `VITE_` prefix, the frontend won't be able to read them.

#### Step 5: Set up the database tables

Log into your Supabase dashboard and open the **SQL Editor**. Paste the contents of the `database.sql` file (included in the project) and click **Run**. This creates the necessary tables for storing user accounts and scan results.

#### Step 6: Start the application!

You need **two terminal windows** — one for the backend and one for the frontend.

**Terminal 1 — Start the Backend:**
```bash
cd api
uvicorn main:app --reload --port 8000
```

✅ **Check**: You should see `Uvicorn running on http://127.0.0.1:8000`. That means the backend is ready!

**Terminal 2 — Start the Frontend:**
```bash
cd frontend
npm run dev
```

✅ **Check**: You should see `VITE ready` and a URL like `http://localhost:5173/`. That means the website is ready!

#### Step 7: Open PomeGuard!

Open your web browser and go to:

👉 **http://localhost:5173**

You should see the PomeGuard home page with the text _"Know your fruit. Before you open it."_

🎉 **Congratulations! PomeGuard is running on your computer!**

---

### Option 2: Quick Start (For experienced developers)

```bash
git clone https://github.com/your-username/pomeguard.git && cd pomeguard

# Backend
cd api && pip install -r requirements.txt
cd ..

# Frontend
cd frontend && npm install
cd ..

# Configure .env files (root and frontend/.env)
# Run database.sql in Supabase SQL Editor

# Start
cd api && uvicorn main:app --reload --port 8000  # Terminal 1
cd frontend && npm run dev                        # Terminal 2
```

### Useful URLs (Once Running)

| What | URL | Description |
|------|-----|-------------|
| 🌐 PomeGuard App | http://localhost:5173 | The main application you interact with |
| ⚙️ Backend API | http://localhost:8000 | The backend server (you don't need to open this) |
| 📄 API Documentation | http://localhost:8000/docs | Auto-generated API documentation (for developers) |

---

## 6. 🎯 How to Use (Step-by-Step)

### Your First Analysis (5 Minutes)

Once PomeGuard is running, here's how to analyze your first pomegranate:

**Step 1: Create an Account**
- Click **Sign Up** in the top navigation bar
- Enter your full name, email, and a password
- Click **Sign Up**
- You'll be logged in automatically

> 💡 **Tip**: If you already have an account, click **Login** instead.

**Step 2: Go to the Analysis Page**
- Click **Analyse** in the navigation bar (or click the big "Analyse a Fruit Now" button on the home page)
- You'll see a page with sections for uploading an image and entering environmental data

**Step 3: Upload a Pomegranate Photo**
- Click the dashed upload box that says **"Drag your fruit image here"**
- Select a photo of a pomegranate from your computer (JPG, PNG, or WEBP format)
- The app will **automatically start analyzing** the photo
- Within a few seconds, you'll see the disease result appear on the right side, including:
  - 🏷️ Disease name (e.g., "Bacterial Blight" or "Healthy")
  - 📊 Confidence percentage (how sure the AI is)
  - ⚠️ Severity level (Mild, Moderate, or Severe)

**Step 4: Add Environmental Data**
- Click the **"Fetch Weather"** button to automatically get your local weather
- Or manually enter values for Solar Radiation, Humidity, and Temperature
- Click **"Submit Environmental Data"**
- The environmental stress results will appear on the right

> 💡 **Tip**: Click **"Tag Location"** to save your GPS coordinates. This helps track disease outbreaks across your farm.

**Step 5: Run Full Analysis**
- Once both the image and environmental data are submitted, the **"Run Full Analysis"** button lights up
- Click it!
- The complete Nutritional & Health Scorecard appears, showing:
  - 🎯 Overall health score (0–100)
  - 📊 Levels of Anthocyanins, Punicalagins, and Ellagic Acid
  - 🌿 Quality tier (Optimal / Reduced / Depleted)
  - 📋 Agronomic advice in plain English

**Step 6: Review Your Results**
- Your scan is **automatically saved** to your history
- Click **"Download Report"** to save a PDF copy
- Click **"Analyse Another Fruit"** to start over

✅ **That's it!** Your first fruit analysis is complete.

---

### Common Tasks

#### 📂 Viewing Past Scans
1. Click **History** in the navigation bar
2. Browse all your previous scans
3. Click any scan to see its full details

#### 💬 Chatting About a Scan
1. Open any completed scan from your History
2. Use the chat box to ask questions like:
   - "What treatment should I apply?"
   - "Can I still sell this fruit?"
   - "How do I prevent this disease?"
3. The AI assistant responds with advice specific to *your* scan data

#### 🗑️ Deleting a Scan
1. Open the scan from History
2. Click the delete button
3. The scan and its uploaded image will be permanently removed

---

## 7. 📚 Examples & Use Cases

### Example 1: Daily Farm Inspection 🌄

**Scenario**: Ravi is a pomegranate farmer in Solapur, Maharashtra. Every morning, he walks through his orchard and checks on his Bhagwa pomegranates.

**How he uses PomeGuard**:
1. He spots a pomegranate with brownish spots
2. He takes a photo with his phone
3. He opens PomeGuard, uploads the photo
4. PomeGuard says: "Bacterial Blight — Severe Severity — Confidence: 97.3%"
5. The nutritional score is 42/100 (Depleted tier)
6. The advice says: "Apply targeted bactericide immediately. Adjust harvest grading to Depleted."
7. Ravi knows exactly which rows to treat, saving his remaining healthy fruit

### Example 2: Pre-Harvest Quality Check 📦

**Scenario**: Priya manages a pomegranate packing house. Before shipping, she needs to verify that the fruit meets export quality standards.

**How she uses PomeGuard**:
1. She photographs a sample from each batch
2. PomeGuard shows each fruit's nutritional score
3. Fruits scoring 80+ are graded "Optimal" — ready for export
4. Fruits scoring 60-79 are "Reduced" — suitable for domestic market
5. Fruits below 60 are "Depleted" — diverted to juice processing
6. She checks her History dashboard to show quality reports to buyers

### Example 3: Agricultural Research 🔬

**Scenario**: Dr. Sharma is a plant pathologist studying the relationship between UV exposure and anthocyanin degradation in pomegranates.

**How he uses PomeGuard**:
1. He scans fruits from high-UV and shaded plots
2. PomeGuard's environmental data and phytochemical estimates give him structured data
3. He uses the History page to export and compare results
4. The ontology-based reasoning provides insights that would normally require expensive lab tests

### Example 4: Student Learning 📖

**Scenario**: Aarav is an agricultural science student learning about plant pathology.

**How he uses PomeGuard**:
1. He uploads textbook images of different pomegranate diseases
2. PomeGuard accurately classifies each one
3. He uses the AI chat to ask "How does Anthracnose affect Punicalagin levels?"
4. The app explains the relationship in simple terms
5. He uses PomeGuard results in his project report

---

## 8. ❓ Frequently Asked Questions

**Q: Do I need to know how to code?**
> A: Not at all! Once PomeGuard is set up (you can ask a tech-savvy friend to help with that), using it is as simple as uploading a photo and clicking a button.

**Q: Will it work on my computer?**
> A: Yes! PomeGuard works on Windows, Mac, and Linux. You just need Python and Node.js installed (both are free). It also works on any modern web browser.

**Q: Can I use it on my phone?**
> A: Yes! The website is designed to work on mobile screens. Just open the URL in your phone's browser. While there's no dedicated phone app yet, the website adapts to smaller screens.

**Q: Is my data private?**
> A: Yes. Each user has their own account, and scans are only visible to the person who created them. The database uses security rules to enforce this.

**Q: How accurate is the disease detection?**
> A: The AI model achieves **99%+ accuracy** across all 5 disease categories. It was trained on over 5,000 labeled pomegranate images from real farms.

**Q: Does it work for pomegranate varieties other than Bhagwa?**
> A: The model was primarily trained on Bhagwa pomegranates. It may work on other varieties, but accuracy could be lower. We're working on expanding the dataset.

**Q: Does it work without internet?**
> A: The core analysis (disease detection) works locally if you have the AI model file on your computer. However, weather fetching, cloud image storage, chat, and scan saving require an internet connection.

**Q: What image quality do I need?**
> A: A clear, focused photo of the pomegranate is ideal. Your phone camera works great! Avoid extremely blurry or dark photos. The image should be JPG, PNG, or WEBP format.

**Q: Is it free?**
> A: Yes, PomeGuard is completely free and open source. The third-party services (Supabase, Cloudinary) have generous free tiers that are more than enough for personal or small farm use.

**Q: What if I upload a photo of something that isn't a pomegranate?**
> A: The AI is trained specifically on pomegranates. If you upload something else, it will still try to classify it into one of the 5 categories, but the result won't be meaningful. Always upload pomegranate photos for accurate results.

---

## 9. 🛠️ Troubleshooting

### Problem 1: "CORS policy" error when trying to log in

**Error message**: `Access to fetch has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header`

**What it means**: Your Supabase project doesn't recognize your local website's address as a trusted source.

**How to fix it**:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project
3. Go to **Authentication** → **URL Configuration**
4. Add `http://localhost:5173` to the **Site URL** and **Redirect URLs**
5. Click **Save**
6. Restart your frontend (`npm run dev` again)

---

### Problem 2: "pip is not recognized" or "python is not recognized"

**What it means**: Python isn't installed, or your computer doesn't know where to find it.

**How to fix it**:
1. Download Python from [python.org/downloads](https://www.python.org/downloads/)
2. During installation, **check the box that says "Add Python to PATH"** (this is critical!)
3. Close and reopen your terminal
4. Try `python --version` to verify it works

> 💡 **Tip**: On some systems, use `python3` and `pip3` instead of `python` and `pip`.

---

### Problem 3: "npm is not recognized"

**What it means**: Node.js isn't installed on your computer.

**How to fix it**:
1. Download Node.js from [nodejs.org](https://nodejs.org/) (choose the "LTS" version)
2. Install it with default settings
3. Close and reopen your terminal
4. Try `node --version` to verify

---

### Problem 4: The frontend starts but shows a blank page

**What it means**: The frontend code might have an issue, or environment variables aren't set up.

**How to fix it**:
1. Make sure the `frontend/.env` file exists and has the correct values
2. Stop the frontend (press `Ctrl + C` in the terminal)
3. Run `npm run dev` again
4. Open the browser console (press `F12` → click "Console" tab) to see error details

---

### Problem 5: Image upload fails or classification returns an error

**What it means**: The AI model file might be missing.

**How to fix it**:
1. Check that the file `api/models/pome_vision_model.onnx` exists
2. If it's missing, you may need to export it using the `export_onnx.py` script or download it from the project's releases page
3. Restart the backend server

---

### Problem 6: "Supabase not configured" error

**What it means**: The backend can't connect to your Supabase database.

**How to fix it**:
1. Make sure your root `.env` file has valid `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` values
2. Check that these values match what's shown in your Supabase Dashboard under **Project Settings → API**
3. Restart the backend server

---

### Still Stuck?

If none of the above solutions work:
1. Check the terminal window for red error messages — these often explain exactly what went wrong
2. Open a [GitHub Issue](https://github.com/your-username/pomeguard/issues) with:
   - What you were trying to do
   - The full error message you see
   - Your operating system (Windows/Mac/Linux)

> 💡 **Tip**: Don't be shy about asking for help! Everyone was a beginner once. We're happy to assist.

---

## 10. 🤝 Contributing & Support

### Need Help?

- **GitHub Issues**: [Report a bug or ask a question](https://github.com/your-username/pomeguard/issues)
- **Discussions**: [Join the conversation](https://github.com/your-username/pomeguard/discussions)

### Want to Help Make This Better?

You don't need to be a programmer! Here are ways anyone can contribute:

| How you can help | Technical skill needed? |
|-----------------|----------------------|
| 🐛 Report bugs you find | No |
| 💡 Suggest new features | No |
| 📸 Contribute pomegranate images for training | No |
| 📝 Improve this documentation | No |
| 🌐 Help translate the app | No |
| 🧪 Test the app and share feedback | No |
| 💻 Fix bugs or add features (code) | Yes |

### For Code Contributors

1. **Fork** the repository (click the "Fork" button on GitHub — it makes your own copy)
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Commit** using clear messages: `git commit -m "feat: add mango support"`
5. **Push** to your fork: `git push origin feature/your-feature-name`
6. **Open a Pull Request** on the main repository

**Code style**:
- Python code: formatted with [Black](https://github.com/psf/black)
- JavaScript code: formatted with [Prettier](https://prettier.io/)

---

## 11. 🚀 What's Next?

Now that you've got PomeGuard running, here are some things you might want to explore:

### Immediate Next Steps
- 📸 Try scanning a few different pomegranate photos
- 🌦️ Use the auto weather feature to see how conditions affect scores
- 💬 Chat with the AI assistant about your results
- 📊 Check your Dashboard to see your scan history

### On Our Roadmap
- [ ] 📱 Mobile app (React Native) — scan directly from your phone camera
- [ ] 💬 WhatsApp Bot — get results via WhatsApp (great for farmers without smartphones)
- [ ] 🌐 Multilingual support — Marathi and Hindi translations
- [ ] 🛰️ Satellite imagery — field-level disease mapping
- [ ] 🌤️ Real-time weather API — no more manual entry
- [ ] 🔌 Offline mode — works without internet on Raspberry Pi
- [ ] 🌿 More crops — grape, onion, and soybean support

---

## 12. 🔧 Tech Stack (For the Curious)

> 💡 **Tip**: This section is for people who want to understand the technical details. **You don't need to know any of this to use PomeGuard!**

<details>
<summary>Click to expand the full technical stack</summary>

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PomeGuard System Architecture                │
└─────────────────────────────────────────────────────────────────┘

  ┌──────────────┐   ┌──────────────────┐   ┌──────────────────┐
  │  Fruit Image │   │  Env. Metadata   │   │  OWL/RDF         │
  │  (Camera /   │   │  UV · Humidity   │   │  Knowledge Base  │
  │   Upload)    │   │  Temperature     │   │  (Ontology)      │
  └──────┬───────┘   └────────┬─────────┘   └────────┬─────────┘
         │                    │                       │
         ▼                    ▼                       ▼
┌────────────────────────────────────────────────────────────────┐
│                     FastAPI Backend                            │
│                                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────────────┐ │
│  │ Vision      │  │ Environment │  │ Ontology Engine        │ │
│  │ Agent       │  │ Agent       │  │ OWL → Phytochemical    │ │
│  │ ONNX Model  │  │ Open-Meteo  │  │ Inference              │ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬────────────┘ │
│         │                │                      │              │
│         └────────────────┴──────────────────────┘              │
│                          │                                     │
│              ┌───────────▼────────────┐                        │
│              │   Nutritional Score    │                        │
│              │   + Advisory Output    │                        │
│              └───────────┬────────────┘                        │
└──────────────────────────┼─────────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │  React Frontend (Vite)  │
              │  Dashboard · History    │
              │  Chat · Reports         │
              └─────────────────────────┘
```

### Technologies Used

| Layer | Technology | What It Does |
|-------|-----------|-------------|
| AI Vision Model | EfficientNetB0 (ONNX Runtime) | Identifies diseases from photos |
| Knowledge Reasoning | OWL 2 DL Ontology | Maps diseases to nutritional impact |
| Backend API | FastAPI + Python | Handles requests, runs the AI pipeline |
| Frontend | React 19 + Vite | The website interface you interact with |
| Styling | Tailwind CSS | Makes the website look modern and responsive |
| UI Components | shadcn/ui | Pre-built interface elements (buttons, cards, etc.) |
| Animations | Framer Motion | Smooth transitions and visual feedback |
| Charts | Recharts | Data visualization |
| State Management | Zustand | Keeps the app's data consistent |
| Database | Supabase (PostgreSQL) | Stores user accounts and scan history |
| Image Storage | Cloudinary | Stores uploaded photos in the cloud |
| Chat AI | Google Gemini | Powers the AI chat assistant |
| Auth | Supabase Auth | Handles login, signup, and security |
| Chat Memory | Firebase Realtime Database | Stores chat conversation history |
| Deployment | Vercel | Hosts the app on the internet |

### Project Structure

```
pomeguard/
├── api/                        # Backend (Python)
│   ├── agents/
│   │   └── vision_agent.py     # AI model that classifies diseases
│   ├── routers/
│   │   └── chat.py             # AI chat assistant endpoint
│   ├── models/
│   │   └── pome_vision_model.onnx  # The trained AI model file
│   ├── utils/
│   │   ├── gemini.py           # Google Gemini AI integration
│   │   └── firebase_admin.py   # Firebase chat storage
│   ├── main.py                 # Main backend server file
│   └── requirements.txt        # Python dependencies
├── frontend/                   # Frontend (React/JavaScript)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Analyse.jsx     # Main analysis page
│   │   │   ├── Dashboard.jsx   # User dashboard
│   │   │   ├── History.jsx     # Scan history
│   │   │   ├── ScanDetail.jsx  # Individual scan view + chat
│   │   │   ├── Login.jsx       # Login page
│   │   │   └── Signup.jsx      # Signup page
│   │   ├── components/         # Reusable UI pieces
│   │   ├── services/
│   │   │   └── api.js          # Talks to the backend
│   │   ├── store/
│   │   │   └── useAppStore.js  # App-wide state management
│   │   └── lib/
│   │       └── supabaseClient.js  # Database connection
│   └── package.json            # Frontend dependencies
├── ontology/
│   └── pomegranate.owl         # Knowledge base about pomegranates
├── database.sql                # Database table definitions
├── .env                        # Backend configuration (you create this)
└── README.md                   # This file!
```

### API Endpoints

| Method | Endpoint | What It Does |
|--------|----------|-------------|
| POST | `/api/classify` | Upload a photo → get disease classification |
| POST | `/api/env-metadata` | Submit weather data → get stress analysis |
| POST | `/api/ontology-inference` | Combine disease + stress → get nutrition score |
| POST | `/api/upload/media` | Upload image to cloud storage |
| POST | `/api/scans/save` | Save a completed analysis |
| GET | `/api/scans/history` | Get all your past scans |
| GET | `/api/scans/{id}` | Get details of a specific scan |
| DELETE | `/api/scans/{id}` | Delete a scan |
| POST | `/api/chat/message` | Send a message to the AI assistant |
| GET | `/api/notifications` | Get alert notifications |

### Model Performance

| Disease Category | Accuracy | Precision | Recall |
|-----------------|----------|-----------|--------|
| Healthy | 99.7% | 99.8% | 99.6% |
| Bacterial Blight | 99.0% | 99.1% | 98.9% |
| Anthracnose | 98.6% | 98.7% | 98.5% |
| Cercospora Fruit Spot | 98.3% | 98.4% | 98.2% |
| Alternaria Fruit Spot | 98.8% | 98.9% | 98.7% |
| **Overall** | **98.9%** | **99.0%** | **98.8%** |

</details>

---

## License

MIT License — Copyright (c) 2026 PomeGuard Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Acknowledgements

- **Pakruddin et al.** for the comprehensive pomegranate disease dataset (5,099 images)
- **Google** for the EfficientNet architecture and Gemini AI
- **Maharashtra Department of Agriculture** for domain-specific insights
- **The W3C** for establishing the OWL and RDF standards
- All open-source contributors who made the tools we build on

---

## Citation

If you use this project in academic research, please cite:

```bibtex
@software{pomeguard2026,
  author    = {PomeGuard Contributors},
  title     = {PomeGuard: AI-Powered Non-Destructive Health Assessment for Bhagwa Pomegranates},
  year      = {2026},
  publisher = {GitHub},
  url       = {https://github.com/your-username/pomeguard}
}
```

---

<div align="center">

**Made with ❤️ for pomegranate farmers everywhere.**

_Know your fruit. Before you open it._

</div>
