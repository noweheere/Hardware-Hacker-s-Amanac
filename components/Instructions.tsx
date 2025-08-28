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
      <InstructionCard title="Desktop-Anleitung (Windows & Linux)">
        <p>Um diese Anwendung lokal auf Ihrem Computer auszuführen, benötigen Sie Node.js und npm. Führen Sie dann die folgenden Schritte aus:</p>
        <ol className="list-decimal list-inside space-y-3">
          <li>
            <strong>1. Code herunterladen:</strong> Klonen Sie das Repository mit Git oder laden Sie den Quellcode herunter.
          </li>
          <li>
            <strong>2. Abhängigkeiten installieren:</strong> Öffnen Sie ein Terminal im Projektverzeichnis und führen Sie aus:
            <div className="mt-2"><Code>npm install</Code></div>
          </li>
          <li>
            <strong>3. Google Gemini API-Schlüssel einrichten:</strong> Diese App benötigt einen API-Schlüssel.
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Holen Sie sich Ihren Schlüssel von <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">Google AI Studio</a>.</li>
              <li>Legen Sie den Schlüssel als Umgebungsvariable namens <Code>API_KEY</Code> fest. Führen Sie den passenden Befehl für Ihr System im selben Terminal aus, in dem Sie die App starten werden.</li>
              <li>
                <strong>Windows (CMD):</strong> <Code>set API_KEY=IHR_API_SCHLÜSSEL_HIER</Code>
              </li>
              <li>
                <strong>Windows (PowerShell):</strong> <Code>$env:API_KEY="IHR_API_SCHLÜSSEL_HIER"</Code>
              </li>
              <li>
                <strong>Linux / macOS:</strong> <Code>export API_KEY=IHR_API_SCHLÜSSEL_HIER</Code>
              </li>
            </ul>
          </li>
          <li>
            <strong>4. Lokalen Server starten:</strong> Führen Sie diesen Befehl aus, um einen einfachen Webserver zu starten.
            <div className="mt-2"><Code>npx serve</Code></div>
            <p className="text-xs text-gray-500 mt-1">Wenn <Code>serve</Code> nicht installiert ist, können Sie es mit <Code>npm install -g serve</Code> installieren.</p>
          </li>
          <li>
            <strong>5. App öffnen:</strong> Öffnen Sie Ihren Webbrowser und navigieren Sie zu der Adresse, die im Terminal angezeigt wird (normalerweise <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">http://localhost:3000</a>).
          </li>
        </ol>
      </InstructionCard>

      <InstructionCard title="Anleitung für Mobilgeräte (Android)">
        <p>Da dies eine Webanwendung ist, können Sie sie von Ihrem Android-Gerät aus nutzen, indem Sie auf einen lokalen Server zugreifen, der auf Ihrem Computer läuft.</p>
        <ol className="list-decimal list-inside space-y-3">
          <li>
            <strong>1. Führen Sie die Desktop-Anleitung aus:</strong> Stellen Sie sicher, dass die App auf Ihrem Computer läuft.
          </li>
          <li>
            <strong>2. Verbinden Sie sich mit demselben WLAN:</strong> Ihr Computer und Ihr Android-Gerät müssen mit demselben Netzwerk verbunden sein.
          </li>
          <li>
            <strong>3. Finden Sie die lokale IP-Adresse Ihres Computers:</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>
                <strong>Windows:</strong> Öffnen Sie CMD und geben Sie <Code>ipconfig</Code> ein. Suchen Sie nach der "IPv4-Adresse".
              </li>
              <li>
                <strong>Linux / macOS:</strong> Öffnen Sie ein Terminal und geben Sie <Code>ifconfig</Code> oder <Code>ip a</Code> ein. Suchen Sie nach Ihrer lokalen IP-Adresse (oft beginnend mit <Code>192.168.x.x</Code>).
              </li>
            </ul>
          </li>
           <li>
            <strong>4. Server für den Netzwerkzugriff starten:</strong> Beenden Sie den aktuellen Server (falls er läuft) und starten Sie ihn mit diesem Befehl neu, damit er von anderen Geräten im Netzwerk erreichbar ist:
            <div className="mt-2"><Code>npx serve -l tcp://0.0.0.0:3000</Code></div>
          </li>
          <li>
            <strong>5. App auf Android öffnen:</strong> Öffnen Sie den Webbrowser auf Ihrem Android-Gerät und geben Sie die IP-Adresse Ihres Computers gefolgt vom Port ein (z.B. <Code>http://192.168.1.10:3000</Code>).
          </li>
        </ol>
      </InstructionCard>
    </div>
  );
};

export default Instructions;
