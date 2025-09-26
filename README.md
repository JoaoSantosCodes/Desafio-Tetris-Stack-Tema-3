# Desafio Tetris Stack - Controle de Peças com Estruturas de Dados

Bem-vindo ao desafio **"Tetris Stack"**! Neste jogo inspirado nas mecânicas clássicas de montagem de peças, o jogador deve organizar, reservar e manipular peças em tempo real. Para isso, você, como programador, será responsável por implementar as estruturas de controle que regem a lógica das peças.

A empresa **ByteBros**, especializada em jogos educacionais de lógica e programação, contratou você para desenvolver o sistema de gerenciamento de peças, utilizando estruturas como **fila circular** e **pilha**.

O desafio está dividido em três níveis: **Novato**, **Aventureiro** e **Mestre**, com cada nível adicionando mais complexidade ao anterior.  
**Você deve escolher qual desafio deseja realizar.**

🚨 **Atenção:** O nível Novato foca apenas na fila de peças, usando conceitos básicos de structs, arrays e modularização.

## 🎮 Nível Novato: Fila de Peças Futuras

No nível Novato, você criará o sistema inicial de controle das peças futuras do jogo Tetris Stack. As peças possuem um **nome** (representando o tipo, como 'I', 'O', 'T', 'L') e um **id** exclusivo (identificador numérico).

🚩 **Objetivo:** Criar um programa em C que simula uma **fila circular** de 5 peças com as seguintes funcionalidades:

*   Visualizar a fila atual
*   Jogar (remover) a peça da frente
*   Inserir automaticamente uma nova peça no final da fila

⚙️ **Funcionalidades do Sistema:**

*   Inicializar a fila com 5 peças geradas automaticamente.
*   Permitir que o usuário:
    *   Jogue uma peça (dequeue)
    *   Insira uma nova peça (enqueue)
    *   Visualize o estado atual da fila
*   Manter a fila circular, reaproveitando o espaço.

📥 **Entrada** e 📤 **Saída de Dados:**

*   O programa utiliza menus via terminal.
*   A cada ação, o estado atualizado da fila é exibido com `printf`.

**Simplificações para o Nível Novato:**

*   Trabalhe **apenas com a fila**.
*   A fila deve conter **exatamente 5 elementos**.
*   Use uma função `gerarPeca()` para criar automaticamente novas peças.
*   Utilize structs e arrays. Não implemente pilha.

## 🛡️ Nível Aventureiro: Reserva de Peças com Pilha

No nível Aventureiro, você irá expandir o sistema com uma **pilha de reserva de peças**, que permite ao jogador guardar peças para uso posterior.

🆕 **Diferença em relação ao Nível Novato:**

*   Introdução da **pilha linear** para reservar peças.
*   A fila permanece sempre cheia com 5 peças.

⚙️ **Funcionalidades do Sistema:**

*   Além das opções anteriores, o usuário pode:
    *   Reservar a peça da frente da fila (push)
    *   Usar uma peça reservada (pop)
*   A fila continua funcionando com inserção automática.
*   A pilha tem **capacidade máxima de 3 peças**.

📥 **Entrada** e 📤 **Saída de Dados:**

*   Menu com 4 opções:
    * `1` - Jogar peça
    * `2` - Reservar peça
    * `3` - Usar peça reservada
    * `0` - Sair
*   O estado da fila e da pilha é exibido após cada ação.

**Simplificações para o Nível Intermediário:**

*   A pilha não permite escolha da posição.
*   O jogador **não escolhe o tipo da peça** — todas são geradas automaticamente.
*   Não há comparação nem troca direta entre as estruturas.

## 🏆 Nível Mestre: Integração Total com Estratégia

No nível Mestre, você implementará uma **integração complexa** entre a fila e a pilha, simulando funcionalidades avançadas como **troca**, **desfazer** e **inversão de peças**.

🆕 **Diferença em relação ao Nível Aventureiro:**

*   Operações mais complexas e estratégicas entre as estruturas.
*   Manipulação reversível do estado das peças.

⚙️ **Funcionalidades do Sistema:**

*   Menu com múltiplas ações:
    * `1` - Jogar peça
    * `2` - Reservar peça
    * `3` - Usar peça reservada
    * `4` - Trocar peça do topo da pilha com a da frente da fila
    * `5` - Desfazer última jogada
    * `6` - Inverter fila com pilha
    * `0` - Sair
*   Controle de fila circular e pilha de reserva com atualização a cada ação.

📥 **Entrada** e 📤 **Saída de Dados:**

*   Mesmo estilo dos níveis anteriores.
*   Agora exige controle total do fluxo e da memória entre as estruturas.

**Observações:**

*   Cada operação deve ser segura e manter a integridade dos dados.
*   A complexidade exige modularização clara e funções bem separadas.

