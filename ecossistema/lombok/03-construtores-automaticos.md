# 3. Construtores Automáticos

No capítulo anterior, vimos como o Lombok elimina o código repetitivo de métodos
de acesso, impressão e comparação.

Neste capítulo, vamos aprender a automatizar a criação de **construtores** com
diferentes finalidades e a aplicar boas práticas de encapsulamento para garantir
que nossos objetos sejam sempre instanciados em um estado válido.

## As Anotações de Construtor

Escrever construtores manualmente pode ser tedioso, especialmente quando uma
classe precisa de múltiplos construtores (um protegido para frameworks e outro
completo para inicialização pela aplicação).

O Lombok disponibiliza três anotações complementares para gerenciar
construtores:

### 1. Construtor Vazio (`@NoArgsConstructor`)

Gera um construtor sem nenhum parâmetro:

```java
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Client {
    private Long id;
    private String name;
}
```

O Lombok gera nos bastidores:

```java
protected Client() {
}
```

**Quando Usar:**

- **Exigência de Frameworks:** Muitas bibliotecas (como o Jackson para leitura
  de JSON e o Hibernate/JPA para bancos de dados) exigem obrigatoriamente um
  construtor sem argumentos para conseguir instanciar objetos e preencher seus
  dados automaticamente usando _reflection_.

> **Recomendação:** Use sempre `AccessLevel.PROTECTED` em conjunto com
> `@NoArgsConstructor`!
>
> Ao definir `access = AccessLevel.PROTECTED`, nós **satisfazemos a exigência
> dos frameworks** e, ao mesmo tempo, **protegemos nossa aplicação**, impedindo
> que outras partes do código criem instâncias vazias em estado incompleto ou
> inválido (`new Client()`).

### 2. Construtor Completo (`@AllArgsConstructor`)

Gera um construtor que recebe **todos os atributos** da classe na ordem exata em
que foram declarados:

```java
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class Client {
    private Long id;
    private String name;
    private String email;
}
```

O Lombok gera nos bastidores:

```java
public Client(Long id, String name, String email) {
    this.id = id;
    this.name = name;
    this.email = email;
}
```

**Quando Usar:**

- **Classes de Transferência de Dados (DTOs):** Ideal para classes cuja
  principal responsabilidade é transportar dados entre camadas sem carregar
  lógica de negócio ou necessidade de ocultar algum desses dados.
- **Base para Métodos de Fábrica Estáticos:** Como estudamos no [Capítulo de
  Construtores do módulo de OO](../../02-oo/04-construtores.md), métodos de
  fábrica estáticos são uma excelente prática para validar invariantes antes da
  instanciação. Combinar `@AllArgsConstructor(access = AccessLevel.PRIVATE)` com
  um método de fábrica manual é uma forma limpa de implementar esse padrão sem
  precisar escrever construtores privados na mão.

> **Dica de Design & Cuidados com Classes Inchadas:**
>
> Evite usar `@AllArgsConstructor` em classes com muitos atributos (ex: 8 ou 10
> campos). Construtores gigantes são desconfortáveis de usar e propensos a erros
> (como trocar a ordem de dois argumentos do mesmo tipo sem que o compilador
> perceba).
>
> Além disso, uma classe com tantos parâmetros quase sempre é um _code smell_
> (_Data Clumps_, em português _Aglutinação de Dados_), indicando que ela
> assumiu responsabilidades demais e que alguns de seus campos poderiam ser
> agrupados em tipos próprios (por exemplo, transformar `street`, `number`,
> `city` e `zipCode` em uma classe `Address`).

### 3. Construtor para Campos Obrigatórios (`@RequiredArgsConstructor`)

Gera um construtor que recebe **apenas os campos que obrigatoriamente precisam
de um valor inicial**:

- Campos marcados como `final` (que não podem ficar sem inicialização).
- Campos anotados com `@NonNull` do Lombok (que realizam verificação automática
  contra `null`).

```java
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class BankAccount {
    private final String accountNumber; // Obrigatório por ser final

    @NonNull
    private String owner; // Obrigatório por ser @NonNull

    private double balance; // Opcional (não entra no construtor)
}
```

O Lombok gera nos bastidores:

```java
public BankAccount(String accountNumber, String owner) {
    if (owner == null) {
        throw new NullPointerException("owner is marked non-null but is null");
    }
    this.accountNumber = accountNumber;
    this.owner = owner;
}
```

**Quando Usar:**

- **Injeção de Dependências:** É o padrão universal em classes de serviço,
  repositórios e controladores (como em aplicações com Spring ou Quarkus). Você
  declara as dependências como `private final UserRepository repository;` e o
  `@RequiredArgsConstructor` cria o construtor exato que o container de injeção
  precisa.
