# 02. Dados, Variáveis e Expressões

Guia de referência sobre os tipos de dados do Java, declaração de variáveis,
casting, semântica de memória e operadores da linguagem.

## 1. Tipos Primitivos

Os tipos primitivos são as unidades básicas de informação em Java. Eles
armazenam o valor bruto diretamente e não são definidos por classes, portanto
não possuem métodos ou atributos.

| Tipo      | Tamanho | Valor Padrão | Intervalo / Descrição                             |
| :-------- | :------ | :----------- | :------------------------------------------------ |
| `byte`    | 8 bits  | `0`          | Inteiro de -128 a 127                             |
| `short`   | 16 bits | `0`          | Inteiro de -32.768 a 32.767                       |
| `int`     | 32 bits | `0`          | Inteiro de -2 bilhões a +2 bilhões                |
| `long`    | 64 bits | `0L`         | Inteiro de -9 quintilhões a 9 quintilhões         |
| `float`   | 32 bits | `0.0f`       | Ponto flutuante de precisão simples (ex: `3.14f`) |
| `double`  | 64 bits | `0.0d`       | Ponto flutuante de precisão dupla (ex: `3.14159`) |
| `boolean` | 1 bit   | `false`      | Apenas `true` ou `false`                          |
| `char`    | 16 bits | `'\u0000'`   | Um caractere Unicode (ex: `'A'`, `'9'`)           |

## 2. Tipos Declarados Através de Classes

Diferente dos tipos primitivos, estes tipos são estruturas complexas construídas
a partir de definições de classes. Eles representam objetos ou estruturas
compostas na linguagem.

- **`Object`:** A classe base de todo o sistema de tipos do Java. Qualquer
  classe em Java herda diretamente ou indiretamente de `Object`.
- **`String`:** Representa sequências de texto (ex: `"Orientação a Objetos"`). É
  uma classe com métodos utilitários próprios para manipulação de caracteres.
- **Arrays:** Estruturas de tamanho fixo que agrupam múltiplos elementos do
  mesmo tipo (ex: `int[] numbers = new int[5];` ou `String[] names = new
String[3];`).

## 3. Variáveis e Constantes

### Declaração vs. Atribuição vs. Inicialização

No ciclo de vida de uma variável, é importante separar três conceitos distintos:

1. **Declaração:** É o ato de informar ao programa o tipo e o nome da variável,
   reservando o identificador no código sem necessariamente guardar um valor
   (ex: `int age;`).
2. **Atribuição:** É o ato de armazenar um valor dentro de uma variável
   previamente declarada utilizando o operador `=` (ex: `age = 25;`).
3. **Inicialização:** É o nome dado à **primeira atribuição** realizada em uma
   variável. Em Java, variáveis locais precisam ser obrigatoriamente
   inicializadas antes que você tente ler seu conteúdo.

```java
int score;         // Declaração (a variável existe, mas não tem valor definido)
score = 100;       // Atribuição (como é a PRIMEIRA vez, chamamos de Inicialização)
score = 200;       // Reatribuição (alteração do valor existente)
```

### Inferência de Tipo com `var`

A partir do Java 10, você pode utilizar a palavra-chave `var` para que o
compilador infira automaticamente o tipo da variável com base no valor atribuído
na sua inicialização:

```java
var limit = 5000.00;                       // O compilador infere o tipo 'double'
var list = new ArrayList<String>();        // O compilador infere 'ArrayList<String>'
```

_Nota de Uso Recomendado:_ Utilize o `var` preferencialmente em cenários onde o
tipo de dado é evidente pelo valor atribuído do lado direito (como em
instanciações explícitas com `new` ou literais claros). À medida que ganhar
experiência e maturidade na leitura de código, você saberá identificar com
precisão quando o uso do `var` mantém a clareza ou quando declarar o tipo
explicitamente melhora a legibilidade.

### Constantes e a Palavra-chave `final`

A palavra-chave `final` indica que uma variável não pode ser **reatribuída**
após ser inicializada. Toda variável marcada com `final` precisa ser
obrigatoriamente inicializada (variáveis locais antes da primeira leitura;
atributos de classe na declaração ou dentro do construtor).

Existe uma diferença conceitual importante entre **variáveis locais imutáveis**
e **constantes de fato**:

#### 1. Variáveis Locais Imutáveis (`final` no escopo de um método)

Quando usada dentro de uma função ou método, a palavra-chave `final` garante
apenas que o valor atribuído naquela execução não será alterado. O valor inicial
pode variar a cada chamada da função:

