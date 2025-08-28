import React from 'react';

const InstructionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
    <h3 className="text-xl font-bold text-cyan-400 mb-4 border-b border-cyan-400/30 pb-2">{title}</h3>
    <div className="space-y-4 text-gray-300">{children}</div>
  </div>
);

const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <code className="bg-gray-900 text-green-300 px-2 py-1 rounded-md text-sm font-mono">{children}</code>
);

const Instructions: React.FC = () => {
  return (
    <div className="mt-6 space-y-6">
      <InstructionCard title="Automatische Installation (Empfohlen)">
        <p>Ein Python-Skript ist enthalten, um die Einrichtung zu automatisieren. Sie benötigen Python 3 auf Ihrem System.</p>
        <ol className="list-decimal list-inside space-y-3">
          <li>
            <strong>1. Code herunterladen:</strong> Klonen Sie das Repository mit Git oder laden Sie den Quellcode herunter und entpacken Sie ihn.
          </li>
          <li>
            <strong>2. Setup-Skript ausführen:</strong> Öffnen Sie ein Terminal oder eine Eingabeaufforderung im Projektverzeichnis und führen Sie aus:
            <div className="mt-2"><Code>python setup.py</Code></div>
            <p className="text-xs text-gray-500 mt-1">Möglicherweise müssen Sie <Code>python3</Code> anstelle von <Code>python</Code> verwenden, je nach Ihrer Systemkonfiguration.</p>
          </li>
          <li>
            <strong>3. Anweisungen befolgen:</strong> Das Skript überprüft, ob Node.js installiert ist, fragt nach Ihrem Google Gemini API-Schlüssel und erstellt ein Startskript (<Code>start.bat</Code> für Windows oder <Code>start.sh</Code> für Linux/macOS).
          </li>
          <li>
            <strong>4. App starten:</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li><strong>Windows:</strong> Doppelklicken Sie auf die Datei <Code>start.bat</Code>.</li>
                <li><strong>Linux / macOS:</strong> Führen Sie im Terminal <Code>./start.sh</Code> aus.</li>
            </ul>
          </li>
          <li>
            <strong>5. App öffnen:</strong> Öffnen Sie Ihren Webbrowser und navigieren Sie zu <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">http://localhost:3000</a>.
          </li>
        </ol>
      </InstructionCard>

      <InstructionCard title="Nutzung auf Mobilgeräten (Android & iOS)">
        <p>Sie können die App auf Ihrem Mobilgerät verwenden, während sie auf Ihrem Computer läuft.</p>
        <ol className="list-decimal list-inside space-y-3">
          <li>
            <strong>1. Starten Sie die App auf Ihrem Computer:</strong> Verwenden Sie das Skript <Code>start.bat</Code> oder <Code>./start.sh</Code>.
          </li>
          <li>
            <strong>2. Verbinden Sie sich mit demselben WLAN:</strong> Ihr Computer und Ihr Mobilgerät müssen mit demselben Netzwerk verbunden sein.
          </li>
          <li>
            <strong>3. Finden Sie die lokale IP-Adresse Ihres Computers:</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>
                <strong>Windows:</strong> Öffnen Sie CMD und geben Sie <Code>ipconfig</Code> ein. Suchen Sie nach der "IPv4-Adresse".
              </li>
              <li>
                <strong>Linux / macOS:</strong> Öffnen Sie ein Terminal und geben Sie <Code>hostname -I</Code> oder <Code>ip a</Code> ein. Suchen Sie nach Ihrer lokalen IP-Adresse (oft beginnend mit <Code>192.168.x.x</Code> oder <Code>10.x.x.x</Code>).
              </li>
            </ul>
          </li>
          <li>
            <strong>4. App auf dem Mobilgerät öffnen:</strong> Öffnen Sie den Webbrowser auf Ihrem Mobilgerät und geben Sie die IP-Adresse Ihres Computers gefolgt vom Port ein (z.B. <Code>http://192.168.1.10:3000</Code>).
          </li>
        </ol>
      </InstructionCard>
    </div>
  );
};

export default Instructions;
