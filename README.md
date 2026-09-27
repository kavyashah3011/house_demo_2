# 🏡 HOME Nº 134 — NPLUSJ Studio (Port 4046)

A private luxury residence visualized frame by frame. Features cinematic architectural camera walkthroughs, room timelines, real-time scroll sync, audio accompaniment, and CAD blueprint floor plans.

## 📁 Architecture & Module Structure

```
02_HOME_No_134_Architectural_Walkthrough_Port_4046/
├── index.html                 # Main entry point (served as root)
├── home134.html               # Named alias for multi-server compatibility
├── styles.css                 # 35mm film grain, vignette, layout & modal styling
├── script.js                  # Smooth architectural scroll engine & room sync
├── assets/
│   └── home134/
│       ├── floorplan.jpg              # High-resolution architectural CAD blueprint
│       ├── scene_01_arrival.jpg       # Exterior Arrival facade
│       ├── scene_01b_threshold.jpg    # Threshold entering residence
│       ├── scene_02_living.jpg        # Double-height Living Hall
│       ├── scene_03_kitchen.jpg       # Culinary Kitchen suite
│       ├── scene_04_bedroom.jpg       # Master Bedroom sanctuary
│       ├── scene_05_bath.jpg          # Roman Travertine Spa Bath
│       └── scene_06_terrace.jpg       # Skyline Roof Terrace
└── README.md                  # This documentation
```

## 🚀 How to Run

### Standalone (Instant Python Server):
```bash
python -m http.server 4046
```
Open [http://localhost:4046](http://localhost:4046) in your browser.
