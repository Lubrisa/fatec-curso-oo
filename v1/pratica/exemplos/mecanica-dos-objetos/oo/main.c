#include "fifo_scheduler.h"
#include "round_robin_scheduler.h"
#include "simulator.h"
#include <stdio.h>

/**
 * @brief Popula a carga de trabalho de processos utilizando o método genérico
 * do escalonador.
 */
static void populate_workload(Scheduler *scheduler) {
  if (scheduler == NULL) {
    return;
  }
  scheduler_add_process(scheduler, "Compiler", 5);
  scheduler_add_process(scheduler, "TextEditor", 2);
  scheduler_add_process(scheduler, "Database", 8);
}

/**
 * @brief Instancia, popula, executa e destroi o cenário de simulação FIFO.
 */
static void run_fifo_simulation(void) {
  Scheduler *fifo = fifo_scheduler_create();
  populate_workload(fifo);
  simulator_run(fifo, "FIFO (First-In, First-Out)");
  scheduler_destroy(fifo);
}

/**
 * @brief Instancia, popula, executa e destroi o cenário de simulação
 * Round-Robin.
 */
static void run_round_robin_simulation(uint32_t quantum) {
  Scheduler *rr = round_robin_scheduler_create(quantum);
  populate_workload(rr);

  char title[64];
  snprintf(title, sizeof(title), "Round-Robin (Quantum = %u)", quantum);

  simulator_run(rr, title);
  scheduler_destroy(rr);
}

int main(void) {
  run_fifo_simulation();
  run_round_robin_simulation(2);
  return 0;
}
