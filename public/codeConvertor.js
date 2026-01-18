async function generateCodes(e) {
    e.preventDefault();

    const form = e.target;
    const generateButton = form.elements["generateButton"];
    const main = document.getElementsByTagName("main")[0];
    const progress = document.createElement("progress");
    const codes = form.elements["codes"];
    
    if (codes.value !== "") {
        generateButton.disabled = true;
        main.appendChild(progress);
        try {
            const codeArray = codes.value.split(form.elements["splitSelect"].value);
            const tempCanvas = document.createElement('canvas');
            const codeTypeSelect = form.elements["codeTypeSelect"].value;
            const fileFormatSelect = form.elements["fileFormatSelect"].value;
            const zip = new JSZip();

            for (const code of codeArray) {
                bwipjs.toCanvas(tempCanvas, {
                    bcid: codeTypeSelect,
                    text: code.trim(),
                    scale: 5,
                    includetext: true
                });

                const blob = await new Promise((resolve) => {
                    tempCanvas.toBlob(resolve, `image/${fileFormatSelect}`);
                });

                zip.file(`${code}.${fileFormatSelect}`, blob);
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(zipBlob);
            a.download = 'codes.zip';
            a.click();
            URL.revokeObjectURL(a.href);
    
            codes.value = "";
        } catch(e) {
            alert(e)
        } finally {
            generateButton.disabled = false;
            main.removeChild(progress);
        }
    } else {
        alert("Le champ 'code(s)' ne peut pas être vide");
    }

}