import React, { useState, useEffect, useRef } from "react";

export default function HelpPage() {
  const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem("emergencyPhone") || "");
  const [email, setEmail] = useState(localStorage.getItem("emergencyEmail") || "");
  const [locationUrl, setLocationUrl] = useState("");
  const [message, setMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const chunks = useRef([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("emergencyPhone", phoneNumber);
  }, [phoneNumber]);

  useEffect(() => {
    localStorage.setItem("emergencyEmail", email);
  }, [email]);

  useEffect(() => {
    startVoiceRecognition();
  }, []);

  const startVoiceRecognition = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toUpperCase();
      console.log("Detected:", transcript);

      if (transcript.includes("HELP")) {
        handleHelpClick();
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleHelpClick = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          setVideoUrl(url);
          saveVideo(blob);
          chunks.current = [];
        };

        mediaRecorder.start();
        setRecording(true);

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
            setLocationUrl(googleMapsUrl);

            const emergencyMessage = `EMERGENCY! I need help. My location: ${googleMapsUrl}`;
            setMessage(emergencyMessage);

            alert("Location fetched! Searching for nearby police stations...");
            window.open(`https://www.google.com/maps/search/police+station/@${latitude},${longitude}`, "_blank");
          },
          (error) => {
            console.error("Error fetching location:", error);
            alert("Could not fetch location. Please enable GPS.");
          }
        );
      })
      .catch((error) => {
        console.error("Error accessing camera and microphone:", error);
        alert("Camera and microphone access denied. Please enable them.");
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      setRecording(false);
    }
  };

  const saveVideo = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "emergency-video.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const sendSMS = () => {
    if (!phoneNumber) {
      alert("Please enter a valid phone number.");
      return;
    }
    const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
  };

  const sendEmail = () => {
    if (!email) {
      alert("Please enter a valid email.");
      return;
    }
    window.location.href = `mailto:${email}?subject=Emergency%20Help&body=${encodeURIComponent(message)}`;
  };

  const copyMessageToClipboard = () => {
    navigator.clipboard.writeText(message);
    alert("Message copied! Paste it into your SMS app.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-red-600 text-white flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <button className="text-xl font-bold">&#9776;</button>
          <h1 className="font-bold text-xl">SHEcurity</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Wi-Fi <span className="font-bold">ON</span></span>
          <span className="text-sm">GPS <span className="font-bold">ON</span></span>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center flex-grow bg-white">
        <button
          onClick={handleHelpClick}
          className="bg-red-600 text-white text-2xl font-bold rounded-full w-40 h-40 flex items-center justify-center shadow-lg mb-8"
        >
          {recording ? "Recording..." : "HELP"}
        </button>

        {recording && (
          <button
            onClick={stopRecording}
            className="bg-gray-600 text-white p-2 rounded-lg mb-2 w-64 text-center"
          >
            Stop Recording
          </button>
        )}

        <video ref={videoRef} autoPlay muted className="w-64 h-40 border border-gray-400"></video>

        {videoUrl && (
          <div className="mt-4">
            <h3>Recorded Video:</h3>
            <video src={videoUrl} controls className="w-64 h-40"></video>
            <a href={videoUrl} download="emergency-video.webm" className="block text-blue-600 mt-2">
              Download Video
            </a>
          </div>
        )}

        <div className="w-80 flex flex-col items-center">
          <input
            type="tel"
            placeholder="Enter emergency phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border border-gray-400 p-2 rounded w-full mb-2"
          />
          <input
            type="email"
            placeholder="Enter emergency email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 p-2 rounded w-full mb-4"
          />
        </div>

        {locationUrl && (
          <div className="flex flex-col items-center mt-4">
            <button onClick={sendSMS} className="bg-green-600 text-white p-2 rounded-lg mb-2 w-64">Send SMS</button>
            <button onClick={sendEmail} className="bg-blue-600 text-white p-2 rounded-lg mb-2 w-64">Send Email</button>
            <button onClick={copyMessageToClipboard} className="bg-gray-600 text-white p-2 rounded-lg mb-2 w-64">Copy Message</button>
            <a href={`tel:${phoneNumber}`} className="bg-red-500 text-white p-2 rounded-lg w-64 text-center">Call Now</a>
          </div>
        )}
      </div>
    </div>
  );
}
