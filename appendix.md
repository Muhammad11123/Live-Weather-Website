
# Appendix A - Deployment Instructions for MyWeatherReport

These instructions provide a step-by-step guide for deploying the MyWeatherReport Flask web application using Koyeb. It assumes the user is operating on Ubuntu 20.04 and has access to a GitHub account.

---

## 1. Python Environment Setup

### Step 1.1: Check Python Installation
```bash
python3 --version
```
- If version is 3.8 or above, proceed to Step 1.3.
- If not, proceed to Step 1.2.

### Step 1.2: Install Python (if needed)
```bash
sudo apt update
sudo apt -y upgrade
```
Check Python version again using:
```bash
python3 --version
```

### Step 1.3: Check pip Installation
```bash
pip3 --version
```
If pip is not installed, run:
```bash
sudo apt install -y python3-pip
```

### Step 1.4: Install Virtual Environment
```bash
sudo apt install -y python3-venv
```

---

## 2. Fork the GitHub Repository

1. Go to: [https://github.com/YourUsername/My-Weather-Report](https://github.com/YourUsername/My-Weather-Report)
2. Click **Fork** at the top-right to fork the repo into your account.

---

## 3. Clone the Repository

```bash
cd ~
mkdir weatherapp
cd weatherapp
git clone https://github.com/YourUsername/My-Weather-Report.git
cd My-Weather-Report
```

---

## 4. Setup Virtual Environment & Install Requirements

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 5. Run Locally (for testing)

```bash
python3 app.py
```

Open your browser and go to `http://127.0.0.1:8000`

---

## 6. Prepare for Deployment on Koyeb

### Step 6.1: Ensure These Files Exist in Root Directory:
- `app.py`
- `requirements.txt`
- `Procfile`
- `/static/`
- `/templates/`

### Step 6.2: Add These to Git
```bash
git add .
git commit -m "Initial deployment commit"
git push origin main
```

---

## 7. Deploy to Koyeb

1. Go to [https://app.koyeb.com](https://app.koyeb.com)
2. Click **Create Web Service**
3. Select GitHub as source and connect your repository
4. Set:
   - **Buildpack**: Python
   - **Command**: `gunicorn app:app`
   - **Port**: 8000
5. Deploy and wait for URL to be generated (e.g., `https://myweather.koyeb.app`)

---

## 8. Done 

Your live weather app is now deployed!
