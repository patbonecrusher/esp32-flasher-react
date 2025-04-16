# ESP32-Flasher-React Workflow

```mermaid
flowchart TD
    A[Start] --> B[Setup Environment]
    B -->|npm install| C[Install Dependencies]
    
    %% Development Path
    C -->|npm run dev| D[Run in Development Mode]
    C -->|npm run watch| D2[Run with File Watching]
    D --> E[Hot Reloading Active]
    D2 --> E
    
    %% ESP32 Detection and Flashing
    E --> F[Detect ESP32 Devices]
    F -->|No devices found| G[Display No Devices Message]
    F -->|Devices found| H[Select ESP32 Device]
    H --> I[Select Firmware]
    I --> J[Flash Firmware]
    J -->|Success| K[Display Success Message]
    J -->|Failure| L[Display Error Message]
    
    %% Build Path
    C -->|npm run build| M[Build for Production]
    M -->|build:win| N[Windows Build]
    M -->|build:mac| O[MacOS Build]
    M -->|build:linux| P[Linux Build]
    M -->|build:win64| N2[Windows 64-bit Build]
    
    N --> Q[Distribute Windows App]
    O --> R[Distribute MacOS App]
    P --> S[Distribute Linux App]
    N2 --> Q
    
    %% Preview Path
    C -->|npm run start| T[Preview Built App]
    
    %% Return to start
    K --> F
    L --> F
    G --> F
```

This diagram illustrates the workflow of the ESP32-Flasher-React application, including:

1. **Setup Process**: Installing dependencies with npm
2. **Development Paths**: Running in development mode with hot reloading or watching for changes
3. **ESP32 Interaction Flow**: Detecting devices, selecting firmware, and flashing process
4. **Build Process**: Creating production builds for different platforms (Windows, macOS, Linux)
5. **Preview**: Previewing the built application

The diagram shows how users can navigate through different paths depending on their needs, from development to production builds.