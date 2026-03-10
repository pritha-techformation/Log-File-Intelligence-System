// components/logs/UploadLogForm.jsx

import { useState } from "react";
import { uploadLog } from "../../../../client/src/api/file.api";
import toast from "react-hot-toast";
import { Bar } from "react-chartjs-2";
import "../styles/UploadForm.css";
import { useNavigate } from "react-router-dom";

// UploadLogForm component
const UploadLogForm = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [logId, setLogId] = useState(null);
  const [dragging, setDragging] = useState(false);

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if a file was dropped
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
      e.dataTransfer.clearData();
    }
  };

  // Handle file selection
  const handleFile = (selectedFile) => {
    if (!selectedFile.name.endsWith(".txt")) {
      toast.error("Only .txt log files allowed");
      return;
    }

    // Set the selected file
    setFile(selectedFile);

    // Set the preview
    const reader = new FileReader();

    // Show the preview of the first 500 characters
    reader.onload = (e) => {
      setPreview(e.target.result.slice(0, 500));
    };
    reader.readAsText(selectedFile);
  };

  // Handle file upload
  const handleUpload = async () => {
    // Check if a file was selected
    if (!file) {
      toast.error("Select a log file");
      return;
    }

    // Create a form data object
    const formData = new FormData();
    formData.append("file", file);

    // Upload the log
    try {
      const res = await uploadLog(formData, {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      toast.success("Log uploaded successfully");

      // Get the log id
      const logId = res.data.log._id;

      // Set the log id
      setAnalysis(res.data.analysis);
      setLogId(logId);

      // redirect to results page
      setTimeout(() => {
        navigate(`/logs/${logId}`);
      }, 2000);
    } catch (err) {
      // Handle error
      toast.error("Upload failed");
      console.error(err);
    }
  };

  return (
    <div className="upload-page">
      <h2>Upload Log File</h2>

      {/* Drag Drop Area */}
      <div
        className={`drop-zone ${dragging ? "drag-active" : ""}`}
        onDrop={(e) => {
          handleDrop(e);
          setDragging(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
      >
        {file ? file.name : "Drag & Drop log file here"}
      </div>

      {/* File Input */}
      <div className="file-input-wrapper">
        <label className="file-label">
          Select Log File
          <input
            type="file"
            accept=".txt"
            onChange={(e) => handleFile(e.target.files[0])}
            hidden
          />
        </label>

        <span className="file-name">
          {file ? file.name : "No file selected"}
        </span>
      </div>

      <button onClick={handleUpload}>Upload</button>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* File Preview */}
      {preview && (
        <div className="preview">
          <h4>File Preview</h4>
          <pre>{preview}</pre>
        </div>
      )}

      {/* Error Chart */}
      {analysis && (
        <div className="charts">
          <h3>Error Frequency</h3>

          <Bar
            data={{
              labels: analysis.errorTypes.map((e) => e.type),
              datasets: [
                {
                  label: "Errors",
                  data: analysis.errorTypes.map((e) => e.count),
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
};

export default UploadLogForm;
