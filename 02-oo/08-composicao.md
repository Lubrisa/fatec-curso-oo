# 8. Composição sobre herança

No capítulo anterior, encerramos com um problema: modelar um `Employee` que pode
ter cargos diferentes, acumular mais de um ao mesmo tempo e mudar de cargo ao
longo do tempo. A herança não resolve bem — ela fixa o tipo do objeto em
compilação, e criar subclasses para cada combinação possível de cargos é
inviável.

A alternativa é a **composição**: em vez de uma classe _ser_ outra, ela _tem_
outra como campo.

## Resolvendo com composição

Em vez de `Manager extends Employee`, modelamos o cargo como um objeto separado
que o funcionário carrega:

```java
class Role {
    private String title;
    private double bonus;

    Role(String title, double bonus) {
        this.title = title;
        this.bonus = bonus;
    }

    public String getTitle() { return this.title; }
    public double getBonus() { return this.bonus; }
}

class Employee {
    private String name;
    private double salary;
    private Role role; // Employee TEM um Role, não É um Role

    Employee(String name, double salary, Role role) {
        this.name = name;
        this.salary = salary;
        this.role = role;
    }

    public void promote(Role newRole) {
        this.role = newRole; // troca de cargo sem recriar o objeto
    }

    public double totalCompensation() {
        return this.salary + this.role.getBonus();
    }
}
```

```java
Role manager = new Role("Gerente", 2000.0);
Role director = new Role("Diretor", 5000.0);

Employee ana = new Employee("Ana", 8000.0, manager);

// promoção: o objeto continua o mesmo, só o cargo muda
ana.promote(director);
```

O objeto `ana` não mudou de tipo — ele mudou de estado. A promoção é uma
operação natural, e nenhuma subclasse precisa existir para isso.

## Composição no BankAccount

O mesmo princípio aparece quando diferentes tipos de conta aplicam regras de
tarifas distintas. Com herança, a tentação seria criar `NoFeeAccount`,
`MonthlyFeeAccount`, `PerTransactionFeeAccount` — e então
`PremiumMonthlyFeeAccount` quando surgir mais uma variação. A proliferação é
rápida.

Com composição, a regra de tarifa vira um objeto que a conta carrega:

```java
interface FeePolicy {
    double calculate(double balance, int transactions);
}

class NoFee implements FeePolicy {
    @Override
    public double calculate(double balance, int transactions) {
        return 0.0;
    }
}

class MonthlyFee implements FeePolicy {
    private double fixedAmount;

    MonthlyFee(double fixedAmount) {
        this.fixedAmount = fixedAmount;
    }

    @Override
    public double calculate(double balance, int transactions) {
        return this.fixedAmount;
    }
}

class PerTransactionFee implements FeePolicy {
    private double feePerTransaction;

    PerTransactionFee(double feePerTransaction) {
        this.feePerTransaction = feePerTransaction;
    }

    @Override
    public double calculate(double balance, int transactions) {
        return transactions * this.feePerTransaction;
    }
}
```

`BankAccount` recebe a política como um campo — sem nenhuma subclasse:

```java
class BankAccount implements Account {
    private String owner;
    private final String accountNumber;
    private double balance;
    private int transactionCount;
    private FeePolicy feePolicy; // BankAccount TEM uma FeePolicy

    BankAccount(String owner, String accountNumber, double initialBalance, FeePolicy feePolicy) {
        // ...
        this.feePolicy = feePolicy;
        this.transactionCount = 0;
    }

    @Override
    public void deposit(double amount) {
        this.balance += amount;
        this.transactionCount++;
    }

    public void chargeMonthlyFee() {
        double fee = this.feePolicy.calculate(this.balance, this.transactionCount);
        this.balance -= fee;
        this.transactionCount = 0;
    }
}
```

```java
BankAccount free    = new BankAccount("Ana",   "001", 1000.0, new NoFee());
BankAccount premium = new BankAccount("Bruno", "002", 1000.0, new MonthlyFee(25.0));
BankAccount pay     = new BankAccount("Carol", "003", 1000.0, new PerTransactionFee(2.0));
```

Para adicionar uma nova política de tarifa, basta criar uma nova implementação
de `FeePolicy`. `BankAccount` não precisa saber nada sobre ela — o contrato já
existe.

## "É um" ou "tem um"

A regra prática para escolher entre herança e composição é a pergunta que vimos
no capítulo anterior:

- Se a resposta for **"é um"** — e fizer sentido substituir o pai pelo filho em
  qualquer lugar do código — herança é a ferramenta certa.
- Se a resposta for **"tem um"**, ou se a relação vier de conveniência (reuso de
  código) em vez de contrato, composição é a escolha mais saudável.

`SavingsAccount` **é** um `BankAccount` — satisfaz o mesmo contrato, pode ser
usada em qualquer lugar que espere um `BankAccount`. Herança faz sentido.

`Employee` **tem** um `Role`. A relação não é de contrato — é de posse. Um
`Employee` pode existir sem cargo, pode ter mais de um, pode trocar. Composição
é a escolha natural.

## Quando herança ainda é a resposta

Composição não substitui herança em todos os casos. Herança é a ferramenta certa
quando:

- A subclasse realmente **é** um subtipo da superclasse — satisfaz o mesmo
  contrato e pode ser substituída em qualquer ponto.
- A subclasse precisa **estender** o comportamento da superclasse, não apenas
  reutilizar código.
- A relação é estável — o tipo do objeto não vai mudar em tempo de execução.

Nos demais casos, prefira composição. O design resultante tende a ser mais
flexível, mais fácil de testar e menos frágil a mudanças.

<a href="07-heranca.md">← Herança</a>

<p align="right"><a href="09-polimorfismo.md">Próximo: Polimorfismo →</a></p>
