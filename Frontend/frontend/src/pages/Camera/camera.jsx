import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./camera.css";

function App() {
  const [cameraFrames, setCameraFrames] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [processingVideo, setProcessingVideo] = useState(false); // ✅ جديد
  const [useCamera, setUseCamera] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    });
  };

  const stopCamera = () => {
    const tracks = videoRef.current?.srcObject?.getTracks();
    tracks?.forEach((track) => track.stop());
  };

  useEffect(() => {
    if (useCamera) {
      startCamera();
      intervalRef.current = setInterval(captureFrame, 2000);
    } else {
      clearInterval(intervalRef.current);
      stopCamera();
    }

    return () => {
      clearInterval(intervalRef.current);
      stopCamera();
    };
  }, [useCamera]);

  const extractRGB = (canvas) => {
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const raw = ctx.getImageData(0, 0, width, height).data;

    const rgbArray = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const r = raw[index];
        const g = raw[index + 1];
        const b = raw[index + 2];
        row.push([r, g, b]);
      }
      rgbArray.push(row);
    }

    return rgbArray;
  };

  const sendToAPI = async (rgbImage) => {
    try {
      console.log("[sendToAPI] Sending image to API", rgbImage);
      const res = await axios.post(
        "http://localhost:8001/api/detect/",
        { image: rgbImage },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("[sendToAPI] Received response from detect API", res.data);

      const resultArray = res.data?.data;
      let characters = [];

      if (!Array.isArray(resultArray) || resultArray.length === 0) return { status: "No plate detected" };

      if (resultArray.length === 1 && typeof resultArray[0] === 'string') {
        characters = resultArray[0].split('').filter(char => char.trim() !== '');
      } else {
        characters = resultArray;
      }

      let letters = [], numbers = [];
      characters.forEach(item => {
        const char = item.trim();
        if (/[\u0660-\u0669]/.test(char)) {
          numbers.push(char);
        } else if (/[\u0600-\u06FF]/.test(char)) {
          letters.push(char);
        }
      });

      numbers = numbers.reverse();

      if (letters.length === 0 || numbers.length === 0) return { status: "Invalid plate format" };

      const plateLetters = letters.slice(0, 3);
      const plateNumbers = numbers.slice(0, 4);

      const structuredPlate = {
        firstNo: plateNumbers[0] || "",
        secondNo: plateNumbers[1] || "",
        thirdNo: plateNumbers[2] || "",
        fourthNo: plateNumbers[3] || "",
        firstLetter: plateLetters[0] || "",
        secondLetter: plateLetters[1] || "",
        thirdLetter: plateLetters[2] || ""
      };

      Object.keys(structuredPlate).forEach(key => {
        if (structuredPlate[key] === "") delete structuredPlate[key];
      });

      if (Object.keys(structuredPlate).length === 0) return { status: "Invalid plate format" };

      console.log("[sendToAPI] Structured plate to check:", structuredPlate);

      const token = localStorage.getItem("token");

      const checkRes = await fetch("http://localhost:8000/api/carEntrance/", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(structuredPlate)
      });
      console.log("[sendToAPI] Received response from carEntrance API", checkRes);

      if (!checkRes.ok) {
        const errorText = await checkRes.text();
        if (errorText.includes("DoesNotExist") || errorText.includes("Car not found")) {
          return { status: "Car not found" };
        }
        throw new Error(errorText);
      }

      const responseData = await checkRes.json();
      console.log("[sendToAPI] carEntrance API JSON:", responseData);
      const fullPlate = `${plateLetters.join("")}-${plateNumbers.join("")}`;
      if (responseData?.Details) return { status: "Car authorized", plate: fullPlate };
      if (responseData?.error === "Car is in Blacklist.") return { status: "Car blacklisted", plate: fullPlate };
      return { status: "Car not authorized", plate: fullPlate };

    } catch (err) {
      console.error("Error:", err);
      return { status: "API Error" };
    }
  };

  const captureFrame = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
    console.log("[captureFrame] Capturing frame from live camera");
    canvas.width =1280;
    canvas.height = 720;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL("image/png");
    const rgb = extractRGB(canvas);
    const { status, plate } = await sendToAPI(rgb);

    // ✅ نعرض الفريم فقط إذا تم اكتشاف رقم عربية
    if (plate) {
      setCameraFrames((prev) => {
        const newFrames = [...prev.slice(4), { img: imageUrl, result: status, plate }];
        console.log("[captureFrame] New frame with plate:", newFrames);
        return newFrames;
      });
    } else {
      console.log("[captureFrame] No plate found, frame not added.");
    }
  };

  const handleUpload = (e) => {
    // untouched
  };

  const handleVideoUpload = (e) => {
    // untouched
  };

  const toggleUseCamera = () => {
    setUseCamera((prev) => !prev);
    setCameraFrames([]);
  };

  return (
    <div className="container">
      <h1 className="title">Sec bot</h1>

      <div style={{ marginBottom: "16px" }}>
        <button onClick={toggleUseCamera} className="button">
          {useCamera ? "Stop Camera" : "Start Camera"}
        </button>
        {/* <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="button"
          style={{ marginLeft: "10px" }}
        /> */}
        {/* <input
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="button"
          style={{ marginLeft: "10px" }}
        /> */}
      </div>

      {useCamera && <video ref={videoRef} className="video" />}

      <h2>Live Camera Frames</h2>
      <div className="imageGrid">
        {cameraFrames.map((frame, idx) => (
          <div className="imageBox" key={idx}>
            <img src={frame.img} alt={`frame-${idx}`} className="image" />
            <p className="result">{frame.result}{frame.plate ? ` - ${frame.plate}` : ""}</p>
          </div>
        ))}
      </div>

      {/* <h2>Uploaded Images</h2>
      <div className="imageGrid">
        {uploadedImages.map((frame, idx) => (
          <div className="imageBox" key={`uploaded-${idx}`}>
            <img src={frame.img} alt={`upload-${idx}`} className="image" />
            <p className="result">{frame.result}</p>
          </div>
        ))}
      </div>

      <h2>Video Frames</h2>
      {processingVideo && <p>🔄 Processing video frames...</p>}
      <div className="imageGrid">
        {uploadedVideos.map((frame, idx) => (
          <div className="imageBox" key={`video-${idx}`}>
            <img src={frame.img} alt={`video-${idx}`} className="image" />
            <p className="result">{frame.result}</p>
          </div>
        ))}
      </div> */}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default App;
