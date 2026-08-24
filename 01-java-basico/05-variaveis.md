# 5. Variáveis

## O Que É uma Variável

Uma variável é um nome associado a um espaço de memória que guarda um valor.
Quando você declara uma variável, está pedindo ao Java para reservar esse espaço
e dar um nome a ele — assim você pode guardar, ler e substituir o valor a
qualquer momento pelo nome, sem precisar se preocupar com endereços de memória.

## Declaração, Inicialização e Atribuição

São três operações distintas, mesmo que às vezes aconteçam na mesma linha:

**Declaração** — cria a variável e reserva o espaço de memória:

```java
int age;
String name;
```

**Inicialização** — atribui um valor pela primeira vez:

```java
age = 25;
name = "Luigi";
```

**Atribuição** — substitui um valor já existente:

```java
age = 30;  // age já existia e tinha valor; agora tem outro
```

Declaração e inicialização podem acontecer juntas:

```java
int age = 25;
String name = "Luigi";
```

Em Java, toda variável local precisa ser inicializada antes de ser lida — o
compilador não deixa você usar um valor que pode estar indefinido:

```java
int x;
System.out.println(x);  // erro de compilação: "variable x might not have been initialized"
```

## Categorias de Variáveis

Dependendo de onde uma variável é declarada, ela recebe um nome diferente:

**Variável local** — declarada dentro de um método ou bloco:

```java
void processPayment(double amount) {
    double fee = amount * 0.02;  // variável local
}
```

**Campo de instância** — declarado dentro da classe, fora de qualquer método.
Cada objeto criado a partir da classe tem sua própria cópia:

```java
public class BankAccount {
    private double balance;  // campo de instância
    private String holder;
}
```

**Campo estático** — declarado com `static`. Pertence à classe, não a um objeto
específico; todos os objetos compartilham o mesmo valor:

```java
public class BankAccount {
    private static int totalAccounts = 0;  // campo estático
}
```

## `final`: Bloqueando a Reatribuição

O modificador `final` impede que uma variável seja reatribuída após a
inicialização:

```java
final double taxRate = 0.15;
taxRate = 0.20;  // erro de compilação: não é possível atribuir a uma variável final
```

É importante entender o que `final` _não_ faz: ele não torna o valor uma
constante no sentido de "sempre será o mesmo". Ele apenas garante que, uma vez
inicializada, aquela variável não pode receber outro valor. Em métodos, isso
significa que chamadas diferentes podem inicializar a variável com valores
diferentes — o `final` só impede a reatribuição dentro da mesma execução:

```java
void applyDiscount(double rate) {
    final double discount = rate;  // inicializada com o valor recebido — diferente a cada chamada
    // discount = 0.5;             // erro: não pode reatribuir dentro desta execução
    double price = 100.0 * (1 - discount);
}
```

Em variáveis de referência, `final` impede que a variável aponte para outro
objeto — mas o objeto em si ainda pode ser modificado:

```java
final BankAccount account = new BankAccount(1000.0);
account = new BankAccount(500.0);  // erro: account não pode apontar para outro objeto
account.deposit(200.0);            // válido: o objeto em si não é imutável
```

Para constantes verdadeiras — valores fixos compartilhados por toda a classe — a
combinação é `static final`, assunto que veremos no capítulo dedicado a
`static`.

## Inferência de Tipo com `var`

A partir do Java 10, o compilador consegue deduzir o tipo de uma variável local
a partir do valor que ela recebe na inicialização. Em vez de repetir o tipo,
você usa `var`:

```java
var name = "Luigi";                    // compilador infere String
var balance = 1000.0;                  // compilador infere double
var account = new BankAccount(1000.0); // compilador infere BankAccount
```

O tipo ainda existe — `var` não é uma variável sem tipo. O compilador determina
o tipo na compilação e o código se comporta exatamente como se você tivesse
escrito o tipo explicitamente. A diferença é apenas na verbosidade do
código-fonte.

`var` só funciona em variáveis locais com inicialização imediata — não em campos
de classe, parâmetros de método, ou quando não há valor inicial:

```java
class BankAccount {
    var holder;                         // erro: não pode usar var em campos de classe

    void processPayment(var amount) {   // erro: não pode usar var em parâmetros
        var x;                          // erro: não pode usar var sem inicialização
        var y = null;                   // erro: null não é informação suficiente para inferir o tipo
    }
}
```

Use `var` quando o tipo já é evidente no lado direito da atribuição. Quando
remover o tipo torna a linha mais difícil de entender, escreva o tipo
explicitamente:

```java
// tipo claro — var reduz ruído sem perder informação
var account = new BankAccount(1000.0);

// tipo não claro — declarar explicitamente ajuda quem lê
Invoice result = process(data);  // o que process retorna? com var, não daria para saber
```

## Convenções de Nomenclatura

Java usa **camelCase** para variáveis: primeira palavra em minúsculo, cada
palavra seguinte começa em maiúsculo.

```java
int accountBalance;
String customerName;
boolean isActive;
```

Nomes devem ser descritivos. `balance` é melhor que `b`; `customerName` é melhor
que `cn`. A exceção convencional são variáveis de controle de laço curtas, como
`i`, `j`, `k`.

Como visto no capítulo 1, identificadores em código Java seguem o inglês —
`accountBalance`, não `saldoConta`.

---

<a href="04-string.md">← String</a>

<p align="right"><a href="06-expressoes-e-operadores.md">Próximo: Operadores e Expressões →</a></p>
