# 04. Classes e Objetos

Guia de referência sobre declaração de classes, atributos, métodos,
construtores, membros estáticos, Enums, Records e os métodos fundamentais
herdados da classe `Object`.

## 1. Definição de Classe, Atributos e Métodos

Conforme visto nos Módulos 2 e 4, a classe funciona como a **planta baixa
(_blueprint_)** e o tipo estático que descreve a estrutura e o comportamento de
uma categoria de objetos.

```java
public class BankAccount {
    // Atributos (Campos que armazenam o Estado do objeto)
    private int number;
    private double balance;

    // Métodos (Comportamentos e operações que alteram ou lêem o estado)
    public void deposit(double amount) {
        if (amount > 0) {
            // A palavra-chave 'this' refere-se à instância atual que recebeu a mensagem
            this.balance += amount;
        }
    }

    public double getBalance() {
        return this.balance;
    }
}
```

### O Uso da Palavra-Chave `this`

O `this` é uma referência implícita para a própria instância em execução na
Heap. Ele é utilizado principalmente para:

1. Desambiguar atributos da classe de parâmetros de métodos que possuem o mesmo
   nome (_shadowing_).

   ```java
   public class User {
       private String name;

       public User(String name) {
           // O parâmetro name esconde o atributo name (shadowing), sendo
           // necessário o uso do 'this' para referenciar o atributo da classe.
           this.name = name;
       }
   }
   ```

2. Deixar explícito que a operação está sendo realizada sobre a memória daquele
   indivíduo (_self_).

## 2. Construtores e Instanciação (`new`)

O construtor é o método especial responsável por **garantir as invariantes no
nascimento do objeto**, impedindo que ele passe a existir no programa em um
estado inválido ou inconsistente.

```java
public class BankAccount {
    private int number;
    private double balance;

    // Construtor
    public BankAccount(int number, double initialBalance) {
        // Validação de Invariantes: Se as regras forem violadas, o objeto sequer nasce!
        if (number <= 0) {
            throw new IllegalArgumentException("O número da conta deve ser positivo.");
        }
        if (initialBalance < 0) {
            throw new IllegalArgumentException("O saldo inicial não pode ser negativo.");
        }

        this.number = number;
        this.balance = initialBalance;
    }
}
```

### O Ritual de Instanciação com `new`

Quando executamos `new BankAccount(1001, 500.00)`, a JVM realiza três etapas
sequenciais na memória:

1. **Alocação:** Reserva o espaço em bytes necessário para o objeto na Heap.
2. **Zeramento:** Preenche a memória alocada com os valores padrão do Java (`0`,
   `false`, `null`).
3. **Invocação do Construtor:** Executa a lógica do construtor passando o
   endereço recém-alocado no parâmetro `this`.

### Construtor Padrão

Se você não escrever nenhum construtor na sua classe, o compilador do Java
criará automaticamente um **construtor padrão sem parâmetros** (vazio). Contudo,
a partir do momento em que você escreve **qualquer construtor explicitamente**,
o construtor padrão deixa de existir automaticamente.

## 3. Membros Estáticos (`static`)

Atributos e métodos marcados com a palavra-chave `static` pertencem à **classe
em si**, e não a uma instância individual na Heap.

### Atributos Estáticos

São compartilhados por todas as instâncias daquela classe. Ao invés de residirem
no Heap junto com cada objeto individual, os atributos estáticos residem na
memória de tipos da classe.

> **Atenção: O Perigo de Campos Estáticos Mutáveis e Estado Global**
>
> Declarar atributos estáticos mutáveis (sem a palavra-chave `final`) introduz
> **estado global** na aplicação, criando dependências ocultas entre partes do
> sistema que deveriam ser isoladas. Isso gera dois problemas graves de
> engenharia:
>
> 1. **Dificuldade em Testes Unitários:** Testes automatizados devem ser
>    isolados e independentes. Se um teste altera o valor de uma variável
>    estática, ele corrompe o estado para os testes seguintes, fazendo com que o
>    resultado dos testes dependa da ordem em que eles são executados (_flaky
>    tests_).
> 2. **Raciocínio e Manutenção Dolorosos:** Quando qualquer ponto do sistema
>    pode alterar o estado de uma variável estática a qualquer momento, fica
>    extremamente difícil rastrear quem modificou aquele dado ou prever o
>    comportamento do código.
>
> **Recomendação Prática:** Como regra geral de design, **atributos estáticos
> devem ser quase sempre imutáveis (`static final`)**. Se você precisa
> compartilhar dados ou serviços entre diferentes partes do sistema, prefira
> passá-los explicitamente via construtor (injeção de dependências) em vez de
> recorrer a estado estático global.

### Métodos Estáticos

São funções que operam no nível da classe e podem ser invocadas sem a
necessidade de instanciar um objeto com `new`.

