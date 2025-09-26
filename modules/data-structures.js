/**
 * Módulo de Estruturas de Dados - Tetris Expert System
 * Contém as classes fundamentais: Peca, FilaCircular, PilhaReserva e SistemaExpert
 */

/**
 * Classe que representa uma peça do Tetris
 * Baseada na estrutura original do código C
 */
export class Peca {
    /**
     * Construtor da peça
     * @param {string} tipo - Tipo da peça (I, O, T, S, Z, J, L)
     * @param {number} pontuacao - Pontuação base da peça
     */
    constructor(tipo, pontuacao = 50) {
        this.tipo = tipo;
        this.pontuacao = pontuacao;
        this.timestamp = Date.now();
    }
}

/**
 * Implementação de uma fila circular para gerenciar peças
 * Estrutura de dados fundamental do sistema expert
 */
export class FilaCircular {
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
     * Insere uma nova peça no final da fila
     * @param {Peca} peca - Peça a ser inserida
     * @returns {boolean} True se a inserção foi bem-sucedida
     */
    inserir(peca) {
        if (this.filaCheia()) {
            console.warn("⚠️ Fila cheia! Não é possível inserir nova peça.");
            return false;
        }

        this.pecas[this.indiceTras] = peca;
        this.indiceTras = (this.indiceTras + 1) % 5;
        this.quantidadePecas++;
        
        console.log(`✅ Peça ${peca.tipo} inserida na fila. Total: ${this.quantidadePecas}`);
        return true;
    }

    /**
     * Remove e retorna a primeira peça da fila
     * @returns {Peca|null} A peça removida ou null se a fila estiver vazia
     */
    remover() {
        if (this.filaVazia()) {
            console.warn("⚠️ Fila vazia! Não há peças para jogar.");
            return null;
        }

        const peca = this.pecas[this.indiceFrente];
        this.pecas[this.indiceFrente] = null;
        this.indiceFrente = (this.indiceFrente + 1) % 5;
        this.quantidadePecas--;
        
        console.log(`🎮 Peça ${peca.tipo} jogada da fila. Restam: ${this.quantidadePecas}`);
        return peca;
    }

