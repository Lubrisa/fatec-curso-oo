# 4. Construtores

No capítulo anterior, criamos objetos e depois atribuímos os campos um a um:

```java
BankAccount account = new BankAccount();
account.owner = "Ana";
account.accountNumber = "001";
account.balance = 1000.0;
```

Esse padrão tem um problema: entre a criação do objeto e a atribuição dos
campos, o objeto existe em estado incompleto — `owner` é `null`, `balance` é
`0`. Nada impede que alguém use o objeto nesse intervalo, ou que esqueça de
preencher um campo.

O **construtor** resolve isso: é um bloco de código que executa no momento exato
em que o objeto é criado, garantindo que ele nasça em estado válido.

## Declarando um construtor

Um construtor é um tipo especial de método que tem duas características que o
distinguem: seu nome é idêntico ao da classe, e ele não tem tipo de retorno —
nem `void`:

```java
class BankAccount {
    String owner;
    String accountNumber;
    double balance;

    // Construtor de BankAccount
    BankAccount(String owner, String accountNumber, double initialBalance) {
        this.owner = owner;
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }
}
```

A criação do objeto agora exige os dados obrigatórios:

```java
BankAccount account = new BankAccount("Ana", "001", 1000.0);
```

O objeto nasce completo. Não há janela de tempo em que `owner` seja `null` ou
`balance` seja `0` por descuido.

## Validando dados no construtor

O construtor é o momento certo para impor as regras que o objeto deve respeitar
desde o início. Uma conta bancária, por exemplo, não deveria ser criada com
saldo negativo:

```java
BankAccount(String owner, String accountNumber, double initialBalance) {
    if (initialBalance < 0) {
        throw new IllegalArgumentException("Saldo inicial não pode ser negativo");
    }

    this.owner = owner;
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
}
```

Se a regra for violada, o objeto simplesmente não é criado — a exceção
interrompe a construção antes que qualquer campo seja atribuído. Não existe
`BankAccount` com saldo negativo; o invariante está garantido desde a origem.

## Múltiplos construtores

Uma classe pode ter mais de um construtor, desde que as listas de parâmetros
sejam diferentes:

```java
class BankAccount {
    String owner;
    String accountNumber;
    double balance;

    // conta criada com saldo inicial explícito
    BankAccount(String owner, String accountNumber, double initialBalance) {
        if (initialBalance < 0) {
            throw new IllegalArgumentException("Saldo inicial não pode ser negativo");
        }
        this.owner = owner;
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    // conta criada sem saldo inicial — começa em zero
    BankAccount(String owner, String accountNumber) {
        this.owner = owner;
        this.accountNumber = accountNumber;
        this.balance = 0.0;
    }
}
```

```java
BankAccount withBalance = new BankAccount("Ana", "001", 1000.0);
BankAccount empty       = new BankAccount("Bruno", "002");
```

## Delegação entre construtores

O segundo construtor do exemplo acima repete a atribuição dos campos `owner` e
`accountNumber`. Imagine que, mais tarde, você decide que o titular não pode ser
uma string vazia. Você adiciona a validação no primeiro construtor — e esquece
de replicar no segundo. Agora os dois construtores aplicam regras diferentes
para o mesmo campo, e criar uma conta sem saldo inicial aceita um titular vazio
enquanto criar com saldo não aceita. Divergências assim são difíceis de perceber
e de rastrear.

A solução é a **delegação**: um construtor chama outro da mesma classe com
`this(...)`. A chamada deve ser a primeira instrução do construtor:

```java
class BankAccount {
    String owner;
    String accountNumber;
    double balance;

    BankAccount(String owner, String accountNumber, double initialBalance) {
        if (initialBalance < 0) {
            throw new IllegalArgumentException("Saldo inicial não pode ser negativo");
        }
        this.owner = owner;
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    BankAccount(String owner, String accountNumber) {
        this(owner, accountNumber, 0.0); // delega para o construtor principal
    }
}
```

Agora a lógica de validação e inicialização vive em um único lugar. O construtor
sem saldo simplesmente escolhe um valor padrão e passa adiante.

## O construtor padrão

Quando você não declara nenhum construtor, o compilador Java gera um
automaticamente: o **construtor padrão**, sem parâmetros, que não faz nada além
de inicializar os campos com os valores padrão do tipo.

```java
class BankAccount {
    String owner;
    double balance;
    // nenhum construtor declarado → o compilador gera BankAccount() {}
}

BankAccount account = new BankAccount(); // funciona
```

