/**
 * Módulo Game Engine - Tetris Expert System
 * Gerencia a lógica principal do jogo e coordena todos os outros módulos
 */

import { Peca, FilaCircular, PilhaReserva, SistemaExpert } from './data-structures.js';
import { UIController } from './ui-controller.js';
import { PieceManager } from './piece-manager.js';

export class GameEngine {
    constructor() {
        this.gameState = this.initializeGameState();
        this.gameGrid = this.createGameGrid();
        this.gameLoop = null;
        this.isGameRunning = false;
        this.isPaused = false;
        
        // Inicializar módulos
        this.uiController = new UIController();
        this.pieceManager = new PieceManager();
        this.filaCircular = new FilaCircular();
        this.pilhaReserva = new PilhaReserva();
        this.sistemaExpert = new SistemaExpert();
        
        this.initialize();
    }

    /**
     * Inicializa o estado do jogo
     */
    initializeGameState() {
        return {
            score: 0,
            level: 1,
            lines: 0,
            combos: 0,
            currentPiece: null,
            nextPiece: null,
            gameSpeed: 1000, // ms
            lastMoveTime: 0,
            isGameOver: false,
            isPaused: false
        };
    }

    /**
     * Cria o grid do jogo (20x10)
     */
    createGameGrid() {
        const grid = [];
        for (let row = 0; row < 20; row++) {
            grid.push(new Array(10).fill(0));
        }
        return grid;
    }

    /**
     * Inicializa o motor do jogo
     */
    initialize() {
        console.log("🎮 Inicializando Game Engine...");
        
        // Criar grid visual
        this.uiController.createTetrisGrid();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Configurar controles de teclado
        this.setupKeyboardControls();
        
        // Gerar peças iniciais
        this.generateInitialPieces();
        
        // Atualizar display inicial
        this.updateDisplay();
        
        console.log("✅ Game Engine inicializado com sucesso!");
    }

    /**
     * Configura os event listeners
     */
    setupEventListeners() {
        const handlers = {
            startGame: () => this.startGame(),
            pauseGame: () => this.togglePause(),
            playPiece: () => this.playPiece(),
            transferPiece: () => this.transferPiece(),
            useReservePiece: () => this.useReservePiece(),
            generateNewPiece: () => this.generateNewPiece(),
            showDetailedStats: () => this.showDetailedStats(),
            optimizeSystem: () => this.optimizeSystem(),
            resetGame: () => this.resetGame()
        };

        this.uiController.setupEventListeners(handlers);
    }

    /**
     * Configura os controles de teclado
     */
    setupKeyboardControls() {
        this.uiController.setupKeyboardControls((event) => {
            if (this.gameState.isGameOver || this.gameState.isPaused) return;

            switch (event.code) {
                case 'ArrowLeft':
                    event.preventDefault();
                    this.movePiece('left');
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    this.movePiece('right');
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    this.movePiece('down');
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    this.rotatePiece();
                    break;
                case 'Space':
                    event.preventDefault();
                    this.hardDrop();
                    break;
                case 'KeyP':
                    event.preventDefault();
                    this.togglePause();
                    break;
                case 'KeyR':
                    event.preventDefault();
                    this.resetGame();
                    break;
            }
        });
    }

    /**
     * Gera peças iniciais para a fila
     */
    generateInitialPieces() {
        // Preencher a fila circular
        for (let i = 0; i < 5; i++) {
            const novaPeca = this.pieceManager.generateRandomPiece();
            const peca = new Peca(novaPeca.tipo, novaPeca.pontuacao);
            this.filaCircular.inserir(peca);
        }

        // Definir peça atual
        this.gameState.currentPiece = this.filaCircular.remover();
        
        console.log("🎲 Peças iniciais geradas!");
    }

    /**
     * Inicia o jogo
     */
    startGame() {
        if (this.isGameRunning) {
            this.uiController.showFeedback("Jogo já está em execução!", "warning");
            return;
        }

        // Resetar estado se necessário
        if (this.gameState.isGameOver) {
            this.resetGame();
        }

        // Garantir que existam peças na fila e uma peça atual
        if (this.filaCircular.estaVazia()) {
            this.generateInitialPieces();
        }

        // Criar a primeira peça em queda se necessário
        if (!this.pieceManager.fallingPiece) {
            if (!this.gameState.currentPiece) {
                this.generateNewPiece();
            }
            if (this.gameState.currentPiece) {
                const falling = this.pieceManager.createFallingPiece(this.gameState.currentPiece);
                if (!falling) {
                    this.uiController.showFeedback("Erro ao criar peça inicial!", "error");
                } else {
                    // A peça atual agora está em jogo
                    this.gameState.currentPiece = null;
                }
            }
        }

        // Atualizar a interface antes de iniciar o loop
        this.updateDisplay();

        // Iniciar o loop do jogo
        this.startGameLoop();
        this.uiController.showFeedback("Jogo Iniciado!", "success");
        console.log("🎮 Jogo iniciado!");
    }

