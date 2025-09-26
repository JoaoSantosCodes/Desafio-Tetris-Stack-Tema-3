/**
 * Aplicação Principal - Tetris Expert System
 * Arquivo principal que integra todos os módulos e inicializa o sistema
 */

import { GameEngine } from './modules/game-engine.js';

class TetrisApp {
    constructor() {
        this.gameEngine = null;
        this.isInitialized = false;
    }

    /**
     * Inicializa a aplicação
     */
    async initialize() {
        try {
            console.log("🚀 Inicializando Tetris Expert System...");
            
            // Verificar se o DOM está carregado
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Inicializar o motor do jogo
            this.gameEngine = new GameEngine();
            
            // Configurar handlers globais
            this.setupGlobalHandlers();
            
            // Marcar como inicializado
            this.isInitialized = true;
            
            console.log("✅ Tetris Expert System inicializado com sucesso!");
            
            // Exibir mensagem de boas-vindas
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error("❌ Erro ao inicializar a aplicação:", error);
            this.showErrorMessage("Erro ao inicializar o jogo. Verifique o console para mais detalhes.");
        }
    }

    /**
     * Configura handlers globais da aplicação
     */
    setupGlobalHandlers() {
        // Handler para erros não capturados
        window.addEventListener('error', (event) => {
            console.error("Erro não capturado:", event.error);
            this.showErrorMessage("Ocorreu um erro inesperado. O jogo pode não funcionar corretamente.");
        });

        // Handler para promessas rejeitadas
        window.addEventListener('unhandledrejection', (event) => {
            console.error("Promise rejeitada:", event.reason);
            event.preventDefault();
        });

        // Handler para mudança de visibilidade da página
        document.addEventListener('visibilitychange', () => {
            if (this.gameEngine && document.hidden) {
                // Pausar o jogo quando a aba não estiver visível
                if (this.gameEngine.isGameRunning && !this.gameEngine.gameState.isPaused) {
                    this.gameEngine.togglePause();
                }
            }
        });

        // Handler para redimensionamento da janela
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });

        console.log("🔧 Handlers globais configurados");
    }

    /**
     * Lida com o redimensionamento da janela
     */
    handleWindowResize() {
        // Aqui você pode adicionar lógica para ajustar o layout
        // quando a janela for redimensionada
        console.log("📐 Janela redimensionada");
    }

    /**
     * Exibe mensagem de boas-vindas
     */
    showWelcomeMessage() {
        const welcomeMessages = [
            "Bem-vindo ao Tetris Expert System!",
            "Use as setas para mover, espaço para drop rápido",
            "P para pausar, R para resetar",
            "Divirta-se jogando!"
        ];

        welcomeMessages.forEach((message, index) => {
            setTimeout(() => {
                if (this.gameEngine && this.gameEngine.uiController) {
                    this.gameEngine.uiController.showFeedback(message, "info");
                }
            }, index * 2000);
        });
    }

    /**
     * Exibe mensagem de erro
     * @param {string} message - Mensagem de erro
     */
    showErrorMessage(message) {
        // Criar elemento de erro se não existir
        let errorElement = document.getElementById('error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'error-message';
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #ff4444;
                color: white;
                padding: 15px 25px;
                border-radius: 5px;
                z-index: 10000;
                font-family: Arial, sans-serif;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';

        // Remover após 5 segundos
        setTimeout(() => {
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }, 5000);
    }

    /**
     * Obtém informações sobre o estado da aplicação
     * @returns {Object} Informações da aplicação
     */
    getAppInfo() {
        return {
            isInitialized: this.isInitialized,
            gameEngine: this.gameEngine ? 'Loaded' : 'Not Loaded',
            version: '2.0.0',
            modules: [
                'GameEngine',
                'UIController', 
                'PieceManager',
                'DataStructures'
            ]
        };
    }

    /**
     * Executa diagnóstico da aplicação
     * @returns {Object} Resultado do diagnóstico
     */
    runDiagnostic() {
        const diagnostic = {
            timestamp: new Date().toISOString(),
            status: 'OK',
            issues: [],
            modules: {}
        };

        try {
            // Verificar inicialização
            if (!this.isInitialized) {
                diagnostic.issues.push('Aplicação não inicializada');
                diagnostic.status = 'ERROR';
            }

            // Verificar GameEngine
            if (this.gameEngine) {
                diagnostic.modules.gameEngine = 'OK';
                
                // Verificar UIController
                if (this.gameEngine.uiController) {
                    diagnostic.modules.uiController = 'OK';
                } else {
                    diagnostic.modules.uiController = 'ERROR';
                    diagnostic.issues.push('UIController não carregado');
                }

                // Verificar PieceManager
                if (this.gameEngine.pieceManager) {
                    diagnostic.modules.pieceManager = 'OK';
                } else {
                    diagnostic.modules.pieceManager = 'ERROR';
                    diagnostic.issues.push('PieceManager não carregado');
                }

                // Verificar estruturas de dados
                if (this.gameEngine.filaCircular && this.gameEngine.pilhaReserva && this.gameEngine.sistemaExpert) {
                    diagnostic.modules.dataStructures = 'OK';
                } else {
                    diagnostic.modules.dataStructures = 'ERROR';
                    diagnostic.issues.push('Estruturas de dados não carregadas');
                }
            } else {
                diagnostic.modules.gameEngine = 'ERROR';
                diagnostic.issues.push('GameEngine não carregado');
                diagnostic.status = 'ERROR';
            }

            // Verificar elementos DOM críticos
            const criticalElements = [
                'tetris-grid',
                'current-piece',
                'score',
                'level'
            ];

            const missingElements = criticalElements.filter(id => !document.getElementById(id));
            if (missingElements.length > 0) {
                diagnostic.issues.push(`Elementos DOM ausentes: ${missingElements.join(', ')}`);
                diagnostic.status = 'WARNING';
            }

        } catch (error) {
            diagnostic.status = 'ERROR';
            diagnostic.issues.push(`Erro durante diagnóstico: ${error.message}`);
        }

        return diagnostic;
    }

    /**
     * Reinicia a aplicação
     */
    async restart() {
        try {
            console.log("🔄 Reiniciando aplicação...");
            
            // Parar o jogo atual se estiver rodando
            if (this.gameEngine) {
                this.gameEngine.stopGameLoop();
            }

            // Resetar estado
            this.gameEngine = null;
            this.isInitialized = false;

            // Reinicializar
            await this.initialize();
            
            console.log("✅ Aplicação reiniciada com sucesso!");
            
        } catch (error) {
            console.error("❌ Erro ao reiniciar aplicação:", error);
            this.showErrorMessage("Erro ao reiniciar a aplicação.");
        }
    }

    /**
     * Obtém estatísticas da aplicação
     * @returns {Object} Estatísticas completas
     */
    getStats() {
        if (!this.gameEngine) {
            return { error: 'GameEngine não inicializado' };
        }

        return {
            app: this.getAppInfo(),
            game: this.gameEngine.getGameStats(),
            diagnostic: this.runDiagnostic()
        };
    }

    /**
     * Executa comando da aplicação
     * @param {string} command - Comando a ser executado
     * @param {Object} params - Parâmetros do comando
     */
    executeCommand(command, params = {}) {
        if (!this.isInitialized || !this.gameEngine) {
            console.warn("Aplicação não inicializada");
            return;
        }

        switch (command) {
            case 'restart':
                this.restart();
                break;
            case 'diagnostic':
                return this.runDiagnostic();
            case 'stats':
                return this.getStats();
            case 'info':
                return this.getAppInfo();
            default:
                // Delegar para o GameEngine
                this.gameEngine.executeAction(command, params);
        }
    }
}

// Instância global da aplicação
let tetrisApp = null;

/**
 * Função de inicialização global
 */
async function initializeTetrisApp() {
    if (tetrisApp) {
        console.warn("Aplicação já inicializada");
        return tetrisApp;
    }

    tetrisApp = new TetrisApp();
    await tetrisApp.initialize();
    
    // Expor globalmente para debug
    window.tetrisApp = tetrisApp;
    
    return tetrisApp;
}

/**
 * Função utilitária para obter a instância da aplicação
 */
function getTetrisApp() {
    return tetrisApp;
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTetrisApp);
} else {
    initializeTetrisApp();
}

// Exportar para uso em módulos
export { TetrisApp, initializeTetrisApp, getTetrisApp };

// Expor globalmente para compatibilidade
window.initializeTetrisApp = initializeTetrisApp;
window.getTetrisApp = getTetrisApp;