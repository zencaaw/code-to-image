const express = require('express');
const path = require('path');
const bwipjs = require('bwip-js');
const JSZip = require('jszip');

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

            const safeName = code.replace(/[^a-z0-9-_]/gi, '_');
            zip.file(`${safeName}.png`, png);
        });

        await Promise.all(promises);
    
        const buffer = await zip.generateAsync({ type: 'nodebuffer' });
    
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=codes.zip');
        res.send(buffer);
    } catch(e) {
        alert(e);
    }
})

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
