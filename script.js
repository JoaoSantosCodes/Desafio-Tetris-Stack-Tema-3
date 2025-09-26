// Tetris Expert System - JavaScript Implementation
// Baseado no sistema C original com adaptações para web

/**
 * Sistema Expert de Tetris - Versão Refinada
 * Implementa um jogo de Tetris com sistema de fila circular e pilha de reserva
 */
class TetrisExpertSystem {
    constructor() {
        // Inicialização dos elementos DOM
        this.initializeElements();
        
        // Inicialização das estruturas de dados
        this.initializeDataStructures();
        
        // Inicialização do estado do jogo
        this.initializeGameState();
        
        // Criar o grid do Tetris
        this.createTetrisGrid();
        
        // Configuração dos event listeners
        this.setupEventListeners();
        
        // Inicialização do jogo
        initializeGame.call(this);
    }
    
    // ===== MÉTODOS DE INICIALIZAÇÃO =====
    
    /**
     * Inicializa os elementos DOM necessários
     */
    initializeElements() {
        this.elements = {
            // Grid principal do jogo
            tetrisGrid: document.getElementById('tetris-grid'),
            
            // Displays de informações
            currentPieceDisplay: document.getElementById('current-piece'),
            scoreDisplay: document.getElementById('score'),
            levelDisplay: document.getElementById('level'),
            combosDisplay: document.getElementById('combos'),
            efficiencyDisplay: document.getElementById('efficiency'),
            progressFill: document.getElementById('progress-fill'), // PODE NÃO EXISTIR
            expertTip: document.getElementById('expertTip'),
            
            // Fila circular - CORRIGINDO SELETOR
            queueSlots: document.querySelectorAll('.piece-slot'), // ERA .queue-slot
            
            // Pilha de reserva
            reserveSlots: document.querySelectorAll('.reserve-slot'),
            
            // Modal de estatísticas - PODEM NÃO EXISTIR
            statsModal: document.getElementById('stats-modal'),
            totalPlaysDisplay: document.getElementById('total-plays'),
            queuePlaysDisplay: document.getElementById('queue-plays'),
            stackPlaysDisplay: document.getElementById('stack-plays'),
            reservedPiecesDisplay: document.getElementById('reserved-pieces'),
            pieceStatsGrid: document.getElementById('piece-stats-grid')
        };
        
        // Verificar elementos críticos
        this.validateCriticalElements();
        
        // Criar grid do Tetris
        this.createTetrisGrid();
    }
    
    /**
     * Valida se os elementos críticos existem
     */
    validateCriticalElements() {
        const criticalElements = ['tetrisGrid', 'currentPieceDisplay', 'scoreDisplay'];
        
        criticalElements.forEach(elementKey => {
            if (!this.elements[elementKey]) {
                console.error(`Elemento crítico não encontrado: ${elementKey}`);
            }
        });
    }
    
    /**
     * Inicializa as estruturas de dados do jogo
     */
    initializeDataStructures() {
        this.filaCircular = new FilaCircular();
        this.pilhaReserva = new PilhaReserva();
        this.sistemaExpert = new SistemaExpert();
        
        // Grid do jogo (20x10)
        this.gameGrid = Array(20).fill().map(() => Array(10).fill(0));
        
        // Células do grid para manipulação visual
        this.gridCells = [];
    }
    
    /**
     * Inicializa o estado do jogo
     */
    initializeGameState() {
        this.gameState = {
            currentPiece: null,
            score: 0,
            level: 1,
            combos: 0,
            isPlaying: false,
            gameOver: false,
            isPaused: false
        };
        
        // Estado da peça em queda
        this.fallingPiece = {
            shape: null,
            x: 4,
            y: 0,
            rotation: 0,
            tipo: null
        };
        
        // Controle de tempo
        this.gameTimer = null;
        this.dropInterval = 1000;
        this.lastDropTime = Date.now();
        
        // Contador para geração de peças
        this.contadorTipo = 0;
    }

    createTetrisGrid() {
        const grid = this.elements.tetrisGrid;
        if (!grid) {
            console.error('ERRO CRÍTICO: tetris-grid não encontrado no DOM!');
            return;
        }
        
        grid.innerHTML = '';
        
        // UNIFICANDO: usar apenas gameGrid (não gameBoard)
        // Inicializar matriz do jogo (20 linhas x 10 colunas)
        this.gameGrid = Array(20).fill().map(() => Array(10).fill(0));
        
        // Limpar variáveis duplicadas
        this.currentFallingPiece = null;
        this.fallingPiecePosition = { x: 4, y: 0 };
        this.dropInterval = null;
        
        // Criar 200 células (20x10)
        for (let i = 0; i < 200; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = Math.floor(i / 10);
            cell.dataset.col = i % 10;
            cell.dataset.index = i;
            grid.appendChild(cell);
        }
        
        this.gridCells = Array.from(grid.children);
        console.log('Grid criado com sucesso:', this.gridCells.length, 'células');
    }
    