    /**
     * Inicia o loop principal do jogo
     */
    startGameLoop() {
        // Se já há um frame agendado, não agendar outro
        if (this.isGameRunning && this.gameLoop !== null) return;

        this.isGameRunning = true;
        this.gameState.isPaused = false;
        this.gameState.lastMoveTime = Date.now();

        this.gameLoop = requestAnimationFrame(() => this.runGameLoopTick());
        console.log("▶️ Game loop iniciado!");
    }

    runGameLoopTick() {
        if (!this.isGameRunning || this.gameState.isPaused) return;

        const currentTime = Date.now();

        // Verificar se é hora de mover a peça para baixo
        if (currentTime - this.gameState.lastMoveTime > this.gameState.gameSpeed) {
            this.autoMovePieceDown();
            this.gameState.lastMoveTime = currentTime;
        }

        // Atualizar display
        this.updateDisplay();

        // Continuar o loop se o jogo não terminou
        if (!this.gameState.isGameOver) {
            this.gameLoop = requestAnimationFrame(() => this.runGameLoopTick());
        }
    }

    /**
     * Para o loop do jogo
     */
    stopGameLoop() {
        this.isGameRunning = false;
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
        console.log("⏹️ Game loop parado!");
    }

    /**
     * Alterna entre pausar e continuar o jogo
     */
    togglePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        
        if (this.gameState.isPaused) {
            // Marcar que não há frame agendado para permitir retomada
            this.gameLoop = null;
            this.uiController.showFeedback("Jogo Pausado", "info");
        } else {
            this.uiController.showFeedback("Jogo Retomado", "success");
            // Retomar o loop
            this.startGameLoop();
        }
    }

    /**
     * Joga a peça atual
     */
    playPiece() {
        if (!this.gameState.currentPiece) {
            this.uiController.showFeedback("Nenhuma peça disponível!", "warning");
            return;
        }

        // Criar peça em queda
        const fallingPiece = this.pieceManager.createFallingPiece(this.gameState.currentPiece);
        
        if (!fallingPiece) {
            this.uiController.showFeedback("Erro ao criar peça!", "error");
            return;
        }

        // Verificar se a peça pode ser colocada
        if (!this.pieceManager.isValidPosition(fallingPiece.x, fallingPiece.y, fallingPiece.shape, this.gameGrid)) {
            this.gameOver();
            return;
        }

        // Registrar jogada no sistema expert
        this.sistemaExpert.registrarJogada(this.gameState.currentPiece, 'fila');
        
        // Iniciar o jogo se não estiver rodando
        if (!this.isGameRunning) {
            this.startGameLoop();
        }

        // Limpar peça atual
        this.gameState.currentPiece = null;
        
        this.uiController.showFeedback("Peça jogada!", "success");
        this.updateDisplay();
    }

    /**
     * Transfere a peça atual para a pilha de reserva
     */
    transferPiece() {
        if (!this.gameState.currentPiece) {
            this.uiController.showFeedback("Nenhuma peça para transferir!", "warning");
            return;
        }

        const sucesso = this.pilhaReserva.reservar(this.gameState.currentPiece);
        
        if (sucesso) {
            this.sistemaExpert.registrarJogada(this.gameState.currentPiece, 'reserva');
            this.gameState.currentPiece = null;
            this.uiController.showFeedback("Peça transferida para reserva!", "success");
        } else {
            this.uiController.showFeedback("Pilha de reserva cheia!", "warning");
        }
        
        this.updateDisplay();
    }

    /**
     * Usa uma peça da pilha de reserva
     */
    useReservePiece() {
        if (this.gameState.currentPiece) {
            this.uiController.showFeedback("Já existe uma peça atual!", "warning");
            return;
        }

        const pecaReserva = this.pilhaReserva.retirar();
        
        if (pecaReserva) {
            this.gameState.currentPiece = pecaReserva;
            this.sistemaExpert.registrarJogada(pecaReserva, 'pilha');
            this.uiController.showFeedback("Peça retirada da reserva!", "success");
        } else {
            this.uiController.showFeedback("Pilha de reserva vazia!", "warning");
        }
        
        this.updateDisplay();
    }

    /**
     * Gera uma nova peça
     */
    generateNewPiece() {
        if (this.gameState.currentPiece) {
            this.uiController.showFeedback("Já existe uma peça atual!", "warning");
            return;
        }

        const novaPeca = this.pieceManager.generateRandomPiece();
        const peca = new Peca(novaPeca.tipo, novaPeca.pontuacao);
        
        // Adicionar à fila e pegar a próxima
        this.filaCircular.inserir(peca);
        this.gameState.currentPiece = this.filaCircular.remover();
        
        this.uiController.showFeedback("Nova peça gerada!", "success");
        this.updateDisplay();
    }

    /**
     * Move a peça em queda
     * @param {string} direction - Direção do movimento
     */
    movePiece(direction) {
        if (!this.pieceManager.fallingPiece) return;

        const moved = this.pieceManager.moveFallingPiece(direction, this.gameGrid);
        
        if (moved && direction === 'down') {
            this.gameState.score += 1; // Pontuação por movimento para baixo
        }
        
        // Se não conseguiu mover para baixo, fixar a peça
        if (!moved && direction === 'down') {
            this.lockCurrentPiece();
        }
    }

    /**
     * Rotaciona a peça em queda
     */
    rotatePiece() {
        if (!this.pieceManager.fallingPiece) return;

        this.pieceManager.rotateFallingPiece(this.gameGrid);
    }

    /**
     * Executa hard drop (queda rápida)
     */
    hardDrop() {
        if (!this.pieceManager.fallingPiece) return;

        const dropDistance = this.pieceManager.hardDrop(this.gameGrid);
        this.gameState.score += dropDistance * 2; // Pontuação extra por hard drop
        
        this.lockCurrentPiece();
    }

    /**
     * Move automaticamente a peça para baixo
     */
    autoMovePieceDown() {
        if (this.pieceManager.fallingPiece) {
            this.movePiece('down');
        }
    }

    /**
     * Fixa a peça atual no grid
     */
    lockCurrentPiece() {
        if (!this.pieceManager.fallingPiece) return;

        const pieceInfo = this.pieceManager.lockFallingPiece(this.gameGrid);
        
        if (pieceInfo) {
            // Adicionar pontuação da peça
            this.gameState.score += pieceInfo.pontuacao;
            
            // Verificar linhas completas
            this.checkAndClearLines();
            
            // Verificar se o jogo terminou
            if (this.pieceManager.isGameOver(this.gameGrid)) {
                this.gameOver();
                return;
            }
            
            // Gerar próxima peça se necessário
            if (!this.gameState.currentPiece) {
                this.generateNewPiece();
            }
        }
    }

    /**
     * Verifica e remove linhas completas
     */
    checkAndClearLines() {
        const completeLines = this.pieceManager.checkCompleteLines(this.gameGrid);
        
        if (completeLines.length > 0) {
            // Remover linhas
            const linesCleared = this.pieceManager.clearCompleteLines(this.gameGrid, completeLines);
            
            // Calcular pontuação
            const lineScore = this.pieceManager.calculateLineScore(linesCleared, this.gameState.level);
            this.gameState.score += lineScore;
            this.gameState.lines += linesCleared;
            
            // Atualizar combos
            if (linesCleared > 1) {
                this.gameState.combos++;
                this.sistemaExpert.registrarCombo(linesCleared);
            }
            
            // Verificar mudança de nível
            this.checkLevelUp();
            
            // Feedback visual
            const messages = {
                1: "Single!",
                2: "Double!",
                3: "Triple!",
                4: "TETRIS!"
            };
            
            this.uiController.showFeedback(messages[linesCleared] || "Linhas removidas!", "success");
        }
    }

    /**
     * Verifica se deve subir de nível
     */
    checkLevelUp() {
        const newLevel = Math.floor(this.gameState.lines / 10) + 1;
        
        if (newLevel > this.gameState.level) {
            this.gameState.level = newLevel;
            this.gameState.gameSpeed = Math.max(100, 1000 - (this.gameState.level - 1) * 50);
            this.uiController.showFeedback(`Nível ${this.gameState.level}!`, "success");
        }
    }

    /**
     * Termina o jogo
     */
    gameOver() {
        this.gameState.isGameOver = true;
        this.stopGameLoop();
        
        this.uiController.showFeedback("Game Over!", "error");
        this.sistemaExpert.finalizarJogo(this.gameState.score);
        
        console.log("💀 Game Over!");
    }

    /**
     * Exibe estatísticas detalhadas
     */
    showDetailedStats() {
        this.uiController.showDetailedStats(this.sistemaExpert);
    }

    /**
     * Otimiza o sistema
     */
    optimizeSystem() {
        const otimizacoes = this.filaCircular.otimizar();
        
        if (otimizacoes > 0) {
            this.uiController.showFeedback(`Sistema otimizado! ${otimizacoes} melhorias aplicadas.`, "success");
        } else {
            this.uiController.showFeedback("Sistema já está otimizado!", "info");
        }
        
        this.updateDisplay();
    }

    /**
     * Reseta o jogo
     */
    resetGame() {
        // Parar o jogo
        this.stopGameLoop();
        
        // Resetar estado
        this.gameState = this.initializeGameState();
        this.gameGrid = this.createGameGrid();
        
        // Resetar módulos
        this.pieceManager.reset();
        this.filaCircular = new FilaCircular();
        this.pilhaReserva = new PilhaReserva();
        this.sistemaExpert = new SistemaExpert();
        
        // Gerar peças iniciais
        this.generateInitialPieces();
        
        // Resetar interface
        this.uiController.resetDisplay();
        this.updateDisplay();
        
        this.uiController.showFeedback("Jogo resetado!", "success");
        console.log("🔄 Jogo resetado!");
    }

    /**
     * Atualiza todo o display do jogo
     */
    updateDisplay() {
        const gameData = {
            gameState: this.gameState,
            filaCircular: this.filaCircular,
            pilhaReserva: this.pilhaReserva,
            sistemaExpert: this.sistemaExpert,
            gameGrid: this.gameGrid,
            fallingPiece: this.pieceManager.fallingPiece
        };

        this.uiController.updateCompleteDisplay(gameData);
        
        // Atualizar dica do sistema expert
        const dica = this.sistemaExpert.obterDicaInteligente(
            this.gameState.currentPiece,
            this.filaCircular,
            this.pilhaReserva
        );
        
        if (dica) {
            this.uiController.showExpertTip(dica);
        }
    }

    /**
     * Obtém o estado atual do jogo
     * @returns {Object} Estado completo do jogo
     */
    getGameState() {
        return {
            gameState: this.gameState,
            gameGrid: this.gameGrid,
            filaCircular: this.filaCircular,
            pilhaReserva: this.pilhaReserva,
            sistemaExpert: this.sistemaExpert,
            isGameRunning: this.isGameRunning,
            isPaused: this.gameState.isPaused
        };
    }

    /**
     * Obtém estatísticas do jogo
     * @returns {Object} Estatísticas completas
     */
    getGameStats() {
        return {
            score: this.gameState.score,
            level: this.gameState.level,
            lines: this.gameState.lines,
            combos: this.gameState.combos,
            efficiency: this.sistemaExpert.estatisticas.eficiencia,
            totalPlays: this.sistemaExpert.estatisticas.jogadasTotais,
            queuePlays: this.sistemaExpert.estatisticas.jogadasDaFila,
            stackPlays: this.sistemaExpert.estatisticas.jogadasDaPilha,
            reservedPieces: this.sistemaExpert.estatisticas.pecasReservadas
        };
    }

    /**
     * Executa uma ação específica do jogo
     * @param {string} action - Ação a ser executada
     * @param {Object} params - Parâmetros da ação
     */
    executeAction(action, params = {}) {
        switch (action) {
            case 'play':
                this.playPiece();
                break;
            case 'transfer':
                this.transferPiece();
                break;
            case 'use-reserve':
                this.useReservePiece();
                break;
            case 'generate':
                this.generateNewPiece();
                break;
            case 'move':
                this.movePiece(params.direction);
                break;
            case 'rotate':
                this.rotatePiece();
                break;
            case 'hard-drop':
                this.hardDrop();
                break;
            case 'pause':
                this.togglePause();
                break;
            case 'reset':
                this.resetGame();
                break;
            case 'optimize':
                this.optimizeSystem();
                break;
            default:
                console.warn(`Ação desconhecida: ${action}`);
        }
    }
}