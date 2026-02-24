// utils.js
import { mostrarToast, mostrarAlertaElegante } from './toast.js';

export function darFeedback() {
    if (navigator.vibrate) { navigator.vibrate(15); }
    try {
        if (!window.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            window.audioCtx = new AudioContext();
        }
        if (window.audioCtx.state === 'suspended') { window.audioCtx.resume(); }
        const osc = window.audioCtx.createOscillator();
        const gain = window.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, window.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, window.audioCtx.currentTime + 0.02);
        gain.gain.setValueAtTime(0.15, window.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, window.audioCtx.currentTime + 0.02);
        osc.connect(gain);
        gain.connect(window.audioCtx.destination);
        osc.start(window.audioCtx.currentTime);
        osc.stop(window.audioCtx.currentTime + 0.03);
    } catch (e) {}
}

export function obterDataAtual() {
    return new Date().toLocaleDateString('pt-BR');
}

export function obterDataAmanha() {
    let hoje = new Date();
    let amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    return amanha.toLocaleDateString('pt-BR');
}

export function copiarParaClipboard(texto) {
    darFeedback();
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(texto)
            .then(() => mostrarToast("Copiado com sucesso! ✅"))
            .catch(() => copiarFallback(texto));
    } else {
        copiarFallback(texto);
    }
}

function copiarFallback(texto) {
    var textArea = document.createElement("textarea");
    textArea.value = texto;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        mostrarToast("Copiado com sucesso! ✅");
    } catch (err) {
        mostrarAlertaElegante("Erro ao copiar.");
    }
    document.body.removeChild(textArea);
}