    /**
     * Configuração dos event listeners
     */
    setupEventListeners() {
        console.log("=== CONFIGURANDO EVENT LISTENERS ===");
        
        // Botões principais - IDs corretos do HTML
        const buttons = [
            { id: 'play-piece', handler: () => playPiece.call(this), name: 'play' },
            { id: 'transfer-piece', handler: () => this.transferPiece(), name: 'transfer' },
            { id: 'use-reserve', handler: () => this.useReservePiece(), name: 'use-reserve' },
            { id: 'generate-piece', handler: () => this.generateNewPiece(), name: 'generate' },
            { id: 'show-stats', handler: () => this.showDetailedStats(), name: 'stats' },
            { id: 'optimize-system', handler: () => this.optimizeSystem(), name: 'optimize' },
            { id: 'reset-game', handler: () => this.resetGame(), name: 'reset' },
            { id: 'showTip', handler: () => this.showExpertTip(), name: 'expert-tip' }
        ];
        
        buttons.forEach(({ id, handler, name }) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', handler);
                console.log(`Listener adicionado para ${name} button`);
            } else {
                console.error(`ERRO: ${name} button (${id}) não encontrado!`);
            }
        });
        
        // Modal
        const closeModal = document.getElementById('close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }
        
        const statsModal = document.getElementById('stats-modal');
        if (statsModal) {
            statsModal.addEventListener('click', (e) => {
                if (e.target === statsModal) {
                    this.closeModal();
                }
            });
        }
        
        // Keyboard shortcuts - otimizado com throttling
        this.setupKeyboardControls();
        
        console.log("Event listeners configurados!");
    }
    
    /**
     * Configura controles de teclado com throttling para melhor performance
     */
    setupKeyboardControls() {
        console.log('🎮 Configurando event listeners de teclado...');
        
        let lastKeyTime = 0;
        const keyThrottle = 50; // 50ms entre teclas
        
        document.addEventListener('keydown', (e) => {
            console.log('🔑 Tecla pressionada:', e.key, e.code);
            
            const currentTime = Date.now();
            if (currentTime - lastKeyTime < keyThrottle) return;
            lastKeyTime = currentTime;
            
            this.handleKeyboard(e);
            handleKeyPress.call(this, e); // Corrigindo a chamada da função
        });
        
        console.log('✅ Event listeners de teclado configurados!');
    }
    
    // ===== MÉTODOS DE CONTROLE DE JOGO OTIMIZADOS =====
    
    /**
     * Loop principal do jogo otimizado com requestAnimationFrame
     */
    startGameLoop() {
        console.log("=== INICIANDO LOOP DO JOGO ===");
        this.gameState.isPlaying = true;
        this.gameState.isPaused = false;
        
        // Calcular intervalo baseado no nível
        this.dropInterval = Math.max(100, 1000 - (this.gameState.level - 1) * 100);
        this.lastDropTime = Date.now();
        
        // Usar requestAnimationFrame para melhor performance
        const gameLoop = () => {
            if (!this.gameState.isPaused && !this.gameState.gameOver && this.gameState.isPlaying) {
                this.gameLoop();
                this.gameTimer = requestAnimationFrame(gameLoop);
            }
        };
        
        this.gameTimer = requestAnimationFrame(gameLoop);
        console.log("Loop do jogo iniciado com intervalo de queda:", this.dropInterval + "ms");
    }
    
    /**
     * Para o loop do jogo
     */
    stopGameLoop() {
        if (this.gameTimer) {
            cancelAnimationFrame(this.gameTimer);
            this.gameTimer = null;
        }
        this.gameState.isPlaying = false;
        console.log("Loop do jogo parado");
    }
    
    /**
     * Loop principal otimizado
     */
    gameLoop() {
        const currentTime = Date.now();
        
        // Verificar se é hora de fazer a peça cair
        if (currentTime - this.lastDropTime > this.dropInterval) {
            dropPiece.call(this);
            this.lastDropTime = currentTime;
        }
        
        // Atualizar display apenas quando necessário
        this.drawGame();
    }
    
    // ===== MÉTODOS DE RENDERIZAÇÃO OTIMIZADOS =====
    
    /**
     * Desenha o jogo com otimizações de performance
     */
    drawGame() {
        // Usar DocumentFragment para melhor performance
        const fragment = document.createDocumentFragment();
        
        // Limpar apenas células que mudaram
        this.clearChangedCells();
        
        // Desenhar peças fixas
        this.drawFixedPieces();
        
        // Desenhar peça em queda
        this.drawFallingPiece();
    }
    
    /**
     * Limpa apenas as células que mudaram para melhor performance
     */
    clearChangedCells() {
        // Cache das células que precisam ser limpas
        if (!this.cellsToClean) this.cellsToClean = new Set();
        
        this.cellsToClean.forEach(cellIndex => {
            const cell = this.gridCells[cellIndex];
            if (cell) {
                cell.className = 'grid-cell';
                cell.style.backgroundColor = '';
            }
        });
        
        this.cellsToClean.clear();
    }
    
    /**
     * Desenha peças fixas com otimização
     */
    drawFixedPieces() {
        for (let row = 0; row < 20; row++) {
            for (let col = 0; col < 10; col++) {
                const cellIndex = row * 10 + col;
                const cellValue = this.gameGrid[row][col];
                
                if (cellValue) {
                    const cell = this.gridCells[cellIndex];
                    if (cell) {
                        const color = this.getPieceColor(cellValue);
                        cell.className = `grid-cell filled`;
                        cell.style.backgroundColor = color;
                        this.cellsToClean.add(cellIndex);
                    }
                }
            }
        }
    }
    
    /**
     * Desenha peça em queda com otimização
     */
    drawFallingPiece() {
        console.log("drawFallingPiece chamada, fallingPiece:", this.fallingPiece);
        
        if (!this.fallingPiece || !this.fallingPiece.shape) {
            console.log("Nenhuma peça em queda para desenhar");
            return;
        }
        
        const shape = this.fallingPiece.shape;
        const color = this.getPieceColor(this.fallingPiece.tipo);
        
        console.log("Desenhando peça:", this.fallingPiece.tipo, "na posição", this.fallingPiece.x, this.fallingPiece.y);
        console.log("Forma da peça:", shape);
        console.log("Cor da peça:", color);
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = this.fallingPiece.x + col;
                    const y = this.fallingPiece.y + row;
                    
                    console.log(`Desenhando bloco em (${x}, ${y})`);
                    
                    if (y >= 0 && y < 20 && x >= 0 && x < 10) {
                        const cellIndex = y * 10 + x;
                        const cell = this.gridCells[cellIndex];
                        if (cell) {
                            cell.className = 'grid-cell falling-piece';
                            cell.style.backgroundColor = color;
                            this.cellsToClean.add(cellIndex);
                            console.log(`Célula ${cellIndex} preenchida com cor ${color}`);
                        } else {
                            console.log(`Célula ${cellIndex} não encontrada!`);
                        }
                    } else {
                        console.log(`Posição (${x}, ${y}) fora dos limites`);
                    }
                }
            }
        }
    }
    
    // ===== MÉTODOS DE LÓGICA OTIMIZADOS =====
    
    /**
     * Verifica linhas completas com algoritmo otimizado
     */
    checkLines() {
        const linesToClear = [];
        
        // Identificar todas as linhas completas primeiro
        for (let row = 19; row >= 0; row--) {
            if (isLineFull.call(this, row)) {
                linesToClear.push(row);
            }
        }
        
        if (linesToClear.length > 0) {
            // Remover todas as linhas de uma vez
            this.clearMultipleLines(linesToClear);
            updateScore.call(this, linesToClear.length);
            
            // Verificar progressão de nível
            const novoNivel = this.sistemaExpert.verificarProgressaoNivel(this.gameState.score);
            if (novoNivel > this.gameState.level) {
                this.gameState.level = novoNivel;
                this.dropInterval = Math.max(100, 1000 - (this.gameState.level - 1) * 100);
                this.showExpertTip(`🎉 Nível ${novoNivel} alcançado!`);
            }
        }
    }
    
    /**
     * Remove múltiplas linhas de forma otimizada
     */
    clearMultipleLines(linesToClear) {
        // Ordenar linhas em ordem decrescente
        linesToClear.sort((a, b) => b - a);
        
        // Remover linhas de baixo para cima
        linesToClear.forEach(row => {
            this.gameGrid.splice(row, 1);
            this.gameGrid.unshift(Array(10).fill(0));
        });
    }
    
    /**
     * Atualiza display apenas quando necessário
     */
    updateDisplay() {
        // Usar requestAnimationFrame para suavizar atualizações
        if (this.displayUpdatePending) return;
        
        this.displayUpdatePending = true;
        requestAnimationFrame(() => {
            this.performDisplayUpdate();
            this.displayUpdatePending = false;
        });
    }
    
    /**
     * Executa a atualização real do display
     */
    performDisplayUpdate() {
        console.log("=== ATUALIZANDO DISPLAY ===");
        
        // Cache de elementos para evitar queries repetidas
        const updates = [];
        
        // Atualizar fila circular
        this.elements.queueSlots.forEach((slot, index) => {
            const peca = this.filaCircular.obterPecaPorIndice(index);
            const pieceType = slot.querySelector('.piece-type');
            if (pieceType) {
                const newText = peca ? peca.tipo : '-';
                if (pieceType.textContent !== newText) {
                    pieceType.textContent = newText;
                    slot.classList.toggle('pulse', !peca);
                }
            }
        });
        
        // Atualizar pilha de reserva
        this.elements.reserveSlots.forEach((slot, index) => {
            const peca = this.pilhaReserva.obterPecaPorIndice(index);
            const pieceType = slot.querySelector('.piece-type');
            if (pieceType) {
                const newText = peca ? peca.tipo : '-';
                if (pieceType.textContent !== newText) {
                    pieceType.textContent = newText;
                }
            }
        });
        
        // Atualizar peça atual
        const currentText = this.gameState.currentPiece ? this.gameState.currentPiece.tipo : '-';
        if (this.elements.currentPieceDisplay.textContent !== currentText) {
            this.elements.currentPieceDisplay.textContent = currentText;
            if (this.gameState.currentPiece) {
                this.elements.currentPieceDisplay.classList.add('glow');
                setTimeout(() => {
                    this.elements.currentPieceDisplay.classList.remove('glow');
                }, 1000);
            }
        }
        
        // Atualizar estatísticas apenas se mudaram
        const newScore = this.gameState.score.toLocaleString();
        if (this.elements.scoreDisplay.textContent !== newScore) {
            this.elements.scoreDisplay.textContent = newScore;
        }
        
        const newLevel = this.gameState.level.toString();
        if (this.elements.levelDisplay.textContent !== newLevel) {
            this.elements.levelDisplay.textContent = newLevel;
        }
        
        const newCombos = this.gameState.combos.toString();
        if (this.elements.combosDisplay.textContent !== newCombos) {
            this.elements.combosDisplay.textContent = newCombos;
        }
        
        // Calcular eficiência
        const eficiencia = this.calcularEficiencia();
        const newEfficiency = `${eficiencia}%`;
        if (this.elements.efficiencyDisplay.textContent !== newEfficiency) {
            this.elements.efficiencyDisplay.textContent = newEfficiency;
        }
        
        // Atualizar barra de progresso
        const progresso = (this.gameState.score % 1000) / 10;
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = `${progresso}%`;
        }
    }
    
    // ===== MÉTODOS UTILITÁRIOS OTIMIZADOS =====
    
    /**
     * Cache para formas de peças
     */
    getPieceShape(tipo) {
        if (!this.shapeCache) {
            this.shapeCache = {
                'I': [[1, 1, 1, 1]],
                'O': [[1, 1], [1, 1]],
                'T': [[0, 1, 0], [1, 1, 1]],
                'S': [[0, 1, 1], [1, 1, 0]],
                'Z': [[1, 1, 0], [0, 1, 1]],
                'J': [[1, 0, 0], [1, 1, 1]],
                'L': [[0, 0, 1], [1, 1, 1]]
            };
        }
        return this.shapeCache[tipo] || this.shapeCache['O'];
    }
    
    /**
     * Cache para cores de peças
     */
    getPieceColor(tipo) {
        if (!this.colorCache) {
            this.colorCache = {
                'I': '#00f5ff',
                'O': '#ffff00',
                'T': '#800080',
                'S': '#00ff00',
                'Z': '#ff0000',
                'J': '#0000ff',
                'L': '#ffa500'
            };
        }
        return this.colorCache[tipo] || '#ffffff';
    }
    
    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = [];
        
        for (let i = 0; i < cols; i++) {
            rotated[i] = [];
            for (let j = 0; j < rows; j++) {
                rotated[i][j] = matrix[rows - 1 - j][i];
            }
        }
        
        return rotated;
    }
    
    transferPiece() {
        if (!this.gameState.currentPiece) {
            this.showExpertTip("Nenhuma peça para transferir!");
            return;
        }
        
        if (this.pilhaReserva.pilhaCheia()) {
            this.showExpertTip("Pilha de reserva está cheia!");
            return;
        }
        
        // Transferir peça atual para a pilha
        this.pilhaReserva.reservarPeca(this.gameState.currentPiece);
        this.sistemaExpert.estatisticas.pecasReservadas++;
        
        // Próxima peça da fila
        this.gameState.currentPiece = this.filaCircular.jogarPeca();
        if (!this.gameState.currentPiece) {
            this.generateNewPiece();
            this.gameState.currentPiece = this.filaCircular.jogarPeca();
        }
        
        this.updateDisplay();
        this.showExpertTip("Peça transferida para a reserva!");
    }
    
    useReservePiece() {
        console.log("=== USANDO PEÇA DA RESERVA ===");
        
        if (this.pilhaReserva.pilhaVazia()) {
            this.showExpertTip("Pilha de reserva está vazia!");
            return;
        }
        
        // Se já há uma peça atual, transferir para a fila
        if (this.gameState.currentPiece) {
            if (this.filaCircular.filaCheia()) {
                this.showExpertTip("Fila está cheia! Não é possível usar peça da reserva.");
                return;
            }
            this.filaCircular.inserirPeca(this.gameState.currentPiece);
        }
        
        // Usar peça da pilha de reserva
        this.gameState.currentPiece = this.pilhaReserva.retirarPeca();
        this.sistemaExpert.estatisticas.jogadasDaPilha++;
        
        console.log("Peça retirada da reserva:", this.gameState.currentPiece);
        
        this.updateDisplay();
        this.showExpertTip("Peça retirada da reserva!");
        
        // Iniciar a peça automaticamente
        if (this.gameState.currentPiece) {
            startFallingPiece.call(this);
        }
    }
    
    generateNewPiece() {
        console.log("Gerando nova peça...");
        const novaPeca = gerarPecaAleatoria.call(this);
        console.log("Nova peça gerada:", novaPeca);
        
        if (this.filaCircular.filaCheia()) {
            this.showExpertTip("Fila está cheia! Jogue algumas peças primeiro.");
            return;
        }
        
        this.filaCircular.inserirPeca(novaPeca);
        this.updateDisplay();
        this.showExpertTip("Nova peça gerada na fila!");
    }
    
    animatePlayedPiece() {
        // Animar células do grid
        const cells = document.querySelectorAll('.grid-cell');
        const randomCells = Array.from(cells).sort(() => 0.5 - Math.random()).slice(0, 4);
        
        randomCells.forEach((cell, index) => {
            setTimeout(() => {
                cell.classList.add('filled');
                setTimeout(() => {
                    cell.classList.remove('filled');
                }, 500);
            }, index * 100);
        });
    }
    
    updateDisplay() {
        console.log("=== ATUALIZANDO DISPLAY ===");
        console.log("Fila circular - quantidade de peças:", this.filaCircular.quantidadePecas);
        console.log("Peça atual:", this.gameState.currentPiece);
        
        // Atualizar fila circular
        this.elements.queueSlots.forEach((slot, index) => {
            const peca = this.filaCircular.obterPecaPorIndice(index);
            const pieceType = slot.querySelector('.piece-type');
            console.log(`Slot ${index}:`, peca);
            if (pieceType) {
                if (peca) {
                    pieceType.textContent = peca.tipo;
                    slot.classList.remove('pulse');
                } else {
                    pieceType.textContent = '-';
                    slot.classList.add('pulse');
                }
            }
        });
        
        // Atualizar pilha de reserva
        this.elements.reserveSlots.forEach((slot, index) => {
            const peca = this.pilhaReserva.obterPecaPorIndice(index);
            const pieceType = slot.querySelector('.piece-type');
            if (pieceType) {
                if (peca) {
                    pieceType.textContent = peca.tipo;
                } else {
                    pieceType.textContent = '-';
                }
            }
        });
        
        // Atualizar peça atual
        if (this.gameState.currentPiece) {
            this.elements.currentPieceDisplay.textContent = this.gameState.currentPiece.tipo;
            this.elements.currentPieceDisplay.classList.add('glow');
            setTimeout(() => {
                this.elements.currentPieceDisplay.classList.remove('glow');
            }, 1000);
        } else {
            this.elements.currentPieceDisplay.textContent = '-';
        }
        
        // Atualizar estatísticas
        this.elements.scoreDisplay.textContent = this.gameState.score.toLocaleString();
        this.elements.levelDisplay.textContent = this.gameState.level;
        this.elements.combosDisplay.textContent = this.gameState.combos;
        
        // Calcular eficiência
        const eficiencia = this.calcularEficiencia();
        this.elements.efficiencyDisplay.textContent = `${eficiencia}%`;
        
        // Atualizar barra de progresso
        const progresso = (this.gameState.score % 1000) / 10;
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = `${progresso}%`;
        }
    }
    
    calcularEficiencia() {
        const total = this.sistemaExpert.estatisticas.jogadasTotais;
        if (total === 0) return 0;
        
        const filaPlays = this.sistemaExpert.estatisticas.jogadasDaFila;
        return Math.round((filaPlays / total) * 100);
    }
    
    generateExpertTip() {
        const tips = [
            "💡 Use peças da fila para ganhar mais pontos!",
            "🎯 Peças I e T dão mais pontuação base.",
            "🔄 Reserve peças estrategicamente para combos.",
            "📈 Mantenha alta eficiência jogando da fila.",
            "⚡ Combos consecutivos multiplicam sua pontuação!",
            "🏆 Cada nível aumenta a dificuldade exponencialmente.",
            "🎮 Use atalhos: ESPAÇO (jogar), T (transferir), G (gerar)."
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        this.showExpertTip(randomTip);
    }
    
    showExpertTip(message) {
        this.elements.expertTip.textContent = message;
        this.elements.expertTip.classList.add('pulse');
        setTimeout(() => {
            this.elements.expertTip.classList.remove('pulse');
        }, 2000);
    }
    
    showDetailedStats() {
        // Atualizar estatísticas detalhadas
        this.elements.totalPlaysDisplay.textContent = this.sistemaExpert.estatisticas.jogadasTotais;
        this.elements.queuePlaysDisplay.textContent = this.sistemaExpert.estatisticas.jogadasDaFila;
        this.elements.stackPlaysDisplay.textContent = this.sistemaExpert.estatisticas.jogadasDaPilha;
        this.elements.reservedPiecesDisplay.textContent = this.sistemaExpert.estatisticas.pecasReservadas;
        
        // Atualizar estatísticas por peça
        this.updatePieceStats();
        
        // Mostrar modal
        this.elements.statsModal.style.display = 'block';
    }
    
    updatePieceStats() {
        const grid = this.elements.pieceStatsGrid;
        grid.innerHTML = '';
        
        const tipos = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        tipos.forEach(tipo => {
            const count = this.sistemaExpert.contadorPecas[tipo] || 0;
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `
                <h4>Peça ${tipo}</h4>
                <span class="big-number">${count}</span>
            `;
            grid.appendChild(card);
        });
    }
    
    closeModal() {
        this.elements.statsModal.style.display = 'none';
    }
    
    optimizeSystem() {
        // Simular otimização do sistema
        this.showExpertTip("🔧 Otimizando sistema...");
        
        setTimeout(() => {
            // Aplicar pequenos bônus
            const bonus = Math.floor(this.gameState.score * 0.1);
            this.gameState.score += bonus;
            
            // Reorganizar fila se necessário
            this.filaCircular.otimizar();
            
            this.updateDisplay();
            this.showExpertTip(`✅ Sistema otimizado! Bônus: +${bonus} pontos`);
        }, 1500);
    }
    
    resetGame() {
        console.log("=== RESETANDO JOGO ===");
        
        // Parar loop do jogo
        this.stopGameLoop();
        
        // Resetar estado
        this.gameState = {
            currentPiece: null,
            score: 0,
            level: 1,
            combos: 0,
            isPlaying: false,
            gameOver: false,
            isPaused: false
        };
        
        // Limpar grid
        this.gameGrid = Array(20).fill().map(() => Array(10).fill(0));
        
        // Limpar peça em queda
        this.fallingPiece = {
            shape: null,
            x: 4,
            y: 0,
            rotation: 0
        };
        
        // Resetar estruturas
        this.filaCircular = new FilaCircular();
        this.pilhaReserva = new PilhaReserva();
        this.sistemaExpert = new SistemaExpert();
        
        // Limpar display
        clearTetrisGrid.call(this);
        this.updateDisplay();
        
        // Reinicializar jogo
        initializeGame.call(this);
        
        console.log("Jogo resetado com sucesso!");
    }
}

