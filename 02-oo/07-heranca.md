# 7. Herança

No capítulo de abstração, criamos a interface `Account` e mencionamos
`SavingsAccount` como outra implementação possível. Uma conta poupança e uma
conta corrente compartilham bastante coisa: ambas têm titular, número, saldo,
permitem depósitos e saques. A diferença está em detalhes específicos de cada
tipo — a poupança aplica rendimento mensal; a corrente, eventualmente, cobra
tarifas.

Uma primeira tentativa seria criar `SavingsAccount` do zero, duplicando todo o
código de `BankAccount`. O problema é evidente: qualquer correção ou melhoria
precisaria ser replicada nos dois lugares, e a divergência entre eles é questão
de tempo.

A **herança** resolve isso: uma classe pode ser declarada como extensão de
outra, herdando seus campos e métodos e acrescentando ou modificando apenas o
que for específico dela.

## 1. A Mecânica da Especialização

### Estendendo uma classe (`extends`)

A palavra-chave `extends` declara que uma classe herda de outra:

```java
class SavingsAccount extends BankAccount {
    // SavingsAccount herda owner, accountNumber, balance
    // e também deposit, withdraw, getStatement
}
```

> **Terminologia**
>
> A classe que é estendida chama-se **superclasse** (ou _classe pai_ / _classe
> base_). A que estende chama-se **subclasse** (ou _classe filha_ / _classe
> derivada_). Os dois pares de termos são intercambiáveis — você vai encontrar
> todos eles na literatura e no dia a dia.

`SavingsAccount` passa a ter tudo que `BankAccount` tem. Agora podemos
acrescentar o que é exclusivo da poupança:

```java
class SavingsAccount extends BankAccount {
    private double monthlyRate; // taxa de rendimento mensal

    SavingsAccount(String owner, String accountNumber, double initialBalance, double monthlyRate) {
        super(owner, accountNumber, initialBalance); // chama o construtor de BankAccount

        this.monthlyRate = monthlyRate;
    }

    void applyYield() {
        double yieldAmount = this.getBalance() * this.monthlyRate;
        this.deposit(yieldAmount); // usa o deposit herdado
    }
}
```

> **Nota de transição:**
>
> Para concentrar o foco nos conceitos essenciais de herança e especialização,
> retomamos aqui a estrutura base de `BankAccount` com três parâmetros no
> construtor (`owner`, `accountNumber`, `initialBalance`), sem o campo adicional
> de limite de crédito explorado no final do capítulo anterior.

`super(...)` chama o construtor da classe pai — e deve ser a primeira instrução
do construtor filho. É por ele que os campos herdados são inicializados com as
validações que já existem em `BankAccount`.

### O que é herdado: visibilidade vs. existência

Uma subclasse herda **todos** os campos e métodos da classe pai — inclusive os
`private`. A restrição não é de existência, mas de visibilidade: o código da
subclasse não pode enxergar nem referenciar esses membros diretamente.

Na prática, isso significa:

- **Campos `private`** existem no objeto em memória. Um `SavingsAccount` tem
  `balance`, `owner` e `accountNumber` alocados como qualquer `BankAccount`. A
  subclasse simplesmente não pode ler nem escrever nesses campos diretamente — e
  é por isso que `applyYield` usa `this.getBalance()` em vez de `this.balance`.

- **Métodos `private`** ficam invisíveis para a subclasse, mas continuam
  funcionando normalmente quando chamados internamente pela superclasse.

  Suponha que `BankAccount` delegue a validação de valores para um método
  privado:

  ```java
  class BankAccount {
      private double balance;

      private void validateAmount(double amount) {
          if (amount <= 0) throw new IllegalArgumentException("Valor inválido");
      }

      public void deposit(double amount) {
          this.validateAmount(amount); // chamada interna ao método privado
          this.balance += amount;
      }
  }
  ```

  Quando `SavingsAccount` chama `this.deposit(...)`, o compilador não tem nenhum
  problema — `deposit` é público e foi herdado normalmente. O fato de `deposit`
  chamar `validateAmount` internamente é detalhe de implementação de
  `BankAccount`; a subclasse nem sabe que esse método existe, e não precisa
  saber:

  ```java
  class SavingsAccount extends BankAccount {
      void applyYield() {
          // compila e executa: deposit é público e herdado
          this.deposit(this.getBalance() * this.monthlyRate);
          // validateAmount é chamado por deposit internamente, de forma transparente

          // this.validateAmount(...) — não compila: método privado invisível aqui
      }
  }
  ```

