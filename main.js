// main.js
import { produtosPadrao } from './produtos.js';
import { identificarCategoria } from './categorias.js';
import { 
    STORAGE_KEYS, carregarDados, salvarDados, carregarOcultos, carregarMeus,
    carregarTema, salvarTema, carregarPosicaoLupa, salvarPosicaoLupa,
    dicaSwipeFoiVista, marcarDicaSwipeVista, carregarUltimaVersao, salvarUltimaVersao
} from './storage.js';
import { renderizarListaCompleta, coletarDadosDaTabela, atualizarStatusSave, salvarEAtualizar } from './ui.js';
import { atualizarPainelCompras, gerarTextoCompras } from './compras.js';
import { darFeedback, obterDataAtual, obterDataAmanha, copiarParaClipboard } from './utils.js';
import { mostrarToast, mostrarAlertaElegante } from './toast.js';
import { mostrarConfirmacao, configurarListenersConfirm } from './confirm.js';
import { abrirCalculadora, fecharCalculadora, calcDigito, calcSalvar, getInputCalculadoraAtual } from './calculadora.js';
import { ativarModoTeclado } from './teclado.js';
import { abrirModalAlerta, fecharModalAlerta, salvarAlerta, verificarAlertas } from './alerta.js';
import { parseAndUpdateQuantity } from './parser.js';
import { initSwipe } from './swipe.js';
import { iniciarNavegacao } from './navegacao.js';
import { alternarCheck, alternarTodos } from './eventos.js';

// Constantes
const VERSAO_ATUAL = "v6.0.0";

// Release notes
const releaseNotes = {
    "v6.0.0": `✨ **StockFlow Pro v6.0.0**

- Navegação por abas: Estoque e Compras.
- Interface reorganizada seguindo novo design.
- Sistema de novidades automáticas ao atualizar.
- Versão dinâmica exibida no título.
- Botão na calculadora para alternar para teclado.
- Ícone de retorno à calculadora nos campos.
- Parser de frações (ex: 1/2, 2 1/3 → decimal).`,
    "v5.3.1": `🔧 **v5.3.1**

- Dica de swipe na primeira execução.
- Tooltips nos botões Fixar e Ocultar.
- Acessibilidade nos botões de swipe.`,
    "v5.3.0": `🚀 **v5.3.0**

- Lista categorizada automaticamente.
- Swipe para apagar/configurar alertas.
- Calculadora integrada.
- Reconhecimento de voz.
- Tema claro/escuro.
- Exportação/importação JSON.`
};

// ===== FUNÇÕES ESPECÍFICAS QUE AINDA NÃO FORAM MODULARIZADAS =====
// (Aquelas que dependem de muitas importações ou são específicas do app)

function verificarNovidades() {
    const ultimaVersaoVista = carregarUltimaVersao();
    if (ultimaVersaoVista !== VERSAO_ATUAL) {
        if (releaseNotes[VERSAO_ATUAL]) {
            mostrarNovidades(releaseNotes[VERSAO_ATUAL]);
        }
        salvarUltimaVersao(VERSAO_ATUAL);
    }
}

function mostrarNovidades(texto) {
    const modal = document.getElementById('modal-whatsnew');
    const content = document.getElementById('whatsnew-content');
    content.innerText = texto;
    modal.style.display = 'flex';
}

function atualizarTituloPrincipal() {
    const titulo = document.getElementById('titulo-principal');
    titulo.innerHTML = `StockFlow Pro <span style="color: var(--btn-danger); font-size: 12px; margin-left: 5px;">${VERSAO_ATUAL}</span>`;
}

function atualizarTitulos() {
    document.getElementById("titulo-compras").innerText = "LISTA " + obterDataAmanha();
}

function carregarListaPadrao() {
    var listaCombinada = [];
    var ocultosSistema = carregarOcultos();
    produtosPadrao.forEach(p => {
        var d = p.split("|");
        if (!ocultosSistema.includes(d[0].toLowerCase())) {
            listaCombinada.push({ n: d[0], q: "", u: d[1], c: false, min: null, max: null });
        }
    });
    var favoritosUsuario = carregarMeus();
    favoritosUsuario.forEach(item => {
        if (!listaCombinada.some(i => i.n.toLowerCase() === item.n.toLowerCase())) {
            listaCombinada.push({ n: item.n, q: "", u: item.u, c: false, min: null, max: null });
        }
    });
    renderizarListaCompleta(listaCombinada);
}