/**
 * Classe que representa uma peça do Tetris
 * Baseada na estrutura original do código C
 */
class Peca {
    /**
     * Construtor da peça
     * @param {string} tipo - Tipo da peça (I, O, T, S, Z, J, L)
     * @param {number} id - Identificador único da peça
     */
    constructor(tipo, id) {
        this.tipo = tipo;
        this.id = id;
    }
}

/**
 * Implementação de uma fila circular para gerenciar peças
 * Estrutura de dados fundamental do sistema expert
 */
class FilaCircular {
    /**
     * Inicializa a fila circular com capacidade para 5 peças
     */
    constructor() {
        this.pecas = new Array(5).fill(null);
        this.indiceFrente = 0;  // Índice do primeiro elemento
        this.indiceTras = 0;    // Índice onde inserir próximo elemento
        this.quantidadePecas = 0;
    }
    
    /**
     * Verifica se a fila está vazia
     * @returns {boolean} True se a fila estiver vazia
     */
    filaVazia() {
        return this.quantidadePecas === 0;
    }
    
    /**
     * Verifica se a fila está cheia
     * @returns {boolean} True se a fila estiver cheia
     */
    filaCheia() {
        return this.quantidadePecas === 5;
    }
    
    /**
     * Insere uma nova peça na fila
     * @param {Peca} peca - Peça a ser inserida
     * @returns {boolean} True se a inserção foi bem-sucedida
     */
    inserirPeca(peca) {
        if (this.filaCheia()) return false;
        
        this.pecas[this.indiceTras] = peca;
        this.indiceTras = (this.indiceTras + 1) % 5;
        this.quantidadePecas++;
        return true;
    }
    
