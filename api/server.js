const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const config = require("./config.json");
const validators = require("./validator");
const registro = require("./registro");

app.post("/estacionamento", async (req, res) => {
    const estacionamento = req.body;

    // Salva o log
    registro('estacionamento', estacionamento);

    if (!await validators.VerificaSePodeMostrarNaTela('E', estacionamento)) {
        return res.status(500).send({
            error: "Video em execução",
            details: "Está rodando um vídeo no momento, tente mais tarde."
        });
    }

    try {
        const response = await axios.post('http://' + config.ip + '/v1/message/' + config.idestacionamento + '/trigger', estacionamento);
        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send({
            error: error.message,
            details: error.response?.data,
        });
    }
});

app.post("/kid", async (req, res) => {
    const payload = req.body;

    // Salva o log
    registro('kid', payload);

    if (!await validators.VerificaSePodeMostrarNaTela('K', payload)) {
        return res.status(500).send({
            error: "Video em execução",
            details: "Está rodando um vídeo no momento, tente mais tarde."
        });
    }

    try {
        const response = await axios.post('http://' + config.ip + '/v1/message/' + config.idkids + '/trigger', payload);
        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send({
            error: error.message,
            details: error.response?.data,
        });
    }
});


app.get("/validaPP", async (req, res) => {
    const urlKids = `http://${config.ip}/v1/capture/settings`;
    
    try {
        const response = await axios.get(urlKids);
        res.status(response.status).send({ conectadoPP: true, data: response.data });
    } catch (error) {
        res.status(error.response?.status || 500).send({
            conectadoPP: false,
            erro: error.message,
            details: error.response?.data,
        });
    }
});

app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});
