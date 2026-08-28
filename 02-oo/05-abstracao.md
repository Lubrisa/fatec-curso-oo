# 5. Abstração

## Um conceito fundamental na computação

Abstração é a ideia de representar algo complexo por meio de uma visão
simplificada — ocultando os detalhes de implementação e expondo apenas o que é
relevante para quem vai usar aquela coisa.

Esse conceito não nasceu na orientação a objetos. Ele é um dos fundamentos da
computação como um todo:

- Quando você chama `Math.sqrt(x)`, não precisa saber como o algoritmo calcula a
  raiz quadrada — só precisa saber o que a função recebe e o que ela retorna.
- Quando você abre um arquivo, não precisa saber em quais setores do disco os
  dados estão fisicamente gravados — o sistema operacional esconde isso atrás de
  uma operação simples.
- Quando você usa uma lista (`ArrayList`), não precisa saber como o
  redimensionamento interno funciona — só precisa saber que `add` insere um
  elemento.

Em cada caso, uma camada de complexidade está escondida atrás de uma interface
simples. Isso é abstração.

A orientação a objetos abraçou esse princípio como um de seus pilares porque ele
é tão fundamental que aparece em praticamente todo design de software bem
construído.

## Interface como conceito

Antes de falar sobre qualquer palavra-chave do Java, vale fixar o conceito puro:
a **interface de um objeto** é o conjunto de operações que ele expõe para quem
está de fora — o contrato mínimo necessário para interagir com ele, sem precisar
conhecer sua implementação interna.

Nesse sentido, qualquer objeto já tem uma interface: os seus membros públicos.
Quando você chama `account.deposit(200.0)`, está interagindo com a interface de
`BankAccount` — você não sabe (e não precisa saber) como `balance` é armazenado
internamente, se há logs sendo gerados, se há validações acontecendo. Só precisa
saber que `deposit` existe, o que ela recebe e o que ela faz.

A abstração bem aplicada significa expor o mínimo necessário para que o
consumidor do objeto consiga fazer o que precisa — e esconder todo o resto.

## A palavra-chave `interface` em Java

Java formaliza esse conceito com a palavra-chave `interface`. Uma interface
declara um conjunto de métodos — mas não os implementa. Ela define o
**contrato** que qualquer classe que a adote deve cumprir:

```java
interface Account {
    void deposit(double amount);
    void withdraw(double amount);
    String getStatement();
}
```

Uma `interface` não tem campos de instância e em versões mais antigas do Java
não podia declarar uma implementação para seus métodos. Ela é pura declaração de
intenção: quem implementar `Account` se compromete a fornecer `deposit`,
`withdraw` e `getStatement`.

Para declarar que uma classe cumpre o contrato, usa-se `implements`:

```java
class BankAccount implements Account {
    private String owner;
    private String accountNumber;
    private double balance;

    BankAccount(String owner, String accountNumber, double initialBalance) {
        if (initialBalance < 0) {
            throw new IllegalArgumentException("Saldo inicial não pode ser negativo");
        }

        this.owner = owner;
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    @Override
    public void deposit(double amount) {
        this.balance += amount;
    }

    @Override
    public void withdraw(double amount) {
        if (amount > this.balance) {
            throw new IllegalStateException("Saldo insuficiente");
        }

        this.balance -= amount;
    }

    @Override
    public String getStatement() {
        return """
        Titular: %s
        Conta: %s
        Saldo: %.2f
        """.formatted(this.owner, this.accountNumber, this.balance);
    }
}
```

A anotação `@Override` instrui o compilador a verificar que o método realmente
existe na interface — se você errar o nome ou a assinatura, o compilador avisa.
É uma boa prática sempre usá-la ao implementar métodos de uma interface.

