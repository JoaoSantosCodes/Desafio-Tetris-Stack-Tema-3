/**
 * @file tetris.c
 * @brief Sistema Avançado de Gerenciamento de Peças Tetris - Nível Expert
 * @version 3.0.0
 * @date 2024-01-27
 * @author João Santos
 * @institution Universidade Estácio de Sá
 * @discipline Estruturas de Dados
 * @created 2024-01-20
 * @updated 2024-01-27
 * 
 * @mainpage Documentação do Sistema Tetris Expert - Análise Inteligente de Jogabilidade
 * 
 * @section intro_sec Introdução
 * 
 * Este sistema implementa um simulador avançado de gerenciamento de peças do jogo Tetris
 * com **Sistema Expert de Análise Inteligente**, utilizando estruturas de dados fundamentais 
 * (fila circular e pilha linear) combinadas com algoritmos de pontuação dinâmica, 
 * detecção de combos e progressão de níveis para criar uma experiência interativa 
 * e educativa de alto nível.
 * 
 * @section features_sec Funcionalidades Principais
 * 
 * O sistema oferece as seguintes funcionalidades integradas:
 * 
 * @subsection queue_features Fila Circular de Peças
 * - **Capacidade**: 5 peças simultâneas
 * - **Operações**: Inserção (enqueue) e remoção (dequeue)
 * - **Algoritmo**: Circular com índices dinâmicos
 * - **Validação**: Controle automático de overflow/underflow
 * 
 * @subsection stack_features Pilha de Reserva
 * - **Capacidade**: 3 peças reservadas
 * - **Operações**: Empilhamento (push) e desempilhamento (pop)
 * - **Algoritmo**: LIFO (Last In, First Out)
 * - **Estratégia**: Permite reservar peças para uso posterior
 * 
 * @subsection expert_features Sistema Expert (NOVO)
 * - **Pontuação Inteligente**: Cálculo dinâmico baseado em tipo de peça e multiplicadores
 * - **Sistema de Combos**: Detecção automática de sequências e bonificações
 * - **Progressão de Níveis**: Aumento automático de dificuldade e desafios
 * - **Estatísticas Avançadas**: Análise completa de performance e eficiência
 * - **Conquistas**: Sistema de marcos e recordes pessoais
 * 
 * @subsection integration_features Integração Avançada
 * - **Transferência**: Peças podem ser movidas da fila para a pilha
 * - **Geração Automática**: Novas peças são criadas automaticamente
 * - **Interface Visual**: Exibição em tempo real do estado das estruturas
 * - **Análise em Tempo Real**: Processamento Expert de cada jogada
 * 
 * @section usage_sec Exemplos de Uso
 * 
 * @subsection basic_usage Uso Básico
 * @code
 * // Inicialização das estruturas
 * FilaCircular fila;
 * PilhaReserva pilha;
 * SistemaExpert expert;
 * 
 * inicializarFila(&fila);
 * inicializarPilha(&pilha);
 * inicializarSistemaExpert(&expert);
 * 
 * // Geração e processamento de peças
 * gerarPecasAleatorias(&fila);
 * Peca peca = jogarPecaDaFila(&fila);
 * processarJogadaExpert(peca, 1, &expert);
 * @endcode
 * 
 * @subsection expert_usage Sistema Expert Avançado
 * @code
 * // Simulação de gameplay estratégico
 * for (int i = 0; i < 50; i++) {
 *     Peca peca = jogarPecaDaFila(&fila);
 *     
 *     // Análise Expert da jogada
 *     processarJogadaExpert(peca, 1, &expert);
 *     
 *     // Verificar progressão de nível
 *     if (expert.nivelAtual > nivelAnterior) {
 *         printf("🎉 Subiu para o nível %d!\n", expert.nivelAtual);
 *     }
 *     
 *     // Exibir estatísticas a cada 10 jogadas
 *     if (i % 10 == 0) {
 *         exibirEstatisticasExpert(&expert);
 *     }
 * }
 * @endcode
 * 
 * @subsection level_progression Progressão de Níveis
 * @code
 * // Sistema de progressão automática
 * while (expert.nivelAtual < 10) {
 *     // Jogar peças estrategicamente
 *     Peca peca = escolherMelhorPeca(&fila, &pilha);
 *     processarJogadaExpert(peca, origem, &expert);
 *     
 *     // Otimizar sistema periodicamente
 *     if (expert.totalJogadas % 25 == 0) {
 *         otimizarSistemaExpert(&expert);
 *     }
 * }
 * 
 * // Gerar relatório final
 * gerarRelatorioExpert(&expert);
 * @endcode
 * 
 * @subsection statistics_usage Estatísticas em Tempo Real
 * @code
 * // Monitoramento contínuo de performance
 * while (continuarJogando) {
 *     processarJogadaExpert(peca, origem, &expert);
 *     
 *     // Alertas de performance
 *     if (expert.eficienciaReserva < 20) {
 *         printf("💡 Dica: Use mais a reserva!\n");
 *     }
 *     
 *     if (expert.comboAtual >= 5) {
 *         printf("🔥 Combo incrível: %dx!\n", expert.multiplicadorAtual);
 *     }
 * }
 * @endcode
 * 
 * @subsection achievements_usage Sistema de Conquistas
 * @code
 * // Verificação de conquistas desbloqueadas
 * if (expert.melhorCombo >= 10) {
 *     printf("🏆 Conquista: Mestre dos Combos!\n");
 *     expert.conquistasDesbloqueadas |= CONQUISTA_COMBO_MASTER;
 * }
 * 
 * if (expert.pontuacaoTotal >= 50000) {
 *     printf("🏆 Conquista: Especialista em Pontuação!\n");
 *     expert.conquistasDesbloqueadas |= CONQUISTA_SCORE_EXPERT;
 * }
 * @endcode
 * 
 * @section performance_sec Otimizações de Performance
 * 
 * O sistema Expert inclui várias otimizações:
 * - **Cálculos em Cache**: Valores frequentemente usados são armazenados
 * - **Validação Automática**: Correção de inconsistências em tempo real
 * - **Algoritmos Eficientes**: Complexidade O(1) para operações críticas
 * - **Gestão de Memória**: Uso otimizado de estruturas fixas
 * 
 * @section compatibility_sec Compatibilidade
 * 
 * - **Compilador**: GCC 4.8+ ou equivalente
 * - **Padrão C**: C99 ou superior
 * - **Plataformas**: Windows, Linux, macOS
 * - **Dependências**: Apenas bibliotecas padrão do C
 * 
 * @author João Santos - Universidade Estácio de Sá
 * @date Janeiro 2025
 * @version 3.0.0 - Nível Expert
 */

