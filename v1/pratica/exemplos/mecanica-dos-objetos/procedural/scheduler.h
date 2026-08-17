#ifndef PROCEDURAL_SCHEDULER_H
#define PROCEDURAL_SCHEDULER_H

#include "process.h"
#include <stddef.h>
#include <stdint.h>

#define MAX_PROCESSES 16

/**
 * @brief Algoritmos de escalonamento suportados.
 */
typedef enum {
  SCHEDULER_ALGORITHM_FIFO,       /**< Escalonamento First-In, First-Out */
  SCHEDULER_ALGORITHM_ROUND_ROBIN /**< Escalonamento Round-Robin por fatia de
                                     tempo */
} SchedulerAlgorithm;

/**
 * @brief Estrutura universal do Escalonador Procedural.
 *
 * Agrupa os atributos e estados necessários para todos os algoritmos
 * suportados. Na abordagem procedural, esta estrutura é manipulada diretamente
 * pela aplicação.
 */
typedef struct {
  SchedulerAlgorithm algorithm;     /**< Algoritmo ativo no escalonador */
  Process processes[MAX_PROCESSES]; /**< Fila estática de processos */
  size_t process_count;             /**< Quantidade de processos cadastrados */
  size_t current_index; /**< Índice do processo em execução no momento */

  /* Campos específicos do Round-Robin (ociosos quando em modo FIFO) */
  uint32_t quantum; /**< Fatia máxima de tempo de CPU em ticks */
  uint32_t
      current_slice_ticks; /**< Contador de ticks executados na fatia atual */
} Scheduler;

/**
 * @brief Executa um ciclo/tick de CPU sobre o escalonador.
 *
 * Função responsável por ditar qual fluxo de escalonamento será executado a
 * cada ciclo.
 *
 * @param scheduler Ponteiro para a estrutura universal do escalonador.
 * @return Ponteiro para o processo executado no ciclo atual, ou NULL caso não
 * haja processo ativo.
 */
Process *scheduler_tick(Scheduler *scheduler);

#endif /* PROCEDURAL_SCHEDULER_H */
