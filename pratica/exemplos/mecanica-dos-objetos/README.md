# Escalonador de Processos: Estudo Comparativo em C (Procedural vs Orientação a Objetos)

Este exemplo pertence ao **Módulo 3: Mecânica dos Objetos** do curso. Ele é
tanto um estudo comparativo prático quanto uma demonstração didática de que **é
plenamente possível implementar Orientação a Objetos (OO) em C**, uma linguagem
procedural que não possui mecanismos nativos de Orientação a Objetos em sua
sintaxe.

O domínio escolhido é o **Escalonamento de Processos em Sistemas Operacionais**,
cobrindo os algoritmos **FIFO (First-In, First-Out)** e **Round-Robin
(Preemptivo com Quantum de Tempo)**.

## 1. Estrutura dos Arquivos do Exemplo

```text
exemplos/mecanica-dos-objetos/
├── specification.md                     # Especificação funcional e formal do sistema
├── README.md                            # Documentação técnica comparativa (este arquivo)
│
├── procedural/                          # Abordagem Procedural Modular
│   ├── process.h                        # Estrutura de dados do Processo
│   ├── scheduler.h                      # Interface do Escalonador
│   ├── scheduler.c                      # Lógica dos algoritmos
│   └── main.c                           # Código cliente (orquestração e manipulação direta)
│
└── oo/                                  # Abordagem Orientada a Objetos
    ├── process.h                        # Contrato do objeto Processo
    ├── process.c                        # Encapsulamento de atributos e métodos
    ├── scheduler.h                      # Interface base com Tabela de Métodos Virtuais
    ├── scheduler.c                      # Despacho dinâmico
    ├── fifo_scheduler.h / .c            # Implementação concreta do Escalonador FIFO
    ├── round_robin_scheduler.h / .c     # Implementação concreta do Escalonador Round-Robin
    ├── simulator.h / .c                 # Runner de simulação desacoplado
    └── main.c                           # Código cliente OO (interage via abstrações)
```

## 2. Análise Comparativa de Arquitetura e Design

### 2.1 Encapsulamento e Integridade dos Dados

Como visto no **[Módulo 2: O que é um
Objeto?](../../conceitos/2-o-que-e-um-objeto.md)**, o encapsulamento protege o
estado interno de um objeto contra modificações indevidas, garantindo
invariantes de dados.

- **Na versão Procedural (`procedural/`):** Tanto a `struct Process` em
  [process.h](./procedural/process.h) quanto a `struct Scheduler` em
  [scheduler.h](./procedural/scheduler.h) possuem membros totalmente públicos. A
  função `main` em [main.c](./procedural/main.c) manipula os campos diretamente.
  Isso expõe as estruturas a estados inconsistentes (ex: o código cliente pode
  zerar `remaining_time` sem alterar o `state`, violando a integridade da
  aplicação).

- **Na versão Orientada a Objetos (`oo/`):**
  - O objeto `Process` em [process.h](./oo/process.h) é declarado como um
    **ponteiro opaco** (`typedef struct Process Process;`), ocultando os campos
    privados dentro de [process.c](./oo/process.c). Alterações de estado ocorrem
    estritamente por meio dos métodos comportamentais (`process_execute`).
  - Da mesma forma, o `Scheduler` deixa de ser uma struct universal aberta e
    passa a ser uma **interface abstrata com `vtable`** em
    [scheduler.h](./oo/scheduler.h). Todas as suas estruturas internas (como a
    lista de processos, contadores de tempo e o `quantum`) ficam completamente
    encapsuladas dentro dos arquivos privados de cada implementação concreta
    ([fifoScheduler.c](./oo/fifo_scheduler.c) e
    [roundRobinScheduler.c](./oo/round_robin_scheduler.c)). O código cliente não
    consegue desordenar ponteiros da fila ou zerar fatias de tempo
    arbitrariamente, **impossibilitando deixar o escalonador em um estado
    inválido**.

_Nota de Design:_ Embora a versão OO seja substancialmente mais segura e
robusta, ela exige maior disciplina do desenvolvedor. Especificamente em C (onde
separamos ponteiros opacos e structs privadas em arquivos `.h` e `.c`
distintos), o projeto passa a ter mais arquivos, o que pode tornar a navegação
inicial mais verbosa do que em linguagens com suporte nativo a OO.

#### Comparativo: Como a classe `Process` ficaria em Java?

Em linguagens com suporte nativo a OO (como Java), a definição de visibilidade é
limpa e integrada à própria linguagem:

```java
public class Process {
    private final int pid;
    private final String name;
    private final int burstTime;
    private int remainingTime;
    private ProcessState state;

    public Process(int pid, String name, int burstTime) {
        // ...
    }

    public void execute(int timeSlice) {
        // ...
    }

    public boolean isFinished() {
        // ...
    }
}
```

### 2.2 Polimorfismo, Acoplamento e Extensibilidade

Um princípio fundamental no design orientado a objetos é **evitar a alteração de
código que já está consolidado e testado**, permitindo adicionar novas
funcionalidades de forma puramente aditiva (indo ao encontro da decomposição de
responsabilidades vista no **[Módulo 1: Paradigmas de
Programação](../../conceitos/1-paradigmas-de-programacao.md)**).