A limitação é de visibilidade, não de funcionalidade. A subclasse usa toda a
lógica da superclasse — só não pode contornar o encapsulamento acessando as
entranhas diretamente.

Os membros com acesso mais amplo seguem as regras já vistas:

- `public` e `protected` — acessíveis diretamente na subclasse sem restrições.
- _package-private_ (sem modificador) — acessível se a subclasse estiver no
  mesmo pacote.

### O modificador `protected`

No capítulo de encapsulamento, mencionamos o modificador de visibilidade
`protected`, mas adiamos a explicação de seu uso para agora, pois ele só faz
sentido dentro do contexto de herança.

`protected` dá acesso à própria classe, ao mesmo pacote **e às subclasses** —
independentemente do pacote em que a subclasse estiver:

| Modificador         | Própria classe | Mesmo pacote | Subclasse | Qualquer lugar |
| ------------------- | :------------: | :----------: | :-------: | :------------: |
| `private`           |       ✓        |              |           |                |
| _(sem modificador)_ |       ✓        |      ✓       |           |                |
| `protected`         |       ✓        |      ✓       |     ✓     |                |
| `public`            |       ✓        |      ✓       |     ✓     |       ✓        |

Se `BankAccount` declarasse `balance` como `protected` em vez de `private`,
`SavingsAccount` poderia acessá-lo diretamente:

```java
class BankAccount {
    protected double balance; // subclasses conseguem ler e escrever
}

class SavingsAccount extends BankAccount {
    void applyYield() {
        this.balance += this.balance * this.monthlyRate; // acesso direto ao campo
    }
}
```

Na prática, evite tornar campos `protected` apenas para que subclasses possam
lê-los ou alterá-los. A alternativa mais segura é manter o campo `private` e
expor um método `protected` com a operação específica que a subclasse precisa.
Assim a superclasse continua aplicando suas validações e invariantes — a
subclasse ganha acesso ao que precisa, mas não às entranhas do objeto.

### Sobrescrita de métodos (`@Override`) e a palavra-chave `super`

Uma subclasse pode **sobrescrever** um método herdado para fornecer uma
implementação diferente. A anotação `@Override` instrui o compilador a verificar
que o método realmente existe na classe pai — o mesmo papel que ela tem com
interfaces:

```java
class SavingsAccount extends BankAccount {
    private double monthlyRate;

    SavingsAccount(String owner, String accountNumber, double initialBalance, double monthlyRate) {
        super(owner, accountNumber, initialBalance);
        this.monthlyRate = monthlyRate;
    }

    @Override
    public String getStatement() {
        // chama a implementação da classe pai e acrescenta informações da poupança
        return super.getStatement() + "\nTaxa mensal: %.2f%%".formatted(this.monthlyRate * 100);
    }
}
```

`super.getStatement()` chama a implementação de `BankAccount`, reaproveitando o
que já existe e adicionando apenas a linha específica da poupança.

O paralelo entre `this` e `super` é direto:

- `this` é uma referência ao próprio objeto.
- `super` é uma referência à parte do objeto que pertence à superclasse.

Assim como `this.campo` acessa um membro do objeto atual, `super.metodo()`
acessa um membro da classe pai — útil exatamente quando a subclasse sobrescreveu
esse membro e quer reaproveitar a implementação original em vez de substituí-la
por completo.

## 2. A Árvore de Tipos

### Herança em profundidade e transitividade

A herança é transitiva: se `C` estende `B` e `B` estende `A`, então `C` também é
um `A` — implicitamente, sem nenhuma declaração adicional. A cadeia pode ter
quantos níveis forem necessários:

