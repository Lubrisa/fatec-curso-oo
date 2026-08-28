# 3. Campos e Métodos

Uma classe é composta por diferentes **membros**. Entre os mais fundamentais
estão os dados que ela carrega e as operações que ela oferece, que são o foco
deste capítulo:

- **Campos (ou atributos)** — as variáveis que armazenam o estado da classe ou
  do objeto.
- **Métodos** — as funções e procedimentos que definem seus comportamentos.

Tanto campos quanto métodos podem ser de **instância** ou **estáticos**. Essa
distinção é o que organiza este capítulo.

## Campos de instância

Um campo de instância é declarado diretamente no corpo da classe, fora de
qualquer método:

```java
class BankAccount {
    String owner;
    String accountNumber;
    double balance;
}
```

Cada objeto criado a partir de `BankAccount` tem sua própria cópia desses três
campos na memória. Alterar `balance` em um objeto não afeta nenhum outro — como
vimos no capítulo anterior.

Campos de instância são inicializados automaticamente com os valores padrão do
tipo quando o objeto é criado. Os valores padrão são os mesmos descritos no
[capítulo 5 do módulo 01](../01-java-basico/05-variaveis.md): `0` para tipos
numéricos, `false` para `boolean`, e `null` para referências.

## Campos estáticos

Um **campo estático** (declarado com a palavra-chave `static`) pertence à classe
como um todo, e não a um objeto em particular. Existe apenas uma única cópia do
campo na memória, compartilhada por todas as instâncias:

```java
class BankAccount {
    double balance;           // instância — cada objeto tem o seu
    static int totalAccounts; // estático — uma única cópia compartilhada por todos
}
```

Campos estáticos podem ser acessados diretamente através do nome da classe:

```java
BankAccount.totalAccounts = 10;
```

### Cuidado com campos estáticos mutáveis

Um campo estático mutável compartilha estado global entre todos os objetos e
todas as partes do programa que acessam a classe. Isso cria sérios problemas:

- **Concorrência:** se duas partes do código tentarem modificar o mesmo campo
  estático simultaneamente, uma pode sobrescrever a escrita da outra de forma
  imprevisível.
- **Rastreabilidade:** como qualquer ponto do código pode alterar o valor a
  qualquer momento, torna-se muito difícil rastrear onde e quando um estado
  inválido ou bug foi gerado.

Se precisar de um campo estático, prefira torná-lo uma constante com `final` e
um tipo de dado imutável:

```java
static final double INTEREST_RATE = 0.02;          // primitivo — imutável por natureza
static final String BANK_NAME = "Banco Digital";   // String é imutável — seguro

static List<String> accountLog = new ArrayList<>(); // mutável — problemático
```

> **Convenção:** constantes estáticas usam `UPPER_SNAKE_CASE` — todas as letras
> maiúsculas, palavras separadas por `_`.

## Métodos

No [capítulo 10 do módulo 01](../01-java-basico/10-funcoes.md), vimos a
estrutura básica de funções em Java (retorno, nome, parâmetros e corpo). Quando
uma função é declarada dentro de uma classe, nós a chamamos de **método**.

Assim como os campos, os métodos podem ser de **instância** ou **estáticos**.

### Métodos de instância

Um método de instância define um comportamento associado ao objeto em que foi
chamado e tem acesso direto aos campos desse objeto:

```java
class BankAccount {
    String owner;
    String accountNumber;
    double balance;

    void deposit(double amount) {
        this.balance += amount;
    }

    void withdraw(double amount) {
        if (amount > this.balance) {
            throw new IllegalStateException("Saldo insuficiente");
        }
        this.balance -= amount;
    }

    String getStatement() {
        return """
        Titular: %s
        Conta: %s
        Saldo: %.2f
        """.formatted(this.owner, this.accountNumber, this.balance);
    }
}
```

Para chamar um método de instância, é necessário ter um objeto criado:

