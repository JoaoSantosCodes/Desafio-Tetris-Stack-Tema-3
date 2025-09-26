#include <stdio.h>
#include <stdlib.h>
#include <time.h>

// Estrutura para representar uma peça do Tetris
typedef struct {
    char tipo;  // Tipo geométrico: 'I'=linha, 'O'=quadrado, 'T'=T, 'L'=L
    int id;     // Identificador único e sequencial (1, 2, 3, ...)
} Peca;

// Estrutura da fila circular para gerenciar peças
typedef struct {
    Peca pecas[5];          // Array circular com capacidade fixa de 5 peças
    int indiceFrente;       // Índice da frente (próxima peça a jogar)
    int indiceTras;         // Índice do final (última peça inserida)
    int quantidadePecas;    // Contador atual de peças válidas (0-5)
} FilaCircular;

// Estrutura da pilha para peças reservadas
typedef struct {
    Peca pecasReservadas[3];    // Array linear para até 3 peças reservadas
    int indiceTopo;             // Índice do topo (-1=vazia, 0-2=válido)
    int quantidadeReservada;    // Contador atual de peças reservadas (0-3)
} PilhaReserva;

// Sistema Expert para análise avançada
typedef struct {
    // Sistema de Pontuação
    int pontuacaoTotal;
    int pontuacaoNivel;
    int multiplicadorAtual;
    int pontosUltimaJogada;
    
    // Sistema de Combos
    int comboAtual;
    int melhorCombo;
    int totalCombos;
    char ultimoTipoJogado;
    int sequenciaTipoAtual;
    
    // Sistema de Níveis
    int nivelAtual;
    int pontosParaProximoNivel;
    int limitePontosNivel;
    double fatorDificuldade;
    
    // Estatísticas Avançadas
    int totalJogadas;
    int jogadasDaFila;
    int jogadasDaPilha;
    int pecasReservadas;
    int eficienciaReserva;
    
    // Análise de Tipos
    int contagemTipoI;
    int contagemTipoO;
    int contagemTipoT;
    int contagemTipoL;
    char tipoMaisJogado;
    
    // Sistema de Conquistas
    int conquistasDesbloqueadas;
    int marcosAlcancados;
    int recordePessoal;
} SistemaExpert;

// Contador global para IDs únicos
int contadorIdGlobal = 1;

// Protótipos das funções
void inicializarSistemaExpert(SistemaExpert* sistemaPtr);
int calcularPontuacao(char tipoPeca, SistemaExpert* sistemaPtr);
int detectarCombo(char tipoPeca, SistemaExpert* sistemaPtr);
int verificarProgressaoNivel(SistemaExpert* sistemaPtr);
void processarJogadaExpert(Peca peca, int origem, SistemaExpert* sistemaPtr);
void exibirEstatisticasExpert(SistemaExpert* sistemaPtr);

// Implementação das funções do Sistema Expert
void inicializarSistemaExpert(SistemaExpert* sistemaPtr) {
    // Inicialização do sistema de pontuação
    sistemaPtr->pontuacaoTotal = 0;
    sistemaPtr->pontuacaoNivel = 0;
    sistemaPtr->multiplicadorAtual = 1;
    sistemaPtr->pontosUltimaJogada = 0;
    
    // Inicialização do sistema de combos
    sistemaPtr->comboAtual = 0;
    sistemaPtr->melhorCombo = 0;
    sistemaPtr->totalCombos = 0;
    sistemaPtr->ultimoTipoJogado = '\0';
    sistemaPtr->sequenciaTipoAtual = 0;
    
    // Inicialização do sistema de níveis
    sistemaPtr->nivelAtual = 1;
    sistemaPtr->pontosParaProximoNivel = 1000;
    sistemaPtr->limitePontosNivel = 1000;
    sistemaPtr->fatorDificuldade = 1.0;
    
    // Inicialização das estatísticas avançadas
    sistemaPtr->totalJogadas = 0;
    sistemaPtr->jogadasDaFila = 0;
    sistemaPtr->jogadasDaPilha = 0;
    sistemaPtr->pecasReservadas = 0;
    sistemaPtr->eficienciaReserva = 0;
    
    // Inicialização da análise de tipos
    sistemaPtr->contagemTipoI = 0;
    sistemaPtr->contagemTipoO = 0;
    sistemaPtr->contagemTipoT = 0;
    sistemaPtr->contagemTipoL = 0;
    sistemaPtr->tipoMaisJogado = 'I';
    
    // Inicialização do sistema de conquistas
    sistemaPtr->conquistasDesbloqueadas = 0;
    sistemaPtr->marcosAlcancados = 0;
    sistemaPtr->recordePessoal = 0;
}

