# 05. Aplicando os Pilares da Orientação a Objetos em Java

Guia prático sobre como os quatro pilares da Orientação a Objetos
(Encapsulamento, Abstração, Herança e Polimorfismo) se materializam na sintaxe e
nas regras da linguagem Java.

## 1. Pilar 1: Encapsulamento e Proteção de Invariantes

Conforme visto no Módulo 5, o Encapsulamento não é a mera criação de `getters` e
`setters`, mas sim a imposição de uma **fronteira de proteção para garantir as
invariantes do objeto**.

### Modificadores de Acesso

O Java oferece quatro níveis de visibilidade:

| Modificador                   | Própria Classe | Mesmo Pacote | Subclasses | Qualquer Lugar |
| :---------------------------- | :------------: | :----------: | :--------: | :------------: |
| `private`                     |    **Sim**     |     Não      |    Não     |      Não       |
| _(package-private)_ (Default) |    **Sim**     |   **Sim**    |    Não     |      Não       |
| `protected`                   |    **Sim**     |   **Sim**    |  **Sim**   |      Não       |
| `public`                      |    **Sim**     |   **Sim**    |  **Sim**   |    **Sim**     |

- **`private`:** Nível máximo de proteção. Escolha padrão absoluta para todos os
  atributos que compõem o estado do objeto.
- **`package-private` (Sem palavra-chave):** Visível por qualquer classe situada
  no mesmo pacote. É o nível de acessibilidade de membros sem um modificador de
  acesso na sua declaração.
- **`protected`:** Visível no pacote e para subclasses.

  _Atenção:_ Expor atributos como `protected` quebra o encapsulamento em relação
  às subclasses; prefira usar `protected` apenas para métodos de extensão
  (_Template Method_).

- **`public`:** Livre acesso global. Deve ser reservado apenas para os métodos
  da interface pública do objeto.

### O Princípio _Tell, Don't Ask_ (Diga, Não Pergunte)

Em vez de usar `getters` e `setters` anêmicos para "perguntar" os dados ao
objeto, fazer o cálculo do lado de fora e injetar o valor de volta, informe a
intenção de negócio ao próprio objeto (`Tell`). O próprio objeto é o guardião
responsável por validar suas regras e atualizar seu estado interno:

```java
// RUIM (Modelo Anêmico / Procedural):
// O código externo pergunta os dados, calcula fora e viola a autonomia do objeto
if (acc.getBalance() >= 100.0) {
    acc.setBalance(acc.getBalance() - 100.0);
}

// BOM (Modelo Encapsulado Rico / OO):
// Expressamos a intenção de negócio; o próprio objeto valida o saldo e atualiza o estado
acc.withdraw(100.0);
```

### Vazamento de Referências (_Leaky Encapsulation_)

O modificador `private` protege o campo, mas **não protege a referência apontada
no Heap**. Se uma classe recebe ou devolve a referência direta de um **objeto ou
coleção mutável**, o código externo ganha a capacidade de alterar o estado
interno do objeto por fora, buraqueando o encapsulamento sem passar pelos
métodos da classe.

```java
// VULNERÁVEL: Vazamento de referência de um objeto mutável (Date)
public class EventPeriod {
    private Date startDate; // Date é um objeto MUTÁVEL em Java

    public EventPeriod(Date startDate) {
        this.startDate = startDate; // Guarda a referência física recebida de fora!
    }

    public Date getStartDate() {
        return this.startDate; // Devolve a referência física direta da Heap!
    }
}

// O código externo pode alterar o objeto internamente por fora:
EventPeriod event = new EventPeriod(myDate);
event.getStartDate().setTime(0L); // Corrompeu o estado do evento sem usar a classe!
```

#### Como Prevenir o Vazamento de Referências

Para proteger o estado contra alterações indevidas em objetos mutáveis e
coleções, utilizamos duas estratégias:

1. **Cópias Defensivas (_Defensive Copies_):**

   Cria uma nova instância independente no Heap durante a construção ou no
   retorno do método:

   ```java
   // SEGURO: Cópia defensiva no construtor e no getter
   public EventPeriod(Date startDate) {
       this.startDate = new Date(startDate.getTime()); // Nova instância isolada
   }

   public Date getStartDate() {
       return new Date(this.startDate.getTime()); // Devolve uma nova cópia isolada
   }
   ```