```java
class BankAccount { /* ... */ }                       // A
class SavingsAccount extends BankAccount { /* ... */ } // B estende A
class HighYieldAccount extends SavingsAccount { /* ... */ } // C estende B
```

`HighYieldAccount` herda tudo de `SavingsAccount`, que por sua vez herdou tudo
de `BankAccount`. Um `HighYieldAccount` carrega os campos e métodos dos três.

A mesma lógica vale para interfaces: como `BankAccount` implementa `Account`,
qualquer subclasse de `BankAccount` também satisfaz `Account` automaticamente —
mesmo que não declare `implements Account` explicitamente:

```java
Account account = new HighYieldAccount("Ana", "001", 1000.0, 0.008);
account.deposit(200.0);    // deposit de BankAccount, herdado pela cadeia toda
account.getStatement();    // getStatement — pode ter sido sobrescrito em qualquer nível
```

O código que espera um `Account` funciona para qualquer tipo na cadeia, sem
nenhuma alteração. Exploraremos isso em mais profundidade no capítulo de
polimorfismo.

### Regras de conexão: `extends` vs. `implements`

Até aqui usamos três formas relacionadas, mas distintas, de conectar tipos:

| Sintaxe                 | Quem usa            | Significado                                   |
| ----------------------- | ------------------- | --------------------------------------------- |
| `class A extends B`     | classe→classe       | A herda campos e métodos de B                 |
| `class A implements I`  | classe→interface    | A se compromete a implementar o contrato de I |
| `interface I extends J` | interface→interface | I herda e amplia o contrato de J              |

Duas restrições fundamentais da linguagem:

- **Uma classe só pode estender uma única classe.** Java não permite herança
  múltipla entre classes (`class A extends B, C` não compila). O motivo é evitar
  ambiguidades quando duas classes pai possuem métodos com o mesmo nome.
- **Uma classe pode implementar quantas interfaces quiser.** É a forma do Java
  permitir que um objeto atenda a múltiplos contratos sem os conflitos da
  herança múltipla de código.
- **Uma interface pode estender múltiplas interfaces.** Isso permite compor
  vários contratos menores em um contrato mais amplo.

```java
// válido: uma classe pode estender uma classe e implementar várias interfaces
class SavingsAccount extends BankAccount implements Account, Comparable<SavingsAccount> {
    // ...
}

// válido: uma interface pode estender várias interfaces
interface FullAccount extends Account, Auditable {
    // reúne os contratos de Account e Auditable
}

// inválido: uma classe não pode estender mais de uma classe
// class SavingsAccount extends BankAccount, InvestmentAccount { } // erro de compilação
```

## 3. Os Dois Extremos do Controle de Herança

Agora que entendemos como a herança funciona e como a árvore de tipos se
organiza, surge uma questão importante de design: **toda classe deve permitir
que outros herdem dela livremente?** E **toda classe pai precisa ser completa
por si mesma?**

Java oferece ferramentas para atuar nos dois extremos: forçar a especialização
quando o modelo base for incompleto, ou proibir a derivação quando a classe
precisar ser blindada.

### Forçando a herança: Classes Abstratas (`abstract`)

Até agora, `BankAccount` foi tratada como uma classe concreta: podemos criar
instâncias dela diretamente com `new BankAccount(...)`. No entanto, em sistemas
reais, uma "conta bancária genérica" muitas vezes é apenas um conceito — os
clientes abrem uma _Conta Corrente_, uma _Conta Poupança_ ou uma _Conta
Salário_, mas nunca uma conta "sem tipo".

Uma **classe abstrata** (`abstract class`) formaliza essa ideia: ela serve como
um **molde parcial** que define estrutura e comportamentos comuns, mas **não
pode ser instanciada diretamente**.