int calcularPontuacao(char tipoPeca, SistemaExpert* sistemaPtr) {
    int pontoBase = 100;
    
    // Pontuação diferenciada por tipo
    switch(tipoPeca) {
        case 'I': pontoBase = 150; break;
        case 'O': pontoBase = 100; break;
        case 'T': pontoBase = 120; break;
        case 'L': pontoBase = 110; break;
        default: pontoBase = 100; break;
    }
    
    // Aplicar multiplicadores
    int pontosFinal = pontoBase * sistemaPtr->multiplicadorAtual * sistemaPtr->fatorDificuldade;
    sistemaPtr->pontosUltimaJogada = pontosFinal;
    
    return pontosFinal;
}

int detectarCombo(char tipoPeca, SistemaExpert* sistemaPtr) {
    if (sistemaPtr->ultimoTipoJogado == tipoPeca) {
        sistemaPtr->sequenciaTipoAtual++;
        
        if (sistemaPtr->sequenciaTipoAtual >= 3) {
            sistemaPtr->comboAtual++;
            sistemaPtr->totalCombos++;
            
            if (sistemaPtr->comboAtual > sistemaPtr->melhorCombo) {
                sistemaPtr->melhorCombo = sistemaPtr->comboAtual;
            }
            
            // Aumentar multiplicador
            if (sistemaPtr->multiplicadorAtual < 10) {
                sistemaPtr->multiplicadorAtual++;
            }
            
            return 1; // Combo detectado
        }
    } else {
        sistemaPtr->sequenciaTipoAtual = 1;
        sistemaPtr->comboAtual = 0;
        sistemaPtr->multiplicadorAtual = 1;
    }
    
    sistemaPtr->ultimoTipoJogado = tipoPeca;
    return 0; // Sem combo
}

int verificarProgressaoNivel(SistemaExpert* sistemaPtr) {
    if (sistemaPtr->pontuacaoNivel >= sistemaPtr->pontosParaProximoNivel) {
        sistemaPtr->nivelAtual++;
        sistemaPtr->pontuacaoNivel = 0;
        sistemaPtr->limitePontosNivel = sistemaPtr->limitePontosNivel * 1.5;
        sistemaPtr->pontosParaProximoNivel = sistemaPtr->limitePontosNivel;
        sistemaPtr->fatorDificuldade += 0.2;
        
        if (sistemaPtr->fatorDificuldade > 3.0) {
            sistemaPtr->fatorDificuldade = 3.0;
        }
        
        return 1; // Nível aumentado
    }
    
    return 0; // Sem mudança de nível
}

void processarJogadaExpert(Peca peca, int origem, SistemaExpert* sistemaPtr) {
    // Atualizar estatísticas gerais
    sistemaPtr->totalJogadas++;
    
    if (origem == 1) {
        sistemaPtr->jogadasDaFila++;
    } else if (origem == 2) {
        sistemaPtr->jogadasDaPilha++;
    }
    
    // Atualizar contagem por tipo
    switch(peca.tipo) {
        case 'I': sistemaPtr->contagemTipoI++; break;
        case 'O': sistemaPtr->contagemTipoO++; break;
        case 'T': sistemaPtr->contagemTipoT++; break;
        case 'L': sistemaPtr->contagemTipoL++; break;
    }
    
    // Detectar combos
    int comboDetectado = detectarCombo(peca.tipo, sistemaPtr);
    
    // Calcular pontuação
    int pontos = calcularPontuacao(peca.tipo, sistemaPtr);
    sistemaPtr->pontuacaoTotal += pontos;
    sistemaPtr->pontuacaoNivel += pontos;
    
    // Verificar progressão de nível
    int nivelAumentado = verificarProgressaoNivel(sistemaPtr);
    
    // Atualizar recorde pessoal
    if (sistemaPtr->pontuacaoTotal > sistemaPtr->recordePessoal) {
        sistemaPtr->recordePessoal = sistemaPtr->pontuacaoTotal;
    }
    
    // Calcular eficiência de reserva
    if (sistemaPtr->totalJogadas > 0) {
        sistemaPtr->eficienciaReserva = (sistemaPtr->jogadasDaPilha * 100) / sistemaPtr->totalJogadas;
    }
    
    // Determinar tipo mais jogado
    int maxContagem = sistemaPtr->contagemTipoI;
    sistemaPtr->tipoMaisJogado = 'I';
    
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
}

