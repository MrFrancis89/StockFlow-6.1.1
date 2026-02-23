# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [6.0.0] - 2025-04-08

### Adicionado
- **Navegação por abas**: Interface reorganizada com as abas "Estoque" e "Compras" no menu superior, seguindo o design dos prints.
- **Seções separadas**: O conteúdo foi dividido em duas seções (`#estoque-section` e `#compras-section`), controladas por classes CSS `.tab-content` e `.active`.
- **Estilo do menu de abas**: Botões com ícone e texto, arredondados, e o ativo destacado em vermelho (`var(--btn-danger)`).
- **Sistema de novidades automáticas**: Ao abrir o app após uma atualização, um modal exibe as principais mudanças da nova versão.
- **Versionamento dinâmico**: O título agora mostra "StockFlow Pro" seguido da versão atual (lida da constante `VERSAO_ATUAL`).

### Alterado
- **Nome do projeto**: Restaurado para "StockFlow Pro".
- **Título principal**: Atualizado via JavaScript para incluir a versão.

### Corrigido
- Todas as funcionalidades anteriores permanecem intactas.

---

## [5.3.1] - 2025-04-08

### Adicionado
- **Dica de swipe na primeira execução**: Um toast informativo é exibido uma única vez após o carregamento da lista, explicando que é possível deslizar os itens para a esquerda para acessar as opções "Apagar" e "Configurar alerta". Essa dica é controlada por uma flag no `localStorage` para não se repetir.
- **Tooltips nos botões da área de adição**:
  - Botão "⭐ Fixar": agora possui o atributo `title="Adicionar item e fixar na lista padrão"`.
  - Botão "🗑️ Ocultar" (anteriormente "Padrão"): agora possui `title="Remover item da lista padrão e ocultá-lo"`.
- **Atributos de acessibilidade (`aria-label`)** nos botões de swipe:
  - Botão "Apagar": `aria-label="Apagar item"`.
  - Botão "Alerta": `aria-label="Configurar alerta"`.

### Alterado
- **Renomeação do botão "Padrão" para "Ocultar"** no formulário de adição de itens, com o objetivo de tornar sua função mais clara (remover/ocultar da lista padrão).

### Corrigido
- Pequenos ajustes de usabilidade e feedback visual para melhor compreensão das ações disponíveis.

---

## [5.3.0] - 2025-03-15 (data aproximada)

### Versão inicial com as seguintes funcionalidades principais:
- Lista de estoque categorizada automaticamente.
- Adição de itens com opção de fixar na lista padrão.
- Remoção de itens da lista padrão (ocultação).
- Swipe em itens para apagar ou configurar alertas de estoque mínimo/máximo.
- Calculadora integrada para entrada de quantidades.
- Reconhecimento de voz para busca e adição de produtos.
- Tema claro/escuro.
- Exportação e importação de listas em JSON.
- Geração de lista de compras baseada em itens marcados.
- Compartilhamento via WhatsApp e cópia para área de transferência.
- Lupa flutuante com funcionalidade de busca e duplo toque para ativar microfone.