É exatamente por isso que as classes dos capítulos anteriores podiam ser
instanciadas com `new BankAccount()` sem nenhum construtor declarado — o
compilador estava gerando um silenciosamente. E é exatamente o problema descrito
no início deste capítulo: o objeto nasce com `owner` nulo, `balance` zerado e
`accountNumber` nulo, sem nenhuma garantia de validade.

Assim que você declara qualquer construtor, o compilador **para de gerar** o
padrão. Se quiser continuar oferecendo a criação sem parâmetros, precisa
declará-lo explicitamente:

```java
class BankAccount {
    String owner;
    double balance;

    BankAccount(String owner, double initialBalance) {
        this.owner = owner;
        this.balance = initialBalance;
    }

    // sem isso, new BankAccount() deixa de compilar
    BankAccount() {
        this("", 0.0);
    }
}
```

<details>
<summary>Aprofundamento: Métodos de Fábrica Estáticos</summary>

Em vez de expor múltiplos construtores diretamente com `new`, muitas classes
utilizam **métodos de fábrica estáticos** para instanciar objetos. Esse padrão
oferece vantagens importantes em relação aos construtores convencionais:

1. **Maior expressividade e clareza de negócio:** Construtores sempre têm o
   mesmo nome da classe. Ao ler `new BankAccount("Ana", "001")`, fica implícito
   que a conta nasce com saldo zerado (o leitor precisa conhecer a implementação
   do construtor). Um método de fábrica comunica a regra de negócio e a intenção
   de forma explícita:

   ```java
   // Menos expressivo (saldo zerado é implícito):
   BankAccount account = new BankAccount("Ana", "001");

   // Mais expressivo e legível:
   BankAccount account = BankAccount.createEmptyAccount("Ana", "001");
   ```

2. **Diferenciação com a mesma lista de parâmetros:** O Java não permite criar
   dois construtores com a mesma assinatura (mesmos tipos de parâmetros). Com
   métodos de fábrica, isso deixa de ser um problema:

   ```java
   // Se declararmos os três construtores abaixo, o código não compila:
   //
   // Temperature(double fahrenheit) { ... }
   // Temperature(double kelvin) { ... }
   // Temperature(double celsius) { ... }
   //
   // Todos recebem um double, e não há como distinguir um do outro — mesmo com
   // nomes diferentes de parâmetros.

   // Com métodos de fábrica estáticos:
   Temperature t1 = Temperature.fromCelsius(25.0);
   Temperature t2 = Temperature.fromFahrenheit(77.0);
   Temperature t3 = Temperature.fromKelvin(298.15);
   ```

3. **Flexibilidade no tipo de retorno (tratamento de falhas):** Um construtor
   precisa instanciar o objeto ou lançar uma exceção. Lançar exceções tem um
   custo de desempenho e nem sempre é a melhor forma de modelar regras de
   validação comuns. Um método de fábrica pode retornar tipos customizados (como
   um `Result<BankAccount>`, `Optional<BankAccount>` ou um tipo de
   sucesso/falha):

   ```java
   // Centraliza as validações e retorna o resultado sem disparar exceções pesadas
   Result<BankAccount> result = BankAccount.tryCreate("Ana", initialBalance);

   if (result.isSuccess()) {
       BankAccount acc = result.getValue();
   }
   ```

4. **Ponto único de manutenção:** Se a inicialização interna ou os parâmetros
   necessários mudarem no futuro, a chamada dos métodos de fábrica permanece
   estável por toda a aplicação, concentrando o ajuste na classe de origem.

> **Dicas de design:**
>
> - **Validações com exceções:** se suas regras lançam exceções em caso de dados
>   inválidos, mantenha um construtor primário com visibilidade restrita (usando
>   modificadores de acesso, que veremos no capítulo de encapsulamento) que
>   centraliza todas as validações essenciais. Os métodos de fábrica apenas
>   preparam os dados e delegam a criação para ele.
> - **Validações com retorno de valor especial:** se você optar por retornar
>   tipos como `Result` ou `Optional` para evitar o custo de exceções, mantenha
>   o construtor "simples" (apenas atribuindo os campos sem validação) e
>   concentre as regras em um método de fábrica base. Nesse cenário, é
>   praticamente obrigatório **ocultar o construtor** (tornando-o privado com
>   modificadores de acesso), caso contrário outros desenvolvedores poderão
>   chamá-lo com `new` e criar objetos em estado inválido, burlando todas as
>   validações da fábrica.

</details>

---

<a href="03-campos-e-metodos.md">← Campos e Métodos</a>

<p align="right"><a href="05-abstracao.md">Próximo: Abstração →</a></p>
