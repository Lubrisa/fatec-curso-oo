#ifndef OO_PROCESS_H
#define OO_PROCESS_H

#include <stdbool.h>
#include <stdint.h>

/**
 * @brief Representação dos dados de um Processo do Sistema Operacional.
 */
typedef struct Process Process;

/**
 * @brief Construtor do objeto Processo.
 *
 * @param pid Identificador único.
 * @param name Nome do programa.
 * @param burst_time Tempo de CPU necessário.
 * @return Ponteiro para a nova instância do objeto Processo alocada no heap.
 */
Process *process_create(uint32_t pid, const char *name, uint32_t burst_time);

/**
 * @brief Executa um comportamento de CPU sobre o objeto Processo.
 *
 * Transita o estado interno e decrementa o tempo restante.
 *
 * @param self Ponteiro para a instância do objeto (parâmetro 'this').
 * @param time_slice Quantidade de ticks a executar no ciclo.
 */
void process_execute(Process *self, uint32_t time_slice);

/**
 * @brief Consulta se a carga de trabalho do processo foi concluída.
 *
 * @param self Ponteiro para a instância do objeto.
 * @return true se remaining_time == 0, false caso contrário.
 */
bool process_is_finished(const Process *self);

/**
 * @brief Retorna o PID do processo.
 *
 * @param self Ponteiro para a instância do objeto.
 * @return PID do processo.
 */
uint32_t process_get_pid(const Process *self);

/**
 * @brief Retorna o nome do processo.
 *
 * @param self Ponteiro para a instância do objeto.
 * @return Nome do processo.
 */
const char *process_get_name(const Process *self);

/**
 * @brief Retorna o tempo restante de CPU do processo.
 *
 * @param self Ponteiro para a instância do objeto.
 * @return Tempo restante de CPU.
 */
uint32_t process_get_remaining_time(const Process *self);

/**
 * @brief Destrutor do objeto Processo.
 *
 * @param self Ponteiro para a instância a ser liberada da memória.
 */
void process_destroy(Process *self);

#endif /* OO_PROCESS_H */
