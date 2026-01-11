async function generateCodes() {
    const codes = document.getElementsByName("codes")[0].value;
    const splitSelect = document.getElementsByName("splitSelect")[0].value;
    const codeTypeSelect = document.getElementsByName("codeTypeSelect")[0].value;

    if (codes !== "") {
        const res = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({codes, splitSelect, codeTypeSelect})
        })
    
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
    
        const a = document.createElement('a')
        a.href = url
        a.download = 'codes.zip'
        a.click()
        URL.revokeObjectURL(url)

        document.getElementsByName("codes")[0].value = "";
    } else {
        alert("Le champ 'code(s)' ne peut pas être vide");
    }

}