```java
BankAccount account = new BankAccount();
account.owner = "Ana";
account.balance = 1000.0;

account.deposit(200.0);
System.out.println(account.getStatement());
```

#### A palavra-chave `this`

`this` representa uma referência ao próprio objeto sobre o qual o método foi
invocado. Ele é obrigatório quando o nome de um parâmetro coincide com o nome de
um campo, e queremos referenciar especificamente o campo:

```java
void setOwner(String owner) {
    this.owner = owner; // this.owner é o campo; owner é o parâmetro
}
```

Nos demais casos, o uso de `this` é opcional para o compilador. Ainda assim,
adotá-lo de forma consistente ao acessar campos é uma boa prática: além de
tornar a intenção do código explícita, evita bugs silenciosos caso um parâmetro
ou variável local seja renomeado no futuro e passe a sombrear (_shadowing_) o
nome do campo sem que você perceba.

### Métodos estáticos

Um **método estático** pertence à classe e não a uma instância individual. Por
isso, não é possível usar a palavra-chave `this` nem acessar campos de instância
diretamente:

```java
class BankAccount {
    static int totalAccounts = 0;
    double balance;

    static int getTotalAccounts() {
        return totalAccounts; // acessa campo estático — correto
    }

    static void deposit(double amount) {
        this.balance += amount; // erro de compilação: sem this em contexto estático
    }
}
```

Métodos estáticos são chamados diretamente a partir do nome da classe:

```java
int total = BankAccount.getTotalAccounts();
```

### Equívocos comuns com métodos estáticos

Métodos estáticos são ideais para funções utilitárias puras, cujo resultado
depende exclusivamente dos argumentos recebidos (como `Math.sqrt(...)` ou
`Integer.parseInt(...)`). Contudo, é comum vê-los sendo usados de forma
inadequada em alguns cenários:

1. **Manipulação de estado de objetos:** uma das ideias centrais da orientação a
   objetos é que o objeto deve ser o único responsável por manter e alterar seu
   próprio estado (aprofundaremos nisso no capítulo sobre encapsulamento). Se um
   método — estático ou até de instância de outra classe — recebe um objeto e
   altera seus campos diretamente, ele está quebrando essa premissa:

   ```java
   // Evite: código externo manipulando o estado do objeto
   static void applyInterest(BankAccount account, double rate) {
       account.balance *= 1 + rate;
   }
   ```

   Se a operação altera os dados de um objeto, ela pertence ao próprio objeto
   (`account.applyInterest(rate)`).

2. **Leitura e formatação de dados:** criar métodos estáticos utilitários para
   formatar ou extrair informações de um objeto (como `formatAccount(account)`)
   costuma espalhar lógica que deveria estar contida nele. O próprio objeto tem
   o maior conhecimento sobre sua estrutura interna: se o formato de exibição ou
   os campos mudarem, você só precisa atualizar a classe em um único lugar (como
   no método `getStatement()` do exemplo na seção [Métodos de
   instância](#métodos-de-instância)).

3. **Cálculos e regras de negócio com variações:** concentrar regras de negócio
   que mudam conforme o tipo do objeto em métodos estáticos tende a gerar
   estruturas rígidas baseadas em `switch` ou `if/else`:

   ```java
   // Evite: método estático centralizando regras que variam por tipo
   static double calculateFee(BankAccount account) {
       return switch (account.type) {
           case "SAVINGS" -> 0.0;
           case "CHECKING" -> 5.0;
           default -> 10.0;
       };
   }
   ```

   Cada novo tipo de conta exige lembrar de modificar esse método estático (e
   todos os outros parecidos espalhados pelo sistema). Na orientação a objetos,
   preferimos delegar esse cálculo para o próprio objeto
   (`account.calculateFee()`), permitindo que cada subtipo defina sua própria
   regra por meio de **herança e polimorfismo** (outro tópico que iremos abordar
   mais adiante).

---

<a href="02-objetos.md">← Objetos</a>

<p align="right"><a href="04-construtores.md">Próximo: Construtores →</a></p>