    /**
     * Remove e retorna a primeira peça da fila
     * @returns {Peca|null} Peça removida ou null se fila vazia
     */
    jogarPeca() {
        if (this.filaVazia()) return null;
        
        const peca = this.pecas[this.indiceFrente];
        this.pecas[this.indiceFrente] = null;
        this.indiceFrente = (this.indiceFrente + 1) % 5;
        this.quantidadePecas--;
        return peca;
    }
    
    /**
     * Obtém uma peça por índice sem removê-la
     * @param {number} index - Índice da peça (0 = primeira)
     * @returns {Peca|null} Peça no índice especificado ou null
     */
    obterPecaPorIndice(index) {
        if (index >= this.quantidadePecas) return null;
        const realIndex = (this.indiceFrente + index) % 5;
        return this.pecas[realIndex];
    }
    
    /**
     * Otimiza a ordem das peças na fila baseado em valor de pontuação
     * Reorganiza para maximizar eficiência do sistema expert
     */
    otimizar() {
        // Coletar todas as peças ativas
        const pecasAtivas = [];
        for (let i = 0; i < this.quantidadePecas; i++) {
            pecasAtivas.push(this.obterPecaPorIndice(i));
        }
        
        // Ordenar por valor de pontuação (peças mais valiosas primeiro)
        pecasAtivas.sort((a, b) => {
            const valorA = this.getValorPeca(a.tipo);
            const valorB = this.getValorPeca(b.tipo);
            return valorB - valorA;
        });
        
        // Reinicializar fila e recolocar peças ordenadas
        this.pecas.fill(null);
        this.indiceFrente = 0;
        this.indiceTras = 0;
        this.quantidadePecas = 0;
        
        pecasAtivas.forEach(peca => this.inserirPeca(peca));
    }
    
