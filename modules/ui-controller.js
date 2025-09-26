/**
 * Módulo UI Controller - Tetris Expert System
 * Gerencia todos os elementos da interface do usuário e interações DOM
 */

export class UIController {
    constructor() {
        this.elements = {};
        this.isInitialized = false;
        this.initializeElements();
        this.validateCriticalElements();
    }

    /**
     * Inicializa os elementos DOM necessários
     */
    initializeElements() {
        // Aguardar o DOM estar pronto se necessário
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupElements();
                this.isInitialized = true;
            });
        } else {
            this.setupElements();
            this.isInitialized = true;
        }
    }

    /**
     * Configura os elementos DOM
     */
    setupElements() {
        this.elements = {
            // Grid principal do jogo
            tetrisGrid: document.getElementById('tetris-grid'),
            
            // Displays de informações
            currentPieceDisplay: document.getElementById('current-piece'),
            scoreDisplay: document.getElementById('score'),
            levelDisplay: document.getElementById('level'),
            combosDisplay: document.getElementById('combos'),
            efficiencyDisplay: document.getElementById('efficiency'),
            progressFill: document.getElementById('progress-fill'),
            expertTip: document.getElementById('expertTip'),
            
            // Fila circular
            queueSlots: document.querySelectorAll('.piece-slot'),
            
            // Pilha de reserva
            reserveSlots: document.querySelectorAll('.reserve-slot'),
            
            // Modal de estatísticas
            statsModal: document.getElementById('stats-modal'),
            totalPlaysDisplay: document.getElementById('total-plays'),
            queuePlaysDisplay: document.getElementById('queue-plays'),
            stackPlaysDisplay: document.getElementById('stack-plays'),
            reservedPiecesDisplay: document.getElementById('reserved-pieces'),
            pieceStatsGrid: document.getElementById('piece-stats-grid'),
            
            // Botões de controle
            startButton: document.getElementById('start-game'),
            pauseButton: document.getElementById('pause-game'),
            playButton: document.getElementById('play-piece'),
            transferButton: document.getElementById('transfer-piece'),
            useReserveButton: document.getElementById('use-reserve'),
            generateButton: document.getElementById('generate-piece'),
            showStatsButton: document.getElementById('show-stats'),
            optimizeButton: document.getElementById('optimize-system'),
            resetButton: document.getElementById('reset-game'),
            closeModalButton: document.getElementById('close-modal')
        };
    }

    /**
     * Valida se os elementos críticos existem
     */
    validateCriticalElements() {
        // Só validar se já foi inicializado
        if (!this.isInitialized) {
            setTimeout(() => this.validateCriticalElements(), 100);
            return;
        }

        const criticalElements = ['tetrisGrid', 'currentPieceDisplay', 'scoreDisplay'];
        
        criticalElements.forEach(elementKey => {
            if (!this.elements[elementKey]) {
                console.warn(`⚠️ Elemento opcional não encontrado: ${elementKey}`);
            }
        });
    }

    /**
     * Cria o grid visual do Tetris
     */
    createTetrisGrid() {
        // Aguardar inicialização se necessário
        if (!this.isInitialized) {
            setTimeout(() => this.createTetrisGrid(), 100);
            return;
        }

        if (!this.elements.tetrisGrid) {
            console.warn("⚠️ Elemento tetris-grid não encontrado - modo de teste!");
            return;
        }

        // Limpar grid existente
        this.elements.tetrisGrid.innerHTML = '';
        this.gridCells = [];

        // Criar células do grid (20x10)
        for (let row = 0; row < 20; row++) {
            const rowCells = [];
            for (let col = 0; col < 10; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                this.elements.tetrisGrid.appendChild(cell);
                rowCells.push(cell);
            }
            this.gridCells.push(rowCells);
        }

        console.log("✅ Grid do Tetris criado com sucesso!");
    }

    /**
     * Atualiza a visualização da fila circular
     * @param {FilaCircular} filaCircular - Instância da fila circular
     */
    updateQueueDisplay(filaCircular) {
        if (!this.elements.queueSlots) return;

        this.elements.queueSlots.forEach((slot, index) => {
            const peca = filaCircular.obterPecaPorIndice(index);
            
            if (peca) {
                slot.textContent = peca.tipo;
                slot.className = `piece-slot piece-${peca.tipo.toLowerCase()}`;
                slot.classList.add('filled');
            } else {
                slot.textContent = '-';
                slot.className = 'piece-slot empty';
            }
        });
    }

    /**
     * Atualiza a visualização da pilha de reserva
     * @param {PilhaReserva} pilhaReserva - Instância da pilha de reserva
     */
    updateReserveDisplay(pilhaReserva) {
        if (!this.elements.reserveSlots) return;

        this.elements.reserveSlots.forEach((slot, index) => {
            const peca = pilhaReserva.obterPecaPorPosicao(index);
            
            if (peca) {
                slot.textContent = peca.tipo;
                slot.className = `reserve-slot piece-${peca.tipo.toLowerCase()}`;
                slot.classList.add('filled');
            } else {
                slot.textContent = '-';
                slot.className = 'reserve-slot empty';
            }
        });
    }

    /**
     * Atualiza as informações principais do jogo
     * @param {Object} gameState - Estado atual do jogo
     */
    updateGameInfo(gameState) {
        // Atualizar peça atual
        if (this.elements.currentPieceDisplay) {
            const currentText = gameState.currentPiece ? gameState.currentPiece.tipo : '-';
            if (this.elements.currentPieceDisplay.textContent !== currentText) {
                this.elements.currentPieceDisplay.textContent = currentText;
                if (gameState.currentPiece) {
                    this.elements.currentPieceDisplay.classList.add('glow');
                    setTimeout(() => {
                        this.elements.currentPieceDisplay.classList.remove('glow');
                    }, 1000);
                }
            }
        }

        // Atualizar estatísticas
        if (this.elements.scoreDisplay) {
            const newScore = gameState.score.toLocaleString();
            if (this.elements.scoreDisplay.textContent !== newScore) {
                this.elements.scoreDisplay.textContent = newScore;
            }
        }

        if (this.elements.levelDisplay) {
            const newLevel = gameState.level.toString();
            if (this.elements.levelDisplay.textContent !== newLevel) {
                this.elements.levelDisplay.textContent = newLevel;
            }
        }

        if (this.elements.combosDisplay) {
            const newCombos = gameState.combos.toString();
            if (this.elements.combosDisplay.textContent !== newCombos) {
                this.elements.combosDisplay.textContent = newCombos;
            }
        }
    }

    /**
     * Atualiza a eficiência do sistema
     * @param {number} eficiencia - Percentual de eficiência
     */
    updateEfficiency(eficiencia) {
        if (this.elements.efficiencyDisplay) {
            const newEfficiency = `${eficiencia}%`;
            if (this.elements.efficiencyDisplay.textContent !== newEfficiency) {
                this.elements.efficiencyDisplay.textContent = newEfficiency;
            }
        }
    }

    /**
     * Atualiza a barra de progresso
     * @param {number} score - Pontuação atual
     */
    updateProgressBar(score) {
        if (this.elements.progressFill) {
            const progresso = (score % 1000) / 10;
            this.elements.progressFill.style.width = `${progresso}%`;
        }
    }

    /**
     * Exibe uma dica do sistema expert
     * @param {string} message - Mensagem da dica
     */
    showExpertTip(message) {
        if (this.elements.expertTip) {
            this.elements.expertTip.textContent = message;
            this.elements.expertTip.classList.add('pulse');
            setTimeout(() => {
                this.elements.expertTip.classList.remove('pulse');
            }, 2000);
        }
    }

    /**
     * Exibe o modal de estatísticas detalhadas
     * @param {SistemaExpert} sistemaExpert - Instância do sistema expert
     */
    showDetailedStats(sistemaExpert) {
        if (!this.elements.statsModal) return;

        // Atualizar estatísticas detalhadas
        if (this.elements.totalPlaysDisplay) {
            this.elements.totalPlaysDisplay.textContent = sistemaExpert.estatisticas.jogadasTotais;
        }
        if (this.elements.queuePlaysDisplay) {
            this.elements.queuePlaysDisplay.textContent = sistemaExpert.estatisticas.jogadasDaFila;
        }
        if (this.elements.stackPlaysDisplay) {
            this.elements.stackPlaysDisplay.textContent = sistemaExpert.estatisticas.jogadasDaPilha;
        }
        if (this.elements.reservedPiecesDisplay) {
            this.elements.reservedPiecesDisplay.textContent = sistemaExpert.estatisticas.pecasReservadas;
        }

        // Atualizar estatísticas por peça
        this.updatePieceStats(sistemaExpert);

        // Mostrar modal
        this.elements.statsModal.style.display = 'block';
    }

    /**
     * Atualiza as estatísticas por tipo de peça
     * @param {SistemaExpert} sistemaExpert - Instância do sistema expert
     */
    updatePieceStats(sistemaExpert) {
        if (!this.elements.pieceStatsGrid) return;

        const grid = this.elements.pieceStatsGrid;
        grid.innerHTML = '';

        const tipos = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        tipos.forEach(tipo => {
            const count = sistemaExpert.contadorPecas[tipo] || 0;
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `
                <h4>Peça ${tipo}</h4>
                <span class="big-number">${count}</span>
            `;
            grid.appendChild(card);
        });
    }

    /**
     * Fecha o modal de estatísticas
     */
    closeStatsModal() {
        if (this.elements.statsModal) {
            this.elements.statsModal.style.display = 'none';
        }
    }

    /**
     * Desenha o grid do jogo com as peças
     * @param {Array} gameGrid - Matriz do jogo
     * @param {Object} fallingPiece - Peça em queda (opcional)
     */
    drawGame(gameGrid, fallingPiece = null) {
        if (!this.gridCells) return;

        // Limpar todas as células
        for (let row = 0; row < 20; row++) {
            for (let col = 0; col < 10; col++) {
                const cell = this.gridCells[row][col];
                cell.className = 'grid-cell';
                cell.textContent = '';
            }
        }

        // Desenhar peças fixas no grid
        for (let row = 0; row < 20; row++) {
            for (let col = 0; col < 10; col++) {
                if (gameGrid[row][col] !== 0) {
                    const cell = this.gridCells[row][col];
                    cell.classList.add('filled');
                    cell.textContent = gameGrid[row][col];
                }
            }
        }

        // Desenhar peça em queda
        if (fallingPiece && fallingPiece.shape) {
            this.drawFallingPiece(fallingPiece);
        }
    }

    /**
     * Desenha a peça em queda no grid
     * @param {Object} fallingPiece - Peça em queda
     */
    drawFallingPiece(fallingPiece) {
        const { shape, x, y, tipo } = fallingPiece;
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] === 1) {
                    const gridRow = y + row;
                    const gridCol = x + col;
                    
                    if (gridRow >= 0 && gridRow < 20 && gridCol >= 0 && gridCol < 10) {
                        const cell = this.gridCells[gridRow][gridCol];
                        cell.classList.add('falling');
                        cell.classList.add(`piece-${tipo.toLowerCase()}`);
                        cell.textContent = tipo;
                    }
                }
            }
        }
    }

    /**
     * Configura os event listeners para os botões
     * @param {Object} handlers - Objeto com os handlers para cada ação
     */
    setupEventListeners(handlers) {
        const buttonMappings = [
            { element: this.elements.startButton, handler: handlers.startGame, name: 'start' },
            { element: this.elements.pauseButton, handler: handlers.pauseGame, name: 'pause' },
            { element: this.elements.playButton, handler: handlers.playPiece, name: 'play' },
            { element: this.elements.transferButton, handler: handlers.transferPiece, name: 'transfer' },
            { element: this.elements.useReserveButton, handler: handlers.useReservePiece, name: 'use-reserve' },
            { element: this.elements.generateButton, handler: handlers.generateNewPiece, name: 'generate' },
            { element: this.elements.showStatsButton, handler: handlers.showDetailedStats, name: 'stats' },
            { element: this.elements.optimizeButton, handler: handlers.optimizeSystem, name: 'optimize' },
            { element: this.elements.resetButton, handler: handlers.resetGame, name: 'reset' },
            { element: this.elements.closeModalButton, handler: () => this.closeStatsModal(), name: 'close-modal' }
        ];

        buttonMappings.forEach(({ element, handler, name }) => {
            if (element && handler) {
                element.addEventListener('click', handler);
                console.log(`✅ Listener adicionado para ${name} button`);
            } else if (!element) {
                console.warn(`⚠️ Elemento ${name} não encontrado`);
            }
        });
    }

    /**
     * Configura os controles de teclado
     * @param {Function} keyboardHandler - Handler para eventos de teclado
     */
    setupKeyboardControls(keyboardHandler) {
        let lastKeyTime = 0;
        const keyThrottle = 50; // 50ms entre teclas

        document.addEventListener('keydown', (event) => {
            const currentTime = Date.now();
            if (currentTime - lastKeyTime < keyThrottle) {
                return;
            }
            lastKeyTime = currentTime;

            keyboardHandler(event);
        });

        console.log("⌨️ Controles de teclado configurados");
    }

    /**
     * Exibe uma mensagem de feedback visual
     * @param {string} message - Mensagem a ser exibida
     * @param {string} type - Tipo da mensagem ('success', 'warning', 'error')
     */
    showFeedback(message, type = 'info') {
        // Criar elemento de feedback se não existir
        let feedbackElement = document.getElementById('feedback-message');
        if (!feedbackElement) {
            feedbackElement = document.createElement('div');
            feedbackElement.id = 'feedback-message';
            feedbackElement.className = 'feedback-message';
            document.body.appendChild(feedbackElement);
        }

        // Configurar mensagem
        feedbackElement.textContent = message;
        feedbackElement.className = `feedback-message ${type} show`;

        // Remover após 3 segundos
        setTimeout(() => {
            feedbackElement.classList.remove('show');
        }, 3000);
    }

    /**
     * Atualiza o display completo do jogo
     * @param {Object} gameData - Dados completos do jogo
     */
    updateCompleteDisplay(gameData) {
        const { gameState, filaCircular, pilhaReserva, sistemaExpert, gameGrid, fallingPiece } = gameData;

        // Atualizar todas as seções da interface
        this.updateQueueDisplay(filaCircular);
        this.updateReserveDisplay(pilhaReserva);
        this.updateGameInfo(gameState);
        this.updateEfficiency(sistemaExpert.estatisticas.eficiencia);
        this.updateProgressBar(gameState.score);
        this.drawGame(gameGrid, fallingPiece);
    }

    /**
     * Reseta a interface para o estado inicial
     */
    resetDisplay() {
        // Limpar displays
        if (this.elements.currentPieceDisplay) this.elements.currentPieceDisplay.textContent = '-';
        if (this.elements.scoreDisplay) this.elements.scoreDisplay.textContent = '0';
        if (this.elements.levelDisplay) this.elements.levelDisplay.textContent = '1';
        if (this.elements.combosDisplay) this.elements.combosDisplay.textContent = '0';
        if (this.elements.efficiencyDisplay) this.elements.efficiencyDisplay.textContent = '0%';
        if (this.elements.expertTip) this.elements.expertTip.textContent = 'Sistema Expert Iniciado!';

        // Limpar fila e pilha
        if (this.elements.queueSlots) {
            this.elements.queueSlots.forEach(slot => {
                slot.textContent = '-';
                slot.className = 'piece-slot empty';
            });
        }

        if (this.elements.reserveSlots) {
            this.elements.reserveSlots.forEach(slot => {
                slot.textContent = '-';
                slot.className = 'reserve-slot empty';
            });
        }

        // Limpar grid
        if (this.gridCells) {
            for (let row = 0; row < 20; row++) {
                for (let col = 0; col < 10; col++) {
                    const cell = this.gridCells[row][col];
                    cell.className = 'grid-cell';
                    cell.textContent = '';
                }
            }
        }

        // Fechar modal se estiver aberto
        this.closeStatsModal();

        console.log("🔄 Interface resetada!");
    }
}