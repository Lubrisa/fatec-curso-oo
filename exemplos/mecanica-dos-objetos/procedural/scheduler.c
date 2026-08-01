#include "scheduler.h"
#include <stddef.h>

/**
 * @brief Executa o ciclo de escalonamento FIFO.
 */
static Process *run_fifo_tick(Scheduler *scheduler) {
  /* Avança o índice até encontrar o próximo processo que ainda não finalizou */
  while (scheduler->current_index < scheduler->process_count &&
         scheduler->processes[scheduler->current_index].state ==
             PROCESS_STATE_FINISHED) {
    scheduler->current_index++;
  }

  /* Se o índice ultrapassou o total de processos, a fila inteira foi concluída
   */
  if (scheduler->current_index >= scheduler->process_count) {
    return NULL;
  }

  Process *current = &scheduler->processes[scheduler->current_index];
  current->state = PROCESS_STATE_RUNNING;

  if (current->remaining_time > 0) {
    current->remaining_time--;
  }

  if (current->remaining_time == 0) {
    current->state = PROCESS_STATE_FINISHED;
    scheduler->current_index++;
  }

  return current;
}

/**
 * @brief Calcula o próximo índice na fila circular utilizando aritmética de
 * módulo.
 *
 * O operador módulo (%) faz a contagem retornar ao início (0) ao atingir o fim
 * da fila, permitindo percorrer os elementos em um ciclo contínuo
 * (comportamento circular).
 */
static size_t get_next_circular_index(size_t current_index,
                                      size_t total_elements) {
  if (total_elements == 0) {
    return 0;
  }
  return (current_index + 1) % total_elements;
}

/**
 * @brief Executa o ciclo de escalonamento Round-Robin.
 */
static Process *run_round_robin_tick(Scheduler *scheduler) {
  size_t searched = 0;

  /*
   * Busca o próximo processo pendente na fila circular.
   * Usamos a variável 'searched' para registrar quantos elementos já foram
   * inspecionados, evitando um loop infinito caso todos os processos já tenham
   * sido finalizados (pois o avanço circular por módulo % continua dando voltas
   * indefinidamente).
   */
  while (searched < scheduler->process_count &&
         scheduler->processes[scheduler->current_index].state ==
             PROCESS_STATE_FINISHED) {
    scheduler->current_index = get_next_circular_index(
        scheduler->current_index, scheduler->process_count);
    searched++;
  }

  /* Se percorreu a fila inteira e todos estão concluídos, encerra a simulação
   */
  if (searched >= scheduler->process_count) {
    return NULL;
  }

  Process *current = &scheduler->processes[scheduler->current_index];
  current->state = PROCESS_STATE_RUNNING;

  if (current->remaining_time > 0) {
    current->remaining_time--;
    scheduler->current_slice_ticks++;
  }

  if (current->remaining_time == 0) {
    current->state = PROCESS_STATE_FINISHED;
    scheduler->current_slice_ticks = 0;
    scheduler->current_index = get_next_circular_index(
        scheduler->current_index, scheduler->process_count);
  } else if (scheduler->current_slice_ticks >= scheduler->quantum) {
    /* Se o quantum expirou, devolve o processo para READY e avança para o
     * próximo */
    current->state = PROCESS_STATE_READY;
    scheduler->current_slice_ticks = 0;
    scheduler->current_index = get_next_circular_index(
        scheduler->current_index, scheduler->process_count);
  }

  return current;
}

Process *scheduler_tick(Scheduler *scheduler) {
  if (scheduler == NULL || scheduler->process_count == 0) {
    return NULL;
  }

  switch (scheduler->algorithm) {
  case SCHEDULER_ALGORITHM_FIFO:
    return run_fifo_tick(scheduler);

  case SCHEDULER_ALGORITHM_ROUND_ROBIN:
    return run_round_robin_tick(scheduler);
  }

  return NULL;
}
