/**
 * Módulo Piece Manager - Tetris Expert System
 * Gerencia todas as operações relacionadas às peças do Tetris
 */

export class PieceManager {
    constructor() {
        this.pieceShapes = this.initializePieceShapes();
        this.pieceColors = this.initializePieceColors();
        this.currentPiece = null;
        this.fallingPiece = null;
    }

    /**
     * Inicializa as formas das peças do Tetris
     */
    initializePieceShapes() {
        return {
            'I': [
                [1, 1, 1, 1]
            ],
            'O': [
                [1, 1],
                [1, 1]
            ],
            'T': [
                [0, 1, 0],
                [1, 1, 1]
            ],
            'S': [
                [0, 1, 1],
                [1, 1, 0]
            ],
            'Z': [
                [1, 1, 0],
                [0, 1, 1]
            ],
            'J': [
                [1, 0, 0],
                [1, 1, 1]
            ],
            'L': [
                [0, 0, 1],
                [1, 1, 1]
            ]
        };
    }

    /**
     * Inicializa as cores das peças
     */
    initializePieceColors() {
        return {
            'I': '#00f0f0', // Ciano
            'O': '#f0f000', // Amarelo
            'T': '#a000f0', // Roxo
            'S': '#00f000', // Verde
            'Z': '#f00000', // Vermelho
            'J': '#0000f0', // Azul
            'L': '#f0a000'  // Laranja
        };
    }

    /**
     * Gera uma nova peça aleatória
     * @returns {Peca} Nova peça gerada
     */
    generateRandomPiece() {
        const tipos = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
        
        // Importar a classe Peca do módulo de estruturas de dados
        return {
            tipo: tipoAleatorio,
            pontuacao: this.getBasePieceScore(tipoAleatorio),
            timestamp: Date.now()
        };
    }

    /**
     * Obtém a pontuação base de uma peça
     * @param {string} tipo - Tipo da peça
     * @returns {number} Pontuação base
     */
    getBasePieceScore(tipo) {
        const baseScores = {
            'I': 100, // Peça linha - mais valiosa
            'O': 40,  // Quadrado - estável
            'T': 60,  // T - versátil
            'S': 80,  // S - complexa
            'Z': 80,  // Z - complexa
            'J': 60,  // J - versátil
            'L': 60   // L - versátil
        };
        return baseScores[tipo] || 50;
    }

    /**
     * Cria uma peça em queda para o jogo
     * @param {Object} peca - Peça a ser convertida
     * @returns {Object} Peça em queda com posição e forma
     */
    createFallingPiece(peca) {
        if (!peca || !this.pieceShapes[peca.tipo]) {
            console.error("Tipo de peça inválido:", peca);
            return null;
        }

        const shape = JSON.parse(JSON.stringify(this.pieceShapes[peca.tipo])); // Deep copy
        
        this.fallingPiece = {
            tipo: peca.tipo,
            shape: shape,
            x: Math.floor((10 - shape[0].length) / 2), // Centralizar horizontalmente
            y: 0,
            rotation: 0,
            color: this.pieceColors[peca.tipo],
            pontuacao: peca.pontuacao
        };

        return this.fallingPiece;
    }

    /**
     * Move a peça em queda
     * @param {string} direction - Direção do movimento ('left', 'right', 'down')
     * @param {Array} gameGrid - Grid do jogo
     * @returns {boolean} True se o movimento foi válido
     */
    moveFallingPiece(direction, gameGrid) {
        if (!this.fallingPiece) return false;

        let newX = this.fallingPiece.x;
        let newY = this.fallingPiece.y;

        switch (direction) {
            case 'left':
                newX--;
                break;
            case 'right':
                newX++;
                break;
            case 'down':
                newY++;
                break;
        }

        if (this.isValidPosition(newX, newY, this.fallingPiece.shape, gameGrid)) {
            this.fallingPiece.x = newX;
            this.fallingPiece.y = newY;
            return true;
        }

        return false;
    }

    /**
     * Rotaciona a peça em queda
     * @param {Array} gameGrid - Grid do jogo
     * @returns {boolean} True se a rotação foi válida
     */
    rotateFallingPiece(gameGrid) {
        if (!this.fallingPiece) return false;

        const rotatedShape = this.rotateShape(this.fallingPiece.shape);
        
        if (this.isValidPosition(this.fallingPiece.x, this.fallingPiece.y, rotatedShape, gameGrid)) {
            this.fallingPiece.shape = rotatedShape;
            this.fallingPiece.rotation = (this.fallingPiece.rotation + 90) % 360;
            return true;
        }

        return false;
    }

    /**
     * Rotaciona uma forma de peça 90 graus no sentido horário
     * @param {Array} shape - Forma da peça
     * @returns {Array} Forma rotacionada
     */
    rotateShape(shape) {
        const rows = shape.length;
        const cols = shape[0].length;
        const rotated = [];

        for (let col = 0; col < cols; col++) {
            const newRow = [];
            for (let row = rows - 1; row >= 0; row--) {
                newRow.push(shape[row][col]);
            }
            rotated.push(newRow);
        }

        return rotated;
    }