function filtrarGeral() {
    var tBusca = document.getElementById('filtroBusca').value.toLowerCase();
    var tSelect = document.getElementById('filtroSelect').value.toLowerCase();
    document.querySelectorAll("#lista-itens-container tr:not(.categoria-header-row)").forEach(r => {
        var nome = r.querySelector(".nome-prod").innerText.toLowerCase();
        if (nome.includes(tBusca) && (tSelect === "" || nome === tSelect)) {
            r.style.display = "";
        } else {
            r.style.display = "none";
        }
    });
    let headers = document.querySelectorAll(".categoria-header-row");
    headers.forEach(header => {
        let proximoElem = header.nextElementSibling;
        let temItemVisivel = false;
        while (proximoElem && !proximoElem.classList.contains("categoria-header-row")) {
            if (proximoElem.style.display !== "none") {
                temItemVisivel = true;
                break;
            }
            proximoElem = proximoElem.nextElementSibling;
        }
        header.style.display = temItemVisivel ? "" : "none";
    });
}

function atualizarDropdown() {
    var select = document.getElementById('filtroSelect');
    var v = select.value;
    select.innerHTML = '<option value="">📂 ITENS</option>';
    var nomes = [];
    document.querySelectorAll(".nome-prod").forEach(td => nomes.push(td.innerText.replace(/(\r\n|\n|\r)/gm, " ").trim()));
    nomes.sort().forEach(n => {
        var o = document.createElement("option");
        o.value = n;
        o.text = n;
        select.add(o);
    });
    select.value = v;
}

function adicionarManual(salvarNoPadrao) {
    var p = document.getElementById("novoProduto").value.trim();
    var q = document.getElementById("novoQtd").value.trim();
    var u = document.getElementById("novoUnidade").value;

    if (!p) { mostrarToast("⚠️ Digite o nome do produto!"); return; }
    darFeedback();

    var dados = carregarDados() || [];

    if (dados.some(item => item.n.toLowerCase() === p.toLowerCase())) {
        mostrarToast("⚠️ O item já existe na lista!");
        return;
    }

    dados.push({ n: p, q: q, u: u, c: false, min: null, max: null });
    renderizarListaCompleta(dados);
    salvarDados(dados);

    if (salvarNoPadrao) {
        var favoritosUsuario = carregarMeus();
        if (!favoritosUsuario.some(item => item.n.toLowerCase() === p.toLowerCase())) {
            favoritosUsuario.push({ n: p, u: u });
            salvarMeus(favoritosUsuario);
            mostrarToast("Item FIXADO! ⭐");
        }
    }
    document.getElementById("novoProduto").value = "";
    document.getElementById("novoQtd").value = "";
}

function removerDoPadrao() {
    var p = document.getElementById("novoProduto").value.trim();
    if (!p) { mostrarToast("⚠️ Digite o nome para remover!"); return; }
    darFeedback();
    var favoritosUsuario = carregarMeus();
    var novaListaFavoritos = favoritosUsuario.filter(item => item.n.toLowerCase() !== p.toLowerCase());
    salvarMeus(novaListaFavoritos);
    var ocultosSistema = carregarOcultos();
    if (!ocultosSistema.includes(p.toLowerCase())) {
        ocultosSistema.push(p.toLowerCase());
        salvarOcultos(ocultosSistema);
    }
    document.querySelectorAll("#lista-itens-container tr:not(.categoria-header-row)").forEach(r => {
        var nomeTabela = r.querySelector(".nome-prod").innerText.toLowerCase();
        if (nomeTabela === p.toLowerCase()) {
            r.remove();
        }
    });
    const dados = coletarDadosDaTabela();
    salvarDados(dados);
    atualizarDropdown();
    document.getElementById("novoProduto").value = "";
    document.getElementById("novoQtd").value = "";
}

function alternarLista() {
    darFeedback();
    var tabelaWrapper = document.querySelector(".table-wrapper");
    var btnToggle = document.getElementById("btn-toggle-lista");
    if (tabelaWrapper.style.display === "none") {
        tabelaWrapper.style.display = "block";
        btnToggle.innerHTML = "🔽 Ocultar Lista de Estoque";
    } else {
        tabelaWrapper.style.display = "none";
        btnToggle.innerHTML = "▶️ Mostrar Lista de Estoque";
    }
}

function alternarTema() {
    darFeedback();
    document.body.classList.toggle('light-mode');
    salvarTema(document.body.classList.contains('light-mode') ? 'claro' : 'escuro');
}

function resetarTudo() {
    mostrarConfirmacao("ATENÇÃO: Restaurar lista de fábrica?", () => {
        localStorage.removeItem(STORAGE_KEYS.dados);
        localStorage.removeItem(STORAGE_KEYS.ocultos);
        location.reload();
    });
}

function iniciarNovoDia() {
    mostrarConfirmacao("ZERAR QUANTIDADES?", () => {
        var dados = carregarDados() || [];
        dados.forEach(item => {
            item.q = "";
            item.c = false;
        });
        salvarDados(dados);
        location.reload();
    }, 'sucesso');
}

