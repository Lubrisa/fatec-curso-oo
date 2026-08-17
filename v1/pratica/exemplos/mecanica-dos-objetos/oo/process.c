#include "process.h"
#include <stdlib.h>
#include <string.h>

#define PROCESS_NAME_LEN 32

typedef enum {
  PROCESS_STATE_READY,
  PROCESS_STATE_RUNNING,
  PROCESS_STATE_FINISHED
} ProcessState;

/**
 * @brief Definição da estrutura do objeto Processo.
 */
struct Process {
  uint32_t pid;
  char name[PROCESS_NAME_LEN];
  uint32_t burst_time;
  uint32_t remaining_time;
  ProcessState state;
};

Process *process_create(uint32_t pid, const char *name, uint32_t burst_time) {
  Process *self = (Process *)malloc(sizeof(Process));

  /*
   * Validação de segurança: se a alocação de memória no heap falhar (malloc
   * retornar NULL), interrompe o construtor para evitar o acesso a uma área da
   * memória inválida, causando Segmentation Fault.
   */
  if (self == NULL) {
    return NULL;
  }

  self->pid = pid;
  self->burst_time = burst_time;
  self->remaining_time = burst_time;
  self->state = PROCESS_STATE_READY;

  /**
   * Strings que não terminam com o caractere NULL (\0) podem causar bugs, por
   * isso colocamos ele manualmente no final do array.
   */
  if (name != NULL) {
    strncpy(self->name, name, PROCESS_NAME_LEN - 1);
    self->name[PROCESS_NAME_LEN - 1] = '\0';
  } else {
    self->name[0] = '\0';
  }

  return self;
}

void process_execute(Process *self, uint32_t time_slice) {
  if (self == NULL || self->state == PROCESS_STATE_FINISHED) {
    return;
  }

  self->state = PROCESS_STATE_RUNNING;

  if (self->remaining_time > time_slice) {
    self->remaining_time -= time_slice;
  } else {
    self->remaining_time = 0;
    self->state = PROCESS_STATE_FINISHED;
  }
}

bool process_is_finished(const Process *self) {
  if (self == NULL) {
    return true;
  }
  return self->remaining_time == 0;
}

uint32_t process_get_pid(const Process *self) {
  return (self != NULL) ? self->pid : 0;
}

const char *process_get_name(const Process *self) {
  return (self != NULL) ? self->name : "";
}

uint32_t process_get_remaining_time(const Process *self) {
  return (self != NULL) ? self->remaining_time : 0;
}

void process_destroy(Process *self) {
  if (self != NULL) {
    free(self);
  }
}
