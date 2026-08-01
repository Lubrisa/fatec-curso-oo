#ifndef OO_FIFO_SCHEDULER_H
#define OO_FIFO_SCHEDULER_H

#include "scheduler.h"

/**
 * @brief Instancia e inicializa o escalonador com o algoritmo FIFO.
 *
 * Retorna o ponteiro para a interface abstrata Scheduler.
 *
 * @return Ponteiro para o Scheduler (upcast para a interface pública).
 */
Scheduler *fifo_scheduler_create(void);

#endif /* OO_FIFO_SCHEDULER_H */
