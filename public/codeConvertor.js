async function generateCodes() {
    const codes = document.getElementsByName("codes")[0];
    const splitSelect = document.getElementsByName("splitSelect")[0];
    const codeTypeSelect = document.getElementsByName("codeTypeSelect")[0];
    const main = document.getElementsByTagName("main")[0];
    const generateButton = document.getElementById("generateButton");

    if (codes.value !== "") {
        try {
            generateButton.disabled = true;
            const progress = document.createElement("progress");
            main.appendChild(progress);
            const codeArray = codes.value.split(splitSelect.value)

            const res = await fetch('/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({codes: codeArray, codeTypeSelect: codeTypeSelect.value})
            })


            if (!res.ok) {
                throw new Error(`Erreur du serveur: ${res.status} ${res.statusText}`);
            }
        
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
        
            const a = document.createElement('a')
            a.href = url
            a.download = 'codes.zip'
            a.click()
            URL.revokeObjectURL(url)
    
            codes.value = "";
            generateButton.disabled = false;
            main.removeChild(progress);
        } catch(e) {
            alert(e)
            generateButton.disabled = false;
            main.removeChild(progress);
        }
    } else {
        alert("Le champ 'code(s)' ne peut pas être vide");
    }

}