> **`public` nos métodos implementados**
>
> Métodos declarados numa `interface` são implicitamente públicos. Ao
> implementá-los na classe, você precisa declará-los explicitamente como
> `public` — caso contrário o compilador rejeita, pois estaria reduzindo a
> visibilidade prometida pelo contrato. Falaremos sobre modificadores de acesso
> em profundidade no próximo capítulo.

## O poder do contrato

A grande vantagem da interface aparece quando o código consumidor programa
esperando um contrato, e não uma implementação concreta:

```java
// o método recebe Account, não BankAccount
static void processDeposit(Account account, double amount) {
    account.deposit(amount);
    System.out.println(account.getStatement());
}
```

`processDeposit` não sabe — e não precisa saber — se está recebendo um
`BankAccount`, uma `SavingsAccount` ou qualquer outra implementação de
`Account`. Desde que o contrato seja cumprido, o método funciona:

```java
class SavingsAccount implements Account {
    // implementação diferente das mesmas operações
    @Override
    public void deposit(double amount) { /* ... */ }

    @Override
    public void withdraw(double amount) { /* ... */ }

    @Override
    public String getStatement() { /* ... */ }
}

Account checking = new BankAccount("Ana", "001", 1000.0);
Account savings  = new SavingsAccount("Bruno", "002", 500.0);

processDeposit(checking, 200.0); // funciona
processDeposit(savings, 100.0);  // também funciona
```

Quando você futuramente criar uma `InvestmentAccount`, `processDeposit` vai
continuar funcionando sem nenhuma alteração — desde que `InvestmentAccount`
implemente `Account` adequadamente. O código consumidor está protegido das
mudanças na implementação.

## Contrato sintático e semântico

A linguagem garante o **contrato sintático**: se uma classe declara `implements
Account`, o compilador verifica que ela fornece `deposit`, `withdraw` e
`getStatement` com as assinaturas corretas. Se faltar algum, o código não
compila.

Mas uma interface também carrega um **contrato semântico** — a expectativa de
_comportamento_ que está por trás da assinatura. O compilador não verifica isso.
Uma classe pode implementar `deposit` da seguinte forma e o compilador aceita
sem reclamar:

```java
@Override
public void deposit(double amount) {
    // não faz absolutamente nada
}
```

O método existe, a assinatura bate — mas o contrato semântico foi violado. Quem
chamar `deposit` vai esperar que o saldo aumente; isso não acontece.

A biblioteca padrão do Java tem um exemplo famoso desse problema. A interface
`List` declara o método `add`, sinalizando que toda lista aceita novos
elementos. Mas `List.of(...)` retorna uma lista imutável — e ao chamar `add`, a
resposta é uma exceção em tempo de execução:

```java
List<String> names = List.of("Ana", "Bruno");
names.add("Carlos"); // compila, mas lança UnsupportedOperationException
```

A assinatura está lá. O contrato semântico foi quebrado silenciosamente.
Contratos semânticos não aparecem no compilador — eles precisam estar claros na
documentação, no nome dos métodos, e sobretudo no design da interface.

<details>
<summary>Aprofundamento: interfaces gordas e segregação</summary>

A interface `List` da biblioteca padrão do Java mistura operações de leitura
(`get`, `size`, `contains`) com operações de escrita (`add`, `remove`, `set`).
Qualquer implementação imutável fica presa a declarar métodos de escrita que não
fazem sentido para ela — e aí tem duas saídas ruins: lançar exceção (como
`List.of` faz) ou fingir que fez algo sem fazer nada. Nos dois casos, o contrato
semântico está quebrado.

Interfaces que concentram responsabilidades em excesso ou exigem métodos além do
que uma classe realmente precisa fornecer são conhecidas como **interfaces
gordas** (_fat interfaces_). A ideia central para contornar esse problema é
separar os contratos de forma que:

- **A classe implementadora** não seja forçada a fornecer métodos que não fazem
  sentido para o seu funcionamento.
- **O código consumidor** tenha acesso e visibilidade apenas às operações de que
  realmente precisa para realizar seu trabalho.