```java
void calculateDiscount(final double originalPrice) {
    // 'originalPrice' recebe um valor diferente a cada invocação do método,
    // mas dentro desta execução seu valor NÃO pode ser alterado!
    // originalPrice = originalPrice * 0.9; // Erro de compilação!

    final double finalPrice = originalPrice * 0.9; // Inicialização da variável local
    System.out.println("Valor com desconto: " + finalPrice);
}

// Em chamadas diferentes, o valor inicial atribuído é diferente:
calculateDiscount(100.0); // originalPrice é inicializado com 100.0
calculateDiscount(200.0); // originalPrice é inicializado com 200.0
```

#### 2. Constantes de Classe (`static final`)

Uma **constante de fato** é um valor único, imutável e compartilhado por toda a
aplicação durante toda a sua execução. Para criar uma constante de fato,
combinamos `final` com o modificador `static` no nível da classe:

```java
public class MathConstants {
    // Constante de fato: valor imutável, único e acessível globalmente
    public static final double PI = 3.14159265359;
}
```

> **Nota sobre Imutabilidade e Tipos de Referência:**
>
> No caso de tipos primitivos, a combinação `static final` cria uma constante
> absoluta, pois o valor bruto armazenado não pode mudar. Contudo, para tipos
> definidos por classes, a palavra-chave `final` garante apenas que a variável
> não pode ser **reatribuída para apontar para outro endereço de memória**.
>
> Se o objeto referenciado for mutável (como um `ArrayList`), seu estado interno
> ainda poderá ser alterado (por exemplo, adicionando ou removendo elementos via
> `lista.add()`). Para garantir uma constante de referência totalmente imutável,
> o objeto apontado também precisa ser imutável por design (como ocorre com a
> classe `String` ou coleções criadas via `List.of()`).

## 4. Conversão de Tipos (Casting)

O _casting_ é o processo de converter um valor de um tipo para outro no sistema
de tipos do Java.

### Casting Implícito

Ocorre automaticamente quando o tipo de origem é **compatível** com o tipo de
destino e a conversão pode ser realizada **sem qualquer perda de informação**.

Esse princípio aplica-se tanto a tipos numéricos quanto à hierarquia de classes
(onde tratar uma subclasse como sua superclasse é uma conversão sem perda de
conceito):

```java
// Numérico: int é totalmente compatível com double (não há perda de dados)
int myInt = 100;
double myDouble = myInt; // Conversão implícita e segura

// Orientação a Objetos: nesse modelo Dog é uma subclasse de Animal, e pode ser tratada como tal
Dog myDog = new Dog();
Animal myAnimal = myDog; // Conversão implícita e segura
```

### Casting Explícito

Ocorre quando convertemos um valor para um tipo que **pode gerar perda de
informação, perda de precisão ou incompatibilidade de dados**. É obrigatório
indicar o tipo desejado entre parênteses para confirmar ao compilador que você
está ciente dos riscos:

```java
// Numérico: converter double para int descarta as casas decimais (perda de precisão)
double price = 99.99;
int roundedPrice = (int) price; // Resulta em 99

// Estouro de memória (Overflow):
int bigNumber = 130;
byte smallByte = (byte) bigNumber; // Resulta em -126 (dados corrompidos por estouro de bytes)
```

## 5. Semântica de Valor vs. Semântica de Referência

A forma como o Java manipula uma variável depende diretamente de seu tipo ser um
**primitivo** ou ser **declarado através de uma classe**.

### Semântica de Valor (Tipos Primitivos)

As variáveis de tipos primitivos armazenam o **próprio valor bruto** na pilha de
execução (Stack). Ao atribuir uma variável primitiva a outra ou passá-la para um
método, o valor é **duplicado/copiado**.

```java
int a = 10;
int b = a; // 'b' recebe uma CÓPIA do valor 10
b = 20;    // Alterar 'b' NÃO afeta 'a'

System.out.println(a); // Imprime: 10
System.out.println(b); // Imprime: 20
```

### Semântica de Referência (Tipos Declarados por Classes)

As variáveis de tipos declarados por classes não armazenam o objeto em si, mas
sim um **endereço de memória (referência)** que aponta para o objeto real
alocado na área dinâmica (Heap).

Ao atribuir uma variável de referência a outra, você **copia o endereço de
memória**, fazendo com que ambas as variáveis passem a apontar para a mesma
instância:

```java
// 'acc1' guarda a referência do objeto criado no Heap
BankAccount acc1 = new BankAccount();
acc1.deposit(100.0);

// 'acc2' recebe a MESMA referência guardada em 'acc1'
BankAccount acc2 = acc1;
acc2.deposit(50.0); // Modifica o objeto compartilhado!

System.out.println(acc1.getBalance()); // Imprime: 150.0
```

### O Valor `null` e a `NullPointerException`

Uma variável de referência que não aponta para nenhum objeto na Heap armazena a
palavra-chave `null`. Tentar invocar métodos ou acessar atributos através de uma
referência nula resultará no erro `NullPointerException` em tempo de execução:

