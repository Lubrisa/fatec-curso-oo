# 1. Classes

Até aqui você escreveu programas que manipulam valores soltos: uma variável para
um saldo, outra para um nome, mais uma para um número de conta... Quando o
programa fica maior, manter esses valores coesos vira um problema. Como
identificar a quem pertence cada valor? Quem pode alterar o quê? Onde estão as
regras do negócio?

A orientação a objetos propõe reunir dados e as operações sobre esses dados num
mesmo lugar. A **classe** é o mecanismo que linguagens como Java oferecem para
expressar essa ideia.

## Um molde para os dados

Uma classe define dois aspectos de uma entidade:

1. **Quais dados ela carrega** — os atributos de cada objeto criado a partir da
   classe.
2. **Quais operações fazem sentido sobre esses dados** — as operações que podem
   alterar ou acessar os atributos de um objeto criado a partir da classe.

Pense numa conta bancária. Toda conta tem um titular, um número e um saldo. Toda
conta pode receber depósitos e processar saques. Esses dois aspectos — dados e
operações — andam juntos. Uma classe captura exatamente isso:

```java
class BankAccount {
    String owner;
    String accountNumber;
    double balance;

    void deposit(double amount) {
        balance += amount;
    }

    void withdraw(double amount) {
        balance -= amount;
    }

    String getStatement() {
        return """
        Titular: %s
        Conta: %s
        Saldo: %.2f
        """.formatted(owner, accountNumber, balance);
    }
}
```

A classe `BankAccount` não é uma conta bancária — ela é o **molde** que descreve
como qualquer conta bancária será estruturada. Os atributos `owner`,
`accountNumber` e `balance` ainda não existem em memória; eles vão existir
quando você criar um objeto a partir desse molde. Isso é o assunto do próximo
capítulo.

## Por que reunir dados e operações?

No [paradigma procedural](../00-fundamentos/03-paradigma-procedural.md), dados e
sub-rotinas ficam separados. Cada função manipula os dados diretamente, o que
facilmente leva à duplicação de lógica e inconsistências:

```java
// Estilo procedural — cada função manipula os dados diretamente

static void withdraw(BankAccount account, double amount) {
    if (amount > account.balance) {
        throw new IllegalStateException("Saldo insuficiente");
    }
    account.balance -= amount;
}

static void transfer(BankAccount from, BankAccount to, double amount) {
    // Esqueceu-se de validar se a conta de origem tinha saldo!
    // A lógica de débito foi duplicada sem as mesmas garantias:
    from.balance -= amount;
    to.balance += amount;
}
```

Nesse modelo, se uma nova regra for adicionada (por exemplo, cobrança de taxa,
limite diário ou bloqueio de saldo negativo), o desenvolvedor precisa lembrar de
atualizar **todos** os lugares do sistema que alteram `balance`. Se esquecer um,
o sistema pode entrar em estado inconsistente (uma conta com saldo negativo, por
exemplo).

Com a classe, o caminho legítimo para alterar os dados passa pelas operações que
pertencem a ela. Quem precisa debitar um valor não altera `balance` diretamente
— usa o método `withdraw`:

```java
class BankAccount {
    String owner;
    String accountNumber;
    double balance;

    void withdraw(double amount) {
        if (amount > balance) {
            throw new IllegalStateException("Saldo insuficiente");
        }
        balance -= amount;
    }

    void transfer(BankAccount to, double amount) {
        this.withdraw(amount); // reutiliza a regra e as validações em um único lugar!
        to.deposit(amount);
    }
}
```

## Declarando uma classe em Java

A forma mais simples de declarar uma classe em Java é usar a palavra-chave
`class` seguida do nome da classe e de um bloco de código:

```java
class NomeDaClasse {
    // membros da classe — assunto dos próximos capítulos
}
```

Dentro do bloco delimitado por chaves (`{ }`), definimos os **membros** da
classe — tudo aquilo que pertence à classe ou aos objetos criados a partir dela:

- **Atributos (ou campos)** — os dados e o estado que o objeto carrega.
- **Métodos** — os comportamentos e operações disponíveis.
- **Construtores** — as instruções de criação e inicialização dos objetos.
- **Classes aninhadas** — classes declaradas dentro de outra classe.

Vamos explorar detalhadamente cada um desses conceitos ao longo deste módulo.

> **Convenção de nome**
>
> Nomes de classe usam **PascalCase**: cada palavra começa com maiúscula, sem
> separadores. `BankAccount`, `CustomerOrder`, `ProductCatalog`.

---

<a href="../01-java-basico/17-filas-e-pilhas.md">← Módulo 1 — Filas e Pilhas</a>

<p align="right"><a href="02-objetos.md">Próximo: Objetos →</a></p>