    /**
     * Retorna o valor de pontuação base de uma peça
     * @param {string} tipo - Tipo da peça
     * @returns {number} Valor de pontuação da peça
     */
    getValorPeca(tipo) {
        const valores = { 
            'I': 100,  // Peça linha - mais valiosa
            'T': 80,   // Peça T - versátil
            'L': 60,   // Peças L e J - bom valor
            'J': 60, 
            'S': 40,   // Peças S e Z - valor médio
            'Z': 40, 
            'O': 20    // Peça quadrado - menor valor
        };
        return valores[tipo] || 0;
    }
}

/**
 * Implementação de uma pilha para reservar peças estrategicamente
 * Permite armazenar até 3 peças para uso posterior
 */
class PilhaReserva {
    /**
     * Inicializa a pilha de reserva com capacidade para 3 peças
     */
    constructor() {
        this.pecas = new Array(3).fill(null);
        this.topo = -1;  // Índice do topo da pilha (-1 = vazia)
    }
    
    /**
     * Verifica se a pilha está vazia
     * @returns {boolean} True se a pilha estiver vazia
     */
    pilhaVazia() {
        return this.topo === -1;
    }
    
    /**
     * Verifica se a pilha está cheia
     * @returns {boolean} True se a pilha estiver cheia
     */
    pilhaCheia() {
        return this.topo === 2;
    }
    
    /**
     * Adiciona uma peça no topo da pilha
     * @param {Peca} peca - Peça a ser reservada
     * @returns {boolean} True se a reserva foi bem-sucedida
     */
    reservarPeca(peca) {
        if (this.pilhaCheia()) return false;
        
        this.topo++;
        this.pecas[this.topo] = peca;
        return true;
    }
    
    /**
     * Remove e retorna a peça do topo da pilha
     * @returns {Peca|null} Peça removida ou null se pilha vazia
     */
    retirarPeca() {
        if (this.pilhaVazia()) return null;
        
        const peca = this.pecas[this.topo];
        this.pecas[this.topo] = null;
        this.topo--;
        return peca;
    }
    
    /**
     * Obtém uma peça por índice sem removê-la
     * @param {number} index - Índice da peça (0 = topo)
     * @returns {Peca|null} Peça no índice especificado ou null
     */
    obterPecaPorIndice(index) {
        if (index > this.topo) return null;
        return this.pecas[this.topo - index];
    }
}

/**
 * Sistema Expert que gerencia a lógica inteligente do jogo
 * Calcula pontuações, detecta combos e analisa performance
 */
class SistemaExpert {
    /**
     * Inicializa o sistema expert com estatísticas zeradas
     */
    constructor() {
        // Estatísticas gerais do jogo
        this.estatisticas = {
            jogadasTotais: 0,      // Total de peças jogadas
            jogadasDaFila: 0,      // Peças jogadas da fila circular
            jogadasDaPilha: 0,     // Peças jogadas da pilha de reserva
            pecasReservadas: 0,    // Total de peças reservadas
            eficiencia: 0          // Percentual de eficiência
        };
        
        // Contador de peças por tipo
        this.contadorPecas = {
            'I': 0, 'O': 0, 'T': 0, 'S': 0, 'Z': 0, 'J': 0, 'L': 0
        };
        
        // Sistema de combos
        this.comboAtual = 0;
        this.ultimaJogada = null;
        
        // Sistema de conquistas e recordes
        this.conquistas = [];
        this.recordePessoal = 0;
    }
    
    /**
     * Calcula a pontuação de uma peça baseada em tipo e multiplicadores
     * @param {Peca} peca - Peça para calcular pontuação
     * @returns {number} Pontuação calculada
     */
    calcularPontuacao(peca) {
        // Pontuação base por tipo de peça
        const pontuacaoBase = {
            'I': 100,  // Peça linha - mais pontos
            'T': 80,   // Peça T - boa pontuação
            'L': 60,   // Peças L e J - pontuação média-alta
            'J': 60, 
            'S': 40,   // Peças S e Z - pontuação média
            'Z': 40, 
            'O': 20    // Peça quadrado - menor pontuação
        };
        
        let pontos = pontuacaoBase[peca.tipo] || 10;
        
        // Aplicar multiplicador baseado na experiência do jogador
        const multiplicador = 1 + (Math.floor(this.estatisticas.jogadasTotais / 10) * 0.1);
        
        return Math.floor(pontos * multiplicador);
    }
    