2. **Visões Não-Modificáveis (_Unmodifiable Views_):**

   Ideal para coleções. Retorna um _wrapper_ imutável que dispara uma exceção se
   o código externo tentar chamar métodos de escrita como `.add()` ou
   `.clear()`:

   ```java
   public class CustomerOrder {
       private final List<String> items = new ArrayList<>();

       // SEGURO: Devolve uma visão somente-leitura da lista interna
       public List<String> getItems() {
           return Collections.unmodifiableList(this.items);
       }
   }
   ```

#### Por que Objetos Imutáveis são Imunes ao Vazamento de Referência?

É importante ressaltar que o vazamento de referências **só ocorre com objetos
mutáveis** (que possuem métodos que alteram seu estado interno depois de
criados).

Se o objeto referenciado for **imutável por design** (como `String`,
`BigDecimal`, `Integer`, tipos da API `java.time.*` como `LocalDate`, ou
`Records`), **não há qualquer risco em compartilhar sua referência
diretamente**. Como o estado desses objetos não pode ser modificado após o
nascimento, o código externo não consegue corromper o estado da sua classe,
tornando desnecessário o uso de cópias defensivas:

```java
public class UserProfile {
    private final String username;     // String é imutável!
    private final LocalDate birthDate; // LocalDate é imutável!

    public UserProfile(String username, LocalDate birthDate) {
        // Totalmente seguro atribuir e retornar referências diretamente:
        this.username = username;
        this.birthDate = birthDate;
    }

    public LocalDate getBirthDate() {
        return this.birthDate; // Não precisa de cópia defensiva!
    }
}
```

## 2. Pilar 2: Abstração e Contratos (`interface` e `abstract class`)

A Abstração filtra os detalhes de execução e expõe apenas os comportamentos
essenciais para quem consome o objeto.

### Interfaces (`interface`)

