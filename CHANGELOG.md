# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [6.1.1] - 2025-04-08

### Corrigido
- **Microfone no duplo toque da lupa**: Agora o microfone é ativado corretamente ao dar duplo toque na lupa. Ajustes no temporizador garantem que o overlay de busca abra antes da ativação do microfone.
- Pequenas melhorias de estabilidade e confiabilidade no reconhecimento de voz.

---

## [6.1.0] - 2025-04-08

### Adicionado
- Alternância entre calculadora e teclado nativo nos campos de quantidade.
- Ícone de retorno à calculadora (🧮) dentro do campo quando em modo teclado.
- Parser avançado de frações (ex: `1/2`, `2 1/3` → decimal).

---

## [6.0.0] - 2025-04-08

### Adicionado
- Navegação por abas: Estoque e Compras.
- Interface reorganizada seguindo novo design.
- Sistema de novidades automáticas ao atualizar (modal "O que há de novo").
- Versão dinâmica exibida no título.

### Alterado
- Nome do projeto restaurado para StockFlow Pro.

---

## [5.3.1] - 2025-04-08

### Adicionado
- Dica de swipe na primeira execução.
- Tooltips nos botões Fixar e Ocultar.
- Acessibilidade nos botões de swipe.

### Alterado
- Renomeação do botão "Padrão" para "Ocultar".

---

## [5.3.0] - 2025-03-15

### Versão inicial
- Lista categorizada automaticamente.
- Swipe para apagar/configurar alertas.
- Calculadora integrada.
- Reconhecimento de voz.
- Tema claro/escuro.
- Exportação/importação JSON.
- Lista de compras baseada em itens marcados.
- Compartilhamento WhatsApp e cópia.
- Lupa flutuante com busca e duplo toque para microfone.