    /**
     * Detecta e gerencia combos baseado em jogadas consecutivas
     * @returns {number} Nível do combo atual
     */
    detectarCombo() {
        // Simular detecção de combo baseada em padrões de jogada
        if (this.ultimaJogada && Math.random() > 0.7) {
            this.comboAtual++;
            return this.comboAtual;
        } else {
            this.comboAtual = 0;
            return 0;
        }
    }
    
    /**
     * Calcula progressão de nível baseada na pontuação
     * Usa progressão exponencial para aumentar dificuldade
     * @param {number} pontuacao - Pontuação atual do jogador
     * @returns {number} Nível calculado
     */
    verificarProgressaoNivel(pontuacao) {
        // Fórmula exponencial: nível = log2(pontuacao/100 + 1) + 1
        return Math.floor(Math.log2(pontuacao / 100 + 1)) + 1;
    }
}

/**
 * Inicialização do sistema quando a página carrega
 * Configura o jogo e exibe informações de debug
 */
document.addEventListener('DOMContentLoaded', () => {
    // Criar instância global do jogo
    window.tetrisGame = new TetrisExpertSystem();
    
    // CONFIGURAR CONTROLES DE TECLADO EXPLICITAMENTE
    console.log('🎮 Configurando controles de teclado...');
    window.tetrisGame.setupKeyboardControls();
    
    // INICIALIZAR O JOGO AUTOMATICAMENTE
    console.log('🎮 Tetris Expert System Iniciado!');
    
    // Gerar peças iniciais para testar
    for (let i = 0; i < 5; i++) {
        window.tetrisGame.generateNewPiece();
    }
    
    // Definir peça atual para teste
    if (window.tetrisGame.filaCircular.quantidadePecas > 0) {
        window.tetrisGame.gameState.currentPiece = window.tetrisGame.filaCircular.obterPecaPorIndice(0);
        window.tetrisGame.gameState.isPlaying = true;
        console.log('✅ Peça atual definida:', window.tetrisGame.gameState.currentPiece);
        
        // INICIAR PEÇA EM QUEDA AUTOMATICAMENTE PARA TESTE DE MOVIMENTO
        const piece = window.tetrisGame.gameState.currentPiece;
        const shape = window.tetrisGame.getPieceShape(piece.tipo);
        
        window.tetrisGame.fallingPiece = {
            shape: shape,
            x: 4, // Centro do tabuleiro
            y: 0, // Topo
            rotation: 0,
            tipo: piece.tipo
        };
        
        console.log('🎯 PEÇA EM QUEDA ATIVA:', window.tetrisGame.fallingPiece);
        console.log('🎮 AGORA VOCÊ PODE MOVER A PEÇA COM AS SETAS!');
    }
    
    // Atualizar display
    window.tetrisGame.updateDisplay();
    
    // Exibir informações de debug e atalhos no console
    console.log('📋 Atalhos disponíveis:');
    console.log('  🎯 ESPAÇO/ENTER: Jogar peça atual');
    console.log('  🔄 T: Transferir peça para reserva');
    console.log('  📦 R: Usar peça da reserva');
    console.log('  ➕ G: Gerar nova peça na fila');
    console.log('  📊 S: Mostrar estatísticas detalhadas');
    console.log('  ⚡ O: Otimizar sistema');
    console.log('  🔄 CTRL+R: Reiniciar jogo');
    console.log('📋 Controles do jogo:');
    console.log('  ⬅️ Seta Esquerda: Mover peça para esquerda');
    console.log('  ➡️ Seta Direita: Mover peça para direita');
    console.log('  ⬇️ Seta Baixo: Acelerar queda (soft drop)');
    console.log('  ⬆️ Seta Cima: Rotacionar peça');
    console.log('  🚀 Espaço: Queda rápida (hard drop)');
    console.log('🎯 Objetivo: Use o sistema expert para maximizar sua pontuação!');
    
    // TESTE IMEDIATO DAS FUNCIONALIDADES
    console.log('🧪 TESTANDO FUNCIONALIDADES:');
    console.log('Fila Circular:', window.tetrisGame.filaCircular.quantidadePecas, 'peças');
    console.log('Pilha Reserva:', window.tetrisGame.pilhaReserva.pilhaVazia() ? 'vazia' : 'com peças');
    console.log('Estado do jogo:', window.tetrisGame.gameState.isPlaying ? 'ativo' : 'inativo');
    console.log('Peça em queda:', window.tetrisGame.fallingPiece ? 'SIM' : 'NÃO');
    console.log('✅ Controles de teclado configurados!');
});

// ===== MÉTODOS GLOBAIS PARA COMPATIBILIDADE =====

/**
 * Manipula eventos de teclado para atalhos do sistema
 * @param {KeyboardEvent} event - Evento de teclado
 */
function handleKeyboard(event) {
    if (!this.gameState.isPlaying) return;
    
    switch(event.key) {
        case ' ':
        case 'Enter':
            event.preventDefault();
            playPiece.call(this);
            break;
        case 't':
        case 'T':
            this.transferPiece();
            break;
        case 'g':
        case 'G':
            this.generateNewPiece();
            break;
        case 's':
        case 'S':
            this.showDetailedStats();
            break;
        case 'o':
        case 'O':
            this.optimizeSystem();
            break;
        case 'r':
        case 'R':
            if (event.ctrlKey) {
                event.preventDefault();
                this.resetGame();
            } else {
                this.useReservePiece();
            }
            break;
    }
}

/**
 * Manipula controles de movimento das peças durante o jogo
 * @param {KeyboardEvent} event - Evento de teclado
 */
function handleKeyPress(event) {
    console.log("Tecla pressionada:", event.key, "Peça em queda:", !!this.fallingPiece);
    
    if (!this.fallingPiece || !this.fallingPiece.shape || this.gameState.gameOver) {
        console.log("Não há peça em queda ou jogo acabou");
        return;
    }
    
    switch(event.key) {
        case 'ArrowLeft':
            event.preventDefault();
            console.log("Movendo para esquerda");
            movePiece.call(this, -1, 0);
            break;
        case 'ArrowRight':
            event.preventDefault();
            console.log("Movendo para direita");
            movePiece.call(this, 1, 0);
            break;
        case 'ArrowDown':
            event.preventDefault();
            console.log("Movendo para baixo");
            movePiece.call(this, 0, 1);
            break;
        case 'ArrowUp':
             event.preventDefault();
             console.log("Rotacionando peça");
             rotatePiece.call(this);
             break;
         case ' ':
             event.preventDefault();
             console.log("Hard drop");
             hardDrop.call(this);
             break;
    }
}
/**
 * Move a peça em queda na direção especificada
 * @param {number} dx - Deslocamento horizontal
 * @param {number} dy - Deslocamento vertical
 */