```java
public class FinancialUtils {
    // Atributo estático (único na memória de tipos)
    public static final double DEFAULT_TAX_RATE = 0.05;

    // Método estático
    public static double calculateInterest(double amount, int months) {
        return amount * DEFAULT_TAX_RATE * months;
    }
}

// Uso direto através do nome da Classe (sem 'new'):
double tax = FinancialUtils.calculateInterest(1000.0, 12);
```

_Limitação de Métodos Estáticos:_ Como os métodos estáticos não pertencem a
nenhuma instância específica, eles **não possuem acesso à referência `this`** e
não podem acessar diretamente atributos ou métodos de instância não-estáticos.

## 4. Enums (Enumerações)

Uma **Enum** é um tipo especial utilizado para definir um conjunto fixo e
fechado de constantes nomeadas do domínio.

### Enum Simples

```java
public enum OrderStatus {
    PENDING,
    PROCESSING,
    SHIPPED,
    DELIVERED,
    CANCELLED
}

// Uso:
OrderStatus status = OrderStatus.PENDING;
```

### Enums Ricas (Com Atributos e Métodos)

Em Java, Enums são tipos muito poderosos e podem possuir atributos, construtores
privados e métodos próprios:

```java
public enum PaymentMethod {
    CREDIT_CARD(0.05),
    BOLETO(0.0),
    PIX(0.0);

    private final double feePercentage;

    // O construtor de uma Enum é sempre privado
    PaymentMethod(double feePercentage) {
        this.feePercentage = feePercentage;
    }

    public double calculateFee(double amount) {
        return amount * this.feePercentage;
    }
}

// Uso:
double fee = PaymentMethod.CREDIT_CARD.calculateFee(100.0); // Resulta em 5.0
```

## 5. Records (Data Classes Imutáveis)

Introduzidos no Java moderno, os **Records** são tipos especiais projetados para
funcionar como "carregadores transparentes de dados imutáveis" (_Value
Objects_).

Ao declarar um `record`, o compilador gera automaticamente:

- Campos privados e imutáveis (`final`).
- Construtor com todos os parâmetros.
- Métodos de leitura (_getters_ sem o prefixo `get`).
- Métodos `equals()`, `hashCode()` e `toString()` baseados no valor de todos os
  componentes.

```java
// Declaração de um Record em linha única:
public record CustomerDto(String name, String email) {}

// Uso:
CustomerDto customer = new CustomerDto("Alice", "alice@email.com");

System.out.println(customer.name());  // Imprime "Alice"
System.out.println(customer.email()); // Imprime "alice@email.com"
System.out.println(customer);        // Imprime "CustomerDto[name=Alice, email=alice@email.com]"
```

### Construtor Compacto em Records

Você pode adicionar validações de invariantes em um Record utilizando o
**construtor compacto** (sem declarar a lista de parâmetros):

```java
public record CustomerDto(String name, String email) {
    // Construtor compacto para validação:
    public CustomerDto {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("O nome é obrigatório.");
        }
    }
}
```

## 6. O Trio Fundamental: `equals()`, `hashCode()` e `toString()`

Toda classe declarada em Java herda diretamente da classe `Object` três métodos
essenciais para o controle de identidade e comparação.

### 1. `toString()`

Retorna uma representação em texto (_String_) do objeto. Por padrão, o `Object`
retorna o nome da classe seguido do endereço hash em hexadecimal. É uma boa
prática sobrescrevê-lo para facilitar logs e depuração.

```java
@Override
public String toString() {
    return "BankAccount{number=" + number + ", balance=" + balance + "}";
}
```

### 2. `equals(Object obj)` — Igualdade Semântica vs. Identidade Física

Conforme visto no Módulo 2, o operador `==` compara a **identidade física** (se
ambos os ponteiros apontam para o mesmo endereço de memória na Heap).

O método `.equals()` serve para definir a **igualdade semântica** (se dois
objetos diferentes no Heap representam a mesma entidade do negócio):

```java
public class BankAccount {
    private int number;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true; // São exatamente a mesma referência em memória!
        if (o == null || getClass() != o.getClass()) return false; // Verifica se o objeto é nulo ou se é de uma classe diferente.
        BankAccount other = (BankAccount) o;
        return this.number == other.number; // Contas são semanticamente iguais se possuem o mesmo número!
    }
}
```

### 3. `hashCode()` — O Contrato de Coleções Hashing

Retorna um número inteiro de 32 bits derivado dos dados do objeto. É utilizado
por coleções de alto desempenho como `HashSet` e `HashMap` para organizar os
objetos em baldes de busca (_buckets_).

**A Regra de Ouro do Contrato `equals()` / `hashCode()`:**

> Se dois objetos são **iguais pelo método `equals()`**, eles **OBRIGATORIAMENTE
> precisam retornar exatamente o mesmo valor no `hashCode()`**.

Se você sobrescrever o `equals()` em uma classe, precisa obrigatoriamente
sobrescrever o `hashCode()` correspondente, caso contrário o objeto falhará
silenciosamente ao ser usado em coleções da API padrão:

```java
@Override
public int hashCode() {
    return Objects.hash(this.number); // Deve usar os mesmos campos usados no equals()!
}
```