    /**
     * Verifica se uma posição é válida para a peça
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {Array} shape - Forma da peça
     * @param {Array} gameGrid - Grid do jogo
     * @returns {boolean} True se a posição é válida
     */
    isValidPosition(x, y, shape, gameGrid) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] === 1) {
                    const newX = x + col;
                    const newY = y + row;

                    // Verificar limites do grid
                    if (newX < 0 || newX >= 10 || newY >= 20) {
                        return false;
                    }

                    // Verificar colisão com peças existentes (apenas se Y >= 0)
                    if (newY >= 0 && gameGrid[newY][newX] !== 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Executa hard drop (queda rápida) da peça
     * @param {Array} gameGrid - Grid do jogo
     * @returns {number} Número de linhas que a peça caiu
     */
    hardDrop(gameGrid) {
        if (!this.fallingPiece) return 0;

        let dropDistance = 0;
        
        while (this.moveFallingPiece('down', gameGrid)) {
            dropDistance++;
        }

        return dropDistance;
    }

    /**
     * Fixa a peça em queda no grid
     * @param {Array} gameGrid - Grid do jogo
     * @returns {Object} Informações sobre a peça fixada
     */
    lockFallingPiece(gameGrid) {
        if (!this.fallingPiece) return null;

        const lockedCells = [];

        // Adicionar peça ao grid
        for (let row = 0; row < this.fallingPiece.shape.length; row++) {
            for (let col = 0; col < this.fallingPiece.shape[row].length; col++) {
                if (this.fallingPiece.shape[row][col] === 1) {
                    const gridX = this.fallingPiece.x + col;
                    const gridY = this.fallingPiece.y + row;
                    
                    if (gridY >= 0 && gridY < 20 && gridX >= 0 && gridX < 10) {
                        gameGrid[gridY][gridX] = this.fallingPiece.tipo;
                        lockedCells.push({ x: gridX, y: gridY });
                    }
                }
            }
        }

        const pieceInfo = {
            tipo: this.fallingPiece.tipo,
            pontuacao: this.fallingPiece.pontuacao,
            lockedCells: lockedCells,
            position: { x: this.fallingPiece.x, y: this.fallingPiece.y }
        };

        // Limpar peça em queda
        this.fallingPiece = null;

        return pieceInfo;
    }

    /**
     * Verifica se há linhas completas no grid
     * @param {Array} gameGrid - Grid do jogo
     * @returns {Array} Índices das linhas completas
     */
    checkCompleteLines(gameGrid) {
        const completeLines = [];

        for (let row = 0; row < 20; row++) {
            let isComplete = true;
            for (let col = 0; col < 10; col++) {
                if (gameGrid[row][col] === 0) {
                    isComplete = false;
                    break;
                }
            }
            if (isComplete) {
                completeLines.push(row);
            }
        }

        return completeLines;
    }

    /**
     * Remove linhas completas do grid
     * @param {Array} gameGrid - Grid do jogo
     * @param {Array} completeLines - Índices das linhas a remover
     * @returns {number} Número de linhas removidas
     */
    clearCompleteLines(gameGrid, completeLines) {
        if (completeLines.length === 0) return 0;

        // Ordenar linhas de cima para baixo para remoção correta
        completeLines.sort((a, b) => a - b);

        // Remover linhas de baixo para cima
        for (let i = completeLines.length - 1; i >= 0; i--) {
            const lineIndex = completeLines[i];
            
            // Remover a linha
            gameGrid.splice(lineIndex, 1);
            
            // Adicionar nova linha vazia no topo
            gameGrid.unshift(new Array(10).fill(0));
        }

        return completeLines.length;
    }

    /**
     * Calcula a pontuação baseada nas linhas removidas
     * @param {number} linesCleared - Número de linhas removidas
     * @param {number} level - Nível atual do jogo
     * @returns {number} Pontuação obtida
     */
    calculateLineScore(linesCleared, level) {
        const baseScores = {
            1: 100,  // Single
            2: 300,  // Double
            3: 500,  // Triple
            4: 800   // Tetris
        };

        const baseScore = baseScores[linesCleared] || 0;
        return baseScore * level;
    }

    /**
     * Verifica se o jogo terminou (peça não pode ser colocada)
     * @param {Array} gameGrid - Grid do jogo
     * @returns {boolean} True se o jogo terminou
     */
    isGameOver(gameGrid) {
        // Verificar se há peças nas primeiras duas linhas
        for (let col = 0; col < 10; col++) {
            if (gameGrid[0][col] !== 0 || gameGrid[1][col] !== 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Obtém informações sobre a peça atual
     * @returns {Object|null} Informações da peça em queda
     */
    getCurrentPieceInfo() {
        if (!this.fallingPiece) return null;

        return {
            tipo: this.fallingPiece.tipo,
            position: { x: this.fallingPiece.x, y: this.fallingPiece.y },
            rotation: this.fallingPiece.rotation,
            shape: this.fallingPiece.shape,
            color: this.fallingPiece.color,
            pontuacao: this.fallingPiece.pontuacao
        };
    }

    /**
     * Obtém a forma de uma peça por tipo
     * @param {string} tipo - Tipo da peça
     * @returns {Array|null} Forma da peça
     */
    getPieceShape(tipo) {
        return this.pieceShapes[tipo] || null;
    }

    /**
     * Obtém a cor de uma peça por tipo
     * @param {string} tipo - Tipo da peça
     * @returns {string|null} Cor da peça
     */
    getPieceColor(tipo) {
        return this.pieceColors[tipo] || null;
    }

    /**
     * Calcula a melhor posição para uma peça (IA básica)
     * @param {Object} peca - Peça a ser analisada
     * @param {Array} gameGrid - Grid do jogo
     * @returns {Object} Melhor posição encontrada
     */
    findBestPosition(peca, gameGrid) {
        if (!peca || !this.pieceShapes[peca.tipo]) return null;

        const shape = this.pieceShapes[peca.tipo];
        let bestPosition = null;
        let bestScore = -Infinity;

        // Testar todas as posições e rotações possíveis
        for (let rotation = 0; rotation < 4; rotation++) {
            const rotatedShape = this.getRotatedShape(shape, rotation);
            
            for (let x = 0; x < 10; x++) {
                // Encontrar a posição Y mais baixa possível
                let y = 0;
                while (y < 20 && this.isValidPosition(x, y + 1, rotatedShape, gameGrid)) {
                    y++;
                }

                if (this.isValidPosition(x, y, rotatedShape, gameGrid)) {
                    const score = this.evaluatePosition(x, y, rotatedShape, gameGrid);
                    
                    if (score > bestScore) {
                        bestScore = score;
                        bestPosition = { x, y, rotation, score };
                    }
                }
            }
        }

        return bestPosition;
    }

    /**
     * Obtém uma forma rotacionada
     * @param {Array} shape - Forma original
     * @param {number} rotations - Número de rotações (0-3)
     * @returns {Array} Forma rotacionada
     */
    getRotatedShape(shape, rotations) {
        let rotatedShape = JSON.parse(JSON.stringify(shape));
        
        for (let i = 0; i < rotations; i++) {
            rotatedShape = this.rotateShape(rotatedShape);
        }
        
        return rotatedShape;
    }

    /**
     * Avalia a qualidade de uma posição (para IA)
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {Array} shape - Forma da peça
     * @param {Array} gameGrid - Grid do jogo
     * @returns {number} Pontuação da posição
     */
    evaluatePosition(x, y, shape, gameGrid) {
        let score = 0;

        // Simular colocação da peça
        const tempGrid = gameGrid.map(row => [...row]);
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] === 1) {
                    const gridX = x + col;
                    const gridY = y + row;
                    
                    if (gridY >= 0 && gridY < 20 && gridX >= 0 && gridX < 10) {
                        tempGrid[gridY][gridX] = 1;
                    }
                }
            }
        }

        // Calcular pontuação baseada em vários fatores
        score += this.calculateHeightScore(tempGrid);
        score += this.calculateHoleScore(tempGrid);
        score += this.calculateLineScore(this.checkCompleteLines(tempGrid).length, 1);
        score += this.calculateBumpinessScore(tempGrid);

        return score;
    }

    /**
     * Calcula pontuação baseada na altura das colunas
     * @param {Array} grid - Grid do jogo
     * @returns {number} Pontuação de altura
     */
    calculateHeightScore(grid) {
        let totalHeight = 0;
        
        for (let col = 0; col < 10; col++) {
            for (let row = 0; row < 20; row++) {
                if (grid[row][col] !== 0) {
                    totalHeight += (20 - row);
                    break;
                }
            }
        }
        
        return -totalHeight; // Penalizar altura
    }

    /**
     * Calcula pontuação baseada em buracos no grid
     * @param {Array} grid - Grid do jogo
     * @returns {number} Pontuação de buracos
     */
    calculateHoleScore(grid) {
        let holes = 0;
        
        for (let col = 0; col < 10; col++) {
            let blockFound = false;
            for (let row = 0; row < 20; row++) {
                if (grid[row][col] !== 0) {
                    blockFound = true;
                } else if (blockFound) {
                    holes++;
                }
            }
        }
        
        return -holes * 50; // Penalizar buracos
    }

    /**
     * Calcula pontuação baseada na irregularidade das colunas
     * @param {Array} grid - Grid do jogo
     * @returns {number} Pontuação de irregularidade
     */
    calculateBumpinessScore(grid) {
        const heights = [];
        
        for (let col = 0; col < 10; col++) {
            let height = 0;
            for (let row = 0; row < 20; row++) {
                if (grid[row][col] !== 0) {
                    height = 20 - row;
                    break;
                }
            }
            heights.push(height);
        }
        
        let bumpiness = 0;
        for (let i = 0; i < heights.length - 1; i++) {
            bumpiness += Math.abs(heights[i] - heights[i + 1]);
        }
        
        return -bumpiness; // Penalizar irregularidade
    }

    /**
     * Reseta o gerenciador de peças
     */
    reset() {
        this.currentPiece = null;
        this.fallingPiece = null;
        console.log("🔄 Piece Manager resetado!");
    }
}