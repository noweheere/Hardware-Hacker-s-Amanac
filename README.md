# Hardware Hacker's Almanac - Web Edition

Dies ist eine webbasierte Anwendung, die mit React und TypeScript erstellt wurde. Sie ermöglicht es Ihnen, Hardware-Komponenten mittels Bild-Upload, Live-Kamera oder Texteingabe zu identifizieren und detaillierte Analysen von der Google Gemini API zu erhalten.

## Funktionen (Geplant)

- **Drei Eingabemodi:** Bilddatei hochladen, Live-Kamera verwenden oder Komponentenname als Text eingeben.
- **Detaillierte KI-Analyse:** Erhalten Sie den Komponentennamen, eine Beschreibung, Spezifikationen und mehr.
- **Projektverwaltung:** Speichern und laden Sie Ihre Analyseergebnisse und Notizen lokal.
- **PDF-Export:** Exportieren Sie den vollständigen Analysebericht als PDF.

## Einrichtung und Ausführung

### 1. Voraussetzungen

- Node.js und npm (oder ein anderer Paketmanager) müssen installiert sein.
- Ein Google Gemini API-Schlüssel ist erforderlich.

### 2. Installation

1.  Klonen Sie das Repository.
2.  Installieren Sie die Abhängigkeiten:
    ```bash
    npm install
    ```

### 3. API-Schlüssel konfigurieren

1.  Erstellen Sie eine `.env`-Datei im Hauptverzeichnis.
2.  Fügen Sie Ihren API-Schlüssel hinzu:
    ```
    VITE_GEMINI_API_KEY=DEIN_API_SCHLUESSEL_HIER
    ```

### 4. Anwendung starten

Führen Sie den Entwicklungsserver aus:
```bash
npm run dev
```

Die Anwendung sollte nun in Ihrem Browser verfügbar sein.
