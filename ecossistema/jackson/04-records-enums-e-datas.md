# 4. Records, Enums e Datas no Jackson

Nos capítulos anteriores, vimos como o Jackson manipula classes Java
tradicionais (com _getters_, _setters_ e construtores) e como personalizar o
mapeamento com anotações fundamentais.

No Java moderno, no entanto, o sistema de tipos oferece recursos muito mais
expressivos para representar dados:

- **Java Records:** O padrão da linguagem para dados e DTOs imutáveis.
- **Enums:** Para representar estados, categorias e opções de forma segura.
- **API `java.time`:** Para manipulação moderna de datas e horários
  (`LocalDate`, `LocalDateTime`, `Instant`).
- **Herança e Polimorfismo:** Para manipular estruturas que possuem tipos
  derivados em uma mesma coleção ou resposta.

Neste capítulo, aprenderemos como o Jackson lida de forma nativa e elegante com
cada uma dessas estruturas.

## 1. Java Records e Imutabilidade

Introduzidos como recurso definitivo no Java 16/17, os **_Records_** são a forma
mais concisa e elegante de criar classes focadas exclusivamente em carregar
dados imutáveis (DTOs).

Desde a versão 2.12, o Jackson oferece **suporte nativo e automático a
_Records_**.

### A Grande Vantagem sobre Classes Tradicionais

Com classes normais, o Jackson precisa obrigatoriamente de:

- Um construtor sem argumentos.
- Métodos _setters_ (ou acesso reflexivo) para preencher cada campo após a
  instanciação.

Com _Records_, **nada disso é necessário**:

- O Jackson identifica automaticamente os componentes do _Record_.
- A desserialização utiliza o **construtor canônico**, instanciando o objeto já
  completamente preenchido e imutável de uma só vez.

### Exemplo Prático com Record

```java
import com.fasterxml.jackson.annotation.JsonProperty;

public record ProductDTO(
    @JsonProperty("product_id") Long id,
    @JsonProperty("product_name") String name,
    double price
) {}
```

Podemos serializar e desserializar normalmente:

```java
String json = """
{
  "product_id": 10,
  "product_name": "Monitor Ultrawide",
  "price": 1800.0
}
""";

// Desserialização direta para Record:
ProductDTO prod = mapper.readValue(json, ProductDTO.class);

System.out.println("%s -> R$ %.2f".formatted(prod.name(), prod.price()));
// Saída: Monitor Ultrawide -> R$ 1800.00
```

> **Por que preferir Records para DTOs?**
>
> Além de eliminar todo o código repetitivo (_boilerplate_) de _getters_,
> _setters_, `equals`, `hashCode` e `toString`, os _Records_ garantem que os
> dados recebidos via JSON **não serão modificados acidentalmente** durante o
> fluxo da aplicação, garantindo imutabilidade real.

## 2. Trabalhando com Enums

Os _Enums_ em Java são tipos especiais que representam um conjunto fixo de
constantes.

### Comportamento Padrão

Por padrão, o Jackson serializa e desserializa _Enums_ utilizando o **nome exato
da constante**:

```java
public enum OrderStatus {
    PENDING,
    PAID,
    CANCELED
}
```

- `OrderStatus.PAID` $\rightarrow$ JSON: `"PAID"`
- JSON `"PAID"` $\rightarrow$ `OrderStatus.PAID`

### Personalizando Valores com `@JsonValue`

Em muitas integrações, o JSON precisa trafegar valores em minúsculo, com hífens
ou com nomes amigáveis (ex: `"em_processamento"` em vez de `"IN_PROGRESS"`).

Para definir qual valor deve ser usado na conversão, anotamos o método de
leitura com **`@JsonValue`**:

```java
import com.fasterxml.jackson.annotation.JsonValue;

public enum OrderStatus {
    PENDING("pendente"),
    PAID("pago"),
    CANCELED("cancelado");

    private final String description;

    OrderStatus(String description) {
        this.description = description;
    }

    // O Jackson usará o retorno deste método tanto na serialização quanto na desserialização:
    @JsonValue
    public String getDescription() {
        return description;
    }
}
```

Com essa anotação:

- `OrderStatus.PAID` $\rightarrow$ JSON: `"pago"`
- JSON `"pago"` $\rightarrow$ `OrderStatus.PAID`

### Personalizando Constantes Específicas com `@JsonProperty`

Se o enum não possuir atributos internos e você quiser apenas renomear uma
constante específica no JSON:

```java
import com.fasterxml.jackson.annotation.JsonProperty;

public enum Priority {
    @JsonProperty("baixa")
    LOW,

    @JsonProperty("media")
    MEDIUM,

    @JsonProperty("alta")
    HIGH
}
```

## 3. Datas Modernas com a API `java.time`

Antes do Java 8, a manipulação de datas com `java.util.Date` e `Calendar` era
propensa a erros. O Java moderno introduziu o pacote **`java.time`**
(`LocalDate`, `LocalDateTime`, `Instant`).

### Configurando o Suporte a Datas no `ObjectMapper`

Para manipular tipos do `java.time` corretamente, registramos o módulo
**`JavaTimeModule`** no nosso `ObjectMapper`:

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

ObjectMapper mapper = new ObjectMapper();

// 1. Registra o suporte aos tipos java.time:
mapper.registerModule(new JavaTimeModule());

