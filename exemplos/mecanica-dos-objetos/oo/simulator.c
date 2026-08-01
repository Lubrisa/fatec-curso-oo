#include "simulator.h"
#include <stdio.h>

void simulator_run(Scheduler *scheduler, const char *title) {
  if (scheduler == NULL) {
    return;
  }

  printf("\n==================================================================="
         "=============\n");
  printf("                  SIMULACAO ORIENTADA A OBJETOS: %s\n", title);
  printf("====================================================================="
         "===========\n");

  uint32_t tick = 0;
  while (scheduler_has_pending(scheduler)) {
    Process *running = scheduler_tick(scheduler);
    if (running != NULL) {
      printf("[Tick %03u] Process '%-12s' [PID %u] running (Remaining: %u "
             "ticks)\n",
             tick, process_get_name(running), process_get_pid(running),
             process_get_remaining_time(running));
    }
    tick++;
  }

  printf("---------------------------------------------------------------------"
         "-----------\n");
  printf("Tempo total de simulacao: %u ticks\n", tick);
  printf("====================================================================="
         "===========\n");
}
