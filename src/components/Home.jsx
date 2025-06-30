import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Search
} from 'lucide-react';
import Button from '@mui/material/Button';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CollectionsIcon from '@mui/icons-material/Collections';
import ShieldTwoToneIcon from '@mui/icons-material/ShieldTwoTone';
import { Typography } from '@mui/material';
import { Card, CardContent, Box, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import ImageUploader from './ImageUploader';
  

const TypeWriter = ({ text, speed = 50, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);
  
  return <>{displayText}</>
};

// TypewriterSequence component to handle multiple sentences
const TypewriterSequence = ({ sentences, speed = 50, delay = 1000 }) => {
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [displayedSentences, setDisplayedSentences] = useState([]);
    const [typing, setTyping] = useState(true);
    
    const handleSentenceComplete = () => {
        setDisplayedSentences(prev => [...prev, sentences[currentSentenceIndex]]);
        setTyping(false);
    
        if (currentSentenceIndex < sentences.length - 1) {
            setTimeout(() => {
                setCurrentSentenceIndex(currentSentenceIndex + 1);
                setTyping(true);
            }, delay);
        }
    };
  
    return (
        <>
        {displayedSentences.map((sentence, index) => (
            <p key={index} className="text-lg text-blue-700 mb-3 font-medium">
            {sentence}
            </p>
        ))}
        {typing && currentSentenceIndex < sentences.length && (
            <p className="text-lg text-blue-700 mb-3 font-medium">
            <TypeWriter 
                text={sentences[currentSentenceIndex]} 
                speed={speed} 
                onComplete={handleSentenceComplete} 
            />
            </p>
        )}
        </>
    );
};

const Home = () => {
    const sentences = [
        "Protect yourself and your loved ones from counterfeit medications.",
        "Our AI-powered technology instantly verifies the authenticity of your medicine.",
        "Simply upload a photo or use your camera to scan any medication.",
        "Get real-time verification results backed by advanced machine learning."
    ];

    const getStyle = (buttonName) => ({
        background:
        activeButton === buttonName ? 'white' : 'transparent',
        width: '50%',
        color: 'black',
        border: 'none',
        padding: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '8px', 
        transition: 'background 0.3s ease',
    });
    const [activeButton, setActiveButton] = useState(null); // 'camera' or 'gallery'
  
    return (
        <div style={{margin: '50px', backgroundColor: 'transparent'}}>
        {/* Hero Section */}
        <div className="">
            <div className="container mx-auto px-6">
                    <div className="part-1" style={{paddingLeft: '18vh', marginBottom:'60px'}}>
                        <h1 className="text-5xl font-bold mb-2" style={{color:'#1f3a8a'}}>MedGuard</h1>
                        <h2 className="text-2xl font-medium mb-8" style={{color:'#1f3a8a'}}>AI-Powered Medication Verification</h2>
                        
                        <div style={{color:'#1c4ed8', height: '220px'}}>
                            <TypewriterSequence sentences={sentences} speed={30} />
                        </div>
                        
                        <div style={{ display: 'flex', width: '100%' }}>
                            <Link to='/verify'><button
                                className="custom-button"
                                style={{ ...getStyle('gallery'), backgroundColor: '#2563F0', width:'30vh', marginRight: '40px', color: 'white' }}
                            >
                                <CameraAltIcon />
                                <Typography variant="button" style={{ fontWeight: 500 }}>Camera</Typography>
                            </button></Link>
                            <Link to='/verify'><button
                                className="custom-button"
                                style={{ ...getStyle('gallery'), backgroundColor: 'white', width:'30vh', color: '#1f3a8a'  }}
                            >
                                <CollectionsIcon />
                                <Typography variant="button" style={{ fontWeight: 500, color:'#1f3a8a' }}>Gallery</Typography>
                            </button></Link>
                        </div>
                    </div>

        {/* How It Works Section */}
        <div className="part-2" style={{backgroundColor: '#b1caf5', width: '100vw', paddingTop: '30px', textAlign: 'center', paddingBottom: '60px'}}>
            <h1 style={{color:'#1d40b0'}}>
                How MedGuard Works
            </h1>
            
            <div style={{textAlign: 'center'}}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{backgroundColor: 'white', color:'#1d40b0', width: '40vw',borderRadius: '20px',padding: '20px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',transition: 'box-shadow 0.3s ease'               }}>
                        <div className="flex justify-center mb-4">
                            <Camera size={48} className="text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-blue-800">Capture</h3>
                        <p className="text-blue-700">
                            Use your device's camera to take a clear photo of your medication, or upload an existing image.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{backgroundColor: 'white', color:'#1d40b0', width: '40vw', marginTop: '40px',borderRadius: '20px',padding: '20px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',transition: 'box-shadow 0.3s ease'               }}>
                        <div className="flex justify-center mb-4">
                            <Search size={48} className="text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-blue-800">Analyze</h3>
                        <p className="text-blue-700">
                            Our AI compares your medication against a database of verified products, analyzing multiple visual factors.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{backgroundColor: 'white', color:'#1d40b0', width: '40vw', marginTop: '40px',borderRadius: '20px',padding: '20px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',transition: 'box-shadow 0.3s ease'               }}>
                        <div className="flex justify-center mb-4">
                            <Shield size={48} className="text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-blue-800">Verify</h3>
                        <p className="text-blue-700">
                            Receive instant verification results with detailed information about the authenticity of your medication.
                        </p>
                    </div>
                </div>
            
            </div>
        </div>
        
         <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#eef3fb',
                padding: 2,
                marginBottom: '20px'
            }}
            >
            <h1 style={{color:'#1d40b0'}}>
                Verification Results
            </h1>

            {/* Card 1 */}
            <Card
                sx={{
                maxWidth: 400,
                borderLeft: '5px solid #4CAF50',
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: '#f9fbff',
                mb: 4
                }}
            >
                <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                    <CheckCircle sx={{ mr: 1 }} style={{color: '#2e7d32', paddingRight: '20px'}}/>
                    <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                    Authentic Medication
                    </Typography>
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: '500', color: '#1a237e' }}>
                    Paracetamol 500mg by PharmaCorp
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Box>
                    <Typography variant="body2" color="textSecondary">
                        Batch Number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a237e' }}>
                        BN45892
                    </Typography>
                    </Box>
                    <Box>
                    <Typography variant="body2" color="textSecondary">
                        Expiry Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a237e' }}>
                        05/2026
                    </Typography>
                    </Box>
                </Box>

                <Typography variant="body2" color="textSecondary">
                    Verification Details
                </Typography>
                <Typography variant="body1" sx={{ color: '#1a237e' }}>
                    All security features present. Package design, lot number, and hologram verified.
                </Typography>
                </CardContent>
            </Card>

            {/* Card 2 */}
            <Card
                sx={{
                maxWidth: 400,
                borderLeft: '5px solid #dc2625',
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: '#f9fbff'
                }}
            >
                <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                    <CheckCircle sx={{ mr: 1 }} style={{color: '#dc2625', paddingRight: '20px'}}/>
                    <Typography variant="h6" sx={{ color: '#dc2625', fontWeight: 'bold' }}>
                    Suspicious Medication
                    </Typography>
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: '500', color: '#1a237e' }}>
                    Claimed: Antibioticin 250mg by MediHealth
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="textSecondary">
                    Warning Signs
                </Typography>
                <Typography variant="body1" sx={{ color: '#1a237e' }}>
                    Missing security hologram. Packaging color inconsistent with verified product.
                </Typography>

                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Recommendation
                </Typography>
                <Typography variant="body1" sx={{ color: '#1a237e' }}>
                    Do not consume. Contact healthcare provider or report to local health authority.
                </Typography>
                </CardContent>
            </Card>
        </Box>
                
            </div>
        </div>
        </div>
        
    );
};

export default Home;