- **Domínios com Valores Padrão:** Quando uma classe possui campos obrigatórios
  para existir (como `accountNumber` e `owner`), mas outros atributos iniciam
  com valores padrão ou são calculados posteriormente (como `balance = 0.0`).

### Bússola de Decisão: Qual Construtor Escolher?

| Anotação                                     | O que Gera                                  | Quando Usar                                                                          |
| :------------------------------------------- | :------------------------------------------ | :----------------------------------------------------------------------------------- |
| **`@NoArgsConstructor(access = PROTECTED)`** | `protected ClassName() { }`                 | Entidades JPA/Hibernate e DTOs que serão lidos pelo Jackson.                         |
| **`@AllArgsConstructor`**                    | Construtor com todos os atributos           | DTOs e base para métodos estáticos privados.                                         |
| **`@RequiredArgsConstructor`**               | Construtor para campos `final` e `@NonNull` | Injeção de dependências em Services/Controllers e entidades com campos obrigatórios. |

## Integrando com Frameworks sem Perder o Encapsulamento

Ao desenvolver aplicações com frameworks como Hibernate/JPA ou Jackson, nos
deparamos com um dilema comum de arquitetura:

1. **O framework exige** um construtor sem argumentos (`@NoArgsConstructor`)
   para instanciar a classe via _reflection_.
2. **A regra de negócio exige** que novos objetos criados pelo código da
   aplicação sejam validados e contenham dados íntegros.

Como já discutimos anteriormente, se simplesmente adicionarmos um construtor
automático público em uma classe de domínio, abrimos uma brecha no
encapsulamento: qualquer código poderá instanciar objetos com dados inválidos
(como preços negativos ou nomes nulos), pois o Lombok não escreve validações.

Para resolver esse dilema com elegância, existem duas abordagens recomendadas:

### Abordagem 1: Construtor Manual com Validações

Colocamos a anotação `@NoArgsConstructor(access = AccessLevel.PROTECTED)` para
atender aos frameworks e escrevemos o construtor parametrizado explicitamente na
mão com as validações necessárias. O Lombok detecta o construtor manual e não
gera conflito:

```java
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 🔒 Frameworks usam nos bastidores
public class Product {
    private Long id;
    private String name;
    private double price;

    // Construtor público da aplicação com validações de negócio:
    public Product(Long id, String name, double price) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("O nome do produto não pode ser vazio");
        }
        if (price < 0) {
            throw new IllegalArgumentException("O preço não pode ser negativo: " + price);
        }
        this.id = id;
        this.name = name;
        this.price = price;
    }
}
```

```java
// O código da aplicação passa obrigatoriamente pelas validações:
Product prod = new Product(1L, "Teclado", 250.0); // ✅ Válido

// Instanciação vazia bloqueada para código externo:
// Product invalid = new Product(); // ❌ Erro de compilação fora do pacote/herança!
```

### Abordagem 2: Construtor Privado do Lombok + Método de Fábrica Estático

Se você prefere que o Lombok gere a atribuição mecânica dos campos, pode fechar
a visibilidade do construtor completo tornando-o **privado** (`access =
AccessLevel.PRIVATE`) e expor um **método de fábrica estático escrito
manualmente** com as validações:

```java
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 🔒 Usado por frameworks via reflection
@AllArgsConstructor(access = AccessLevel.PRIVATE)  // 🔒 Bloqueia new Money(...) direto
public class Money {

    private final double amount;
    private final String currency;

    // Método de fábrica estático público com validações:
    public static Money of(double amount, String currency) {
        if (amount < 0) {
            throw new IllegalArgumentException("O valor monetário não pode ser negativo: " + amount);
        }
        if (currency == null || currency.isBlank()) {
            throw new IllegalArgumentException("A moeda deve ser informada");
        }
        return new Money(amount, currency.toUpperCase());
    }
}
```

Dessa forma, o código cliente é forçado a passar pelas validações de negócio,
mas pulamos a cerimônia de escrever o construtor completo:

```java
Money price = Money.of(150.0, "BRL"); // ✅ Válido

Money invalid = Money.of(-50.0, "BRL"); // 💥 Lança IllegalArgumentException!
```

---

<a href="02-anotacoes-de-acesso-e-utilidades.md">← Anotações de Acesso e Utilidades</a>

<p align="right"><a href="04-anotacoes-agregadoras-data-e-value.md">Próximo: Anotações Agregadoras: @Data e @Value →</a></p>