void exibirEstatisticasExpert(SistemaExpert* sistemaPtr) {
    printf("\n=== ESTATÍSTICAS EXPERT ===\n");
    printf("Pontuação Total: %d\n", sistemaPtr->pontuacaoTotal);
    printf("Nível Atual: %d\n", sistemaPtr->nivelAtual);
    printf("Melhor Combo: %d\n", sistemaPtr->melhorCombo);
    printf("Total de Jogadas: %d\n", sistemaPtr->totalJogadas);
    printf("Tipo Mais Jogado: %c\n", sistemaPtr->tipoMaisJogado);
    printf("Eficiência de Reserva: %d%%\n", sistemaPtr->eficienciaReserva);
    printf("Recorde Pessoal: %d\n", sistemaPtr->recordePessoal);
    printf("===========================\n");
}

// Função para gerar nova peça
Peca gerarNovaPeca() {
    Peca novaPeca;
    char tipos[] = {'I', 'O', 'T', 'L'};
    
    novaPeca.tipo = tipos[rand() % 4];
    novaPeca.id = contadorIdGlobal++;
    
    return novaPeca;
}

// Funções da fila circular
void inicializarFilaCircular(FilaCircular* filaPtr) {
    filaPtr->indiceFrente = 0;
    filaPtr->indiceTras = -1;
    filaPtr->quantidadePecas = 0;
}

int verificarFilaCheia(FilaCircular* filaPtr) {
    return filaPtr->quantidadePecas == 5;
}

int verificarFilaVazia(FilaCircular* filaPtr) {
    return filaPtr->quantidadePecas == 0;
}

void inserirPecaNaFila(FilaCircular* filaPtr, Peca pecaParaInserir) {
    if (!verificarFilaCheia(filaPtr)) {
        filaPtr->indiceTras = (filaPtr->indiceTras + 1) % 5;
        filaPtr->pecas[filaPtr->indiceTras] = pecaParaInserir;
        filaPtr->quantidadePecas++;
    }
}

Peca removerPecaDaFila(FilaCircular* filaPtr) {
    Peca pecaRemovida = {'\0', 0};
    
    if (!verificarFilaVazia(filaPtr)) {
        pecaRemovida = filaPtr->pecas[filaPtr->indiceFrente];
        filaPtr->indiceFrente = (filaPtr->indiceFrente + 1) % 5;
        filaPtr->quantidadePecas--;
    }
    
    return pecaRemovida;
}

// Funções da pilha de reserva
void inicializarPilhaReserva(PilhaReserva* pilhaPtr) {
    pilhaPtr->indiceTopo = -1;
    pilhaPtr->quantidadeReservada = 0;
}

int verificarPilhaCheia(PilhaReserva* pilhaPtr) {
    return pilhaPtr->quantidadeReservada == 3;
}

int verificarPilhaVazia(PilhaReserva* pilhaPtr) {
    return pilhaPtr->quantidadeReservada == 0;
}

void reservarPecaNaPilha(PilhaReserva* pilhaPtr, Peca pecaParaReservar) {
    if (!verificarPilhaCheia(pilhaPtr)) {
        pilhaPtr->indiceTopo++;
        pilhaPtr->pecasReservadas[pilhaPtr->indiceTopo] = pecaParaReservar;
        pilhaPtr->quantidadeReservada++;
    }
}

Peca usarPecaDaPilha(PilhaReserva* pilhaPtr) {
    Peca pecaUsada = {'\0', 0};
    
    if (!verificarPilhaVazia(pilhaPtr)) {
        pecaUsada = pilhaPtr->pecasReservadas[pilhaPtr->indiceTopo];
        pilhaPtr->indiceTopo--;
        pilhaPtr->quantidadeReservada--;
    }
    
    return pecaUsada;
}

// Funções de exibição
void exibirMenuPrincipal() {
    printf("\n=== TETRIS - NÍVEL EXPERT ===\n");
    printf("1. Jogar peça da fila\n");
    printf("2. Reservar peça da fila\n");
    printf("3. Usar peça reservada\n");
    printf("4. Exibir estado atual\n");
    printf("5. Exibir estado completo\n");
    printf("6. Estatísticas Expert\n");
    printf("0. Sair\n");
    printf("Escolha uma opção: ");
}