function movePiece(dx, dy) {
    console.log("=== MOVENDO PEÇA ===");
    console.log("Parâmetros:", { dx, dy });
    console.log("Peça atual:", this.fallingPiece);
    console.log("Game grid existe:", !!this.gameGrid);
    
    if (!this.fallingPiece || !this.fallingPiece.shape) {
        console.log("❌ ERRO: Não há peça em queda ou shape é null");
        return;
    }
    
    if (this.gameState.gameOver) {
        console.log("❌ ERRO: Jogo acabou");
        return;
    }
    
    const newX = this.fallingPiece.x + dx;
    const newY = this.fallingPiece.y + dy;
    
    console.log("Posição atual:", { x: this.fallingPiece.x, y: this.fallingPiece.y });
    console.log("Nova posição:", { x: newX, y: newY });
    
    // TESTE SIMPLES DE LIMITES PRIMEIRO
    if (newX < 0) {
        console.log("❌ Movimento bloqueado: fora do limite esquerdo");
        return;
    }
    if (newX + this.fallingPiece.shape[0].length > 10) {
        console.log("❌ Movimento bloqueado: fora do limite direito");
        return;
    }
    if (newY < 0) {
        console.log("❌ Movimento bloqueado: fora do limite superior");
        return;
    }
    if (newY + this.fallingPiece.shape.length > 20) {
        console.log("❌ Movimento bloqueado: fora do limite inferior");
        return;
    }
    
    // SE CHEGOU ATÉ AQUI, MOVIMENTO É VÁLIDO
    console.log("✅ Movimento válido! Atualizando posição...");
    this.fallingPiece.x = newX;
    this.fallingPiece.y = newY;
    
    // Se moveu para baixo, resetar timer de queda
    if (dy > 0) {
        this.lastDropTime = Date.now();
    }
    
    console.log("✅ Posição atualizada para:", { x: this.fallingPiece.x, y: this.fallingPiece.y });
    
    // Redesenhar o jogo
    this.drawGame();
    console.log("✅ Jogo redesenhado");
}
/**
 * Rotaciona a peça em queda no sentido horário
 */
function rotatePiece() {
    console.log("rotatePiece chamada, peça atual:", this.fallingPiece);
    
    if (!this.fallingPiece || !this.fallingPiece.shape || this.gameState.gameOver) {
        console.log("Não é possível rotacionar: sem peça em queda ou jogo acabou");
        return;
    }
    
    const originalShape = this.fallingPiece.shape;
    const rotatedShape = this.rotateMatrix(originalShape);
    
    console.log("Forma original:", originalShape);
    console.log("Forma rotacionada:", rotatedShape);
    
    // Temporariamente usar a forma rotacionada para teste
    this.fallingPiece.shape = rotatedShape;
    
    if (canPlacePiece.call(this, this.fallingPiece.x, this.fallingPiece.y)) {
        // Rotação válida, manter
        console.log("Peça rotacionada com sucesso");
        this.drawGame();
    } else {
        // Rotação inválida, reverter
        console.log("Rotação inválida, revertendo");
        this.fallingPiece.shape = originalShape;
    }
}
/**
 * Executa queda rápida da peça até o fundo
 */
function hardDrop() {
    console.log("hardDrop chamada, peça atual:", this.fallingPiece);
    
    if (!this.fallingPiece || !this.fallingPiece.shape || this.gameState.gameOver) {
        console.log("Não é possível fazer hard drop: sem peça em queda ou jogo acabou");
        return;
    }
    
    let dropCount = 0;
    // Mover peça para baixo até não poder mais
    while (canPlacePiece.call(this, this.fallingPiece.x, this.fallingPiece.y + 1)) {
        this.fallingPiece.y++;
        dropCount++;
    }
    
    console.log("Peça caiu", dropCount, "posições");
    
    // Fixar peça imediatamente
    placePiece.call(this);
    this.checkLines();
    this.fallingPiece = null;
    
    console.log("Hard drop concluído, peça fixada");
}
/**
 * Inicializa o jogo com peças na fila
 */
function initializeGame() {
    console.log("=== INICIALIZANDO JOGO ===");
    console.log("Estado inicial do jogo:", this.gameState);
    console.log("Grid cells disponíveis:", this.gridCells ? this.gridCells.length : 'undefined');
    
    // Gerar peças iniciais para a fila - SIMPLES e DIRETO
    for (let i = 0; i < 5; i++) {
        const novaPeca = gerarPecaAleatoria.call(this);
        console.log(`Peça inicial ${i}:`, novaPeca);
        const inserida = this.filaCircular.inserirPeca(novaPeca);
        console.log(`Peça ${i} inserida na fila:`, inserida);
    }
    
    console.log("Peças na fila após inicialização:", this.filaCircular.quantidadePecas);
    
    // Finalizar inicialização imediatamente
    finalizarInicializacao.call(this);
}
/**
 * Finaliza a inicialização do jogo
 */
function finalizarInicializacao() {
    console.log("=== FINALIZANDO INICIALIZAÇÃO ===");
    console.log("Quantidade de peças na fila:", this.filaCircular.quantidadePecas);
    
    // Definir peça atual APENAS da fila (sem gerar nova)
    this.gameState.currentPiece = this.filaCircular.jogarPeca();
    
    if (this.gameState.currentPiece) {
        console.log("Peça atual definida da fila:", this.gameState.currentPiece.tipo);
        
        // Iniciar automaticamente a primeira peça
        console.log("Iniciando primeira peça automaticamente...");
        playPiece.call(this);
        
    } else {
        console.log("ERRO: Não foi possível definir peça atual - fila vazia!");
    }
    
    // Atualizar interface
    this.updateDisplay();
    
    // Marcar jogo como ativo
    this.gameState.isPlaying = true;
    
    // Mostrar dica inicial
    this.showExpertTip("Bem-vindo ao Tetris Expert System! Use as peças da fila para maximizar sua pontuação.");
}
/**
 * Gera uma nova peça aleatória seguindo a distribuição do Tetris
 * @returns {string} Tipo da peça gerada
 */
function gerarPecaAleatoria() {
    const tipos = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    
    // Usar Math.random() para geração verdadeiramente aleatória
    const indiceAleatorio = Math.floor(Math.random() * tipos.length);
    const tipo = tipos[indiceAleatorio];
    
    console.log(`Peça gerada aleatoriamente: ${tipo} (índice: ${indiceAleatorio})`);
    
    return new Peca(tipo, Date.now());
}
/**
 * Inicia uma peça no jogo (coloca no tabuleiro)
 */
function playPiece() {
    console.log("=== JOGANDO PEÇA ===");
    
    if (this.gameState.gameOver) {
        console.log("Jogo terminado! Não é possível jogar peças.");
        return;
    }
    
    if (this.gameState.currentPiece) {
        console.log("Iniciando peça:", this.gameState.currentPiece);
        
        // Iniciar a peça em queda
        startFallingPiece.call(this, this.gameState.currentPiece);
        
        // Iniciar o loop do jogo se não estiver rodando
        if (!this.gameState.isPlaying) {
            this.startGameLoop();
        }
        
        // Gerar próxima peça
        nextPiece.call(this);
        
        // Atualizar display
        this.updateDisplay();
    } else {
        console.log("Nenhuma peça atual para jogar!");
    }
}
/**
 * Configura uma peça para começar a cair
 * @param {Peca} piece - Peça a ser iniciada
 */
