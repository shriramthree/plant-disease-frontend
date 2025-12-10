import React, { useState } from "react";
import axios from "axios";
import Loader from "./components/Loader";
import "./styles.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (err) {
      console.log(err);
      alert("Error predicting disease.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">🌿 Plant Leaf Disease Detection</h1>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {preview && <img src={preview} className="preview" />}

      <button className="btn" onClick={handleUpload}>
        Predict Disease
      </button>

      {loading && <Loader />}

      {result && (
        <div className="result-box">
          <h3>Disease: {result.class}</h3>
          <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
