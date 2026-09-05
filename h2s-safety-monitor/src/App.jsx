import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("home");
  const [rfid, setRfid] = useState("");
  const [history, setHistory] = useState([]);
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(
    "Fetching current location..."
  );
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const autoScanTimerRef = useRef(null);

  /* =================================
     SAMPLE RFID DATABASE
  ================================= */

  const wristbandDatabase = {
    RFID123: {
      name: "Rahul Sharma",
      workerId: "WRK-1024",
      workerUnit: "Production Unit A",
      status: "valid",
      entryExit: "ENTRY",
    },

    RFID456: {
      name: "Priya Singh",
      workerId: "WRK-2048",
      workerUnit: "Maintenance Unit",
      status: "expiring",
      entryExit: "EXIT",
    },

    RFID789: {
      name: "Aman Kumar",
      workerId: "WRK-3072",
      workerUnit: "Safety Department",
      status: "expired",
      entryExit: "ENTRY",
    },
  };

  /* =================================
     STATUS TEXT
  ================================= */

  const getStatusText = (status) => {
    if (status === "valid") {
      return "VALID";
    }

    if (status === "expiring") {
      return "EXPIRING SOON";
    }

    if (status === "expired") {
      return "EXPIRED";
    }

    return "UNKNOWN";
  };

  /* =================================
     DATE FORMAT
     DD-MM-YYYY
  ================================= */

  const getFormattedDate = () => {
    const now = new Date();

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const year = now.getFullYear();

    return `${day}-${month}-${year}`;
  };

  /* =================================
     GET EXACT CURRENT LOCATION
  ================================= */

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocation(
        "Location is not supported by this browser."
      );
      return;
    }

    setLocation(
      "Fetching current location..."
    );

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();

          if (data && data.display_name) {
            setLocation(
              data.display_name
            );
          } else {
            setLocation(
              "Exact location could not be identified."
            );
          }
        } catch (error) {
          console.error(
            "Location error:",
            error
          );

          setLocation(
            "Unable to fetch exact location."
          );
        }
      },

      (error) => {
        console.error(
          "Geolocation error:",
          error
        );

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          setLocation(
            "Location permission was denied."
          );
        } else {
          setLocation(
            "Unable to detect current location."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  /* =================================
     START CAMERA
  ================================= */

  const startCamera = async () => {
    try {
      setCameraError("");

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setCameraError(
          "Camera is not supported by this browser."
        );

        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment",
            },
          },

          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;
      }
    } catch (error) {
      console.error(
        "Camera error:",
        error
      );

      setCameraError(
        "Unable to access camera. Please allow camera permission."
      );
    }
  };

  /* =================================
     STOP CAMERA
  ================================= */

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }
  };

  /* =================================
     PAGE 3 CAMERA EFFECT
  ================================= */

  useEffect(() => {
    if (screen === "scanner") {
      startCamera();
      getCurrentLocation();

      /*
        AUTOMATIC DEMO SCAN

        This remains automatic so you
        do not need to press a button.
      */

      autoScanTimerRef.current =
        setTimeout(() => {
          automaticScan();
        }, 4000);
    }

    return () => {
      stopCamera();

      if (autoScanTimerRef.current) {
        clearTimeout(
          autoScanTimerRef.current
        );
      }
    };
  }, [screen]);

  /* =================================
     START
  ================================= */

  const startScanning = () => {
    setScreen("intro");
  };

  /* =================================
     OPEN SCANNER
  ================================= */

  const openScanner = () => {
    setRfid("");
    setError("");
    setCameraError("");
    setScreen("scanner");
  };

  /* =================================
     CHECK IF ALREADY SCANNED

     SAME RFID CANNOT SCAN TWICE
     WITHIN 1 MINUTE
  ================================= */

  const checkAlreadyScanned = (
    enteredRFID
  ) => {
    const now = Date.now();

    const previousScan = history.find(
      (record) =>
        record.rfid === enteredRFID &&
        now - record.timestamp < 60000
    );

    return previousScan;
  };

  /* =================================
     CREATE SCAN DATA
  ================================= */

  const createScanData = (
    worker,
    enteredRFID
  ) => {
    const now = new Date();

    return {
      ...worker,

      rfid: enteredRFID,

      id: Date.now(),

      timestamp: Date.now(),

      date: getFormattedDate(),

      time: now.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),

      location: location,
    };
  };

  /* =================================
     PROCESS RFID
  ================================= */

  const processRFID = (rfidValue) => {
    const enteredRFID = (
      rfidValue || rfid
    )
      .trim()
      .toUpperCase();

    if (!enteredRFID) {
      setError(
        "Please enter an RFID number."
      );

      return;
    }

    const alreadyScanned =
      checkAlreadyScanned(enteredRFID);

    /*
      SAME PERSON SCANNED AGAIN
      WITHIN ONE MINUTE
    */

    if (alreadyScanned) {
      setScanResult({
        success: false,

        alreadyScanned: true,

        name: alreadyScanned.name,

        rfid: alreadyScanned.rfid,

        workerId:
          alreadyScanned.workerId,

        message:
          "This worker has already been scanned within the last 1 minute.",
      });

      setScreen("failed");

      return;
    }

    setError("");
    setIsScanning(true);

    setTimeout(() => {
      const worker =
        wristbandDatabase[enteredRFID];

      if (!worker) {
        setIsScanning(false);

        setScanResult({
          success: false,

          message:
            "RFID wristband was not found in the system.",
        });

        setScreen("failed");

        return;
      }

      const scanData = createScanData(
        worker,
        enteredRFID
      );

      setHistory((previousHistory) => [
        scanData,
        ...previousHistory,
      ]);

      setScanResult({
        success: true,
        ...scanData,
      });

      setIsScanning(false);

      stopCamera();

      setScreen("result");
    }, 1800);
  };

  /* =================================
     AUTOMATIC DEMO SCAN

     THIS STARTS AUTOMATICALLY
     WHEN THE SCANNER PAGE OPENS.
  ================================= */

  const automaticScan = () => {
    if (isScanning) {
      return;
    }

    setIsScanning(true);

    const demoRFIDs = [
      "RFID123",
      "RFID456",
      "RFID789",
    ];

    const randomRFID =
      demoRFIDs[
        Math.floor(
          Math.random() *
            demoRFIDs.length
        )
      ];

    setTimeout(() => {
      const alreadyScanned =
        checkAlreadyScanned(randomRFID);

      /*
        IF THE AUTOMATICALLY SELECTED
        RFID WAS SCANNED WITHIN 1 MINUTE,
        SHOW ALREADY SCANNED
      */

      if (alreadyScanned) {
        setIsScanning(false);

        stopCamera();

        setScanResult({
          success: false,

          alreadyScanned: true,

          name: alreadyScanned.name,

          rfid: alreadyScanned.rfid,

          workerId:
            alreadyScanned.workerId,

          message:
            "This worker has already been scanned within the last 1 minute.",
        });

        setScreen("failed");

        return;
      }

      setRfid(randomRFID);

      const worker =
        wristbandDatabase[randomRFID];

      const scanData = createScanData(
        worker,
        randomRFID
      );

      setHistory((previousHistory) => [
        scanData,
        ...previousHistory,
      ]);

      setScanResult({
        success: true,
        ...scanData,
      });

      setIsScanning(false);

      stopCamera();

      setScreen("result");
    }, 2500);
  };

  /* =================================
     CLEAR HISTORY
  ================================= */

  const clearHistory = () => {
    setHistory([]);
  };

  /* =================================
     PAGE 1 — HOME
  ================================= */

  if (screen === "home") {
    return (
      <div className="app-screen home-screen">
        <header className="home-header">
          <h1>SULFISCAN</h1>

          <span className="app-tag">
            SMART WORKER CONTROL
          </span>
        </header>

        <main className="home-content">
          <img
  src="/sulfscan-logo.png"
  alt="SULFSCAN Logo"
  className="app-logo"
/>
          <div className="hero-badge">
            SMART • FAST • SECURE
          </div>

          <h2 className="home-subtitle">
            Smart Worker.
            <br />

            <span>
              Control & Access.
            </span>
          </h2>

          <p className="home-description">
            A smart RFID-based system
            designed to manage worker
            access, monitor entry and
            exit, and verify worker
            information instantly.
          </p>

          <button
            className="start-scan-button"
            onClick={startScanning}
          >
            START SCANNING
          </button>
        </main>

        <div className="moving-features">
          <div className="feature-track">
            <span>
              SMART RFID SCANNING
            </span>

            <span>
              REAL-TIME VALIDATION
            </span>

            <span>
              SECURE WORKER ACCESS
            </span>

            <span>
              ENTRY & EXIT MONITORING
            </span>

            <span>
              SCAN HISTORY
            </span>

            <span>
              INSTANT STATUS CHECK
            </span>

            <span>
              SMART RFID SCANNING
            </span>

            <span>
              REAL-TIME VALIDATION
            </span>

            <span>
              SECURE WORKER ACCESS
            </span>

            <span>
              ENTRY & EXIT MONITORING
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* =================================
     PAGE 2 — INTRODUCTION
  ================================= */

  if (screen === "intro") {
    return (
      <div className="app-screen intro-screen">
        <button
          className="back-button"
          onClick={() =>
            setScreen("home")
          }
        >
          ← Back
        </button>

        <div className="wristband-image">
          <div className="rfid-wave wave-one"></div>

          <div className="rfid-wave wave-two"></div>

          <div className="rfid-card">
            <div className="rfid-chip"></div>

            <span>RFID</span>
          </div>

          <div className="wristband-strap"></div>
        </div>

        <h1>Scan Your Wristband</h1>

        <p className="subtitle intro-text">
          Place your RFID wristband near
          the scanner for quick and secure
          worker verification.
        </p>

        <button
          className="primary-button intro-button"
          onClick={openScanner}
        >
          NEXT →
        </button>
      </div>
    );
  }

  /* =================================
     PAGE 3 — SCANNER
  ================================= */

  if (screen === "scanner") {
    return (
      <div className="app-screen scanning-screen">
        <button
          className="back-button"
          onClick={() =>
            setScreen("intro")
          }
        >
          ← Back
        </button>

        <div className="scan-header">
          <h1>
            Scan Your Wristband
          </h1>

          <p>
            Position the RFID wristband
            near the scanner.
          </p>
        </div>

        <div className="camera-box">
          {cameraError ? (
            <div className="camera-placeholder">
              <div className="camera-label">
                CAMERA ERROR
              </div>

              <p
                style={{
                  color: "white",
                  padding: "25px",
                  textAlign: "center",
                }}
              >
                {cameraError}
              </p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />

              <div className="camera-placeholder">
                <div className="camera-label">
                  RFID SCANNER ACTIVE
                </div>

                <div className="scanner-frame">
                  <div className="corner top-left"></div>

                  <div className="corner top-right"></div>

                  <div className="corner bottom-left"></div>

                  <div className="corner bottom-right"></div>

                  <div className="scan-line"></div>
                </div>

                <div className="scanner-tap-text">
                  AUTOMATIC SCANNING ACTIVE
                </div>
              </div>
            </>
          )}
        </div>

        <div className="camera-status">
          <span className="status-dot"></span>

          <span>
            Scanner ready for wristband
          </span>
        </div>

        <div className="manual-rfid-box">
          <div className="manual-divider">
            <span>
              OR ENTER RFID MANUALLY
            </span>
          </div>

          <input
            type="text"
            placeholder="Enter RFID number"
            value={rfid}
            onChange={(event) => {
              setRfid(
                event.target.value
              );

              setError("");
            }}
            onKeyDown={(event) => {
              if (
                event.key === "Enter"
              ) {
                if (
                  autoScanTimerRef.current
                ) {
                  clearTimeout(
                    autoScanTimerRef.current
                  );
                }

                processRFID();
              }
            }}
          />

          {error && (
            <p className="rfid-error">
              {error}
            </p>
          )}

          <button
            className="primary-button verify-button"
            onClick={() => {
              if (
                autoScanTimerRef.current
              ) {
                clearTimeout(
                  autoScanTimerRef.current
                );
              }

              processRFID();
            }}
          >
            VERIFY RFID
          </button>
        </div>

        {isScanning && (
          <div className="loading-overlay">
            <div className="scan-loader"></div>

            <p className="loading-text">
              Scanning and verifying
              wristband...
            </p>
          </div>
        )}
      </div>
    );
  }

  /* =================================
     RESULT PAGE
  ================================= */

  if (
    screen === "result" &&
    scanResult
  ) {
    return (
      <div className="app-screen result-screen">
        <div className="success-history-header">
          <button
            className="history-button"
            onClick={() =>
              setScreen("history")
            }
          >
            🔎 Search History
          </button>
        </div>

        {/* EXPIRED ANIMATION */}

        {scanResult.status ===
          "expired" && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background:
                "rgba(127, 29, 29, 0.96)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "white",
              zIndex: 200,
              animation:
                "expiredFade 1s ease forwards",
            }}
          >
            <div
              style={{
                fontSize: "70px",
                marginBottom: "20px",
                animation:
                  "expiredPulse 1.2s infinite",
              }}
            >
              ⚠
            </div>

            <h1
              style={{
                color: "white",
                fontSize: "42px",
                marginBottom: "15px",
              }}
            >
              WRISTBAND EXPIRED
            </h1>

            <p
              style={{
                fontSize: "20px",
                margin: "8px",
              }}
            >
              <strong>
                {scanResult.name}
              </strong>
            </p>

            <p>
              RFID: {scanResult.rfid}
            </p>

            <p>
              Worker ID:{" "}
              {scanResult.workerId}
            </p>

            <p
              style={{
                marginTop: "25px",
                opacity: 0.8,
              }}
            >
              Access requires attention.
            </p>

            <button
              className="primary-button"
              style={{
                marginTop: "30px",
              }}
              onClick={() =>
                setScreen("scanner")
              }
            >
              CONTINUE
            </button>

            <style>
              {`
                @keyframes expiredPulse {
                  0% {
                    transform: scale(1);
                  }

                  50% {
                    transform: scale(1.15);
                  }

                  100% {
                    transform: scale(1);
                  }
                }

                @keyframes expiredFade {
                  from {
                    opacity: 0;
                  }

                  to {
                    opacity: 1;
                  }
                }
              `}
            </style>
          </div>
        )}

        <div
          className={`result-icon ${scanResult.status}`}
        >
          {scanResult.status ===
          "valid"
            ? "✓"
            : scanResult.status ===
              "expiring"
            ? "!"
            : "✕"}
        </div>

        <h1>
          Worker Details
        </h1>

        <div
          className={`status-banner ${scanResult.status}`}
        >
          <div className="status-indicator">
            ●
          </div>

          <div>
            <h3>
              {getStatusText(
                scanResult.status
              )}
            </h3>

            <p>
              {scanResult.status ===
              "valid"
                ? "The wristband is active and access is permitted."
                : scanResult.status ===
                  "expiring"
                ? "The wristband is still active but will expire soon."
                : "The wristband has expired and requires attention."}
            </p>
          </div>
        </div>

        <div className="details-card final-details-card">
          <div className="detail-row">
            <span className="detail-label">
              NAME
            </span>

            <span>
              {scanResult.name}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              WORKER ID
            </span>

            <span>
              {scanResult.workerId}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              WORKER UNIT
            </span>

            <span>
              {scanResult.workerUnit}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              LOCATION
            </span>

            <span>
              {scanResult.location}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              ENTRY / EXIT
            </span>

            <span
              className={`entry-exit-tag ${scanResult.entryExit.toLowerCase()}`}
            >
              {scanResult.entryExit}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              RFID NUMBER
            </span>

            <span>
              {scanResult.rfid}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              DATE
            </span>

            <span>
              {scanResult.date}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              SCAN TIME
            </span>

            <span>
              {scanResult.time}
            </span>
          </div>
        </div>

        <button
          className="primary-button scan-again-button"
          onClick={openScanner}
        >
          SCAN AGAIN
        </button>
      </div>
    );
  }

  /* =================================
     FAILED SCREEN
  ================================= */

  if (screen === "failed") {
    return (
      <div className="app-screen failed-screen">
        <div className="failed-circle">
          !
        </div>

        <h1>
          {scanResult?.alreadyScanned
            ? "Already Scanned"
            : "Scan Failed"}
        </h1>

        {scanResult?.alreadyScanned && (
          <div
            style={{
              marginBottom: "20px",
              padding: "20px",
              background: "#fef3c7",
              borderRadius: "15px",
              maxWidth: "400px",
            }}
          >
            <h3>
              {scanResult.name}
            </h3>

            <p>
              RFID: {scanResult.rfid}
            </p>

            <p>
              Worker ID:{" "}
              {scanResult.workerId}
            </p>
          </div>
        )}

        <div className="failure-message">
          {scanResult?.message ||
            "Unable to verify the RFID wristband."}
        </div>

        <button
          className="primary-button"
          onClick={openScanner}
        >
          TRY AGAIN
        </button>

        <button
          className="secondary-button"
          onClick={() =>
            setScreen("home")
          }
        >
          RETURN HOME
        </button>
      </div>
    );
  }

  /* =================================
     HISTORY SCREEN
  ================================= */

  if (screen === "history") {
    return (
      <div className="app-screen history-screen">
        <div className="history-top-bar">
          <button
            className="history-back-button"
            onClick={() =>
              setScreen("result")
            }
          >
            ← Back
          </button>

          {history.length > 0 && (
            <button
              className="clear-history-button"
              onClick={clearHistory}
            >
              Clear History
            </button>
          )}
        </div>

        <h1>
          Search History
        </h1>

        <p className="subtitle">
          Complete record of scanned
          worker wristbands
        </p>

        {history.length === 0 ? (
          <div className="empty-history">
            <div className="history-icon">
              📜
            </div>

            <h2>
              No Scan History
            </h2>

            <p>
              Your scanned workers will
              appear here.
            </p>
          </div>
        ) : (
          <div className="history-list">
            {history.map(
              (record) => (
                <div
                  key={record.id}
                  className={`history-card ${record.status}`}
                >
                  <div className="history-card-header">
                    <div>
                      <h3>
                        {record.name}
                      </h3>

                      <span>
                        {record.workerId}
                      </span>
                    </div>

                    <span
                      className={`status-badge ${record.status}`}
                    >
                      {getStatusText(
                        record.status
                      )}
                    </span>
                  </div>

                  <div className="history-details">
                    <p>
                      <strong>
                        WORKER UNIT
                      </strong>

                      <span>
                        {record.workerUnit}
                      </span>
                    </p>

                    <p>
                      <strong>
                        LOCATION
                      </strong>

                      <span>
                        {record.location}
                      </span>
                    </p>

                    <p>
                      <strong>
                        ENTRY / EXIT
                      </strong>

                      <span
                        className={`entry-exit-tag ${record.entryExit.toLowerCase()}`}
                      >
                        {record.entryExit}
                      </span>
                    </p>

                    <p>
                      <strong>
                        DATE
                      </strong>

                      <span>
                        {record.date}
                      </span>
                    </p>

                    <p>
                      <strong>
                        TIME
                      </strong>

                      <span>
                        {record.time}
                      </span>
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default App;