const fs = require('fs');
const path = require('path');

// Caminho para a pasta de log
const logDir = path.join(__dirname, 'log');

// Garante que a pasta de log existe
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

/**
 * Função para registrar os dados em um arquivo de log único por dia e tipo.
 * @param {string} endpoint - Nome do endpoint para categorizar o log.
 * @param {Object} data - Dados a serem registrados.
 */
function registrar(endpoint, data) {
    const date = new Date().toISOString().split('T')[0]; // Data no formato YYYY-MM-DD
    const logFile = path.join(logDir, `${endpoint}-${date}.log`);
    
    const logEntry = {
        timestamp: new Date().toISOString(),
        data
    };

    // Adiciona a nova entrada de log ao arquivo
    const logContent = JSON.stringify(logEntry, null, 2) + ',\n'; // Formata e adiciona vírgula e nova linha

    fs.appendFile(logFile, logContent, (err) => {
        if (err) {
            console.error("Erro ao salvar o log:", err);
        } else {
            console.log(`Log salvo em: ${logFile}`);
        }
    });
}

module.exports = registrar;