function salvarListaNoCelular() {
    var dados = localStorage.getItem(STORAGE_KEYS.dados);
    if (!dados || dados === "[]") return;
    darFeedback();
    var blob = new Blob([dados], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;

    var data = new Date();
    var dia = String(data.getDate()).padStart(2, '0');
    var mes = String(data.getMonth() + 1).padStart(2, '0');
    var ano = data.getFullYear();
    var horas = String(data.getHours()).padStart(2, '0');
    var minutos = String(data.getMinutes()).padStart(2, '0');
    var nomeArquivo = `ESTOQUE_${dia}-${mes}-${ano}_${horas}h${minutos}.json`;

    a.download = nomeArquivo;
    a.click();
}

function carregarListaDoCelular(event) {
    var f = event.target.files[0];
    var r = new FileReader();
    r.onload = function(e) {
        let dados = JSON.parse(e.target.result);
        dados = dados.map(item => ({
            ...item,
            min: item.min !== undefined ? item.min : null,
            max: item.max !== undefined ? item.max : null
        }));
        localStorage.setItem(STORAGE_KEYS.dados, JSON.stringify(dados));
        location.reload();
    };
    r.readAsText(f);
}

function autoPreencherUnidade() {
    var inputNome = document.getElementById("novoProduto").value.toLowerCase().trim();
    var match = produtosPadrao.find(p => p.split("|")[0].toLowerCase().startsWith(inputNome));
    if (match) {
        document.getElementById("novoUnidade").value = match.split("|")[1];
    }
}

function compartilharEstoque() {
    window.open("https://wa.me/?text=" + encodeURIComponent(gerarTextoEstoque()), '_blank');
}
function copiarEstoque() {
    copiarParaClipboard(gerarTextoEstoque());
}
function compartilharComprasZap() {
    window.open("https://wa.me/?text=" + encodeURIComponent(gerarTextoCompras()), '_blank');
}
function copiarCompras() {
    copiarParaClipboard(gerarTextoCompras());
}

function gerarTextoEstoque() {
    let t = "*ESTOQUE " + obterDataAtual() + "*\n\n";
    let itens = [];
    document.querySelectorAll("#lista-itens-container tr:not(.categoria-header-row)").forEach(r => {
        let cols = r.querySelectorAll("td");
        let nome = cols[1].querySelector('.nome-prod').innerText.replace(/(\r\n|\n|\r)/gm, " ").trim();
        let qTxt = cols[2].querySelector("input").value.trim();
        let unidade = cols[3].querySelector("select").options[cols[3].querySelector("select").selectedIndex].text;
        if (qTxt !== "") { itens.push(`${nome}: ${qTxt} ${unidade}`); }
        else { itens.push(`${nome}:   ${unidade}`); }
    });
    itens.sort();
    itens.forEach(i => t += `${i}\n`);
    return t;
}

function mostrarDicaSwipe() {
    if (!dicaSwipeFoiVista()) {
        setTimeout(() => {
            mostrarToast("👆 Deslize os itens para esquerda para apagar ou configurar alerta");
            marcarDicaSwipeVista();
        }, 1000);
    }
}

// ===== CONFIGURAÇÃO DE EVENT LISTENERS =====
function configurarEventListeners() {
    document.querySelector('.btn-theme').addEventListener('click', alternarTema);

    document.querySelectorAll('.calc-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const val = e.target.dataset.calc;
            if (val === 'OK') calcSalvar();
            else calcDigito(val);
        });
    });
    document.querySelector('.calc-close').addEventListener('click', fecharCalculadora);

    document.querySelectorAll('.btn-limpar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.limpar;
            if (id) {
                document.getElementById(id).value = '';
                document.getElementById(id).focus();
                if (id === 'filtroBusca') filtrarGeral();
            }
        });
    });

    document.getElementById('btn-mic-prod').addEventListener('click', (e) => toggleMic('produto', e));
    document.getElementById('btn-mic-busca').addEventListener('click', (e) => toggleMic('busca', e));

    document.getElementById('add-btn').addEventListener('click', () => adicionarManual(false));
    document.getElementById('add-star-btn').addEventListener('click', () => adicionarManual(true));
    document.getElementById('remove-star-btn').addEventListener('click', removerDoPadrao);

    document.getElementById('btn-toggle-lista').addEventListener('click', alternarLista);

    document.getElementById('btn-compartilhar-estoque').addEventListener('click', () => { darFeedback(); compartilharEstoque(); });
    document.getElementById('btn-copiar-estoque').addEventListener('click', copiarEstoque);
    document.getElementById('btn-compartilhar-compras').addEventListener('click', () => { darFeedback(); compartilharComprasZap(); });
    document.getElementById('btn-copiar-compras').addEventListener('click', copiarCompras);

    document.getElementById('btn-novo-dia').addEventListener('click', iniciarNovoDia);
    document.getElementById('btn-exportar').addEventListener('click', salvarListaNoCelular);
    document.getElementById('btn-importar').addEventListener('click', () => { darFeedback(); document.getElementById('input-arquivo').click(); });
    document.getElementById('btn-reset').addEventListener('click', resetarTudo);
    document.getElementById('input-arquivo').addEventListener('change', carregarListaDoCelular);

    document.getElementById('check-todos').addEventListener('change', (e) => alternarTodos(e.target));

    document.getElementById('lista-itens-container').addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') alternarCheck(e.target);
    });

    document.getElementById('lista-itens-container').addEventListener('blur', (e) => {
        if (e.target.classList.contains('nome-prod')) salvarEAtualizar();
        if (e.target.classList.contains('input-qtd-tabela') && !e.target.hasAttribute('readonly')) {
            parseAndUpdateQuantity(e.target);
        }
    }, true);

    document.getElementById('lista-itens-container').addEventListener('change', (e) => {
        if (e.target.classList.contains('select-tabela')) {
            const dados = coletarDadosDaTabela();
            salvarDados(dados);
        }
    });

    document.getElementById('lista-itens-container').addEventListener('click', (e) => {
        if (e.target.classList.contains('input-qtd-tabela')) {
            if (!e.target.hasAttribute('readonly')) return;
            abrirCalculadora(e.target);
        }
    });

    document.getElementById('novoQtd').addEventListener('click', (e) => {
        if (!e.target.hasAttribute('readonly')) return;
        abrirCalculadora(e.target);
    });

    document.getElementById('novoQtd').addEventListener('blur', (e) => {
        if (!e.target.hasAttribute('readonly')) {
            parseAndUpdateQuantity(e.target);
        }
    });

    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && (e.target.classList.contains('input-qtd-tabela') || e.target.id === 'novoQtd')) {
            e.preventDefault();
            e.target.blur();
        }
    });

    document.getElementById('filtroBusca').addEventListener('input', filtrarGeral);
    document.getElementById('filtroSelect').addEventListener('change', filtrarGeral);

    document.getElementById('btn-scroll-top').addEventListener('click', () => { darFeedback(); window.scrollTo(0, 0); });
    document.getElementById('btn-scroll-bottom').addEventListener('click', () => { darFeedback(); window.scrollTo(0, document.body.scrollHeight); });

    document.getElementById('salvar-alerta').addEventListener('click', salvarAlerta);
    document.querySelectorAll('.fechar-modal-alerta').forEach(btn => {
        btn.addEventListener('click', fecharModalAlerta);
    });

    document.getElementById('calc-btn-teclado').addEventListener('click', function(e) {
        e.stopPropagation();
        const input = getInputCalculadoraAtual();
        if (input) {
            fecharCalculadora();
            ativarModoTeclado(input);
        } else {
            mostrarToast("Clique em um campo de quantidade primeiro.");
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            if (e.target.id === 'modal-confirm') fecharModal();
            if (e.target.id === 'modal-calc') fecharCalculadora();
            if (e.target.id === 'modal-alerta') fecharModalAlerta();
            if (e.target.id === 'modal-whatsnew') e.target.style.display = 'none';
        }
    });

    // Configura listeners do modal de confirmação
    configurarListenersConfirm();

    // Fechar modal de novidades ao clicar no X
    document.querySelectorAll('.fechar-whatsnew').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('modal-whatsnew').style.display = 'none';
        });
    });
}

// ===== INICIALIZAÇÃO =====
function iniciarApp() {
    if (carregarTema() === 'claro') { document.body.classList.add('light-mode'); }
    atualizarTituloPrincipal();
    atualizarTitulos();

    const posLupa = carregarPosicaoLupa();
    const assistiveTouch = document.getElementById('assistive-touch');
    if (posLupa) {
        assistiveTouch.style.left = posLupa.left;
        assistiveTouch.style.top = posLupa.top;
        assistiveTouch.style.bottom = 'auto';
        assistiveTouch.style.right = 'auto';
    } else {
        assistiveTouch.style.bottom = '20px';
        assistiveTouch.style.right = '15px';
        assistiveTouch.style.top = 'auto';
        assistiveTouch.style.left = 'auto';
    }

    var salvos = carregarDados();
    if (salvos && salvos.length > 0) {
        renderizarListaCompleta(salvos);
    } else {
        carregarListaPadrao();
    }
    atualizarDropdown();
    atualizarPainelCompras();
    initSwipe();
    verificarAlertas();
    mostrarDicaSwipe();
    iniciarNavegacao();
    configurarEventListeners();
    verificarNovidades();
}

// Inicia o app
iniciarApp();
