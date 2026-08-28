# 6. Encapsulamento

No capítulo anterior vimos que a abstração define o que um objeto expõe — o
mínimo necessário para interagir com ele. O encapsulamento é o pilar que garante
que o resto permaneça protegido.

É comum pensar no encapsulamento como "deixar campos privados". Mas essa é uma
visão incompleta. O ponto central é outro: **garantir que as regras do objeto
não possam ser violadas de fora**.

## Invariantes

Um **invariante** é uma condição que deve ser verdadeira sobre o estado do
objeto em qualquer momento de sua vida. Para `BankAccount`, alguns invariantes
naturais são:

- O saldo nunca pode ser negativo.
- O titular nunca pode ser nulo ou vazio.
- O número da conta nunca pode ser alterado após a criação.

Quando os campos são públicos, qualquer código pode quebrá-los:

```java
BankAccount account = new BankAccount("Ana", "001", 1000.0);
account.balance = -9999.0; // invariante violado, sem nenhum aviso
account.owner = null;      // invariante violado
account.accountNumber = "999"; // número alterado livremente
```

O objeto existe, mas está em estado inválido. O resto do programa vai operar
sobre dados corrompidos, e o bug pode se manifestar bem longe daqui.

## Modificadores de acesso

Java oferece modificadores de acesso para controlar quem pode ver e alterar cada
membro da classe.

| Modificador         | Acessível por                                             |
| ------------------- | --------------------------------------------------------- |
| `private`           | Somente pela própria classe                               |
| _(sem modificador)_ | Pela própria classe e por qualquer classe no mesmo pacote |
| `public`            | Por qualquer classe em qualquer lugar                     |

> **`protected`**
>
> Existe ainda o modificador `protected`, que dá acesso à própria classe, ao
> mesmo pacote e às subclasses. Vamos explorá-lo no capítulo de herança, onde
> ele aparece de forma natural.

<details>
<summary>Amarração com capítulos anteriores</summary>

Três momentos anteriores prometeram ou adiaram explicações que chegam agora:

**Capítulo 3 (Campos e Métodos):** na seção de equívocos com métodos estáticos,
dissemos que "o objeto deve ser o único responsável por manter e alterar seu
próprio estado" e que aprofundaríamos isso no capítulo de encapsulamento. Agora
você tem o mecanismo: campos `private` tornam fisicamente impossível que código
externo altere o estado do objeto sem passar pelos métodos da classe. A regra
deixa de ser uma recomendação e vira uma barreira do compilador.

**Capítulo 4 (Construtores):** no aprofundamento sobre métodos de fábrica,
mencionamos que dá para tornar o construtor privado para forçar o uso da
fábrica. Um construtor `private` segue as mesmas regras de qualquer outro membro
privado — só a própria classe pode chamá-lo, inclusive seus métodos estáticos:

```java
class BankAccount {
    private BankAccount(String owner, String accountNumber, double balance) {
        // ...
    }

    // único ponto de entrada — aplica validações antes de delegar ao construtor
    public static BankAccount open(String owner, String accountNumber, double initialBalance) {
        if (initialBalance < 0) {
            throw new IllegalArgumentException("Saldo inicial não pode ser negativo");
        }

        return new BankAccount(owner, accountNumber, initialBalance);
    }
}
```

`new BankAccount(...)` fora da classe vira erro de compilação. O único caminho
é `BankAccount.open(...)`.

**Capítulo 5 (Abstração):** ao implementar métodos de uma interface, você
precisou declará-los como `public`, e a nota dizia "Falaremos sobre
modificadores de acesso em profundidade no próximo capítulo". Agora você sabe
por quê: os métodos de uma interface são implicitamente `public`. Ao
implementá-los na classe, você não pode reduzir essa visibilidade — uma
implementação `private` de `withdraw` quebraria qualquer código que receba um
`Account`.

</details>

### Aplicando ao `BankAccount`:

```java
class BankAccount implements Account {
    private String owner;
    private final String accountNumber; // final: não pode ser reatribuído
    private double balance;

    BankAccount(String owner, String accountNumber, double initialBalance) {
        if (owner == null || owner.isBlank()) {
            throw new IllegalArgumentException("Titular não pode ser vazio");
        }
        if (initialBalance < 0) {
            throw new IllegalArgumentException("Saldo inicial não pode ser negativo");
        }

        this.owner = owner;
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    @Override
    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Valor de depósito deve ser positivo");
        }

        this.balance += amount;
    }

    @Override
    public void withdraw(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Valor de saque deve ser positivo");
        }
        if (amount > this.balance) {
            throw new IllegalStateException("Saldo insuficiente");
        }

        this.balance -= amount;
    }
}
```

