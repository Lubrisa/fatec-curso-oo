#include "fifo_scheduler.h"
#include <stdlib.h>

#define MAX_PROCESSES 16

/**
 * @brief Estrutura concreta do Escalonador FIFO.
 * Contém a struct Scheduler base como primeiro membro para suporte a
 * Polimorfismo (Upcasting).
 */
typedef struct {
  Scheduler base; /**< Interface base contendo o ponteiro vtable */
  Process *processes[MAX_PROCESSES]; /**< Array privado de ponteiros para
                                        objetos Process */
  size_t process_count;              /**< Quantidade de processos cadastrados */
  size_t current_index; /**< Índice do processo em execução no momento */
  uint32_t next_pid;    /**< Gerador de PID auto-incrementado */
} FifoScheduler;

static void fifo_add_process(Scheduler *self, const char *name,
                             uint32_t burst_time) {
  FifoScheduler *fifo = (FifoScheduler *)self;
  if (fifo == NULL || fifo->process_count >= MAX_PROCESSES) {
    return;
  }

  /* Auto-incrementa o PID interno e instancia o objeto Processo encapsulado */
  uint32_t pid = fifo->next_pid++;
  Process *process = process_create(pid, name, burst_time);
  if (process == NULL) {
    return;
  }

  fifo->processes[fifo->process_count] = process;
  fifo->process_count++;
}

static Process *fifo_tick(Scheduler *self) {
  FifoScheduler *fifo = (FifoScheduler *)self;
  if (fifo == NULL || fifo->process_count == 0) {
    return NULL;
  }

  /* Avança o índice até encontrar o próximo processo não concluído */
  while (fifo->current_index < fifo->process_count &&
         process_is_finished(fifo->processes[fifo->current_index])) {
    fifo->current_index++;
  }

  if (fifo->current_index >= fifo->process_count) {
    return NULL;
  }

  Process *current = fifo->processes[fifo->current_index];

  /* Executa o comportamento encapsulado do objeto Processo por 1 tick */
  process_execute(current, 1);

  if (process_is_finished(current)) {
    fifo->current_index++;
  }

  return current;
}

static bool fifo_has_pending(const Scheduler *self) {
  const FifoScheduler *fifo = (const FifoScheduler *)self;
  if (fifo == NULL || fifo->process_count == 0) {
    return false;
  }

  for (size_t i = 0; i < fifo->process_count; i++) {
    if (!process_is_finished(fifo->processes[i])) {
      return true;
    }
  }

  return false;
}

static void fifo_destroy(Scheduler *self) {
  FifoScheduler *fifo = (FifoScheduler *)self;
  if (fifo == NULL) {
    return;
  }

  /* Libera cada objeto de processo individualmente */
  for (size_t i = 0; i < fifo->process_count; i++) {
    if (fifo->processes[i] != NULL) {
      process_destroy(fifo->processes[i]);
      fifo->processes[i] = NULL;
    }
  }

  free(fifo);
}

/**
 * @brief Instância estática constante da tabela de métodos virtuais para o
 * FifoScheduler.
 */
static const SchedulerVTable fifo_vtable = {.add_process = fifo_add_process,
                                            .tick = fifo_tick,
                                            .has_pending = fifo_has_pending,
                                            .destroy = fifo_destroy};

Scheduler *fifo_scheduler_create(void) {
  FifoScheduler *self = (FifoScheduler *)malloc(sizeof(FifoScheduler));
  if (self == NULL) {
    return NULL;
  }

  self->base.vtable = &fifo_vtable;
  self->process_count = 0;
  self->current_index = 0;
  self->next_pid = 101; /* PIDs numéricos iniciam em 101 */

  return (Scheduler *)self;
}
