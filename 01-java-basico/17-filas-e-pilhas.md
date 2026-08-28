# 17. Filas e Pilhas

## O Que São Filas e Pilhas

Filas e pilhas são coleções que definem uma **política de acesso** — ou seja,
determinam em qual ordem os elementos saem, independentemente da ordem em que
entraram.

**Fila (Queue)** segue a política FIFO (_First In, First Out_): o primeiro
elemento a entrar é o primeiro a sair. Pense em uma fila de banco.

![Fila — FIFO](./imgs/queue.png)

Na imagem, o elemento que entrou primeiro está na base e é o próximo a sair. O
elemento que entrou por último está no topo e ainda aguarda sua vez.

**Pilha (Stack)** segue a política LIFO (_Last In, First Out_): o último
elemento a entrar é o primeiro a sair. Pense em uma pilha de pratos — você
sempre pega o de cima.

![Pilha — LIFO](./imgs/stack.png)

Na imagem, o elemento que entrou por último está no topo e é o próximo a sair. O
elemento que entrou primeiro está na base e só sairá quando todos os outros
acima dele tiverem sido removidos.

## Interfaces e Implementações

Java representa filas com a interface `Queue<E>`. A interface `Deque<E>`
(_Double Ended Queue_) estende `Queue` e permite inserir e remover em ambas as
extremidades — o que a torna útil tanto como fila quanto como pilha.

A implementação preferida para ambos os casos é `ArrayDeque`, que usa um array
circular internamente e oferece custo amortizado O(1) para todas as operações.

> A classe `Stack` existe na biblioteca padrão mas é considerada legada. Prefira
> `ArrayDeque` — ela é mais eficiente e não carrega as restrições de design da
> `Stack` original.

## Fila com `ArrayDeque`

```java
import java.util.ArrayDeque;
import java.util.Queue;

Queue<String> queue = new ArrayDeque<>();

queue.offer("primeiro");   // insere no final
queue.offer("segundo");
queue.offer("terceiro");

queue.peek();              // "primeiro" — consulta o início sem remover
queue.poll();              // "primeiro" — remove e retorna o início
queue.poll();              // "segundo"

queue.size();              // 1
queue.isEmpty();           // false
```

`offer` e `poll` retornam `null` quando a fila está vazia, em vez de lançar
exceção — preferível na maioria dos casos.

## Pilha com `ArrayDeque`

```java
import java.util.ArrayDeque;
import java.util.Deque;

Deque<String> stack = new ArrayDeque<>();

stack.push("primeiro");    // insere no topo
stack.push("segundo");
stack.push("terceiro");

stack.peek();              // "terceiro" — consulta o topo sem remover
stack.pop();               // "terceiro" — remove e retorna o topo
stack.pop();               // "segundo"

stack.size();              // 1
stack.isEmpty();           // false
```

`push` e `pop` lançam exceção se a pilha estiver vazia. Para comportamento sem
exceção, use `offerFirst` / `pollFirst`.

## Como o `ArrayDeque` Funciona

Internamente, o `ArrayDeque` mantém um array e dois índices: `head`, que aponta
para o primeiro elemento válido, e `tail`, que aponta para o último elemento
inserido.

![Estrutura interna do ArrayDeque](./imgs/arraydequeue.png)

Na imagem, `tail` aponta para o índice 3 (valor 9) e `head` aponta para o índice
7 (valor 23). Os elementos válidos são 23, 1, 7, 12 e 9 — percorridos a partir
de `head` em direção ao início do array e continuando do índice 0 até `tail`.
Repare que os índices 4 (16) e 5 (4) têm valores antigos de operações
anteriores: o `ArrayDeque` não precisa limpar os slots ao remover um elemento,
basta avançar o índice. O índice 6 é `null` — uma posição que nunca foi escrita.

Cada operação move um dos índices:

- **Inserir no final** (`offer`): coloca o elemento no slot após `tail` e avança
  `tail`
- **Remover do início** (`poll`): retorna o elemento em `head` e avança `head`
- **Inserir no início** (`push`/`offerFirst`): recua `head` e coloca o elemento
  lá

Os índices não param na borda do array — quando chegam no último índice, voltam
para 0 usando aritmética modular. É por isso que a estrutura é chamada de
_buffer circular_.

![ArrayDeque como anel](./imgs/arraydequeue-ring.png)

Na visualização em anel fica mais claro o que aconteceu: `head` (23) está depois
de `tail` (9) no sentido horário, o que significa que `head` já deu a volta pelo
array. A zona livre (tracejada) vai de `tail` até `head` no sentido horário —
índices 4 (16, stale), 5 (4, stale) e 6 (null). Se continuarmos inserindo
elementos pelo lado do `head` (recuando-o) ou avançando `tail`, os dois índices
vão se aproximar. Quando se encontrarem após uma inserção — sem mais slots
disponíveis — o `ArrayDeque` dobra o tamanho do array e reposiciona todos os
elementos, exatamente como o `ArrayList`.

Esse mecanismo permite O(1) para inserções e remoções em ambas as extremidades
sem deslocar nenhum elemento — ao contrário de um `ArrayList`, que custaria O(n)
para inserir ou remover no início.

## Quando Usar

| Situação                                    | Estrutura |
| ------------------------------------------- | --------- |
| Processar tarefas na ordem em que chegaram  | Fila      |
| Desfazer operações (undo)                   | Pilha     |
| Navegar em histórico (voltar / avançar)     | Deque     |
| Busca em largura (BFS) em grafos ou árvores | Fila      |
| Busca em profundidade (DFS) iterativa       | Pilha     |

---

<a href="16-mapas.md">← Mapas</a>

<p align="right"><a href="../02-oo/01-classes.md">Próximo: Módulo 2 — Classes →</a></p>