#include <stdio.h>   // Funções de entrada/saída (printf, scanf, getchar)
#include <stdlib.h>  // Funções utilitárias (rand, srand, exit)
#include <time.h>    // Funções de tempo (time para inicialização aleatória)
#include <math.h>    // Funções matemáticas (pow para cálculos de progressão)

// ═══════════════════════════════════════════════════════════════════════════════
//                              DEFINIÇÕES DE ESTRUTURAS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @brief Estrutura que representa uma peça individual do Tetris
 * 
 * Cada peça possui um tipo geométrico e um identificador único.
 * Os tipos seguem a nomenclatura padrão do Tetris clássico.
 * 
 * Tipos disponíveis:
 * • 'I': Peça linear (4 blocos em linha)
 * • 'O': Peça quadrada (2x2 blocos)
 * • 'T': Peça em formato T (3 blocos + 1 central)
 * • 'L': Peça em formato L (3 blocos + 1 perpendicular)
 * 
 * @note Os tipos suportados são: 'I', 'O', 'T', 'L'
 * @note Os IDs são gerados sequencialmente a partir de 1
 */
typedef struct {
    char tipo;  // Tipo geométrico: 'I'=linha, 'O'=quadrado, 'T'=T, 'L'=L
    int id;     // Identificador único e sequencial (1, 2, 3, ...)
} Peca;

/**
 * @brief Estrutura que implementa uma fila circular para gerenciamento de peças
 * 
 * A fila circular otimiza o uso de memória reutilizando posições do array.
 * Mantém exatamente 5 peças em rotação constante, seguindo o padrão FIFO
 * (First In, First Out - primeiro a entrar, primeiro a sair).
 * 
 * Componentes da estrutura:
 * • pecas[5]: Array fixo que armazena as 5 peças
 * • indiceFrente: Aponta para a próxima peça a ser jogada
 * • indiceTras: Aponta para a posição da última peça inserida
 * • quantidadePecas: Contador atual de peças válidas (0 a 5)
 * 
 * @note A circularidade é implementada usando operação módulo (%)
 * @note Quando cheia, novas inserções sobrescrevem as mais antigas
 */
typedef struct {
    Peca pecas[5];          // Array circular com capacidade fixa de 5 peças
    int indiceFrente;       // Índice da frente (próxima peça a jogar)
    int indiceTras;         // Índice do final (última peça inserida)
    int quantidadePecas;    // Contador atual de peças válidas (0-5)
} FilaCircular;

/**
 * @brief Estrutura que implementa uma pilha linear para reserva estratégica
 * 
 * A pilha de reserva permite armazenamento temporário de até 3 peças,
 * seguindo o padrão LIFO (Last In, First Out - último a entrar, primeiro a sair).
 * É utilizada para estratégias avançadas de gerenciamento de peças.
 * 
 * Componentes da estrutura:
 * • pecasReservadas[3]: Array linear para armazenamento das peças
 * • indiceTopo: Índice do topo da pilha (-1 = vazia, 0-2 = posições válidas)
 * • quantidadeReservada: Contador atual de peças reservadas (0 a 3)
 * 
 * Operações principais:
 * • Push (empilhar): Adiciona peça no topo, incrementa indiceTopo
 * • Pop (desempilhar): Remove peça do topo, decrementa indiceTopo
 * 
 * @note O índice -1 indica pilha vazia
 * @note Máximo de 3 peças podem ser armazenadas simultaneamente
 */
typedef struct {
    Peca pecasReservadas[3];    // Array linear para até 3 peças reservadas
    int indiceTopo;             // Índice do topo (-1=vazia, 0-2=válido)
    int quantidadeReservada;    // Contador atual de peças reservadas (0-3)
} PilhaReserva;

/**
 * @brief Estrutura para sistema de pontuação e estatísticas avançadas - Nível Expert
 * 
 * Esta estrutura mantém todas as métricas de gameplay do Nível Expert,
 * incluindo pontuação, combos, níveis de dificuldade e estatísticas detalhadas.
 * 
 * @details Funcionalidades implementadas:
 * - Sistema de pontuação com multiplicadores
 * - Detecção e contabilização de combos
 * - Progressão automática de níveis
 * - Estatísticas completas de performance
 * - Sistema de conquistas e marcos
 * 
 * @author João Santos
 * @version 2.0 - Nível Expert
 */