### Segregando e implementando interfaces individualmente

Uma primeira saída é separar os contratos em interfaces menores e deixar a
classe implementar apenas aquelas que fazem sentido para ela:

```java
interface ImmutableList {
    String get(int index);
    int size();
}

interface MutableList {
    void add(String item);
    void remove(int index);
}

// Uma lista imutável implementa apenas a interface de leitura:
class ImmutableArrayList implements ImmutableList {
    @Override
    public String get(int index) { /* ... */ }

    @Override
    public int size() { /* ... */ }
}

// Uma lista comum implementa múltiplos contratos ao mesmo tempo:
class ArrayList implements ImmutableList, MutableList {
    @Override
    public String get(int index) { /* ... */ }

    @Override
    public int size() { /* ... */ }

    @Override
    public void add(String item) { /* ... */ }

    @Override
    public void remove(int index) { /* ... */ }
}
```

O compilador exige que todos os contratos declarados sejam cumpridos. Agora,
quem precisa apenas iterar ou consultar dados recebe `ImmutableList` e nem
sequer tem acesso a métodos como `add` ou `remove` — prevenindo erros em tempo
de compilação, sem exceções inesperadas em tempo de execução.

### Estendendo e combinando interfaces

Quando as interfaces têm uma relação de hierarquia ou queremos criar um contrato
mais amplo, uma interface pode **estender** uma ou mais interfaces existentes:

```java
interface ImmutableList {
    String get(int index);
    int size();
}

interface MutableList {
    void add(String item);
    void remove(int index);
}

// Estendendo e combinando múltiplas interfaces em um único contrato:
interface List extends ImmutableList, MutableList {
    // Reúne todas as operações de leitura e de escrita
}
```

Uma interface também pode estender diretamente outra para especializá-la. Na
prática, uma lista puramente de escrita (`MutableList`) quase nunca é útil de
forma isolada (quem adiciona elementos em uma lista quase sempre precisa lê-los
em algum momento). Por isso, uma modelagem mais natural e direta costuma ser
fazer `List` estender `ImmutableList`, adicionando as operações de modificação:

```java
interface List extends ImmutableList {
    void add(String item);
    void remove(int index);
}
```

Nesse modelo:

- Quem implementar `List` precisará fornecer tanto os métodos de leitura quanto
  os de escrita.
- Uma função que só realiza leituras pode continuar esperando apenas
  `ImmutableList`:

```java
static void printAll(ImmutableList list) {
    for (int i = 0; i < list.size(); i++) {
        System.out.println(list.get(i));
    }
}
```

Qualquer implementação que cumpra `ImmutableList` (seja uma `ImmutableArrayList`
ou uma implementação de `List`) poderá ser passada para `printAll` com total
segurança.

A extensão entre interfaces é **transitiva**: uma classe que implementa `List`
satisfaz automaticamente `ImmutableList`, sem precisar declarar `implements
ImmutableList` de forma explícita. O compilador resolve a cadeia.

```java
class ArrayList implements List {
    // implementa add, remove, get, size
}

// ArrayList satisfaz List — declarado explicitamente
// ArrayList satisfaz ImmutableList — implicitamente, pois List extends ImmutableList
static void printAll(ImmutableList list) { /* ... */ }

printAll(new ArrayList()); // compila normalmente
```

### Cuidado com o exagero

O remédio não pode ser pior que a doença. Criar uma interface para cada método
individual — como `Addable`, `Gettable`, `Sizeable` — e depois compor tudo gera
uma proliferação excessiva de tipos que torna o código difícil de navegar e
compreender. A granularidade certa está em agrupar operações que fazem sentido
juntas do ponto de vista do consumidor.

</details>

<a href="04-construtores.md">← Construtores</a>

<p align="right"><a href="06-encapsulamento.md">Próximo: Encapsulamento →</a></p>
