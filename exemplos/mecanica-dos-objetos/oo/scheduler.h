#ifndef OO_SCHEDULER_H
#define OO_SCHEDULER_H

#include "process.h"
#include <stdbool.h>

typedef struct Scheduler Scheduler;

/**
 * @brief Tabela de Métodos Virtuais (vtable) do Escalonador.
 * Contém os ponteiros de função para despacho dinâmico (late binding).
 */
typedef struct SchedulerVTable {
  void (*add_process)(Scheduler *self, Process *process);
  Process *(*tick)(Scheduler *self);
  bool (*has_pending)(const Scheduler *self);
  void (*destroy)(Scheduler *self);
} SchedulerVTable;

/**
 * @brief Estrutura base da Interface Escalonador.
 * Todas as implementações (FifoScheduler, RoundRobinScheduler) devem conter
 * esta struct como primeiro membro.
 */
struct Scheduler {
  const SchedulerVTable *vtable;
};

/**
 * @brief Adiciona um processo à fila do escalonador.
 *
 * @param self Ponteiro para a instância do escalonador.
 * @param process Ponteiro para o objeto processo a ser adicionado.
 */
void scheduler_add_process(Scheduler *self, Process *process);

/**
 * @brief Executa um ciclo/tick de CPU sobre o escalonador.
 *
 * @param self Ponteiro para a instância do escalonador.
 * @return Ponteiro para o processo executado no ciclo atual, ou NULL caso não
 * haja processo ativo.
 */
Process *scheduler_tick(Scheduler *self);

/**
 * @brief Verifica se o escalonador possui processos pendentes de execução.
 *
 * @param self Ponteiro para a instância do escalonador.
 * @return true se houver processos pendentes, false caso contrário.
 */
bool scheduler_has_pending(const Scheduler *self);

/**
 * @brief Libera os recursos do escalonador.
 *
 * @param self Ponteiro para a instância do escalonador a ser destruída.
 */
void scheduler_destroy(Scheduler *self);

#endif /* OO_SCHEDULER_H */