// 2. Impede que datas sejam serializadas como timestamps numéricos:
mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
```

> **Dependência Maven:**
>
> Se estiver utilizando o pacote `jackson-databind` em versões modernas, o
> `JavaTimeModule` (artefato `jackson-datatype-jsr310`) já vem incluído como
> dependência transitiva automática.

### Formatando Datas com `@JsonFormat`

Podemos formatar a representação em texto das datas diretamente nos atributos do
objeto ou _Record_ com a anotação **`@JsonFormat`**:

```java
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record EventDTO(
    String title,

    // Formato dia/mês/ano:
    @JsonFormat(pattern = "dd/MM/yyyy")
    LocalDate date,

    // Formato completo com data e hora:
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    LocalDateTime createdAt
) {}
```

Ao serializar um evento:

```java
EventDTO event = new EventDTO(
    "Workshop de Java",
    LocalDate.of(2026, 9, 15),
    LocalDateTime.of(2026, 9, 4, 14, 30, 0)
);

String json = mapper.writeValueAsString(event);
System.out.println(json);
```

Saída no JSON:

```json
{
  "title": "Workshop de Java",
  "date": "15/09/2026",
  "createdAt": "04/09/2026 14:30:00"
}
```

## 4. Herança e Polimorfismo no JSON

No paradigma orientado a objetos, utilizamos **polimorfismo** e **herança** para
representar variações de um mesmo conceito (ex: uma classe base abstrata
`Payment` com subclasses `PixPayment` e `CreditCardPayment`).

### O Desafio

O formato JSON é puramente estrutural e **não possui conceito nativo de
herança**. Se recebermos o JSON:

```json
{
  "amount": 250.0,
  "pixKey": "contato@email.com"
}
```

Ao pedir para o Jackson desserializar como `Payment.class`, ele não sabe se deve
instanciar um `PixPayment`, um `CreditCardPayment` ou outra subclasse.

### A Solução: Campo Discriminador (`@JsonTypeInfo` e `@JsonSubTypes`)

Para resolver isso, instruímos o Jackson a incluir uma propriedade no JSON que
funciona como um **discriminador de tipo** (geralmente uma chave chamada
`"type"`):

```java
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

// 1. Define que usaremos uma propriedade chamada "type" para identificar a classe:
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
// 2. Mapeia cada valor do "type" para a sua respectiva subclasse Java:
@JsonSubTypes({
    @JsonSubTypes.Type(value = PixPayment.class, name = "PIX"),
    @JsonSubTypes.Type(value = CreditCardPayment.class, name = "CREDIT_CARD")
})
public abstract class Payment {
    private double amount;

    protected Payment() {}

    public Payment(double amount) {
        this.amount = amount;
    }

    public double getAmount() {
        return amount;
    }
}
```

Agora definimos as subclasses concretas:

```java
public class PixPayment extends Payment {
    private String pixKey;

    protected PixPayment() {}

    public PixPayment(double amount, String pixKey) {
        super(amount);
        this.pixKey = pixKey;
    }

    public String getPixKey() {
        return pixKey;
    }
}
```

```java
public class CreditCardPayment extends Payment {
    private String cardNumber;
    private int installments;

    protected CreditCardPayment() {}

    public CreditCardPayment(double amount, String cardNumber, int installments) {
        super(amount);
        this.cardNumber = cardNumber;
        this.installments = installments;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public int getInstallments() {
        return installments;
    }
}
```

### Funcionamento na Prática

#### 1. Na Serialização

O Jackson insere automaticamente a chave `"type"` correspondente no JSON:

```java
Payment pagamento = new PixPayment(150.0, "chave-pix-123");
String json = mapper.writeValueAsString(pagamento);

System.out.println(json);
// Saída: {"type":"PIX","amount":150.0,"pixKey":"chave-pix-123"}
```

#### 2. Na Desserialização

Ao ler a chave `"type": "PIX"`, o Jackson descobre qual subclasse instanciar:

```java
String jsonEntrada = """
{
  "type": "PIX",
  "amount": 300.0,
  "pixKey": "financeiro@empresa.com"
}
""";

Payment p = mapper.readValue(jsonEntrada, Payment.class);

if (p instanceof PixPayment pix) {
    System.out.println("Pagamento via PIX para a chave: " + pix.getPixKey());
}
```

## Tabela Resumo do Capítulo

| Recurso / Anotação                    | Finalidade Principal                                                             |
| :------------------------------------ | :------------------------------------------------------------------------------- |
| **Java Records**                      | DTOs imutáveis com suporte nativo (dispensa _setters_ e construtor sem args).    |
| **`@JsonValue`**                      | Define um método/campo customizado como a representação do Enum no JSON.         |
| **`JavaTimeModule`**                  | Módulo do Jackson para habilitar serialização dos tipos modernos de `java.time`. |
| **`@JsonFormat(pattern = "...")`**    | Define a máscara de formatação para datas e horas no JSON.                       |
| **`@JsonTypeInfo` / `@JsonSubTypes`** | Habilita polimorfismo via campo discriminador (`"type"`).                        |

---

<a href="03-anotacoes-essenciais.md">← Anotações Essenciais do Jackson</a>

<p align="right"><a href="05-integracoes-e-ecossistema.md">Próximo: Jackson no Ecossistema: Lombok e Spring Boot →</a></p>