- **Na versão Procedural (`procedural/`):** O despacho na função
  `scheduler_tick` em [scheduler.c](./procedural/scheduler.c) utiliza um bloco
  `switch(scheduler->algorithm)` para decidir a lógica de execução. Qualquer
  nova funcionalidade exige abrir e alterar o arquivo `scheduler.c`, inserindo
  novos `case`s e enums. O código fica altamente acoplado e propício a
  regressão.

- **Na versão Orientada a Objetos (`oo/`):** Conforme estudado no **[Módulo 3:
  Mecânica dos Objetos](../../conceitos/3-mecanica-dos-objetos.md)**, utilizamos
  uma **Tabela de Métodos Virtuais (`vtable`)** definida em
  [scheduler.h](./oo/scheduler.h). O `Simulator` em
  [simulator.c](./oo/simulator.c) executa o escalonador chamando a interface
  abstrata via _late binding_.

#### O Custo de Performance do Polimorfismo

Apesar de ganhar extrema flexibilidade e desacoplamento, o polimorfismo por
`vtable` traz um **custo de performance**:

1. **Consumo de Memória:** Cada instância precisa carregar o ponteiro da
   `vtable` (além do custo adicional no heap para alocação/liberação dinâmica
   por `malloc`/`free`).
2. **Tempo de Execução:** O despacho por ponteiros de função exige instruções de
   indirection a mais na CPU (buscar a `vtable` na memória e depois saltar para
   o endereço do ponteiro de função).

_Nota Didática:_ Esse overhead costuma ser insignificante na grande maioria das
aplicações de software. Porém, em sistemas embarcados críticos de baixíssimo
recurso ou em aplicações que escalam para milhões de objetos criados por
segundo, o custo dessa indireção pode ser tornar relevante.

#### Comparativo: Como o Polimorfismo ficaria em Java?

Em Java, a linguagem gerencia as `vtables` automaticamente por debaixo dos
panos, tornando o código bem mais enxuto:

```java
// Interface pública
public interface Scheduler {
    void addProcess(String name, int burstTime);
    Process tick();
    boolean hasPending();
}

// Implementação concreta
public class FifoScheduler implements Scheduler {
    // ...
}

// Uso polimórfico no Simulador
public class Simulator {
    public void run(Scheduler scheduler, String title) {
        while (scheduler.hasPending()) {
            Process running = scheduler.tick();
            // ...
        }
    }
}
```

### 2.3 Inchaço de Estado (_State Bloat_) vs Custo Polimórfico

- **Na versão Procedural (`procedural/`):** A `struct Scheduler` é "universal" e
  agrupa todos os campos de todos os algoritmos suportados (`quantum`,
  `current_slice_ticks`, etc.). Quando executamos em modo FIFO, esses campos
  ficam ociosos, gerando desperdício de memória e poluindo a estrutura.

- **Na versão Orientada a Objetos (`oo/`):** Conseguimos enxugar o estado de
  cada objeto (`FifoScheduler` aloca apenas a fila; `RoundRobinScheduler` aloca
  também o `quantum`). **Contudo, vale frisar:** para obter essa economia de
  espaço na estrutura de dados, precisamos do polimorfismo. Ou seja, trocamos a
  memória do estado ocioso pelo custo de gerenciamento dinâmico e ponteiro de
  `vtable`.

### 2.4 Responsabilidade do Código Cliente

- **Na versão Procedural (`procedural/`):** O código cliente em
  [main.c](./procedural/main.c) precisa instanciar diretamente a struct aberta,
  popular manualmente o array e controlar o laço `while(has_pending)`
  inspecionando diretamente os dados da estrutura.

- **Na versão Orientada a Objetos (`oo/`):** A aplicação cliente
  [main.c](./oo/main.c) interage apenas com métodos de alto nível
  (`round_robin_scheduler_create`, `scheduler_add_process`), enquanto a
  responsabilidade de executar a simulação fica totalmente delegada ao
  `Simulator`.

## 3. Estudo de Caso: Adicionando um 3º Algoritmo (Priority Round-Robin)

Para demonstrar o impacto prático na manutenibilidade, veja o que é exigido para
adicionar um 3º algoritmo: **Priority Round-Robin**.

### Na Abordagem Procedural (Alteração de Código Consolidado)

É necessário **modificar múltiplos arquivos existentes**:

1. **Em `procedural/process.h`:** Adicionar o atributo `priority`:

   ```c
   typedef struct {
       uint32_t pid;
       char name[32];
       uint32_t burst_time;
       uint32_t remaining_time;
       ProcessState state;
       uint32_t priority; // <--- MODIFICAÇÃO EM ARQUIVO CONSOLIDADO
   } Process;
   ```

2. **Em `procedural/scheduler.h`:** Alterar enum e acrescentar campos na struct
   universal:

   ```c
   typedef enum {
       SCHEDULER_ALGORITHM_FIFO,
       SCHEDULER_ALGORITHM_ROUND_ROBIN,
       SCHEDULER_ALGORITHM_PRIORITY_RR // <--- MODIFICAÇÃO
   } SchedulerAlgorithm;
   ```