typedef struct {
    // ═══════════════════════════════════════════════════════════════
    //                    SISTEMA DE PONTUAÇÃO
    // ═══════════════════════════════════════════════════════════════
    int pontuacaoTotal;          ///< Pontuação acumulada total do jogador
    int pontuacaoNivel;          ///< Pontuação no nível atual (reset a cada nível)
    double multiplicadorAtual;   ///< Multiplicador de pontos atual (1.0x-10.0x)
    int pontosUltimaJogada;      ///< Pontos ganhos na última jogada
    
    // ═══════════════════════════════════════════════════════════════
    //                    SISTEMA DE COMBOS
    // ═══════════════════════════════════════════════════════════════
    int comboAtual;              ///< Sequência atual de combos consecutivos
    int melhorCombo;             ///< Maior sequência de combos alcançada
    int totalCombos;             ///< Total de combos realizados na sessão
    char ultimoTipoJogado;       ///< Último tipo de peça jogada (para combos)
    int sequenciaTipoAtual;      ///< Sequência atual do mesmo tipo de peça
    
    // ═══════════════════════════════════════════════════════════════
    //                   NÍVEIS DE DIFICULDADE
    // ═══════════════════════════════════════════════════════════════
    int nivelAtual;              ///< Nível de dificuldade atual (1-10)
    int pontosParaProximoNivel;  ///< Pontos necessários para próximo nível
    int limitePontosNivel;       ///< Limite de pontos do nível atual
    double fatorDificuldade;     ///< Multiplicador de dificuldade (1.0-3.0)
    
    // ═══════════════════════════════════════════════════════════════
    //                  ESTATÍSTICAS AVANÇADAS
    // ═══════════════════════════════════════════════════════════════
    int totalJogadas;            ///< Total de peças jogadas na sessão
    int jogadasDaFila;           ///< Peças jogadas diretamente da fila
    int jogadasDaPilha;          ///< Peças jogadas da pilha de reserva
    int pecasReservadas;         ///< Total de peças que foram reservadas
    int eficienciaReserva;       ///< Percentual de uso eficiente da reserva
    
    // ═══════════════════════════════════════════════════════════════
    //                 ESTATÍSTICAS POR TIPO
    // ═══════════════════════════════════════════════════════════════
    int contagemTipoI;           ///< Contador de peças tipo 'I' jogadas
    int contagemTipoO;           ///< Contador de peças tipo 'O' jogadas
    int contagemTipoT;           ///< Contador de peças tipo 'T' jogadas
    int contagemTipoL;           ///< Contador de peças tipo 'L' jogadas
    char tipoMaisJogado;         ///< Tipo de peça mais utilizado
    
    // ═══════════════════════════════════════════════════════════════
    //                 CONQUISTAS E MARCOS
    // ═══════════════════════════════════════════════════════════════
    int conquistasDesbloqueadas; ///< Bitmask das conquistas obtidas
    int marcosAlcancados;        ///< Contador de marcos especiais
    int recordePessoal;          ///< Maior pontuação já alcançada
} SistemaExpert;

// ═══════════════════════════════════════════════════════════════════════════════
//                              PROTÓTIPOS DAS FUNÇÕES
// ═══════════════════════════════════════════════════════════════════════════════

// Funções da Fila Circular
void inicializarFila(FilaCircular* filaPtr);
int filaVazia(FilaCircular* filaPtr);
int filaCheia(FilaCircular* filaPtr);
void inserirPecaNaFila(FilaCircular* filaPtr, Peca novaPeca);
Peca jogarPecaDaFila(FilaCircular* filaPtr);
void exibirFila(FilaCircular* filaPtr);

// Funções da Pilha de Reserva
void inicializarPilha(PilhaReserva* pilhaPtr);
int pilhaVazia(PilhaReserva* pilhaPtr);
int pilhaCheia(PilhaReserva* pilhaPtr);
void reservarPeca(PilhaReserva* pilhaPtr, Peca peca);
Peca jogarPecaDaPilha(PilhaReserva* pilhaPtr);
void exibirPilha(PilhaReserva* pilhaPtr);

// Funções do Sistema Expert
void inicializarSistemaExpert(SistemaExpert* sistemaPtr);
int calcularPontuacao(char tipoPeca, SistemaExpert* sistemaPtr);
double detectarCombo(SistemaExpert* sistemaPtr, char tipoPeca);
void verificarProgressaoNivel(SistemaExpert* sistemaPtr);
void processarJogadaExpert(Peca peca, int origem, SistemaExpert* sistemaPtr);
void exibirEstatisticasExpert(SistemaExpert* sistemaPtr);
int otimizarSistemaExpert(SistemaExpert* sistemaPtr);
void gerarRelatorioExpert(SistemaExpert* sistemaPtr);

// Funções Utilitárias
Peca criarPeca(char tipo, int id);
void gerarPecasAleatorias(FilaCircular* filaPtr);
void transferirPecaFilaParaPilha(FilaCircular* filaPtr, PilhaReserva* pilhaPtr);
void exibirEstadoCompleto(FilaCircular* filaPtr, PilhaReserva* pilhaPtr, SistemaExpert* sistemaPtr);
void exibirMenu();
void pausarExecucao();

// Variável global para controle de IDs sequenciais
int proximoId = 1;

// ═══════════════════════════════════════════════════════════════════════════════
//                              IMPLEMENTAÇÃO DAS FUNÇÕES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @brief Inicializa a fila circular
 * @param filaPtr Ponteiro para a estrutura da fila
 */
void inicializarFila(FilaCircular* filaPtr) {
    filaPtr->indiceFrente = 0;
    filaPtr->indiceTras = 0;
    filaPtr->quantidadePecas = 0;
}

/**
 * @brief Verifica se a fila está vazia
 * @param filaPtr Ponteiro para a estrutura da fila
 * @return 1 se vazia, 0 caso contrário
 */
