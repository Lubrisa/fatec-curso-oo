/**
 * @file scheduler.c
 * @brief Implementação do despacho dinâmico da interface do Escalonador.
 *
 * As funções deste arquivo atuam como o ponto de entrada da interface pública
 * do Escalonador, redirecionando as chamadas para a implementação
 * correspondente registrada na vtable. As verificações com early-return
 * garantem que não acessaremos uma região de memória inválida caso o ponteiro
 * da instância ou da vtable seja nulo.
 */

#include "scheduler.h"
#include <stddef.h>

void scheduler_add_process(Scheduler *self, const char *name,
                           uint32_t burst_time) {
  if (self == NULL || self->vtable == NULL ||
      self->vtable->add_process == NULL) {
    return;
  }
  self->vtable->add_process(self, name, burst_time);
}

Process *scheduler_tick(Scheduler *self) {
  if (self == NULL || self->vtable == NULL || self->vtable->tick == NULL) {
    return NULL;
  }
  return self->vtable->tick(self);
}

bool scheduler_has_pending(const Scheduler *self) {
  if (self == NULL || self->vtable == NULL ||
      self->vtable->has_pending == NULL) {
    return false;
  }
  return self->vtable->has_pending(self);
}

void scheduler_destroy(Scheduler *self) {
  if (self == NULL || self->vtable == NULL || self->vtable->destroy == NULL) {
    return;
  }
  self->vtable->destroy(self);
}
