import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CollectionsIcon from '@mui/icons-material/Collections';
import { Typography } from '@mui/material';

const ImageUploader = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [extractedTexts, setExtractedTexts] = useState([]);
    const [fraudCheckResults, setFraudCheckResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeButton, setActiveButton] = useState(null); // 'camera' or 'gallery'

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setPreview(null);
        }
    };

    const uploadImage = async (imgFile) => {
        const formData = new FormData();
        formData.append('file', imgFile);
        setIsLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setExtractedTexts(data.texts || []);
                setFraudCheckResults(data.fraud_check);
            } else {
                alert(data.error || "Upload failed");
            }
        } catch (error) {
            alert("An error occurred while uploading the file.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) return;
        await uploadImage(file);
    };

    const getStyle = (buttonName) => ({
        background: activeButton === buttonName ? 'white' : 'transparent',
        width: '50%',
        color: '#1d40b0',
        border: 'none',
        padding: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'background 0.3s ease',
    });

    useEffect(() => {
        if (activeButton === 'camera' && videoRef.current) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                })
                .catch((err) => {
                    console.error("Failed to access camera:", err);
                });
        } else {
            stopCamera();
        }

        return () => {
            stopCamera(); // Clean up when component unmounts
        };
    }, [activeButton]);

    const handleButtonClick = (type) => {
        setActiveButton(type);
        setFile(null);
        setPreview(null);
        setExtractedTexts([]);
        setFraudCheckResults([]);
    };

    const handleCapture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            stopCamera(); // Turn off camera
            const randomFilename = `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}.jpg`;
            const capturedFile = new File([blob], randomFilename, { type: 'image/jpg' });
            setFile(capturedFile);
            setPreview(URL.createObjectURL(blob));

            // Upload captured image to the backend
            setIsLoading(true); // Set loading state
            try {
                const formData = new FormData();
                formData.append('file', capturedFile);

                // Backend request to /upload
                const response = await fetch('http://127.0.0.1:5000/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (response.ok) {
                    // Set the extracted text and fraud check results
                    setExtractedTexts(data.texts || []);
                    setFraudCheckResults(data.fraud_check || []);
                } else {
                    alert(data.error || 'Upload failed');
                }
            } catch (error) {
                alert('An error occurred while uploading the file.');
            } finally {
                setIsLoading(false); // Reset loading state
            }
        }, 'image/png');
    }
};


    return (
        <div style={{ margin: '50px' }}>
            <h1 style={{ fontFamily: 'monospace', textAlign: 'center', color: '#1d40b0' }}>
                Authentic Medication Verification System
            </h1>

            <div style={{ display: 'flex', width: '100%' }}>
                {/* <button
                    style={getStyle('camera')}
                    onClick={() => handleButtonClick('camera')}
                >
                    <CameraAltIcon />
                    <Typography variant="button" style={{ fontWeight: 500 }}>Camera</Typography>
                </button> */}
                <button
                    style={getStyle('gallery')}
                    onClick={() => handleButtonClick('gallery')}
                >
                    <CollectionsIcon />
                    <Typography variant="button" style={{ fontWeight: 500 }}>Gallery</Typography>
                </button>
            </div>

            {activeButton === 'camera' && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: '300px', borderRadius: '10px' }} />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <Button
                        variant="contained"
                        onClick={handleCapture}
                        disabled={isLoading}
                        style={{ marginTop: '10px' }}
                    >
                        Capture
                    </Button>
                </div>
            )}

            {activeButton === 'gallery' && (
                <div style={{ backgroundColor: 'white', marginTop: '5px', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                    <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            required
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                        <Button variant="contained" onClick={() => fileInputRef.current.click()}>
                            Choose File
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={isLoading}
                            style={{ marginLeft: '10px' }}
                        >
                            Upload
                        </Button>
                    </form>

                    <p style={{ marginTop: '10px', textAlign: 'center', color: 'black' }}>
                        {file ? `Selected file: ${file.name}` : 'No file chosen'}
                    </p>
                </div>
            )}

            {/* Preview */}
            {preview && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '300px', border: '1px solid #ccc' }}
                    />
                </div>
            )}

            {isLoading && <div className="spinner" style={{ textAlign: 'center', marginTop: '10px' }}></div>}

            {extractedTexts.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <h2 style={{ color: 'black' }}>Extracted Text:</h2>
                    <ul style={{ color: 'black' }}>
                        {extractedTexts.map((text, index) => (
                            <li key={index}>{text}</li>
                        ))}
                    </ul>

                    <h2 style={{ color: 'black' }}>Fraud Check Results:</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ul style={{ listStyleType: 'none', padding: 0, color: 'black' }}>
                            {fraudCheckResults ? (
                                <li style={{ display: 'flex', alignItems: 'center' }}>
                                    <CheckCircleIcon style={{ color: 'green', marginRight: '5px', fontSize: '36px' }} />
                                    Not Fake
                                </li>
                            ) : (
                                <li style={{ display: 'flex', alignItems: 'center' }}>
                                    <CancelIcon style={{ color: 'red', marginRight: '5px', fontSize: '36px' }} />
                                    Fake
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
