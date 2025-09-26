# Checklist de melhorias de UI/UX do Novo Tetris

Status legendas: [ ] pendente · [x] concluído · [~] em validação

## Quick Wins
- [x] Consolidar scoreboard (lista, tamanhos e divisores)
  - Aceite: estilos sem sobreposição; itens com divisória sutil; espaçamento regular.
  - Arquivos: new-tetris.css
- [x] Aplicar `.panel--mini` nos painéis “Próxima” e “Hold”
  - Aceite: canvas centralizado; título com espaçamento consistente; altura mínima uniforme.
  - Arquivos: new-tetris.html, new-tetris.css
- [ ] Unificar estilos de botão
  - Ações: remover duplicatas; manter apenas a versão com `var(--panel-border-color)` + `min-height`; hover e foco visível consistentes.
  - Aceite: todos os botões têm o mesmo visual, inclusive estados hover/focus/disabled.
  - Arquivos: new-tetris.css

## Resoluções e densidade
- [~] Consolidar tokens por resolução (compact, small, medium, large)
  - Ações: garantir blocos únicos para densidade e tipografia; usar variáveis (`--sidebar-gap`, `--panel-padding`, `--mini-size`, `--score-font-size`).
  - Aceite: alternar no select preserva alinhamento e densidade sem recortes/overflow.
  - Arquivos: new-tetris.css, new-tetris.html, newtetris/main.js, newtetris/settings.js
- [ ] Ajustar `clamp` tipográfico por resolução
  - Ações: revisar limites para títulos (.panel h2), lista de atalhos e scoreboard.
  - Aceite: legibilidade consistente sem saltos abruptos ao trocar resolução.
  - Arquivos: new-tetris.css

## Acessibilidade e UX
- [~] Foco visível e navegação por teclado
  - Ações: garantir outline em botões e selects; ordem lógica de tabulação.
  - Aceite: operar configurações via teclado com foco evidente.
  - Arquivos: new-tetris.css, newtetris/controls.js
- [ ] Reduzir movimento
  - Ações: honrar `prefers-reduced-motion` em efeitos.
  - Aceite: sem animações intrusivas quando preferência está ativa.
  - Arquivos: new-tetris.css
- [ ] Contraste e cores
  - Ações: validar contraste em dark/light (`--divider-color`, painel, texto).
  - Aceite: AA mínimo em textos e divisórias (≥ 4.5:1 ideal).
  - Arquivos: new-tetris.css

## Tema e persistência
- [~] Persistência de tema e resolução
  - Ações: confirmar `applyTheme` e `applyResolution` salvando/restaurando corretamente.
  - Aceite: após reload, tema/resolução permanecem conforme seleção.
  - Arquivos: newtetris/main.js, newtetris/settings.js

## Performance e render
- [ ] Canvas: tamanhos e pixel ratio
  - Ações: revisar dimensões por resolução; `image-rendering: pixelated` nos mini-cards.
  - Aceite: peças nítidas, sem blur nem serrilhado exagerado.
  - Arquivos: newtetris/render.js, newtetris/main.js, new-tetris.css
- [ ] Carga de assets/sons
  - Ações: atrasar carregamento não essencial; evitar travar UI.
  - Aceite: início de jogo fluido.
  - Arquivos: newtetris/audio.js

## Estrutura e manutenção
- [ ] Limpeza final de duplicidades e comentários temporários
  - Ações: remover placeholders como “duplicata removida” ao concluir consolidações.
  - Aceite: CSS enxuto com comentários úteis.
  - Arquivos: new-tetris.css
- [ ] Componentização leve
  - Ações: utilitários e padrões previsíveis (.panel--mini, .status-pill, .settings-grid).
  - Aceite: reaproveitamento sem regressões.
  - Arquivos: new-tetris.html, new-tetris.css

## Roteiro de validação (por release)
1) Abrir http://localhost:8001/new-tetris.html e alternar Resolução: Compacta, Baixa, Média, Alta.
2) Conferir: alinhamento de painéis, scoreboard (spacing + divisor), mini-cards (canvas central e títulos), botões (hover/focus).
3) Alternar Tema claro/escuro e checar contraste.
4) Recarregar página para validar persistência.
5) Verificar `prefers-reduced-motion`.
6) Checklist de regressão curta: sem overflow em sidebar, sem corte do canvas, sem erros visíveis.