Com os campos `private`, a tentativa de acesso direto de fora da classe vira
erro de compilação. O único caminho para interagir com os dados é através dos
métodos — que aplicam as regras.

## O perigo dos setters burros

Uma armadilha comum é criar getters e setters para cada campo e chamar isso de
encapsulamento:

```java
// isso não é encapsulamento — é um campo público disfarçado
public void setBalance(double balance) {
    this.balance = balance;
}
```

Um setter que apenas atribui o valor sem nenhuma validação oferece exatamente a
mesma brecha que um campo público. Qualquer código pode chamar
`account.setBalance(-9999.0)` e o invariante é violado da mesma forma.

Sempre que criar um setter, pergunte: o que impede que um valor inválido seja
passado aqui? Se a resposta for "nada", reconsidere se esse setter deveria
existir. Muitas vezes, a operação certa é um método com nome de negócio — como
`deposit` e `withdraw` — que aplica as regras internamente.

## Getters que computam

A mesma lógica vale para getters: expor o dado bruto nem sempre é o melhor
caminho. Um objeto rico encapsula não só o estado, mas também o raciocínio sobre
esse estado.

Em vez de expor `balance` e deixar o código externo calcular:

```java
// código externo fazendo cálculo que deveria ser da conta
if (account.getBalance() < minimumRequired) {
    notify(account.getOwner());
}
```

Prefira métodos que expressem a intenção diretamente:

```java
class BankAccount implements Account {
    // ...

    public double getBalance() {
        return this.balance;
    }

    public boolean canWithdraw(double amount) {
        return amount > 0 && amount <= this.balance;
    }

    // ...
}
```

```java
// código externo limpo: pergunta ao objeto sobre seu próprio estado
if (!account.canWithdraw(minimumRequired)) {
    notify(account.getOwner());
}
```

`canWithdraw` não expõe `balance` — ele responde uma pergunta sobre o estado da
conta. Se a lógica de "o que é saldo insuficiente" mudar, a mudança fica dentro
do objeto. O código externo não precisa ser atualizado.

## Encapsulamento e abstração juntos

Os dois pilares se complementam:

- A **abstração** decide o que fica visível: os métodos que o consumidor
  precisa.
- O **encapsulamento** protege o que fica escondido: os campos e as regras que
  mantêm o objeto íntegro.

Uma classe bem encapsulada pode mudar sua implementação interna sem quebrar nada
fora dela — desde que a interface pública permaneça estável.

Imagine que `BankAccount` recebe um novo requisito: a conta agora suporta um
limite de crédito. Um saque pode deixar o saldo negativo, desde que não
ultrapasse esse limite. A regra mudou — mas o impacto fica contido dentro da
classe:

```java
class BankAccount implements Account {
    private String owner;
    private final String accountNumber;
    private double balance;
    private double creditLimit; // novo campo

    BankAccount(String owner, String accountNumber, double initialBalance, double creditLimit) {
        // ...
        this.creditLimit = creditLimit;
    }

    public boolean canWithdraw(double amount) {
        // antes: amount > 0 && amount <= this.balance
        // agora: o saque é permitido até o limite de crédito
        return amount > 0 && amount <= this.balance + this.creditLimit;
    }

    @Override
    public void withdraw(double amount) {
        if (!this.canWithdraw(amount)) {
            throw new IllegalStateException("Limite insuficiente");
        }
        this.balance -= amount;
    }
}
```

O código que usa `canWithdraw` não precisa saber que existe um `creditLimit` — e
não muda:

```java
// este código continua funcionando sem nenhuma alteração
if (!account.canWithdraw(minimumRequired)) {
    notify(account.getOwner());
}
```

É exatamente isso que o encapsulamento compra: a liberdade de evoluir a
implementação sem quebrar os consumidores da classe.

<a href="05-abstracao.md">← Abstração</a>

<p align="right"><a href="07-heranca.md">Próximo: Herança →</a></p>
