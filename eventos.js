// eventos.js
import { darFeedback } from './utils.js';
import { salvarDados } from './storage.js';
import { coletarDadosDaTabela } from './ui.js';
import { atualizarPainelCompras } from './compras.js';

export function alternarCheck(box) {
    darFeedback();
    var linha = box.parentElement.parentElement;
    if (box.checked) {
        linha.classList.add("linha-marcada");
    } else {
        linha.classList.remove("linha-marcada");
        document.getElementById('check-todos').checked = false;
    }
    const dados = coletarDadosDaTabela();
    salvarDados(dados);
    atualizarPainelCompras(); // <-- Atualiza a lista de compras
}

export function alternarTodos(masterBox) {
    darFeedback();
    let isChecked = masterBox.checked;
    document.querySelectorAll("#lista-itens-container tr:not(.categoria-header-row)").forEach(r => {
        if (r.style.display !== "none") {
            let box = r.querySelector("input[type='checkbox']");
            box.checked = isChecked;
            if (isChecked) {
                r.classList.add("linha-marcada");
            } else {
                r.classList.remove("linha-marcada");
            }
        }
    });
    const dados = coletarDadosDaTabela();
    salvarDados(dados);
    atualizarPainelCompras(); // <-- Atualiza a lista de compras
}
