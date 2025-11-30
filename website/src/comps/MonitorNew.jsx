import "../css/mon.css";
import { useEffect, useRef, useState } from "react";

export default function MonitorNew({v, setV}) {    
  const [rates, setRates] = useState({
    HR: v.HR,
    RR: v.RR
  });
  useEffect(() => {
    setRates({
      HR: v.HR,
      RR: v.RR
    });
    rhythmRef.current = getCurrentRhythm();
    // Regenerate the static EKG data when rhythm changes
    generateStaticEKGData();
  }, [v.HR, v.RR, v.EKG]);

  const ekgRef = useRef(null);
  const plethRef = useRef(null);
  const respRef = useRef(null);
  const animationRef = useRef(null);
  const rhythmRef = useRef("normal");
  const cursorXRef = useRef(0);
  
  // Static data arrays - generated once and reused
  const ekgDataRef = useRef(new Array(800).fill(0));
  const plethDataRef = useRef(new Array(800).fill(0));
  const respDataRef = useRef(new Array(800).fill(0));

  // Realistic EKG waveforms - STATIC patterns
  const rhythms = {
    normal: {
      getBeat: (beatTime) => {
        if (beatTime < 0.1) return 0;
        if (beatTime < 0.15) return 0.3;  // P wave
        if (beatTime < 0.2) return 0;
        if (beatTime < 0.25) return -0.2; // Q wave
        if (beatTime < 0.3) return 1.0;   // R wave
        if (beatTime < 0.35) return -0.3; // S wave
        if (beatTime < 0.4) return 0;
        if (beatTime < 0.5) return 0.4;   // T wave
        return 0;
      }
    },
    svt: {
      getBeat: (beatTime) => {
        if (beatTime < 0.05) return 0;
        if (beatTime < 0.08) return 0.2;  // P wave
        if (beatTime < 0.1) return 0;
        if (beatTime < 0.12) return -0.15;
        if (beatTime < 0.14) return 0.8;  // R wave
        if (beatTime < 0.16) return -0.2;
        if (beatTime < 0.2) return 0.25;  // T wave
        return 0;
      }
    },
    vtach: {
      getBeat: (beatTime) => {
        if (beatTime < 0.1) return 0;
        if (beatTime < 0.2) return 0.9;   // Wide R wave
        if (beatTime < 0.3) return -0.7;  // Deep S wave
        if (beatTime < 0.35) return 0.5;  // Secondary R
        if (beatTime < 0.4) return 0;
        return 0;
      }
    },
    vfib: {
      generate: (x) => {
        // Consistent chaotic pattern based on position
        const base = Math.sin(x * 0.1) * 0.6;
        const chaos = Math.sin(x * 0.23 + 1.2) * 0.4;
        return base + chaos;
      }
    },
    afib: {
      generate: (x) => {
        // Irregular pattern based on position
        const base = Math.sin(x * 0.08) * 0.3;
        // Random QRS complexes at fixed positions
        if (x % 40 < 3) return Math.min(0.8, base + 0.6);
        if (x % 60 < 3) return Math.max(-0.4, base - 0.3);
        return base;
      }
    },
    aflutter: {
      generate: (x) => {
        // Sawtooth pattern based on position
        const flutterPos = (x * 0.3) % 1;
        let flutterWave;
        if (flutterPos < 0.5) {
          flutterWave = flutterPos * 1.2 - 0.3;
        } else {
          flutterWave = (1 - flutterPos) * 1.2 - 0.3;
        }
        // Occasional QRS at fixed positions
        if (x % 50 < 2) return Math.min(0.7, flutterWave + 0.5);
        return flutterWave;
      }
    },
    pvc: {
      getBeat: (beatTime, beatIndex) => {
        if (beatIndex % 4 === 2) {
          // PVC beat
          if (beatTime < 0.1) return 0;
          if (beatTime < 0.15) return 0.8;
          if (beatTime < 0.25) return -0.6;
          if (beatTime < 0.3) return 0.4;
          return 0;
        } else {
          // Normal beat
          if (beatTime < 0.1) return 0;
          if (beatTime < 0.15) return 0.2;
          if (beatTime < 0.2) return 0;
          if (beatTime < 0.25) return -0.2;
          if (beatTime < 0.3) return 0.8;
          if (beatTime < 0.35) return -0.2;
          if (beatTime < 0.4) return 0;
          if (beatTime < 0.5) return 0.3;
          return 0;
        }
      }
    },
    asystole: {
      generate: () => 0 // Flatline
    },
    brady: {
      getBeat: (beatTime) => {
        if (beatTime < 0.2) return 0;
        if (beatTime < 0.25) return 0.2;
        if (beatTime < 0.3) return 0;
        if (beatTime < 0.35) return -0.2;
        if (beatTime < 0.4) return 0.8;
        if (beatTime < 0.45) return -0.2;
        if (beatTime < 0.5) return 0;
        if (beatTime < 0.7) return 0.3;
        if (beatTime < 1.0) return 0;
        return 0;
      }
    }
  };

  // Get current rhythm from EKG type
  const getCurrentRhythm = () => {
    return v.EKG || "normal";
  };

  // Generate STATIC EKG data - called only when rhythm changes
  const generateStaticEKGData = () => {
    const rhythm = getCurrentRhythm();
    const rhythmDef = rhythms[rhythm];
    const width = 800;
    
    for (let x = 0; x < width; x++) {
      if (rhythmDef.generate) {
        // Use position-based generation for continuous rhythms
        ekgDataRef.current[x] = rhythmDef.generate(x);
      } else {
        // Use beat-based generation for regular rhythms
        const beatDuration = 60 / rates.HR;
        const pixelsPerBeat = (beatDuration / 8) * width; // 8-second display
        const beatIndex = Math.floor(x / pixelsPerBeat);
        const beatTime = ((x % pixelsPerBeat) / pixelsPerBeat);
        
        if (rhythm === 'pvc') {
          ekgDataRef.current[x] = rhythmDef.getBeat(beatTime, beatIndex);
        } else {
          ekgDataRef.current[x] = rhythmDef.getBeat(beatTime);
        }
      }
    }
  };

  // Generate STATIC pleth data
  const generateStaticPlethData = () => {
    const width = 800;
    const period = 60 / rates.HR;
    const pixelsPerBeat = (period / 8) * width;
    
    for (let x = 0; x < width; x++) {
      const beatTime = ((x % pixelsPerBeat) / pixelsPerBeat);
      plethDataRef.current[x] = Math.sin(beatTime * Math.PI * 2) * 0.8;
    }
  };

  // Generate STATIC resp data
  const generateStaticRespData = () => {
    const width = 800;
    const period = 60 / rates.RR;
    const pixelsPerBreath = (period / 16) * width; // 16-second display
    
    for (let x = 0; x < width; x++) {
      const breathTime = ((x % pixelsPerBreath) / pixelsPerBreath);
      respDataRef.current[x] = Math.sin(breathTime * Math.PI * 2) * 0.6;
    }
  };

  // Draw STATIC EKG with moving cursor
  const drawStaticEKG = (ctx, width, height) => {
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Draw grid - STATIC
    ctx.strokeStyle = '#1a3a1a';
    ctx.lineWidth = 1;
    const gridSize = width / 16;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw EKG trace - STATIC
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const centerY = height / 2;
    const amplitude = height * 0.3;

    for (let x = 0; x < width; x++) {
      const y = centerY - ekgDataRef.current[x] * amplitude;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Draw moving cursor line
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 20;
    ctx.beginPath();
    const cursorX = cursorXRef.current;
    ctx.moveTo(cursorX, 0);
    ctx.lineTo(cursorX, height);
    ctx.stroke();
  };

  // Draw STATIC waveform
  const drawStaticWaveform = (ctx, width, height, data, color) => {
    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Draw waveform - STATIC
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const centerY = height / 2;
    const amplitude = height * 0.3;

    for (let x = 0; x < width; x++) {
      const y = centerY - data[x] * amplitude;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
     ctx.strokeStyle = 'black';
    ctx.lineWidth = 20;
    ctx.beginPath();
    const cursorX = cursorXRef.current;
    ctx.moveTo(cursorX, 0);
    ctx.lineTo(cursorX, height);
    ctx.stroke();
  };

  const updateAnimation = (timestamp) => {
    const ekgCanvas = ekgRef.current;
    const plethCanvas = plethRef.current;
    const respCanvas = respRef.current;
    
    if (!ekgCanvas || !plethCanvas || !respCanvas) return;
    
    // Update moving cursor only
    cursorXRef.current = (cursorXRef.current + 2) % ekgCanvas.width;
    
    // Draw STATIC waveforms with moving cursor
    drawStaticEKG(ekgCanvas.getContext('2d'), ekgCanvas.width, ekgCanvas.height);
    drawStaticWaveform(plethCanvas.getContext('2d'), plethCanvas.width, plethCanvas.height, plethDataRef.current, '#ff9900');
    drawStaticWaveform(respCanvas.getContext('2d'), respCanvas.width, respCanvas.height, respDataRef.current, '#00ccff');
    
    animationRef.current = requestAnimationFrame(updateAnimation);
  };

  useEffect(() => {
    // Generate static data once when component mounts or rhythm changes
     
        generateStaticEKGData();
        generateStaticPlethData();
        generateStaticRespData();
            
        animationRef.current = requestAnimationFrame(updateAnimation);
        return () => {
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        };
     
  }, [rates.HR, rates.RR, v.EKG]);

  // Get rhythm display name
  const getRhythmDisplayName = () => {
    const rhythm = rhythmRef.current;
    const names = {
      "svt": "SVT",
      "afib": "ATRIAL FIB", 
      "vtach": "V-TACH",
      "vfib": "V-FIB",
      "aflutter": "A-FLUTTER",
      "pvc": "PVC",
      "asystole": "ASYSTOLE",
      "brady": "BRADYCARDIA",
      "normal": "NORMAL SINUS"
    };
    return names[rhythm] || "NORMAL SINUS";
  };

  return (
    <div className="medical-monitor">
      {/* Header */}
      <div className="monitor-header">
        <div className="monitor-title">PATIENT MONITOR</div>
        <div className="monitor-info">
        </div>
        <div className="time-display">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Main Content */}
      <div className="monitor-content">
        {/* Left Column - Numerics */}
        <div className="numerics-panel">
          <div className="vital-box hr-box">
            <div className="vital-label">HR</div>
            <div className="vital-value">{rates.HR}</div>
            <div className="vital-unit">bpm</div>
          </div>
          
          <div className="vital-box bp-box">
            <div className="vital-label">NIBP</div>
            <div className="vital-value">{Math.round(v.BPS)}/{Math.round(v.BPD)}</div>
            <div className="vital-unit">mmHg</div>
            <div className="bp-time">14:32</div>
          </div>
          
          <div className="vital-box spo2-box">
            <div className="vital-label">SpO₂</div>
            <div className="vital-value">{Math.round(v.SPO2)}</div>
            <div className="vital-unit">%</div>
          </div>
          
          <div className="vital-box resp-box">
            <div className="vital-label">RESP</div>
            <div className="vital-value">{rates.RR}</div>
            <div className="vital-unit">bpm</div>
          </div>
          
          <div className="vital-box etco2-box">
            <div className="vital-label">ETCO₂</div>
            <div className="vital-value">{Math.round(v.CAP)}</div>
            <div className="vital-unit">mmHg</div>
          </div>
        </div>

        {/* Right Column - Waveforms */}
        <div className="waveforms-panel">
          {/* ECG Lead II */}
          <div className="wave-container ecg-container">
            <div className="wave-header">
              <span className="lead-name">II</span>
              <span className="wave-scale">10 mm/mV</span>
              <span className="heart-rate">{rates.HR} bpm</span>
            </div>
            <canvas 
              ref={ekgRef} 
              width={800} 
              height={150}
              className="wave-canvas static-ekg"
            />
          </div>

          {/* SpO2 Pleth */}
          <div className="wave-container pleth-container">
            <div className="wave-header">
              <span className="lead-name">PLETH</span>
              <span className="spo2-value">{Math.round(v.SPO2)}%</span>
            </div>
            <canvas 
              ref={plethRef} 
              width={800} 
              height={100}
              className="wave-canvas"
            />
          </div>

          {/* Respiration */}
          <div className="wave-container resp-container">
            <div className="wave-header">
              <span className="lead-name">RESP</span>
              <span className="resp-rate">{rates.RR} bpm</span>
            </div>
            <canvas 
              ref={respRef} 
              width={800} 
              height={100}
              className="wave-canvas"
            />
          </div>
        </div>
      </div>
    </div>
  );
}