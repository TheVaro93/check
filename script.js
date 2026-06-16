
const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('id');
const BACKEND_URL = "https://activism-suggest-probation.ngrok-free.dev/save-data";

if (!linkId) {
    document.getElementById('status').innerText = "err mauvais lien.";
} else {
    fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_lien: linkId })
    })
        .then(() => {
            document.getElementById('status').innerText = "Vérification réussie !";
        })
        .catch(() => {
            document.getElementById('status').innerText = "err connexion au serveur de verif";
        });
}