## 🏁 Conclusão

Ao concluir qualquer um dos níveis, você terá exercitado conceitos fundamentais de estrutura de dados, como **fila circular** e **pilha**, em um contexto prático de desenvolvimento de jogos.

Boa sorte e divirta-se programando!

Equipe de Ensino - ByteBros

```

## Versão Web Modular do Tetris (JavaScript)

Esta versão web foi reconstruída de forma independente e modular, sem interferir no projeto original em C. A página de entrada é `new-tetris.html`, que carrega módulos ES em `newtetris/`.

- Como executar localmente:
  - Já existe um servidor local comum: abra http://localhost:8000/new-tetris.html
  - Alternativamente, rode: `python -m http.server 8000` e acesse a mesma URL.
- Principais funcionalidades de UX/UI:
  - Próxima peça e Reserva (Hold) com mini-canvases
  - Ghost piece (sombra de queda)
  - Animação de limpeza de linhas
  - Status pill dinâmico (Pronto/Jogando/Pausado/Fim)
  - Botões com estados, tooltips e atalhos de teclado
- Atalhos:
  - Setas: mover/rotacionar/acelerar
  - Espaço: queda rápida
  - P: pausar/retomar
  - C: reservar (hold)
  - Enter: iniciar
  - R: reiniciar

Estrutura dos módulos (pasta `newtetris/`):
- `consts.js`: dimensões, tempos e tetrominós/cores
- `board.js`: operações do tabuleiro (criação, merge e limpeza de linhas)
- `pieces.js`: geração, rotação, colisão e clone de peça
- `render.js`: renderização do tabuleiro, peça, ghost e miniaturas
- `hud.js`: placar, status e estados de botões
- `controls.js`: mapeamento de botões/teclado com acessibilidade
- `game.js`: loop principal, spawn/hold, movimentos, lock, limpeza e pontuação
- `main.js`: bootstrap que conecta DOM ↔ motor do jogo

Arquivo HTML:
- `new-tetris.html`: carrega `type="module"` apontando para `newtetris/main.js` e contém a interface (canvas, HUD, painéis Next/Hold e controles).

### Guia rápido: como jogar (web)
1) Abra http://localhost:8000/new-tetris.html
2) Pressione Enter para iniciar. Use as setas para mover (← →), rotacionar (↑) e acelerar (↓)
3) Espaço para queda rápida; P para pausar/retomar; C para reservar (hold); R para reiniciar
4) Acompanhe o placar, nível e linhas no painel; veja Próxima e Reserva nas miniaturas
5) O status pill indica o estado: Pronto, Jogando, Pausado ou Fim

### Arquitetura de módulos (diagrama simples)
```
newtetris/
  consts.js     --> Constantes globais (dimensões, tempos, tetrominós, cores)
  board.js      --> Criação/merge/aplicação de linhas do tabuleiro
  pieces.js     --> Geração, rotação, colisão e clone de peças
  render.js     --> Desenho do tabuleiro, peça, ghost e miniaturas
  hud.js        --> Atualização de status, placar e estados de botões
  controls.js   --> Bind de botões/teclado + acessibilidade
  game.js       --> Loop principal, spawn/hold, movimentos, lock e pontuação
  main.js       --> Bootstrap: conecta DOM ↔ Game ↔ HUD/Render/Controls

Fluxo básico:
main.js -> instancia Game + bind de controles
Game -> usa board/pieces para lógica + render para desenhar + hud para UI
```

### Configurações futuras (roadmap de UI/UX)
- Áudio com toggle no HUD:
  - Efeitos para queda, travamento e limpeza de linhas
  - Preferência persistida em localStorage (ligado/desligado)
- Tema claro/escuro:
  - Variáveis CSS (custom properties) para cores de fundo, grade e tetrominós
  - Toggle no HUD com persistência em localStorage
- Velocidade e dificuldade:
  - Ajuste de queda inicial e incremento por nível
  - Modo “Maratona” vs “Relax” (sem game over) com impacto no placar
- Controles personalizáveis:
  - Remapeamento de teclas via UI, com validação e fallback
  - Exibição dinâmica dos atalhos nos tooltips e aria-keyshortcuts
- Acessibilidade adicional:
  - Suporte a navegação por teclado em todos os controles e foco visível
  - Preferência “reduzir animações” (prefers-reduced-motion)
- Persistência de progresso:
  - Melhor tabela de recordes (high score) por modo
  - Última configuração reaberta automaticamente ao carregar a página

Como próximo passo, recomendo começarmos por “Áudio com toggle no HUD” (rápido impacto na percepção). Se concordar, implemento um módulo newtetris/audio.js, integro no Game e adiciono o controle no HUD.