```java
// abstract class: não pode ser instanciada diretamente com new BaseAccount(...)
abstract class BaseAccount implements Account {
    private String owner;
    private final String accountNumber;
    private double balance;

    // Construtor: chamado pelas subclasses através de super(...)
    BaseAccount(String owner, String accountNumber, double initialBalance) {
        if (initialBalance < 0) {
            throw new IllegalArgumentException("Saldo inicial não pode ser negativo");
        }

        this.owner = owner;
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    // Métodos concretos: implementados uma única vez e herdados por todas as subclasses
    public double getBalance() {
        return this.balance;
    }

    @Override
    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Valor inválido");

        this.balance += amount;
    }

    // Método abstrato: não tem corpo { }. Cada subclasse é OBRIGADA a implementar!
    @Override
    public abstract void withdraw(double amount);
}
```

Se tentarmos criar a classe abstrata diretamente:

```java
BaseAccount acc = new BaseAccount("Ana", "001", 1000.0); // Erro de compilação!
```

Para usá-la, criamos subclasses concretas que preenchem as lacunas deixadas
pelos métodos abstratos:

```java
class CheckingAccount extends BaseAccount {
    CheckingAccount(String owner, String accountNumber, double initialBalance) {
        super(owner, accountNumber, initialBalance);
    }

    @Override
    public void withdraw(double amount) {
        // Implementação obrigatória da regra de saque da conta corrente
        if (amount > this.getBalance()) {
            throw new IllegalStateException("Saldo insuficiente");
        }

        // realiza o débito...
    }

    @Override
    public String getStatement() {
        return "Conta Corrente — Saldo: " + this.getBalance();
    }
}
```

#### Classe Abstrata vs. Interface

Uma dúvida comum entre quem está começando é: _"Se a classe abstrata não pode
ser instanciada e exige que outros implementem seus métodos abstratos, qual é a
diferença para uma `interface`?"_

| Característica              | Interface                                               | Classe Abstrata                                                          |
| :-------------------------- | :------------------------------------------------------ | :----------------------------------------------------------------------- |
| **Instanciação com `new`**  | Não permite                                             | Não permite                                                              |
| **Herança / Implementação** | Uma classe implementa **múltiplas** (`implements A, B`) | Uma classe só estende **uma** (`extends Base`)                           |
| **Campos de instância**     | Não possui (apenas constantes `static final`)           | Possui campos normais (`private double balance`)                         |
| **Construtores**            | Não possui                                              | Possui (chamados via `super(...)`)                                       |
| **Foco principal**          | **Contrato puro:** define _o que_ o objeto deve fazer   | **Base compartilhada:** define _o que o objeto é_ e fornece código comum |

**Quando usar cada uma:**

- **Prefira interfaces** como padrão para definir contratos e capacidades do
  sistema. Elas mantêm o código desacoplado e não consomem o único `extends` que
  sua classe possui.
- **Use classes abstratas** quando você tem um grupo de classes irmãs que
  realmente precisam compartilhar **estado (campos)**, **construtores com
  validações** e **lógica base reutilizável**, onde a relação "é um" é genuína e
  indiscutível.

---

### Proibindo a herança: Bloqueio com `final`

No outro extremo do controle, temos situações em que uma classe ou método foi
desenhado de forma completa e **não deve sofrer derivações**. Permitir herança
indiscriminada em qualquer classe pode abrir brechas de segurança ou quebrar
invariantes fundamentais.

Java permite usar `final` para **prevenir derivações indesejadas**:

#### 1. `final` em classes (proíbe herança)

Quando uma classe é declarada com `final`, **nenhuma outra classe pode
estendê-la**. A tentativa de usar `extends` nela resulta em erro de compilação:

```java
public final class SecurityToken {
    private final String token;

    public SecurityToken(String token) {
        this.token = token;
    }
}

// Erro de compilação: não é permitido herdar de SecurityToken
// class CustomToken extends SecurityToken { }
```

O exemplo mais famoso da biblioteca padrão é a classe `String`: ela é declarada
como `public final class String`. Se qualquer desenvolvedor pudesse criar uma
subclasse de `String`, seria possível sobrescrever métodos internos e burlar
mecanismos de autenticação ou corromper a imutabilidade do _pool de strings_.

#### 2. `final` em métodos (proíbe sobrescrita)

Quando um método é declarado com `final`, as subclasses continuam herdando o
método normalmente, mas **não têm permissão para sobrescrevê-lo** com
`@Override`:

