const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('id');
const BACKEND_URL = "https://activism-suggest-probation.ngrok-free.dev/save-data";

if (!linkId) {
    document.getElementById('status').innerText = "err mauvais lien.";
} else {
    const donnéesAEnvoyer = { id_lien: linkId };

    fetch(BACKEND_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "any-value"
        },
        body: JSON.stringify(donnéesAEnvoyer)
    })
        .then(() => {
            document.getElementById('status').innerText = "Vérification réussie ! Vous pouvez retourner à votre activité précédente.";
        })
        .catch(() => {
            document.getElementById('status').innerText = "Erreur de connexion au serveur";
        });
}