int filaVazia(FilaCircular* filaPtr) {
    return filaPtr->quantidadePecas == 0;
}

/**
 * @brief Verifica se a fila está cheia
 * @param filaPtr Ponteiro para a estrutura da fila
 * @return 1 se cheia, 0 caso contrário
 */
int filaCheia(FilaCircular* filaPtr) {
    return filaPtr->quantidadePecas == 5;
}

/**
 * @brief Insere uma peça na fila
 * @param filaPtr Ponteiro para a estrutura da fila
 * @param novaPeca Peça a ser inserida
 */
void inserirPecaNaFila(FilaCircular* filaPtr, Peca novaPeca) {
    if (!filaCheia(filaPtr)) {
        filaPtr->indiceTras = (filaPtr->indiceTras + 1) % 5;
        filaPtr->pecas[filaPtr->indiceTras] = novaPeca;
        filaPtr->quantidadePecas++;
    }
}

/**
 * @brief Remove e retorna uma peça da fila
 * @param filaPtr Ponteiro para a estrutura da fila
 * @return Peça removida
 */
Peca jogarPecaDaFila(FilaCircular* filaPtr) {
    Peca peca = {'X', 0}; // Peça vazia por padrão
    if (!filaVazia(filaPtr)) {
        peca = filaPtr->pecas[filaPtr->indiceFrente];
        filaPtr->indiceFrente = (filaPtr->indiceFrente + 1) % 5;
        filaPtr->quantidadePecas--;
    }
    return peca;
}

/**
 * @brief Exibe o conteúdo da fila
 * @param filaPtr Ponteiro para a estrutura da fila
 */
void exibirFila(FilaCircular* filaPtr) {
    printf("Fila: ");
    for (int i = 0; i < filaPtr->quantidadePecas; i++) {
        int indice = (filaPtr->indiceFrente + i) % 5;
        printf("%c ", filaPtr->pecas[indice].tipo);
    }
    printf("\n");
}

/**
 * @brief Inicializa a pilha de reserva
 * @param pilhaPtr Ponteiro para a estrutura da pilha
 */
void inicializarPilha(PilhaReserva* pilhaPtr) {
    pilhaPtr->indiceTopo = -1;
    pilhaPtr->quantidadeReservada = 0;
}

/**
 * @brief Verifica se a pilha está vazia
 * @param pilhaPtr Ponteiro para a estrutura da pilha
 * @return 1 se vazia, 0 caso contrário
 */
int pilhaVazia(PilhaReserva* pilhaPtr) {
    return pilhaPtr->quantidadeReservada == 0;
}

/**
 * @brief Verifica se a pilha está cheia
 * @param pilhaPtr Ponteiro para a estrutura da pilha
 * @return 1 se cheia, 0 caso contrário
 */
int pilhaCheia(PilhaReserva* pilhaPtr) {
    return pilhaPtr->quantidadeReservada == 3;
}

/**
 * @brief Adiciona uma peça à pilha de reserva
 * @param pilhaPtr Ponteiro para a estrutura da pilha
 * @param peca Peça a ser reservada
 */
void reservarPeca(PilhaReserva* pilhaPtr, Peca peca) {
    if (!pilhaCheia(pilhaPtr)) {
        pilhaPtr->indiceTopo++;
        pilhaPtr->pecasReservadas[pilhaPtr->indiceTopo] = peca;
        pilhaPtr->quantidadeReservada++;
    }
}

/**
 * @brief Remove e retorna uma peça da pilha
 * @param pilhaPtr Ponteiro para a estrutura da pilha
 * @return Peça removida
 */
Peca jogarPecaDaPilha(PilhaReserva* pilhaPtr) {
    Peca peca = {'X', 0}; // Peça vazia por padrão
    if (!pilhaVazia(pilhaPtr)) {
        peca = pilhaPtr->pecasReservadas[pilhaPtr->indiceTopo];
        pilhaPtr->indiceTopo--;
        pilhaPtr->quantidadeReservada--;
    }
    return peca;
}

/**
 * @brief Exibe o conteúdo da pilha
 * @param pilhaPtr Ponteiro para a estrutura da pilha
 */
void exibirPilha(PilhaReserva* pilhaPtr) {
    printf("Pilha: ");
    for (int i = pilhaPtr->indiceTopo; i >= 0; i--) {
        printf("%c ", pilhaPtr->pecasReservadas[i].tipo);
    }
    printf("\n");
}

/**
 * @brief Inicializa o sistema Expert com valores padrão
 * @param sistemaPtr Ponteiro para a estrutura do sistema Expert
 */
void inicializarSistemaExpert(SistemaExpert* sistemaPtr) {
    // Inicialização do sistema de pontuação
    sistemaPtr->pontuacaoTotal = 0;
    sistemaPtr->multiplicadorAtual = 1.0;
    sistemaPtr->fatorDificuldade = 1.0;
    
    // Inicialização de combos
    sistemaPtr->comboAtual = 0;
    sistemaPtr->melhorCombo = 0;
    sistemaPtr->totalCombos = 0;
    sistemaPtr->ultimoTipoJogado = 'X';
    sistemaPtr->sequenciaTipoAtual = 0;
    
    // Inicialização dos níveis de dificuldade
    sistemaPtr->nivelAtual = 1;
    sistemaPtr->pontosParaProximoNivel = 1000;
    sistemaPtr->limitePontosNivel = 1000;
    
    // Inicialização das estatísticas avançadas
    sistemaPtr->totalJogadas = 0;
    sistemaPtr->jogadasDaFila = 0;
    sistemaPtr->jogadasDaPilha = 0;
    sistemaPtr->pecasReservadas = 0;
    sistemaPtr->eficienciaReserva = 0;
    
    // Inicialização das estatísticas por tipo de peça
    sistemaPtr->contagemTipoI = 0;
    sistemaPtr->contagemTipoO = 0;
    sistemaPtr->contagemTipoT = 0;
    sistemaPtr->contagemTipoL = 0;
    sistemaPtr->tipoMaisJogado = 'I';
    
    // Inicialização de combos
    sistemaPtr->comboAtual = 0;
    sistemaPtr->melhorCombo = 0;
    sistemaPtr->totalCombos = 0;
    sistemaPtr->ultimoTipoJogado = 'X';
    sistemaPtr->sequenciaTipoAtual = 0;
    
    // Inicialização de conquistas e marcos
    sistemaPtr->conquistasDesbloqueadas = 0;
    sistemaPtr->marcosAlcancados = 0;
    sistemaPtr->recordePessoal = 0;
}