3. **Em `procedural/scheduler.c`:** Inserir um novo `case` no `switch` da função
   `scheduler_tick`:

   ```c
   switch (scheduler->algorithm) {
       case SCHEDULER_ALGORITHM_FIFO:
           return run_fifo_tick(scheduler);
       case SCHEDULER_ALGORITHM_ROUND_ROBIN:
           return run_round_robin_tick(scheduler);
       case SCHEDULER_ALGORITHM_PRIORITY_RR: // <--- MODIFICAÇÃO
           return run_priority_rr_tick(scheduler);
   }
   ```

### Na Abordagem Orientada a Objetos (Código 100% Aditivo)

1. **Criar novos arquivos `oo/priority_rr_scheduler.h` e
   `oo/priority_rr_scheduler.c`:**

   ```c
   // oo/priority_rr_scheduler.h
   Scheduler *priority_rr_scheduler_create(uint32_t quantum);
   ```

2. **Nenhuma linha dos arquivos existentes (`scheduler.h`, `scheduler.c`,
   `fifo_scheduler.c`, `simulator.c`) é alterada!**

## 4. Nota de Arquitetura: Deduplicação de Código entre Escalonadores

Inspecionando os arquivos `oo/fifo_scheduler.c` e `oo/round_robin_scheduler.c`,
observa-se que métodos como `add_process`, `has_pending` e `destroy` possuem
implementações quase idênticas, pois ambos usam um array estático interno de
processos.

Existem mecanismos para eliminar essa duplicação (como o conceito de **Classe
Abstrata Base**).

### Como seria em C (Estrutura Base Simplificada)

Poderíamos criar uma struct base `ArrayScheduler` contendo a fila de processos e
fornecer implementações padrão reutilizáveis para `add_process`, `has_pending` e
`destroy`.

As implementações concretas (como `FifoScheduler`) estenderiam a base
posicionando a `ArrayScheduler base` como seu **primeiro membro** de dados:

```c
// 1. Struct base que agrupa o estado comum dos escalonadores que usam um array
// para gerenciar os processos.
typedef struct {
    Scheduler base;                   // "herda" o ponteiro vtable da interface
    Process *processes[16];
    size_t process_count;
    uint32_t next_pid;
} ArrayScheduler;

// Implementações reutilizáveis fornecidas pela base
void array_scheduler_add_process(Scheduler *self, const char *name, uint32_t burst_time) {
  //...
}
bool array_scheduler_has_pending(const Scheduler *self) {
  //...
}
void array_scheduler_destroy(Scheduler *self) {
  //...
}

// 2. Struct derivada concreta "herdando" a struct base como primeiro membro
typedef struct {
    ArrayScheduler base;              // "herda" todos os campos do ArrayScheduler
} FifoScheduler;

// 3. vtable do FifoScheduler reutilizando as funções padrão da base e
// definindo apenas o 'tick'
static const SchedulerVTable fifo_vtable = {
    .add_process = array_scheduler_add_process,   // reutilizado da base
    .tick        = fifo_tick,                     // método específico do FIFO
    .has_pending  = array_scheduler_has_pending,  // reutilizado da base
    .destroy     = array_scheduler_destroy        // reutilizado da base
};
```

### Como seria em Java

Em Java, a dedutibilidade é nativa através do suporte a `abstract class`:

```java
public abstract class ArrayScheduler implements Scheduler {
    protected List<Process> processes = new ArrayList<>();

    @Override
    public void addProcess(String name, int burstTime) {
        processes.add(new Process(generatePid(), name, burstTime));
    }

    @Override
    public boolean hasPending() {
        return processes.stream().anyMatch(p -> !p.isFinished());
    }
}

public class FifoScheduler extends ArrayScheduler {
    @Override
    public Process tick() {
        // Implementa apenas a regra FIFO específica
    }
}
```

### Por que não aplicamos a Classe Abstrata Base neste Exemplo em C?

Neste repositório didático, optamos por **não** introduzir uma classe abstrata
intermediária em C porque isso adicionaria uma camada a mais de ponteiros e
indireção. Para os objetivos deste módulo, manter cada escalonador autocontido
no seu próprio arquivo `.c` deixa o aprendizado mais direto, sem sobrecarregar a
estrutura de arquivos.

## 5. Compilação e Execução

O código pode ser compilado com **qualquer compilador compatível com C99** (como
GCC, Clang ou MSVC).

### Executando a Simulação Procedural com GCC

```bash
gcc -Wall -Wextra -std=c99 -pedantic -Iprocedural procedural/scheduler.c procedural/main.c -o procedural_app.exe
./procedural_app.exe
```

### Executando a Simulação Orientada a Objetos com GCC

```bash
gcc -Wall -Wextra -std=c99 -pedantic -Ioo oo/process.c oo/scheduler.c oo/fifo_scheduler.c oo/round_robin_scheduler.c oo/simulator.c oo/main.c -o oo_app.exe
./oo_app.exe
```