    /**
     * Obtém uma peça por índice sem removê-la
     * @param {number} index - Índice da peça (0 = primeira)
     * @returns {Peca|null} A peça no índice especificado
     */
    obterPecaPorIndice(index) {
        if (index < 0 || index >= this.quantidadePecas) {
            return null;
        }
        
        const indiceReal = (this.indiceFrente + index) % 5;
        return this.pecas[indiceReal];
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
export class PilhaReserva {
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
     * Reserva uma peça no topo da pilha
     * @param {Peca} peca - Peça a ser reservada
     * @returns {boolean} True se a reserva foi bem-sucedida
     */
    reservarPeca(peca) {
        if (this.pilhaCheia()) {
            console.warn("⚠️ Pilha de reserva cheia! Não é possível reservar mais peças.");
            return false;
        }

        this.topo++;
        this.pecas[this.topo] = peca;
        
        console.log(`📦 Peça ${peca.tipo} reservada. Posição na pilha: ${this.topo + 1}`);
        return true;
    }

    /**
     * Retira e retorna a peça do topo da pilha
     * @returns {Peca|null} A peça retirada ou null se a pilha estiver vazia
     */
    retirarPeca() {
        if (this.pilhaVazia()) {
            console.warn("⚠️ Pilha de reserva vazia! Não há peças para retirar.");
            return null;
        }

        const peca = this.pecas[this.topo];
        this.pecas[this.topo] = null;
        this.topo--;
        
        console.log(`🎯 Peça ${peca.tipo} retirada da reserva. Peças restantes: ${this.topo + 1}`);
        return peca;
    }

    /**
     * Visualiza a peça do topo sem removê-la
     * @returns {Peca|null} A peça do topo ou null se vazia
     */
    verTopo() {
        if (this.pilhaVazia()) {
            return null;
        }
        return this.pecas[this.topo];
    }

    /**
     * Obtém uma peça por posição na pilha (0 = base, topo = último)
     * @param {number} posicao - Posição na pilha
     * @returns {Peca|null} A peça na posição especificada
     */
    obterPecaPorPosicao(posicao) {
        if (posicao < 0 || posicao > this.topo) {
            return null;
        }
        return this.pecas[posicao];
    }
}

/**
 * Sistema Expert que gerencia a lógica inteligente do jogo
 * Calcula pontuações, detecta combos e analisa performance
 */
export class SistemaExpert {
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
     * Calcula a pontuação de uma peça baseada no tipo e multiplicadores
     * @param {string} tipoPeca - Tipo da peça jogada
     * @returns {number} Pontuação calculada
     */
    calcularPontuacao(tipoPeca) {
        // Pontuação base por tipo de peça
        const pontosBase = this.getValorBasePeca(tipoPeca);
        
        // Multiplicador baseado no total de jogadas (experiência)
        const multiplicadorExperiencia = 1 + (this.estatisticas.jogadasTotais * 0.01);
        
        // Multiplicador de combo
        const multiplicadorCombo = 1 + (this.comboAtual * 0.1);
        
        const pontuacaoFinal = Math.floor(pontosBase * multiplicadorExperiencia * multiplicadorCombo);
        
        console.log(`💰 Pontuação calculada para ${tipoPeca}: ${pontuacaoFinal} pontos`);
        return pontuacaoFinal;
    }

    /**
     * Registra uma jogada no sistema expert
     * @param {string} tipoPeca - Tipo da peça jogada
     * @param {string} origem - Origem da peça ('fila' ou 'pilha')
     */
    registrarJogada(tipoPeca, origem = 'fila') {
        // Atualizar estatísticas gerais
        this.estatisticas.jogadasTotais++;
        
        if (origem === 'fila') {
            this.estatisticas.jogadasDaFila++;
        } else if (origem === 'pilha') {
            this.estatisticas.jogadasDaPilha++;
        }
        
        // Atualizar contador por tipo
        if (this.contadorPecas.hasOwnProperty(tipoPeca)) {
            this.contadorPecas[tipoPeca]++;
        }
        
        // Detectar combos
        this.detectarCombo(tipoPeca);
        
        // Atualizar eficiência
        this.calcularEficiencia();
        
        console.log(`📊 Jogada registrada: ${tipoPeca} (${origem}). Total: ${this.estatisticas.jogadasTotais}`);
    }

    /**
     * Registra uma peça reservada
     * @param {string} tipoPeca - Tipo da peça reservada
     */
    registrarReserva(tipoPeca) {
        this.estatisticas.pecasReservadas++;
        console.log(`📦 Reserva registrada: ${tipoPeca}. Total reservado: ${this.estatisticas.pecasReservadas}`);
    }

    /**
     * Detecta e atualiza combos baseado na sequência de jogadas
     * @param {string} tipoPeca - Tipo da peça atual
     */
    detectarCombo(tipoPeca) {
        if (this.ultimaJogada === tipoPeca) {
            this.comboAtual++;
            console.log(`🔥 Combo x${this.comboAtual} com peças ${tipoPeca}!`);
        } else {
            this.comboAtual = 0;
        }
        this.ultimaJogada = tipoPeca;
    }

    /**
     * Calcula a eficiência atual do sistema
     * @returns {number} Percentual de eficiência (0-100)
     */
    calcularEficiencia() {
        if (this.estatisticas.jogadasTotais === 0) {
            return 0;
        }
        
        // Eficiência baseada na proporção de uso da fila vs pilha
        const proporcaoFila = this.estatisticas.jogadasDaFila / this.estatisticas.jogadasTotais;
        const proporcaoPilha = this.estatisticas.jogadasDaPilha / this.estatisticas.jogadasTotais;
        
        // Eficiência ideal: 70% fila, 30% pilha
        const eficienciaFila = Math.max(0, 100 - Math.abs(proporcaoFila - 0.7) * 100);
        const eficienciaPilha = Math.max(0, 100 - Math.abs(proporcaoPilha - 0.3) * 100);
        
        this.estatisticas.eficiencia = Math.floor((eficienciaFila + eficienciaPilha) / 2);
        return this.estatisticas.eficiencia;
    }

    /**
     * Verifica progressão de nível baseada na pontuação
     * @param {number} pontuacaoAtual - Pontuação atual do jogo
     * @returns {number} Nível calculado
     */
    verificarProgressaoNivel(pontuacaoAtual) {
        return Math.floor(pontuacaoAtual / 1000) + 1;
    }

    /**
     * Retorna o valor base de uma peça
     * @param {string} tipo - Tipo da peça
     * @returns {number} Valor base da peça
     */
    getValorBasePeca(tipo) {
        const valores = {
            'I': 100,  // Linha - mais comum, menor valor
            'O': 120,  // Quadrado - versátil, valor médio
            'T': 150,  // T - estratégico, valor alto
            'L': 180,  // L - mais complexo, maior valor
            'J': 180,  // J - complexidade similar ao L
            'S': 140,  // S - valor médio-alto
            'Z': 140   // Z - valor médio-alto
        };
        return valores[tipo] || 50;
    }

    /**
     * Gera dica inteligente baseada no estado atual
     * @param {FilaCircular} fila - Fila circular atual
     * @param {PilhaReserva} pilha - Pilha de reserva atual
     * @returns {string} Dica para o jogador
     */
    obterDicaInteligente(fila, pilha) {
        const dicas = [
            "💡 Use a pilha de reserva para peças estratégicas!",
            "🎯 Peças 'I' são ideais para linhas múltiplas!",
            "⚡ Mantenha um equilíbrio entre fila e pilha!",
            "🔥 Combos aumentam sua pontuação!",
            "📈 Otimize a fila para maximizar eficiência!"
        ];
        
        return dicas[Math.floor(Math.random() * dicas.length)];
    }

    /**
     * Reseta todas as estatísticas do sistema expert
     */
    resetar() {
        this.estatisticas = {
            jogadasTotais: 0,
            jogadasDaFila: 0,
            jogadasDaPilha: 0,
            pecasReservadas: 0,
            eficiencia: 0
        };
        
        Object.keys(this.contadorPecas).forEach(tipo => {
            this.contadorPecas[tipo] = 0;
        });
        
        this.comboAtual = 0;
        this.ultimaJogada = null;
        this.conquistas = [];
        
        console.log("🔄 Sistema Expert resetado!");
    }
}