int main() {
    srand(time(NULL));
    
    FilaCircular fila;
    PilhaReserva pilha;
    SistemaExpert sistemaExpert;
    
    inicializarFilaCircular(&fila);
    inicializarPilhaReserva(&pilha);
    inicializarSistemaExpert(&sistemaExpert);
    
    // Gerar peças iniciais
    for (int i = 0; i < 5; i++) {
        inserirPecaNaFila(&fila, gerarNovaPeca());
    }
    
    int opcao;
    
    printf("=== BEM-VINDO AO TETRIS EXPERT ===\n");
    
    do {
        exibirMenuPrincipal();
        scanf("%d", &opcao);
        
        switch (opcao) {
            case 1: {
                if (!verificarFilaVazia(&fila)) {
                    Peca pecaJogada = removerPecaDaFila(&fila);
                    processarJogadaExpert(pecaJogada, 1, &sistemaExpert);
                    
                    printf("Jogou peça %c%d da fila!\n", pecaJogada.tipo, pecaJogada.id);
                    printf("Pontos ganhos: %d | Total: %d | Nível: %d\n", 
                           sistemaExpert.pontosUltimaJogada, 
                           sistemaExpert.pontuacaoTotal, 
                           sistemaExpert.nivelAtual);
                    
                    if (sistemaExpert.comboAtual > 0) {
                        printf("COMBO x%d! Multiplicador: %dx\n", 
                               sistemaExpert.comboAtual, 
                               sistemaExpert.multiplicadorAtual);
                    }
                    
                    // Gerar nova peça
                    inserirPecaNaFila(&fila, gerarNovaPeca());
                } else {
                    printf("Fila vazia!\n");
                }
                break;
            }
            
            case 2: {
                if (!verificarFilaVazia(&fila) && !verificarPilhaCheia(&pilha)) {
                    Peca pecaReservada = removerPecaDaFila(&fila);
                    reservarPecaNaPilha(&pilha, pecaReservada);
                    sistemaExpert.pecasReservadas++;
                    
                    printf("Peça %c%d reservada!\n", pecaReservada.tipo, pecaReservada.id);
                    
                    // Gerar nova peça
                    inserirPecaNaFila(&fila, gerarNovaPeca());
                } else {
                    printf("Não é possível reservar!\n");
                }
                break;
            }
            
            case 3: {
                if (!verificarPilhaVazia(&pilha)) {
                    Peca pecaUsada = usarPecaDaPilha(&pilha);
                    processarJogadaExpert(pecaUsada, 2, &sistemaExpert);
                    
                    printf("Usou peça reservada %c%d!\n", pecaUsada.tipo, pecaUsada.id);
                    printf("Pontos ganhos: %d | Total: %d | Nível: %d\n", 
                           sistemaExpert.pontosUltimaJogada, 
                           sistemaExpert.pontuacaoTotal, 
                           sistemaExpert.nivelAtual);
                } else {
                    printf("Pilha de reserva vazia!\n");
                }
                break;
            }
            
            case 4:
                printf("\n=== ESTADO ATUAL ===\n");
                printf("Peças na fila: %d/5\n", fila.quantidadePecas);
                printf("Peças reservadas: %d/3\n", pilha.quantidadeReservada);
                break;
                
            case 5:
                printf("\n=== ESTADO COMPLETO ===\n");
                printf("Fila: ");
                for (int i = 0; i < fila.quantidadePecas; i++) {
                    int idx = (fila.indiceFrente + i) % 5;
                    printf("%c%d ", fila.pecas[idx].tipo, fila.pecas[idx].id);
                }
                printf("\nReserva: ");
                for (int i = 0; i <= pilha.indiceTopo; i++) {
                    printf("%c%d ", pilha.pecasReservadas[i].tipo, pilha.pecasReservadas[i].id);
                }
                printf("\n");
                break;
                
            case 6:
                exibirEstatisticasExpert(&sistemaExpert);
                break;
                
            case 0:
                printf("Obrigado por jogar!\n");
                break;
                
            default:
                printf("Opção inválida! Escolha entre 0-6.\n");
                break;
        }
        
        if (opcao != 0) {
            printf("\nPressione Enter para continuar...");
            getchar();
            getchar();
        }
        
    } while (opcao != 0);
    
    return 0;
}