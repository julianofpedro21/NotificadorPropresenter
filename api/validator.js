const axios = require('axios');
const config = require('./config.json');

module.exports = {
    async VerificaSePodeMostrarNaTela() {
        
        try {
            //-- busca o que está mostrando na tela
            const response = await axios.get('http://' + config.ip + '/v1/playlist/active?chunked=false');

            if (!response.data) {
                return true; 
            }

            if (!response.data.presentation.playlist) {
                return true; 
            }

            let nomeDoArquivo = response.data.presentation.item.name;
            console.log("Rodando no momento o arquivo " + nomeDoArquivo);

            // Busca as informações da playlist do culto
            const culto = await axios.get('http://' + config.ip + '/v1/playlist/' + response.data.presentation.playlist.uuid);

            // Itera sobre os itens da playlist
            for (let element of culto.data.items) {
                if (element.id.name == nomeDoArquivo) {
                    if (element.type == "media" && element.duration > 30) {
                        console.log('Está rodando um video, no momento não poderá mostrar a mensagem na tela');
                        return false; 
                    }
                }       
            }

            console.log('Não foi encontrada midia rodando na tela, mensagem será mostrada');
            return true;

        } catch (error) {
            console.log("Ocorreu um erro, verifique " + error);
            return false;
        }
    }   
};
