#ifndef OO_ROUND_ROBIN_SCHEDULER_H
#define OO_ROUND_ROBIN_SCHEDULER_H

#include "scheduler.h"

/**
 * @brief Instancia e inicializa o escalonador com o algoritmo Round-Robin.
 *
 * Retorna o ponteiro para a interface abstrata Scheduler.
 *
 * @param quantum Fatia máxima de tempo de CPU por ciclo (em ticks).
 * @return Ponteiro para o Scheduler (upcast para a interface pública).
 */
Scheduler *round_robin_scheduler_create(uint32_t quantum);

#endif /* OO_ROUND_ROBIN_SCHEDULER_H */