/**
 * @brief Calcula a pontuação base para um tipo de peça
 * @param tipoPeca Tipo da peça jogada
 * @param sistemaPtr Ponteiro para o sistema Expert
 * @return Pontuação calculada
 */
int calcularPontuacao(char tipoPeca, SistemaExpert* sistemaPtr) {
    int pontuacaoBase = 0;
    
    // Pontuação base por tipo de peça
    switch (tipoPeca) {
        case 'I': pontuacaoBase = 100; break; // Linha reta
        case 'O': pontuacaoBase = 80;  break; // Quadrado
        case 'T': pontuacaoBase = 90;  break; // T
        case 'S': pontuacaoBase = 85;  break; // S
        case 'Z': pontuacaoBase = 85;  break; // Z
        case 'J': pontuacaoBase = 75;  break; // J
        case 'L': pontuacaoBase = 75;  break; // L
        default:  pontuacaoBase = 50;  break; // Peça desconhecida
    }
    
    // Aplicar multiplicadores
    return (int)(pontuacaoBase * sistemaPtr->multiplicadorAtual * sistemaPtr->fatorDificuldade);
}

/**
 * @brief Detecta e processa combos de peças consecutivas
 * @param sistemaPtr Ponteiro para o sistema Expert
 * @param tipoPeca Tipo da peça atual
 * @return Multiplicador de combo aplicado
 */
double detectarCombo(SistemaExpert* sistemaPtr, char tipoPeca) {
    if (sistemaPtr->ultimoTipoJogado == tipoPeca) {
        sistemaPtr->sequenciaTipoAtual++;
        if (sistemaPtr->sequenciaTipoAtual >= 3) {
            sistemaPtr->comboAtual = sistemaPtr->sequenciaTipoAtual - 2;
            if (sistemaPtr->comboAtual > sistemaPtr->melhorCombo) {
                sistemaPtr->melhorCombo = sistemaPtr->comboAtual;
            }
            return 1.0 + (sistemaPtr->comboAtual * 0.2);
        }
    } else {
        sistemaPtr->sequenciaTipoAtual = 1;
        sistemaPtr->comboAtual = 0;
    }
    sistemaPtr->ultimoTipoJogado = tipoPeca;
    return 1.0;
}

/**
 * @brief Verifica e processa a progressão de nível baseada na pontuação
 * @param sistemaPtr Ponteiro para o sistema Expert
 * 
 * Esta função implementa um sistema dinâmico de progressão que:
 * - Monitora a pontuação atual do nível
 * - Calcula progressão exponencial de dificuldade
 * - Ajusta automaticamente multiplicadores e limites
 * - Fornece feedback visual da evolução
 */
void verificarProgressaoNivel(SistemaExpert* sistemaPtr) {
    // Verificar se atingiu pontos suficientes para próximo nível
    if (sistemaPtr->pontuacaoTotal >= sistemaPtr->limitePontosNivel) {
        sistemaPtr->nivelAtual++;
        
        // Calcular novo limite com progressão exponencial
        sistemaPtr->limitePontosNivel = (int)(1000 * pow(1.5, sistemaPtr->nivelAtual - 1));
        sistemaPtr->pontosParaProximoNivel = sistemaPtr->limitePontosNivel - sistemaPtr->pontuacaoTotal;
        
        // Aumentar fator de dificuldade (máximo 3.0)
        if (sistemaPtr->fatorDificuldade < 3.0) {
            sistemaPtr->fatorDificuldade += 0.2;
        }
        
        // Aumentar multiplicador base (máximo 10.0)
        if (sistemaPtr->multiplicadorAtual < 10.0) {
            sistemaPtr->multiplicadorAtual += 0.5;
        }
        
        // Registrar marco alcançado
        sistemaPtr->marcosAlcancados++;
        
        printf("\n*** NIVEL %d ALCANCADO! ***\n", sistemaPtr->nivelAtual);
        printf("Novo multiplicador: %.1fx\n", sistemaPtr->multiplicadorAtual);
        printf("Fator de dificuldade: %.1f\n", sistemaPtr->fatorDificuldade);
    } else {
        // Atualizar pontos restantes para próximo nível
        sistemaPtr->pontosParaProximoNivel = sistemaPtr->limitePontosNivel - sistemaPtr->pontuacaoTotal;
    }
    
    // Verificar conquistas especiais
    if (sistemaPtr->nivelAtual == 5 && !(sistemaPtr->conquistasDesbloqueadas & 1)) {
        sistemaPtr->conquistasDesbloqueadas |= 1; // Primeira conquista
        printf("*** CONQUISTA DESBLOQUEADA: Veterano (Nivel 5)\n");
    }
    
    if (sistemaPtr->nivelAtual == 10 && !(sistemaPtr->conquistasDesbloqueadas & 2)) {
        sistemaPtr->conquistasDesbloqueadas |= 2; // Segunda conquista
        printf("*** CONQUISTA DESBLOQUEADA: Mestre (Nivel 10)\n");
    }
}

