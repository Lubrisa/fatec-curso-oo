#ifndef PROCEDURAL_PROCESS_H
#define PROCEDURAL_PROCESS_H

#include <stdint.h>

/**
 * @brief Estados possíveis de um processo no ciclo de vida do escalonador.
 */
typedef enum {
    PROCESS_STATE_READY,   /**< Aguardando alocação de tempo de CPU */
    PROCESS_STATE_RUNNING, /**< Em execução no ciclo atual de CPU */
    PROCESS_STATE_FINISHED /**< Carga de trabalho concluída */
} ProcessState;

/**
 * @brief Representação dos dados de um Processo do Sistema Operacional.
 */
typedef struct {
    uint32_t pid;            /**< Identificador único do processo */
    char name[32];           /**< Nome legível do programa */
    uint32_t burst_time;     /**< Tempo total de CPU necessário (em ticks) */
    uint32_t remaining_time; /**< Tempo restante de CPU (em ticks) */
    ProcessState state;      /**< Estado atual do processo */
} Process;

#endif /* PROCEDURAL_PROCESS_H */