Servem para definir **contratos puros de comunicação ou capacidade** ("o que
sabe fazer"), sem vínculo com estado interno do objeto.

```java
public interface PaymentGateway {
    // Método abstrato público (implicitamente public e abstract)
    void processPayment(double amount);

    // Default Method (Java Moderno): Fornece comportamento padrão opcional
    default void logTransaction(double amount) {
        System.out.println("Processando transação de: " + amount);
    }
}
```

#### Implementando Interfaces (`implements`)

Para que uma classe assine e cumpra o contrato definido por uma interface,
utiliza-se a palavra-chave **`implements`**. A classe é obrigada a fornecer uma
implementação concreta para todos os métodos abstratos previstos no contrato.

Diferente da herança de classes (`extends`), na qual o Java permite herdar de
apenas uma única superclasse, **uma classe pode implementar múltiplas interfaces
simultaneamente**, permitindo que o mesmo objeto assuma múltiplos papéis no
sistema:

```java
public interface Printable {
    void print();
}

public interface Exportable {
    void exportToFile(String fileName);
}

// Implementando múltiplas interfaces separadas por vírgula:
public class InvoiceReport implements Printable, Exportable {

    @Override
    public void print() {
        System.out.println("Imprimindo nota fiscal...");
    }

    @Override
    public void exportToFile(String fileName) {
        System.out.println("Exportando relatório para " + fileName);
    }
}
```

### Classes Abstratas (`abstract`)

Estruturas híbridas que definem contratos parciais e permitem **compartilhar
código, estado interno ou orquestrar a estrutura fixa de um algoritmo**
(_Template Method_). Não podem ser instanciadas diretamente com `new`.

```java
public abstract class FileExporter {

    // Método concreto que orquestra o fluxo (Template Method)
    public final void export(String content) {
        validate(content);
        String data = formatData(content); // Ponto de extensão abstrato!
        save(data);
    }

    private void validate(String content) {
        if (content == null || content.isBlank()) throw new IllegalArgumentException("Conteúdo inválido.");
    }

    private void save(String data) {
        System.out.println("Gravando no disco: " + data);
    }

    // Contrato parcial: Subclasses são OBRIGADAS a definir como formatam os dados
    protected abstract String formatData(String rawContent);
}
```

## 3. Reutilização de Código: Herança (`extends`) vs. Composição (`HAS-A`)

### Herança de Classe (`extends`)

Mecanismo de reutilização baseado na relação estática "É-Um" (_IS-A_).

```java
// Herdando características da classe Account com a palavra-chave 'extends'
public class SavingsAccount extends Account {
    private double interestRate;

    public SavingsAccount(String number, double initialBalance, double interestRate) {
        super(number, initialBalance); // A linguagem nos obriga a chamar o
        // construtor da superclasse no início do construtor da subclasse

        this.interestRate = interestRate;
    }

    public void applyInterest() {
        this.balance += this.balance * this.interestRate; // 'balance' herdado da superclasse
    }
}
```

#### Impedindo a Herança ou Sobrescrita (`final`)

- **`public final class BankAccount`:** A classe não pode ser herdada por
  nenhuma outra classe.
- **`public final void deposit()`:** O método não pode ser sobrescrito por
  NENHUMA subclasse.

#### O Perigo da Herança e o Princípio de Liskov (LSP)

Conforme visto no Módulo 7, a herança cria um acoplamento rígido de tempo de
compilação (_Problema da Classe Base Frágil_). Se uma subclasse precisa
desativar métodos do pai lançando exceções (ex:
`UnsupportedOperationException`), a herança é ilegítima e viola o Princípio da
Substituição de Liskov (LSP).

### Favorecendo a Composição por Delegação

Substitui o vínculo rígido _IS-A_ pela relação flexível **"Tem-Um" (_HAS-A_)**.
O objeto guarda uma referência para uma abstração e delega o trabalho a ela em
tempo de execução:

```java
// Em vez de herdar de uma classe concreta de lista, decoramos a interface via composição:
public class CountableList<E> implements List<E> {
    private final List<E> internalList; // Relacionamento HAS-A (Composição)
    private int count = 0;

    public CountableList(List<E> list) {
        this.internalList = list;
    }

    @Override
    public boolean add(E element) {
        this.count++;
        return internalList.add(element); // Delegação limpa
    }

    // ... delega os demais métodos da interface List para internalList
}
```

## 4. Pilar 4: Polimorfismo e Despacho Dinâmico

O Polimorfismo de Subtipagem permite tratar implementações diferentes por meio
do mesmo contrato abstrato, respeitando o **Princípio Aberto/Fechado (OCP)**.

### Sobrecarga (_Overloading_) vs. Sobrescrita (_Overriding_)

- **Sobrecarga (_Ad-hoc_):** Métodos com o mesmo nome e assinaturas de
  parâmetros diferentes na mesma classe. É resolvida em tempo de **compilação**
  (_Static Binding_).

  ```java
  public void print(String text) { ... }
  public void print(String text, int copies) { ... }
  ```

- **Sobrescrita (_Subtipagem_):** Uma subclasse/implementação fornece sua
  própria versão para um método já declarado pela abstração. É resolvida em
  tempo de **execução** (_Late Binding / Dynamic Binding_).

  ```java
  @Override // Anotação recomendada (não obrigatória pelo compilador, mas essencial na prática)
  public void processPayment(double amount) {
      // Regra específica da implementação
  }
  ```

### Invocação Polimórfica Uniforme

O código cliente depende apenas da abstração. O runtime do Java inspeciona a
instância atribuída a variável e despacha a execução para a VTable correta:

```java
public class OrderProcessor {
    private final PaymentGateway gateway; // Depende da Abstração (Inversão de Dependência)

    public OrderProcessor(PaymentGateway gateway) {
        this.gateway = gateway;
    }

    public void process(Order order) {
        // Invocação Polimórfica: Não importa se é Stripe, PayPal ou Pix!
        this.gateway.processPayment(order.getTotalAmount());
    }
}
```

### Conversão de Tipos Polimórficos (Upcasting vs. Downcasting)

- **Upcasting (Automático e Seguro):** Trata uma instância concreta como sua
  abstração (ex: `PaymentGateway g = new StripeGateway();`).
- **Downcasting (Manual e Arriscado):** Converte uma abstração de volta para o
  tipo concreto. Utilize sempre o **Pattern Matching para `instanceof`** para
  garantir uma conversão segura:

```java
PaymentGateway gateway = getGatewayFromConfig();

// Downcasting seguro com Pattern Matching (Java 16+):
if (gateway instanceof StripeGateway stripe) {
    stripe.executeStripeSpecificRefund(); // 'stripe' já está convertida e pronta para uso!
}
```
