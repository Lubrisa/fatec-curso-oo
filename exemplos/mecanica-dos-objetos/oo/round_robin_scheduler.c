#include "round_robin_scheduler.h"
#include <stdlib.h>

#define MAX_PROCESSES 16

/**
 * @brief Estrutura concreta do Escalonador Round-Robin.
 * Contém a struct Scheduler base como primeiro membro para suporte a
 * Polimorfismo (Upcasting).
 */
typedef struct {
  Scheduler base; /**< Interface base contendo o ponteiro vtable */
  Process *processes[MAX_PROCESSES]; /**< Array privado de ponteiros para
                                        objetos Process */
  size_t process_count;              /**< Quantidade de processos cadastrados */
  size_t current_index; /**< Índice do processo em execução no momento */
  uint32_t quantum;     /**< Fatia máxima de tempo de CPU por ciclo */
  uint32_t
      current_slice_ticks; /**< Contador de ticks executados na fatia atual */
  uint32_t next_pid;       /**< Gerador de PID auto-incrementado */
} RoundRobinScheduler;

/**
 * @brief Calcula o próximo índice na fila circular utilizando aritmética
 * modular.
 */
static size_t get_next_circular_index(size_t current_index,
                                      size_t total_elements) {
  if (total_elements == 0) {
    return 0;
  }
  return (current_index + 1) % total_elements;
}

static void rr_add_process(Scheduler *self, const char *name,
                           uint32_t burst_time) {
  RoundRobinScheduler *rr = (RoundRobinScheduler *)self;
  if (rr == NULL || rr->process_count >= MAX_PROCESSES) {
    return;
  }

  uint32_t pid = rr->next_pid++;
  Process *process = process_create(pid, name, burst_time);
  if (process == NULL) {
    return;
  }

  rr->processes[rr->process_count] = process;
  rr->process_count++;
}

static Process *rr_tick(Scheduler *self) {
  RoundRobinScheduler *rr = (RoundRobinScheduler *)self;
  if (rr == NULL || rr->process_count == 0) {
    return NULL;
  }

  size_t searched = 0;
  /*
   * Busca o próximo processo pendente na fila circular.
   * Usamos a variável 'searched' para registrar quantos elementos já foram
   * inspecionados, evitando um loop infinito caso todos os processos já tenham
   * sido finalizados (pois o avanço circular por módulo % continua dando voltas
   * indefinidamente).
   */
  while (searched < rr->process_count &&
         process_is_finished(rr->processes[rr->current_index])) {
    rr->current_index =
        get_next_circular_index(rr->current_index, rr->process_count);
    searched++;
  }

  if (searched >= rr->process_count) {
    return NULL;
  }

  Process *current = rr->processes[rr->current_index];

  /* Executa o comportamento encapsulado do objeto Processo por 1 tick */
  process_execute(current, 1);
  rr->current_slice_ticks++;

  if (process_is_finished(current)) {
    rr->current_slice_ticks = 0;
    rr->current_index =
        get_next_circular_index(rr->current_index, rr->process_count);
  } else if (rr->current_slice_ticks >= rr->quantum) {
    /* Quantum expirou: reseta o contador e avança para o próximo processo */
    rr->current_slice_ticks = 0;
    rr->current_index =
        get_next_circular_index(rr->current_index, rr->process_count);
  }

  return current;
}

static bool rr_has_pending(const Scheduler *self) {
  const RoundRobinScheduler *rr = (const RoundRobinScheduler *)self;
  if (rr == NULL || rr->process_count == 0) {
    return false;
  }

  for (size_t i = 0; i < rr->process_count; i++) {
    if (!process_is_finished(rr->processes[i])) {
      return true;
    }
  }

  return false;
}

static void rr_destroy(Scheduler *self) {
  RoundRobinScheduler *rr = (RoundRobinScheduler *)self;
  if (rr == NULL) {
    return;
  }

  /* Libera cada objeto de processo individualmente */
  for (size_t i = 0; i < rr->process_count; i++) {
    if (rr->processes[i] != NULL) {
      process_destroy(rr->processes[i]);
      rr->processes[i] = NULL;
    }
  }

  free(rr);
}

/**
 * @brief Instância estática constante da tabela de métodos virtuais para o
 * RoundRobinScheduler.
 */
static const SchedulerVTable round_robin_vtable = {
    .add_process = rr_add_process,
    .tick = rr_tick,
    .has_pending = rr_has_pending,
    .destroy = rr_destroy};

Scheduler *round_robin_scheduler_create(uint32_t quantum) {
  RoundRobinScheduler *self =
      (RoundRobinScheduler *)malloc(sizeof(RoundRobinScheduler));
  if (self == NULL) {
    return NULL;
  }

  self->base.vtable = &round_robin_vtable;
  self->process_count = 0;
  self->current_index = 0;
  self->quantum = (quantum > 0) ? quantum : 1;
  self->current_slice_ticks = 0;
  self->next_pid = 101; /* PIDs numéricos iniciam em 101 */

  return (Scheduler *)self;
}
