const express = require('express');
const path = require('path');
const bwipjs = require('bwip-js');
const JSZip = require('jszip');
const { error } = require('console');

const app = express()
app.use(express.json());
const PORT = 3000

app.use(express.static(path.join(__dirname, 'public')))

app.post('/generate', async (req, res) => {
    try {
        const { codes, splitSelect, codeTypeSelect } = req.body;
        const zip = new JSZip();

        const codeArray = codes.split(splitSelect);
        
        const promises = codeArray.map(async (code) => {
            const png = await bwipjs.toBuffer({
                bcid: codeTypeSelect,
                text: code.trim(),
                scale: 5,
                includetext: true
            });

            zip.file(`${code}.png`, png);
        });

        await Promise.all(promises);
    
        const buffer = await zip.generateAsync({ type: 'nodebuffer' });
    
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=codes.zip');
        res.status(200).send(buffer);
    } catch(e) {
        throw new Error("Erreur interne du serveur !");
    }
})

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
