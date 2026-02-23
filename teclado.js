// teclado.js
import { abrirCalculadora } from './calculadora.js';

export function ativarModoTeclado(input) {
    if (!input) return;
    input.removeAttribute('readonly');
    input.classList.add('modo-teclado');
    input.focus();

    let parent = input.parentNode;
    if (window.getComputedStyle(parent).position === 'static') {
        parent.style.position = 'relative';
    }
    if (!parent.classList.contains('input-com-calc')) {
        parent.classList.add('input-com-calc');
    }
    let oldIcon = parent.querySelector('.btn-calc-revert');
    if (oldIcon) oldIcon.remove();

    let icon = document.createElement('span');
    icon.className = 'btn-calc-revert';
    icon.innerHTML = '🧮';
    icon.setAttribute('title', 'Usar calculadora');
    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        input.setAttribute('readonly', true);
        input.classList.remove('modo-teclado');
        icon.remove();
        parent.classList.remove('input-com-calc');
        parent.style.position = '';
        abrirCalculadora(input);
    });
    parent.appendChild(icon);
}
