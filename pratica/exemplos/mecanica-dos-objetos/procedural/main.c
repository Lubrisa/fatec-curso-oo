#include "scheduler.h"
#include <stdbool.h>
#include <stdio.h>

/**
 * @brief Instancia e inicializa os atributos de um Escalonador na aplicação
 * cliente.
 */
static Scheduler create_scheduler(SchedulerAlgorithm algorithm,
                                  uint32_t quantum) {
  Scheduler scheduler;
  scheduler.algorithm = algorithm;
  scheduler.process_count = 0;
  scheduler.current_index = 0;
  scheduler.quantum = quantum;
  scheduler.current_slice_ticks = 0;
  return scheduler;
}

/**
 * @brief Adiciona processos à estrutura do escalonador.
 */
static void populate_workload(Scheduler *scheduler) {
  if (scheduler == NULL) {
    return;
  }

  scheduler->processes[0] = (Process){.pid = 101,
                                      .name = "Compiler",
                                      .burst_time = 5,
                                      .remaining_time = 5,
                                      .state = PROCESS_STATE_READY};
  scheduler->processes[1] = (Process){.pid = 102,
                                      .name = "TextEditor",
                                      .burst_time = 2,
                                      .remaining_time = 2,
                                      .state = PROCESS_STATE_READY};
  scheduler->processes[2] = (Process){.pid = 103,
                                      .name = "Database",
                                      .burst_time = 8,
                                      .remaining_time = 8,
                                      .state = PROCESS_STATE_READY};
  scheduler->process_count = 3;
}

/**
 * @brief Verifica se há processos pendentes no escalonador.
 */
static bool has_pending_processes(const Scheduler *scheduler) {
  if (scheduler == NULL || scheduler->process_count == 0) {
    return false;
  }

  for (size_t i = 0; i < scheduler->process_count; i++) {
    if (scheduler->processes[i].state != PROCESS_STATE_FINISHED) {
      return true;
    }
  }

  return false;
}

/**
 * @brief Executa o loop principal de simulação tick a tick.
 */
static uint32_t execute_simulation_loop(Scheduler *scheduler) {
  uint32_t tick = 0;
  while (has_pending_processes(scheduler)) {
    Process *running = scheduler_tick(scheduler);
    if (running != NULL) {
      printf("[Tick %03u] Process '%-12s' [PID %u] running (Remaining: %u "
             "ticks)\n",
             tick, running->name, running->pid, running->remaining_time);
    }
    tick++;
  }
  return tick;
}

/**
 * @brief Executa o cenário de simulação procedural completo para um algoritmo.
 */
static void run_simulation(SchedulerAlgorithm algorithm, const char *title,
                           uint32_t quantum) {
  /* 1. Aplicação cliente cria a estrutura do escalonador */
  Scheduler scheduler = create_scheduler(algorithm, quantum);

  /* 2. Aplicação cliente popula a lista de processos */
  populate_workload(&scheduler);

  printf("\n==================================================================="
         "=============\n");
  printf("                  SIMULACAO PROCEDURAL: %s\n", title);
  printf("====================================================================="
         "===========\n");

  /* 3. Aplicação cliente coordena a execução da simulação */
  uint32_t total_ticks = execute_simulation_loop(&scheduler);

  printf("---------------------------------------------------------------------"
         "-----------\n");
  printf("Tempo total de simulacao: %u ticks\n", total_ticks);
  printf("====================================================================="
         "===========\n");
}

int main(void) {
  run_simulation(SCHEDULER_ALGORITHM_FIFO, "FIFO (First-In, First-Out)", 0);
  run_simulation(SCHEDULER_ALGORITHM_ROUND_ROBIN, "Round-Robin (Quantum = 2)",
                 2);
  return 0;
}
