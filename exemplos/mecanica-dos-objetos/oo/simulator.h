#ifndef OO_SIMULATOR_H
#define OO_SIMULATOR_H

#include "scheduler.h"

/**
 * @brief Executa o loop de simulação de escalonamento.
 *
 * @param scheduler Ponteiro para a interface do escalonador a ser executado.
 * @param title Título legível da simulação para o relatório no terminal.
 */
void simulator_run(Scheduler *scheduler, const char *title);

#endif /* OO_SIMULATOR_H */
