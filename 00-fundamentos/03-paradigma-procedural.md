# 3. Paradigma Procedural

## A Mesma Lógica em Vários Lugares

O paradigma estruturado resolve o fluxo _dentro_ de uma funcionalidade. Mas um
programa real tem muitas funcionalidades — e algumas delas compartilham passos
em comum.

Pense no sistema bancário: tanto o saque quanto a transferência precisam
verificar se o valor é positivo e se o saldo é suficiente antes de debitar. Sem
nenhuma forma de reutilização, esses passos precisariam ser escritos duas vezes
— e se a regra mudasse, precisariam ser corrigidos em dois lugares.

Quanto mais o programa cresce, mais esse problema se agrava. É o que os
programadores chamam de _duplicação de lógica_.

## A Sub-rotina: Extraia, Nomeie, Reutilize

A resposta do paradigma procedural é direta: _identifique um conjunto de passos
que se repete, dê um nome a ele, e chame pelo nome sempre que precisar_.

Esse bloco nomeado e reutilizável é chamado de **sub-rotina** — o conceito
central do paradigma procedural.

> **Sub-rotina, Procedimento e Função**
>
> - **Sub-rotina:** termo histórico genérico para qualquer bloco de código
>   nomeado e reutilizável.
> - **Procedimento (_procedure_):** sub-rotina que executa ações mas não produz
>   valor de retorno (`void`). O nome do paradigma vem daqui.
> - **Função:** sub-rotina que calcula e retorna um valor (como `boolean withdraw(...)`).
>
> No dia a dia moderno, a maioria das linguagens usa "função" para ambos os
> casos — e em Java, blocos de código que pertencem a uma classe são chamados de
> **métodos**.

Aplicando ao sistema bancário:

```java
// apenas dados — sem comportamento próprio
class AccountData {
    String holder;
    double balance;
}

static boolean withdraw(AccountData account, double amount) {
    if (amount <= 0 || amount > account.balance) return false;
    account.balance -= amount;
    return true;
}

static void deposit(AccountData account, double amount) {
    if (amount > 0) account.balance += amount;
}
```

Agora a lógica de verificação e débito existe em um único lugar. Se a regra do
saque mudar — por exemplo, passou a existir uma taxa — a mudança acontece em
`withdraw`, e todo o código que a chama passa a usar a versão atualizada
automaticamente.

É importante, porém, não confundir _semelhança de código_ com _semelhança de
intenção_. Dois pontos do programa podem conter expressões idênticas — por
exemplo, `value > 18` — mas representar regras completamente diferentes: a idade
mínima para abertura de conta e o tempo de expiração de um log de auditoria.
Extrair os dois para uma sub-rotina compartilhada cria um acoplamento
artificial: se a regra de um mudar, a do outro não deveria mudar junto — mas
agora elas estão amarradas. A pergunta correta antes de extrair não é _"esse
código parece igual?"_, mas _"esse código representa a mesma regra?"_.

## Decomposição Procedural

A sub-rotina não serve apenas para evitar repetição. Ela também permite
_decompor_ um problema complexo em partes menores que podem ser combinadas.

Transferência é um bom exemplo: do ponto de vista do negócio, uma transferência
é um saque de uma conta seguido de um depósito em outra. Em vez de reimplementar
essa lógica do zero, a sub-rotina de transferência simplesmente chama as
sub-rotinas que já existem:

```java
static boolean transfer(AccountData source, AccountData destination, double amount) {
    if (!withdraw(source, amount)) return false;
    deposit(destination, amount);
    return true;
}
```

> **Checkpoint:** `transfer` não repete nenhuma lógica de validação nem de
> débito — ela delega para `withdraw` e `deposit`. Se amanhã surgir uma regra de
> limite diário de transferência, em que parte desse código você a adicionaria?

Os dados que cada sub-rotina precisa aparecem explicitamente nos parâmetros.
Lendo `withdraw(AccountData account, double amount)` você sabe exatamente com o
que ela trabalha — não há estado escondido.

## Quando as Sub-rotinas Se Multiplicam

À medida que o programa cresce, o número de sub-rotinas cresce com ele. Além de
`withdraw`, `deposit` e `transfer`, aparecem `checkBalance`,
`calculateInterest`, `validateLimit`, `generateStatement` — e o mesmo padrão
surge para outras entidades do sistema: clientes, empréstimos, investimentos.

Naturalmente, os programadores começaram a agrupar sub-rotinas relacionadas —
primeiro por convenção, depois com suporte da linguagem. Essa ideia de
agrupamento é o que eventualmente levou aos módulos, pacotes e namespaces que
usamos hoje.

Mas mesmo com sub-rotinas bem organizadas, um problema estrutural permanece: os
_dados_ e o _comportamento_ que opera sobre eles ainda são entidades separadas.
`AccountData` existe em um lugar; `withdraw`, `deposit` e `transfer` existem em
outro. Nada na linguagem garante que alguém não vá acessar `account.balance`
diretamente e atribuir um valor inválido.

> "E se os dados e o comportamento que os protege pudessem existir juntos, como
> uma coisa só?"

Essa pergunta é o ponto de partida do próximo capítulo.

```mermaid
graph LR
    CAP1["<b>Cap. 1</b><br/>O Que É um Paradigma?"]
    CAP2["<b>Cap. 2</b><br/>Paradigma Estruturado"]
    CAP3["📍 você está aqui!<br/><b>Cap. 3</b> · Paradigma Procedural"]:::current
    CAP4["<b>Cap. 4</b><br/>Rumo à OO"]
    CAP5["<b>Cap. 5</b><br/>Classificação dos Paradigmas"]

    CAP1 --> CAP2 --> CAP3 --> CAP4 --> CAP5

    classDef current stroke-width:2px
```

---

<a href="02-paradigma-estruturado.md">← Cap. 2 — Paradigma Estruturado</a>

<p align="right"><a href="04-rumo-a-orientacao-a-objetos.md">Próximo: Cap. 4 — Rumo à Orientação a Objetos →</a></p>