```java
BankAccount acc = null;
// acc.deposit(100.0); // Dispara NullPointerException!
```

## 6. Expressões e Operadores

### Operadores Aritméticos

Servem para realizar operações matemáticas básicas.

```java
int sum = 10 + 5;        // Adição (15)
int sub = 10 - 5;        // Subtração (5)
int mult = 10 * 5;       // Multiplicação (50)
int div = 10 / 3;        // Divisão inteira (3)
double exactDiv = 10.0 / 3.0; // Divisão exata (3.333...)
int rest = 10 % 3;       // Módulo / Resto da divisão (1)
```

### Operadores Relacionais

Comparam operandos e retornam um valor `boolean` (`true` ou `false`).

- `==` : Igual a
- `!=` : Diferente de
- `>` : Maior que
- `<` : Menor que
- `>=` : Maior ou igual a
- `<=` : Menor ou igual a

_Atenção com Objetos:_ O operador `==` em tipos definidos por classes compara se
ambas as variáveis apontam para a **mesma referência na memória**. Para comparar
se os **conteúdos/valores** de dois objetos são semanticamente iguais (como
`String`s), utilize o método `.equals()`.

### Operadores Lógicos

Utilizados para combinar expressões booleanas.

- `&&` : E (AND) — Retorna `true` apenas se ambas as condições forem
  verdadeiras. Avalia em curto-circuito (se a primeira for falsa, nem testa a
  segunda).
- `||` : OU (OR) — Retorna `true` se pelo menos uma condição for verdadeira.
  Avalia em curto-circuito (se a primeira for verdadeira, nem testa a segunda).
- `!` : NÃO (NOT) — Inverte o valor booleano.

### Operador Ternário

Uma forma enxuta de expressão condicional: `condição ? valor_se_verdadeiro :
valor_se_falso`.

```java
int age = 20;
String status = (age >= 18) ? "Maior de idade" : "Menor de idade";
```

### Operador `instanceof` e Pattern Matching

O `instanceof` é um operador que testa se um objeto é uma instância de uma
classe ou interface específica.

A partir do **Java 16**, a linguagem oficializou o recurso de **Pattern Matching
para `instanceof`**, permitindo declarar a variável já convertida diretamente na
instrução de checagem, eliminando a necessidade de casting manual:

```java
Object obj = "Texto de exemplo";

// A partir do Java 16:
if (obj instanceof String s) { // Testa o tipo e já declara 's' convertida para String
    System.out.println(s.toUpperCase());
}
```

Antes do Java 16, era necessário fazer o casting manualmente:

```java
if (obj instanceof String) { // Testa o tipo
    String s = (String) obj; // Faz o casting manualmente
    System.out.println(s.toUpperCase());
}
```

## 7. Precedência e Associatividade de Operadores

A ordem de avaliação das expressões é governada por duas regras fundamentais:
**Precedência** (quais operadores são executados primeiro) e **Associatividade**
(em que direção a expressão é resolvida quando há operadores de mesma
precedência).

### Associatividade em Ação

- **Associatividade à Esquerda (`->`):** A maioria dos operadores (como os
  aritméticos) resolve a expressão da esquerda para a direita.

  ```java
  int result = 10 - 5 - 2; // É avaliado como (10 - 5) - 2 = 3 (e não 10 - (5 - 2) = 7)
  ```

- **Associatividade à Direita (`<-`):** Operadores de atribuição e o operador
  ternário resolvem a expressão da direita para a esquerda.

  ```java
  int a, b, c;
  a = b = c = 5; // Avaliado da direita para a esquerda: c recebe 5, depois b recebe c, depois a recebe b.
  ```

### Tabela de Precedência (Do maior para o menor)

1. **Parênteses:** `()` (utilizados para forçar a ordem desejada, se aninhados,
   os parênteses mais internos são avaliados primeiro)
2. **Operadores Unários:** `++`, `--`, `!`, `+` (positivo), `-` (negativo)
   _(Associatividade à Direita)_
3. **Multiplicativos:** `*`, `/`, `%` _(Associatividade à Esquerda)_
4. **Aditivos:** `+`, `-` _(Associatividade à Esquerda)_
5. **Relacionais e Tipo:** `<`, `>`, `<=`, `>=`, `instanceof` _(Associatividade
   à Esquerda)_
6. **Igualdade:** `==`, `!=` _(Associatividade à Esquerda)_
7. **Lógicos:** `&&` seguido por `||` _(Associatividade à Esquerda)_
8. **Ternário:** `? :` _(Associatividade à Direita)_
9. **Atribuição:** `=`, `+=`, `-=`, `*=`, `/=`, `%=` _(Associatividade à
   Direita)_
