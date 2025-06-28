# Egyptian-License-Plate-Recognition-System
# 🚘 Egyptian License Plate Recognition System (Sec-Bot)

This project is a full-stack AI-powered license plate recognition system tailored for Egyptian vehicle plates (Arabic letters and Indian numerals). It enables automatic gate access management in compounds, supporting both web and mobile platforms.

## 📌 Project Overview

**Sec-Bot** (Security Robot) is an automated vehicle access control system designed to enhance security and streamline gate management in residential compounds and gated communities.

The system is divided into:
- **Offline Component:** Captures frames from camera feeds, detects license plates using OCR, and sends the data to the server.
- **Online Component:** The backend determines the car's status (resident, guest, delivery, or blacklist) and responds to the frontend for visualization and further action.

## 🎯 Motivation

Delays at compound gates due to manual checking and guest handling are common issues. Our system uses AI and OCR to automate the process, making it faster, smarter, and more reliable.

## 🛠️ Tech Stack

- **Frontend (Web):** React.js  
- **Frontend (Mobile):** React Native (Expo)
- **Backend:** Django REST Framework
- **OCR & Detection:** OpenCV + Tesseract (no deep learning)
- **Database:** SQLite (can be extended)

## 🧠 Features

- Real-time vehicle plate detection and recognition
- Supports Egyptian plates (Arabic letters and Indian numerals)
- Handles whitelist/blacklist/guest logic
- Admin dashboard and security visualization interface
- Multi-platform (web + mobile)

## 📐 System Architecture

- The **camera** continuously captures frames.
- Frames are analyzed locally using classical CV techniques.
- Results are sent to the **Django backend**.
- The backend determines the car category and sends results to:
  - Web dashboard (React)
  - Mobile interface (React Native)

## 🖼️ Sample UI & Pipeline (see project screenshots)

- License Plate Detection
- Plate OCR Pipeline
- Realtime Alerts
- Role-based access (Admin/Security)

## 🔮 Future Work

- Improve OCR accuracy using ML-based methods.
- Add support for different country formats.
- Expand database with scraped real-world data.
- Integrate real-time push notifications and camera streaming.

## 👨‍🏫 Supervised by

**Dr. Mohammed El-Said** – Faculty of Computers and Artificial Intelligence, Helwan University

## 👨‍💻 Team Members

| Name                     |
|--------------------------|
| Youssef Mohamed Magdy    |
| Youssef Yasser Youssef   | 
| Bassel Wael Samir        |

## 📚 Dataset References

- [Roboflow: Egyptian Car Plates Dataset](https://universe.roboflow.com/alyalsayed-vyx6g/egyptian-car-plates)
- [Kaggle: Egyptian Cars Plates Dataset](https://www.kaggle.com/datasets/mahmoudeldebase/egyptian-cars-plates)
- [Research Paper](https://www.researchgate.net/publication/376210424_License_plate_detection_and_recognition_A_study_of_review)

---

> *This project was submitted in partial fulfillment of the requirements for the Bachelor's degree in Computer Science, Faculty of Computers and Artificial Intelligence, Helwan University – June 2025.*


https://github.com/user-attachments/assets/0ac9545e-6f78-4a93-af23-d7ac3bf71a67