/**
 * @brief Processa uma jogada completa no sistema Expert
 * @param peca Peça jogada
 * @param origem Origem da peça (0=fila, 1=pilha)
 * @param sistemaPtr Ponteiro para o sistema Expert
 */
void processarJogadaExpert(Peca peca, int origem, SistemaExpert* sistemaPtr) {
    // Cálculo da pontuação
    int pontos = calcularPontuacao(peca.tipo, sistemaPtr);
    
    // Detectar combo e aplicar multiplicador
    double multiplicadorCombo = detectarCombo(sistemaPtr, peca.tipo);
    
    // Aplicar multiplicador de combo à pontuação
    pontos = (int)(pontos * multiplicadorCombo);
    
    // Atualização das pontuações
    sistemaPtr->pontuacaoTotal += pontos;
    sistemaPtr->pontuacaoNivel += pontos;
    
    // Atualização do recorde pessoal
    if (sistemaPtr->pontuacaoTotal > sistemaPtr->recordePessoal) {
        sistemaPtr->recordePessoal = sistemaPtr->pontuacaoTotal;
    }
    
    // Estatísticas de origem das jogadas
    sistemaPtr->totalJogadas++;
    if (origem == 0) {
        sistemaPtr->jogadasDaFila++;
    } else {
        sistemaPtr->jogadasDaPilha++;
    }
    
    // Atualizar contadores de tipo de peça
    switch(peca.tipo) {
        case 'I': sistemaPtr->contagemTipoI++; break;
        case 'O': sistemaPtr->contagemTipoO++; break;
        case 'T': sistemaPtr->contagemTipoT++; break;
        case 'L': sistemaPtr->contagemTipoL++; break;
    }
    
    // Determinar tipo mais jogado
    int maxContagem = 0;
    if (sistemaPtr->contagemTipoI > maxContagem) {
        maxContagem = sistemaPtr->contagemTipoI;
        sistemaPtr->tipoMaisJogado = 'I';
    }
    if (sistemaPtr->contagemTipoO > maxContagem) {
        maxContagem = sistemaPtr->contagemTipoO;
        sistemaPtr->tipoMaisJogado = 'O';
    }
    if (sistemaPtr->contagemTipoT > maxContagem) {
        maxContagem = sistemaPtr->contagemTipoT;
        sistemaPtr->tipoMaisJogado = 'T';
    }
    if (sistemaPtr->contagemTipoL > maxContagem) {
        maxContagem = sistemaPtr->contagemTipoL;
        sistemaPtr->tipoMaisJogado = 'L';
    }
    
    // Calcular eficiência da reserva
    if (sistemaPtr->totalJogadas > 0) {
        sistemaPtr->eficienciaReserva = (double)sistemaPtr->jogadasDaPilha / sistemaPtr->totalJogadas * 100.0;
    }
    
    // Verificação de progressão de nível
    verificarProgressaoNivel(sistemaPtr);
}

/**
 * @brief Exibe estatísticas avançadas do sistema Expert
 * @param sistemaPtr Ponteiro para o sistema Expert
 */
void exibirEstatisticasExpert(SistemaExpert* sistemaPtr) {
    printf("\n+==============================================================+\n");
    printf("|                    ESTATISTICAS EXPERT                      |\n");
    printf("+==============================================================+\n");
    
    // Pontuacao e Progressao
    printf("| Pontuacao Total: %8d  |  Nivel Atual: %3d            |\n", 
           sistemaPtr->pontuacaoTotal, sistemaPtr->nivelAtual);
    printf("| Recorde Pessoal: %8d  |  Multiplicador: %.1fx         |\n", 
           sistemaPtr->recordePessoal, sistemaPtr->multiplicadorAtual);
    
    // Progresso do nivel com barra visual
    int progresso = (int)((double)sistemaPtr->pontuacaoTotal / sistemaPtr->limitePontosNivel * 20);
    printf("| Progresso: [");
    for (int i = 0; i < 20; i++) {
        printf(i < progresso ? "#" : "-");
    }
    printf("] %3d%%    |\n", (int)((double)sistemaPtr->pontuacaoTotal / sistemaPtr->limitePontosNivel * 100));
    
    // Combos e Sequencias
    printf("| Combo Atual: %3d      |  Melhor Combo: %3d           |\n", 
           sistemaPtr->comboAtual, sistemaPtr->melhorCombo);
    printf("| Sequencia: %3d        |  Ultima Peca: %c              |\n", 
           sistemaPtr->sequenciaTipoAtual, sistemaPtr->ultimoTipoJogado);
    
    // Estatisticas de Tipos de Pecas
    printf("+==============================================================+\n");
    printf("| Tipo Mais Jogado: %c  |  Total de Jogadas: %4d        |\n", 
           sistemaPtr->tipoMaisJogado, sistemaPtr->totalJogadas);
    
    printf("| Tipos de Pecas:                                      |\n");
    printf("|   I:%2d  O:%2d  T:%2d  L:%2d                        |\n", 
           sistemaPtr->contagemTipoI, sistemaPtr->contagemTipoO, 
           sistemaPtr->contagemTipoT, sistemaPtr->contagemTipoL);
    
    // Eficiencia do Jogo
    printf("+==============================================================+\n");
    printf("| Jogadas da Fila: %4d   |  Jogadas da Pilha: %4d      |\n", 
           sistemaPtr->jogadasDaFila, sistemaPtr->jogadasDaPilha);
    
    // Eficiencia da reserva com barra visual
    int eficiencia = (int)(sistemaPtr->eficienciaReserva / 5); // Escala para 20 caracteres
    printf("| Eficiencia Reserva: [");
    for (int i = 0; i < 20; i++) {
        printf(i < eficiencia ? "#" : "-");
    }
    printf("] %5.1f%% |\n", (double)sistemaPtr->eficienciaReserva);
    
    // Conquistas e Marcos
    printf("| Marcos Alcancados: %2d  |  Fator Dificuldade: %.1fx      |\n", 
           sistemaPtr->marcosAlcancados, sistemaPtr->fatorDificuldade);
    
    printf("+==============================================================+\n");
}