```java
class BankAccount {
    private final String accountNumber;

    // Subclasses herdam esse método, mas NÃO podem alterá-lo
    public final String getAccountNumber() {
        return this.accountNumber;
    }
}
```

Isso garante que comportamentos críticos ou verificações de segurança definidas
pela superclasse sejam executados exatamente como foram concebidos, sem o risco
de uma classe filha alterar silenciosamente a regra do jogo.

## 4. Os Limites da Herança

Você viu a mecânica da especialização, a formação da árvore de tipos e como
controlar as permissões de herança. Mas o erro mais comum entre desenvolvedores
em início de carreira é usar herança pelo motivo errado: **reuso preguiçoso de
código**.

### O problema do "reuso por conveniência"

A pergunta certa antes de usar `extends` não é _"eu consigo reaproveitar esse
código?"_, mas sim:

> **Uma `SavingsAccount` _é_ um `BankAccount`?**

Sim. Ela satisfaz tudo que um `BankAccount` satisfaz — depósito, saque, extrato
— e apenas acrescenta regras específicas. Faz sentido substituir um
`BankAccount` por uma `SavingsAccount` em qualquer ponto da aplicação.

Agora imagine modelar um funcionário (`Employee`) com campo `salary`, e um
gerente (`Manager`) com `salary` e `bonus`. A tentação inicial seria escrever
`Manager extends Employee` — afinal, gerente é um tipo de funcionário, certo?

Mas "gerente" é um **cargo**, não uma identidade fixa da pessoa. Isso cria
problemas concretos no mundo real:

1. **Cargos mudam com o tempo:** a herança fixa o tipo do objeto em tempo de
   compilação. Não é possível transformar uma instância de `Manager` em
   `Employee` em tempo de execução sem destruir o objeto e recriá-lo do zero.
2. **Cargos se acumulam:** e se alguém for promovido a diretor e acumular
   responsabilidades? Criamos `DirectorAndManager`? A proliferação de subclasses
   torna o modelo inviável muito rápido.

### "É um" vs. "Tem um"

Nesses cenários, a relação correta não é "é um", mas sim **"tem um"**:

- O funcionário **tem um** cargo (que pode mudar), ele não **é** o cargo.
- Uma conta **tem uma** política de tarifas, ela não **é** a política.

No próximo capítulo, veremos como a **composição** resolve esses problemas com
muito mais flexibilidade, permitindo trocar comportamentos em tempo de execução
sem criar hierarquias rígidas e difíceis de manter.

<details>
<summary>Herança e a classe Object</summary>

Em Java, toda classe que não declara `extends` herda implicitamente de
`java.lang.Object`. Isso significa que qualquer objeto carrega um conjunto de
métodos que vêm de `Object`:

- `toString()` — representação textual do objeto. É o método chamado quando você
  passa um objeto para `System.out.println`. A implementação padrão retorna algo
  como `BankAccount@1a2b3c` (nome da classe + endereço); sobrescreva-o para
  retornar algo legível.
- `equals(Object o)` — comparação de igualdade. Por padrão, compara referências
  (o mesmo que `==`). Sobrescreva quando dois objetos com os mesmos dados devem
  ser considerados iguais.
- `hashCode()` — código numérico usado em estruturas como `HashMap` e `HashSet`.
  Sempre que sobrescrever `equals`, sobrescreva `hashCode` também — caso
  contrário, objetos "iguais" terão hashes diferentes e o comportamento dessas
  estruturas vai surpreender você.

```java
class BankAccount {
    // ...

    @Override
    public String toString() {
        return "BankAccount[%s, %s]".formatted(this.owner, this.accountNumber);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BankAccount other)) return false;
        return this.accountNumber.equals(other.accountNumber);
    }

    @Override
    public int hashCode() {
        return this.accountNumber.hashCode();
    }
}
```

</details>

---

<a href="06-encapsulamento.md">← Encapsulamento</a>

<p align="right"><a href="08-composicao.md">Próximo: Composição →</a></p>