function startFallingPiece(piece) {
    console.log("=== INICIANDO PEÇA EM QUEDA ===");
    console.log("Peça recebida:", piece);
    
    // Configurar peça em queda
    const shape = this.getPieceShape(piece.tipo);
    console.log("Forma da peça obtida:", shape);
    
    this.fallingPiece = {
        shape: shape,
        x: 4, // Centro do tabuleiro
        y: 0, // Topo
        rotation: 0,
        tipo: piece.tipo
    };
    
    console.log("Peça em queda configurada:", this.fallingPiece);
    
    // Verificar se pode colocar a peça (game over check)
    if (!canPlacePiece.call(this, this.fallingPiece.x, this.fallingPiece.y)) {
        console.log("GAME OVER: Não é possível colocar a peça!");
        gameOver.call(this);
        return;
    }
    
    console.log("Peça posicionada com sucesso em:", this.fallingPiece.x, this.fallingPiece.y);
    console.log("Iniciando desenho da peça...");
    this.drawGame();
}
/**
 * Faz a peça cair uma posição ou a fixa no tabuleiro
 */
function dropPiece() {
    console.log("=== DROP PIECE ===");
    console.log("Peça em queda atual:", this.fallingPiece);
    
    if (!this.fallingPiece || !this.fallingPiece.shape) {
        console.log("Nenhuma peça em queda para fazer cair");
        return;
    }
    
    // Tentar mover a peça para baixo
    if (canPlacePiece.call(this, this.fallingPiece.x, this.fallingPiece.y + 1)) {
        this.fallingPiece.y++;
        console.log("Peça movida para baixo, nova posição Y:", this.fallingPiece.y);
    } else {
        console.log("Peça não pode mais cair, fixando no tabuleiro");
        // Peça não pode mais cair, fixar no tabuleiro
        placePiece.call(this);
        this.checkLines();
        this.fallingPiece.shape = null; // Limpar peça atual
        console.log("Peça fixada e limpa");
    }
}
/**
 * Verifica se uma peça pode ser colocada na posição especificada
 * @param {number} x - Posição X
 * @param {number} y - Posição Y
 * @returns {boolean} - True se a peça pode ser colocada
 */
function canPlacePiece(x, y) {
    if (!this.fallingPiece.shape) return false;
    
    const shape = this.fallingPiece.shape;
    
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const newX = x + col;
                const newY = y + row;
                
                // Verificar limites do tabuleiro
                if (newX < 0 || newX >= 10 || newY >= 20) {
                    return false;
                }
                
                // Verificar colisão com peças já colocadas
                if (newY >= 0 && this.gameGrid[newY][newX]) {
                    return false;
                }
            }
        }
    }
    return true;
}
/**
 * Coloca a peça atual no tabuleiro permanentemente
 */
function placePiece() {
    if (!this.fallingPiece.shape) return;
    
    const shape = this.fallingPiece.shape;
    
    // Colocar peça no grid
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const x = this.fallingPiece.x + col;
                const y = this.fallingPiece.y + row;
                
                if (y >= 0 && y < 20 && x >= 0 && x < 10) {
                    this.gameGrid[y][x] = this.fallingPiece.tipo;
                }
            }
        }
    }
    
    // Calcular pontuação
    const pontos = this.sistemaExpert.calcularPontuacao(this.fallingPiece);
    this.gameState.score += pontos;
    
    // Atualizar estatísticas
    this.sistemaExpert.estatisticas.jogadasTotais++;
    this.sistemaExpert.estatisticas.jogadasDaFila++;
    this.sistemaExpert.contadorPecas[this.fallingPiece.tipo]++;
    
    console.log("Peça fixada no tabuleiro");
}
/**
 * Verifica se uma linha está completamente preenchida
 * @param {number} row - Índice da linha
 * @returns {boolean} True se a linha está completa
 */
function isLineFull(row) {
    return this.gameGrid[row].every(cell => cell !== 0);
}
/**
 * Remove uma linha específica do tabuleiro
 * @param {number} row - Índice da linha a ser removida
 */
function clearLine(row) {
    // Remove a linha
    this.gameGrid.splice(row, 1);
    // Adiciona nova linha vazia no topo
    this.gameGrid.unshift(new Array(10).fill(0));
}

/**
 * Atualiza a pontuação baseada nas linhas limpas
 * @param {number} linesCleared - Número de linhas limpas
 */
function updateScore(linesCleared) {
    const points = [0, 100, 300, 500, 800]; // Pontos por 0, 1, 2, 3, 4 linhas
    const linePoints = points[Math.min(linesCleared, 4)] * this.gameState.level;
    
    this.gameState.score += linePoints;
    
    // Verificar se subiu de nível (a cada 1000 pontos)
    const newLevel = Math.floor(this.gameState.score / 1000) + 1;
    if (newLevel > this.gameState.level) {
        this.gameState.level = newLevel;
        this.dropInterval = Math.max(100, 1000 - (this.gameState.level - 1) * 100);
        console.log("Nível aumentado para:", this.gameState.level);
    }
    
    // Atualizar combos
    if (linesCleared > 1) {
        this.gameState.combos++;
    }
}
/**
 * Finaliza o jogo e exibe estatísticas
 */
function gameOver() {
    console.log("=== GAME OVER ===");
    this.gameState.gameOver = true;
    this.gameState.isPlaying = false;
    this.stopGameLoop();
    
    // Mostrar mensagem de game over
    alert(`Game Over!\nPontuação: ${this.gameState.score}\nNível: ${this.gameState.level}`);
}
/**
 * Limpa o grid visual do Tetris
 */
function clearTetrisGrid() {
    const cells = this.elements.tetrisGrid.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.className = 'grid-cell';
    });
}
/**
 * Obtém a próxima peça da fila para jogar
 * @returns {Peca|null} Próxima peça ou null se fila vazia
 */
function nextPiece() {
    // Pegar EXATAMENTE a próxima peça da fila (sem gerar nova)
    const proximaPeca = this.filaCircular.jogarPeca();
    
    if (proximaPeca) {
        this.gameState.currentPiece = proximaPeca;
        console.log("Peça retirada da fila para jogar:", proximaPeca.tipo);
    } else {
        console.log("ERRO: Fila vazia! Não há peças para jogar.");
        this.showExpertTip("Fila vazia! Gere novas peças primeiro.");
        return null;
    }
    
    // Atualizar display
    this.updateDisplay();
    
    // Dica do expert system
    this.generateExpertTip();
    
    return this.gameState.currentPiece;
}
/**
 * Rotaciona uma matriz 90 graus no sentido horário
 * @param {Array<Array<number>>} matrix - Matriz a ser rotacionada
 * @returns {Array<Array<number>>} Matriz rotacionada
 */