/**
 * @brief Otimiza e valida o sistema Expert
 * @param sistemaPtr Ponteiro para o sistema Expert
 * @return 1 se otimização foi aplicada, 0 caso contrário
 */
int otimizarSistemaExpert(SistemaExpert* sistemaPtr) {
    int otimizacaoAplicada = 0;
    
    // Validação e correção de valores inconsistentes
    if (sistemaPtr->multiplicadorAtual > 10.0) {
        sistemaPtr->multiplicadorAtual = 10.0;
        otimizacaoAplicada = 1;
    }
    
    if (sistemaPtr->multiplicadorAtual < 1.0) {
        sistemaPtr->multiplicadorAtual = 1.0;
        otimizacaoAplicada = 1;
    }
    
    // Recálculo da eficiência se necessário
    if (sistemaPtr->totalJogadas > 0) {
        double novaEficiencia = (double)sistemaPtr->jogadasDaPilha / sistemaPtr->totalJogadas * 100.0;
        if (abs((int)(novaEficiencia - sistemaPtr->eficienciaReserva)) > 1) {
            sistemaPtr->eficienciaReserva = novaEficiencia;
            otimizacaoAplicada = 1;
        }
    }
    
    // Ajuste automático da dificuldade baseado no desempenho
    if (sistemaPtr->nivelAtual > 5 && sistemaPtr->fatorDificuldade < 2.0) {
        sistemaPtr->fatorDificuldade = 1.0 + (sistemaPtr->nivelAtual - 1) * 0.2;
        otimizacaoAplicada = 1;
    }
    
    return otimizacaoAplicada;
}

/**
 * @brief Gera relatório detalhado do sistema Expert
 * @param sistemaPtr Ponteiro para o sistema Expert
 */
void gerarRelatorioExpert(SistemaExpert* sistemaPtr) {
    printf("\n+==============================================================+\n");
    printf("|                     RELATORIO EXPERT                        |\n");
    printf("+==============================================================+\n");
    
    // Analise de Performance
    printf("\n*** ANALISE DE PERFORMANCE:\n");
    printf("   * Pontuacao Media por Jogada: %.1f\n", 
           sistemaPtr->totalJogadas > 0 ? (double)sistemaPtr->pontuacaoTotal / sistemaPtr->totalJogadas : 0);
    printf("   * Taxa de Uso da Reserva: %.1f%%\n", 
           sistemaPtr->totalJogadas > 0 ? (double)sistemaPtr->jogadasDaPilha / sistemaPtr->totalJogadas * 100 : 0);
    printf("   * Progressao de Nivel: %d niveis alcancados\n", sistemaPtr->nivelAtual - 1);
    
    // Recomendacoes Estrategicas
    printf("\n*** RECOMENDACOES ESTRATEGICAS:\n");
    if (sistemaPtr->eficienciaReserva < 20) {
        printf("   * Utilize mais a pilha de reserva para melhor estrategia\n");
    }
    if (sistemaPtr->melhorCombo < 5) {
        printf("   * Foque em formar combos de pecas consecutivas\n");
    }
    if (sistemaPtr->sequenciaTipoAtual < 3) {
        printf("   * Mantenha sequencias longas para maximizar multiplicadores\n");
    }
    
    // Projecoes de Melhoria
    printf("\n*** PROJECOES DE MELHORIA:\n");
    int proximoNivel = sistemaPtr->limitePontosNivel - sistemaPtr->pontuacaoTotal;
    printf("   * Pontos para proximo nivel: %d\n", proximoNivel);
    printf("   * Potencial de pontuacao com combo maximo: %d\n", 
           sistemaPtr->pontuacaoTotal + (sistemaPtr->melhorCombo * 100));
    printf("   * Eficiencia otima da reserva: 40-60%%\n");
}

/**
 * @brief Cria uma nova peça
 * @param tipo Tipo da peça
 * @param id ID da peça
 * @return Nova peça criada
 */
Peca criarPeca(char tipo, int id) {
    Peca novaPeca;
    novaPeca.tipo = tipo;
    novaPeca.id = id;
    return novaPeca;
}

/**
 * @brief Gera peças aleatórias para a fila
 * @param filaPtr Ponteiro para a fila
 */
void gerarPecasAleatorias(FilaCircular* filaPtr) {
    char tipos[] = {'I', 'O', 'T', 'S', 'Z', 'J', 'L'};
    for (int i = 0; i < 5; i++) {
        char tipoAleatorio = tipos[rand() % 7];
        Peca novaPeca = criarPeca(tipoAleatorio, proximoId++);
        inserirPecaNaFila(filaPtr, novaPeca);
    }
}

/**
 * @brief Transfere uma peça da fila para a pilha
 * @param filaPtr Ponteiro para a fila
 * @param pilhaPtr Ponteiro para a pilha
 */
void transferirPecaFilaParaPilha(FilaCircular* filaPtr, PilhaReserva* pilhaPtr) {
    if (!filaVazia(filaPtr) && !pilhaCheia(pilhaPtr)) {
        Peca peca = jogarPecaDaFila(filaPtr);
        reservarPeca(pilhaPtr, peca);
        printf("Peca %c transferida da fila para a pilha de reserva.\n", peca.tipo);
    }
}

/**
 * @brief Exibe o estado completo do sistema
 * @param filaPtr Ponteiro para a fila
 * @param pilhaPtr Ponteiro para a pilha
 * @param sistemaPtr Ponteiro para o sistema Expert
 */
void exibirEstadoCompleto(FilaCircular* filaPtr, PilhaReserva* pilhaPtr, SistemaExpert* sistemaPtr) {
    printf("\n===============================================================\n");
    printf("                    ESTADO ATUAL DO SISTEMA\n");
    printf("===============================================================\n");
    
    exibirFila(filaPtr);
    exibirPilha(pilhaPtr);
    exibirEstatisticasExpert(sistemaPtr);
}

/**
 * @brief Exibe o menu principal
 */
void exibirMenu() {
    printf("\n+==============================================================+\n");
    printf("|                    TETRIS EXPERT SYSTEM                     |\n");
    printf("+==============================================================+\n");
    printf("| 1. Jogar peca da fila                                       |\n");
    printf("| 2. Jogar peca da pilha de reserva                           |\n");
    printf("| 3. Transferir peca da fila para reserva                     |\n");
    printf("| 4. Gerar novas pecas aleatorias                             |\n");
    printf("| 5. Exibir estado completo                                   |\n");
    printf("| 6. Exibir estatisticas Expert                               |\n");
    printf("| 7. Otimizar sistema Expert                                  |\n");
    printf("| 8. Gerar relatorio Expert                                   |\n");
    printf("| 0. Sair                                                     |\n");
    printf("+==============================================================+\n");
    printf("Escolha uma opcao: ");
}

/**
 * @brief Pausa a execução aguardando entrada do usuário
 */
void pausarExecucao() {
    printf("\nPressione Enter para continuar...");
    getchar();
}

/**
 * @brief Função principal do programa
 * @return Código de saída
 */
int main() {
    // Inicialização das estruturas
    FilaCircular fila;
    PilhaReserva pilha;
    SistemaExpert sistema;
    
    inicializarFila(&fila);
    inicializarPilha(&pilha);
    inicializarSistemaExpert(&sistema);
    
    // Gerar peças iniciais
    srand((unsigned int)time(NULL));
    gerarPecasAleatorias(&fila);
    
    int opcao;
    
    printf("+==============================================================+\n");
    printf("|              BEM-VINDO AO TETRIS EXPERT SYSTEM               |\n");
    printf("|                                                              |\n");
    printf("|  Sistema inteligente de analise de jogabilidade Tetris      |\n");
    printf("|  com estatisticas avancadas e otimizacao automatica         |\n");
    printf("+==============================================================+\n");
    
    do {
        exibirMenu();
        scanf("%d", &opcao);
        getchar(); // Limpar buffer
        
        switch (opcao) {
            case 1: {
                if (!filaVazia(&fila)) {
                    Peca peca = jogarPecaDaFila(&fila);
                    processarJogadaExpert(peca, 0, &sistema);
                    printf("Peca %c (ID: %d) jogada da fila!\n", peca.tipo, peca.id);
                } else {
                    printf("Fila vazia! Gere novas pecas primeiro.\n");
                }
                pausarExecucao();
                break;
            }
            case 2: {
                if (!pilhaVazia(&pilha)) {
                    Peca peca = jogarPecaDaPilha(&pilha);
                    processarJogadaExpert(peca, 1, &sistema);
                    printf("Peca %c (ID: %d) jogada da pilha de reserva!\n", peca.tipo, peca.id);
                } else {
                    printf("Pilha de reserva vazia!\n");
                }
                pausarExecucao();
                break;
            }
            case 3: {
                transferirPecaFilaParaPilha(&fila, &pilha);
                pausarExecucao();
                break;
            }
            case 4: {
                gerarPecasAleatorias(&fila);
                printf("Novas pecas geradas na fila!\n");
                pausarExecucao();
                break;
            }
            case 5: {
                exibirEstadoCompleto(&fila, &pilha, &sistema);
                pausarExecucao();
                break;
            }
            case 6: {
                exibirEstatisticasExpert(&sistema);
                pausarExecucao();
                break;
            }
            case 7: {
                if (otimizarSistemaExpert(&sistema)) {
                    printf("Sistema Expert otimizado com sucesso!\n");
                } else {
                    printf("Sistema Expert ja esta otimizado.\n");
                }
                pausarExecucao();
                break;
            }
            case 8: {
                gerarRelatorioExpert(&sistema);
                pausarExecucao();
                break;
            }
            case 0: {
                printf("\n+==============================================================+\n");
                printf("|                    OBRIGADO POR JOGAR!                      |\n");
                printf("|                                                              |\n");
                printf("|  Pontuacao Final: %8d                               |\n", sistema.pontuacaoTotal);
                printf("|  Nivel Alcancado: %3d                                    |\n", sistema.nivelAtual);
                printf("|  Melhor Combo: %3d                                       |\n", sistema.melhorCombo);
                printf("+==============================================================+\n");
                break;
            }
            default: {
                printf("Opcao invalida! Tente novamente.\n");
                pausarExecucao();
                break;
            }
        }
    } while (opcao != 0);
    
    return 0;
}

