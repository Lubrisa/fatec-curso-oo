# 3. Mapeamento de Entidades com Anotações

No capítulo anterior, configuramos o arquivo `persistence.xml`.

Agora, precisamos instruir a JPA sobre como converter nossas classes Java em
tabelas e colunas no banco de dados. Isso é feito utilizando as **anotações de
mapeamento** da especificação JPA (localizadas no pacote
`jakarta.persistence.*`).

Neste capítulo, aprenderemos as principais anotações para mapear entidades,
chaves primárias, colunas, enums, datas modernas e atributos transitórios.

## A Anotação `@Entity` e o Construtor sem Argumentos

A anotação **`@Entity`** marca uma classe Java comum como uma **Entidade JPA**,
indicando que instâncias dessa classe terão seu ciclo de vida e estado
persistidos no banco de dados.

```java
import jakarta.persistence.Entity;

@Entity
public class Product {
    // ...
}
```

> **Registro no `persistence.xml`:**
>
> Lembre-se de que, em aplicações Java SE convencionais, é uma boa prática
> declarar explicitamente a entidade dentro da tag `<class>` no arquivo
> `persistence.xml` (ex.: `<class>br.com.fatec.model.Product</class>`),
> garantindo que a JPA e o Hibernate a reconheçam imediatamente na
> inicialização.

### O Requisito Obrigatório do Construtor Vazio

A especificação JPA exige que toda entidade possua um **construtor sem
argumentos** (_no-arg constructor_). O Hibernate utiliza esse construtor via
_Reflection_ para instanciar o objeto antes de preencher seus campos ao ler do
banco de dados.

> **Boa Prática de Encapsulamento:**
>
> Para evitar que outras partes da aplicação criem instâncias inválidas com
> campos nulos (`new Product()`), defina esse construtor como **`protected`**:

```java
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Double price;

    // Construtor sem argumentos protegido (para uso exclusivo da JPA/Hibernate):
    protected Product() {}

    // Construtor público para uso da aplicação com validações:
    public Product(String name, Double price) {
        this.name = name;
        this.price = price;
    }
}
```

## Mapeando a Tabela com `@Table`

Por padrão, a JPA assume que o nome da tabela no banco de dados é idêntico ao
nome da classe Java (ex: classe `Product` mapeia para tabela `Product`).

Com a anotação **`@Table`**, podemos personalizar o nome da tabela e definir o
**schema** (esquema) do banco de dados:

```java
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_products", schema = "vendas")
public class Product {
    // ...
}
```

> **Parâmetro `schema` e o SQLite:**
>
> Bancos de dados corporativos (como PostgreSQL, Oracle e SQL Server) utilizam
> **schemas** para organizar e agrupar tabelas em diferentes áreas de negócio
> (ex.: `vendas.tb_products`, `financeiro.tb_contas`).
>
> Embora o SQLite não utilize schemas (armazenando tudo no esquema padrão
> `main`), conhecer o atributo `schema` é essencial para quando você trabalhar
> com outros SGBDs em ambientes profissionais.

## Identificador e Chave Primária (`@Id`)

Toda entidade JPA **deve obrigatoriamente possuir uma chave primária**, marcada
com a anotação **`@Id`**.

> **Por que usar `Long` (Wrapper) em vez de `long` (Primitivo)?**
>
> Em entidades JPA, preferimos o tipo objeto `Long` para o identificador. Isso
> permite que uma entidade recém-criada em memória tenha `id == null`,
> sinalizando de forma clara e inequívoca para a JPA que ela ainda **não foi
> persistida** no banco de dados. Um tipo primitivo `long` teria valor padrão
> `0L`, o que poderia ser confundido com um ID existente.

Existem diferentes cenários para a geração da chave primária:

### 1. Autoincremento Sequencial (`GenerationType.IDENTITY`)

Para números inteiros sequenciais gerados pelo próprio motor do banco de dados
(como `INTEGER PRIMARY KEY` no SQLite, `AUTO_INCREMENT` no MySQL ou `IDENTITY`
no PostgreSQL):

```java
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

### 2. Identificadores Universais com UUID (`GenerationType.UUID`)

Em sistemas distribuídos, microsserviços e APIs públicas, o uso de
identificadores sequenciais (`1, 2, 3...`) pode expor métricas de negócio ou
sofrer com colisões ao sincronizar múltiplos bancos. Nesses casos, o padrão da
indústria é utilizar **UUIDs** (_Universally Unique Identifiers_).

Desde a JPA 3.1 e Hibernate 6, a geração automática de UUIDs é suportada
diretamente pela estratégia `GenerationType.UUID`:

```java
import java.util.UUID;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Id
@GeneratedValue(strategy = GenerationType.UUID)
private UUID id;
```

> O Hibernate e os dialetos de banco compatíveis geram um valor de 128 bits
> aleatório e estatisticamente único (ex.:
> `550e8400-e29b-41d4-a716-446655440000`) no momento da persistência.

### 3. Identificadores Atribuídos pela Aplicação (Chaves Naturais ou Manuais)

Quando o identificador não deve ser gerado pelo banco de dados nem pelo provedor
JPA, mas sim **fornecido diretamente pela regra de negócio da aplicação** (como
um código SKU, CPF, sigla de estado ou um identificador externo):

Basta declarar a anotação **`@Id` sem `@GeneratedValue`**. Nesse cenário, a JPA
exigirá que sua aplicação defina o valor do atributo antes de chamar o método
`em.persist()`:

```java
import jakarta.persistence.Id;

@Id
private String code; // Ex: "PROD-2026-X" ou "SP" atribuído no construtor
```

> **Geração de UUID pela própria aplicação:**
>
> Caso você queira que a própria classe Java gere seu identificador antes de
> salvar (sem depender do provedor JPA), você também pode combinar o `@Id`
> manual com a biblioteca padrão do Java:
>
> ```java
> @Id
> private String id = UUID.randomUUID().toString();
> ```

### 4. Chaves Primárias Compostas (`@EmbeddedId` e `@Embeddable`)

Quando a chave primária de uma tabela é composta por **dois ou mais campos**
(como em tabelas associativas ou entidades com chaves naturais compostas):

1. Criamos um tipo auxiliar anotado com **`@Embeddable`** que encapsula os
   campos da chave e implementa a interface `Serializable`:

   ```java
   import java.io.Serializable;
   import jakarta.persistence.Embeddable;

   @Embeddable
   public record OrderItemId(Long orderId, Long productId) implements Serializable {}
   ```

2. Na entidade principal, utilizamos a anotação **`@EmbeddedId`**:

   ```java
   import jakarta.persistence.Entity;
   import jakarta.persistence.EmbeddedId;
   import jakarta.persistence.Table;

   @Entity
   @Table(name = "order_items")
   public class OrderItem {
       @EmbeddedId
       private OrderItemId id;

       private Integer quantity;
       private Double unitPrice;

       // ...
   }
   ```

> **Suporte a Records no Hibernate 6 vs Versões Legadas:**
>
> O uso de Java Records como `@Embeddable` é um recurso nativo introduzido a
> partir do **Hibernate 6**.
>
> Em versões mais antigas do Hibernate (Hibernate 5.x) ou outros provedores
> JPA que exigem classes tradicionais, você precisaria escrever uma classe
> comum sobrescrevendo `equals()` e `hashCode()` manualmente — ou utilizar as
> anotações do [Lombok](../lombok/01-fundamentos-e-setup.md) (`@Getter`,
> `@EqualsAndHashCode`, `@NoArgsConstructor`, `@AllArgsConstructor`) para
> gerar esse código automaticamente.

## Customizando Colunas com `@Column`

Se nenhum ajuste for necessário, os atributos da classe serão mapeados
automaticamente para colunas com o mesmo nome.

Porém, com a anotação **`@Column`**, podemos personalizar nomes e adicionar
regras de integridade relacional:

```java
import jakarta.persistence.Column;

@Column(name = "product_name", nullable = false, length = 120, unique = true)
private String name;

@Column(name = "unit_price", nullable = false)
private Double price;
```

### Principais Parâmetros do `@Column`

- **`name`:** Define um nome customizado para a coluna no banco.
- **`nullable = false`:** Cria a coluna com a restrição `NOT NULL`.
- **`length = 120`:** Define o tamanho máximo para colunas de texto (padrão é
  `255`).
- **`unique = true`:** Adiciona uma restrição de unicidade (`UNIQUE`) na coluna.

## Mapeando Datas Modernas (`java.time`)

A JPA suporta nativamente os tipos da API moderna de data e hora do Java
(`java.time`), sem a necessidade de anotações adicionais:

- **`LocalDate`:** Apenas a data (mapeado para `DATE` em bancos comerciais).
- **`LocalDateTime`:** Data e hora completas (mapeado para `TIMESTAMP` em bancos
  comerciais).
- **`Instant`:** Ponto universal no tempo em UTC (mapeado para `TIMESTAMP WITH TIME ZONE`).

```java
import java.time.LocalDateTime;
import jakarta.persistence.Column;

@Column(name = "created_at", nullable = false)
private LocalDateTime createdAt = LocalDateTime.now();
```

> **Como o SQLite armazena datas?**
>
> O SQLite não possui um tipo de dados nativo de data. Por isso, o Hibernate
> armazena esses campos automaticamente como texto formatado em **ISO-8601**
> (ex.: `"2026-09-04 12:28:22"`).
>
> Essa é uma grande vantagem do ORM: o seu código Java permanece 100%
> padronizado e portável, enquanto o dialeto se encarrega das particularidades
> de cada banco de dados!

## Ignorando Atributos com `@Transient`

Se a sua classe possuir algum atributo auxiliar em memória ou calculado que
**não deve ser salvo no banco de dados**, utilize a anotação **`@Transient`**:

```java
import jakarta.persistence.Transient;

@Transient
private String temporaryToken; // O Hibernate ignorará este campo completamente
```

## Mapeando Enumerações com `@Enumerated`

Ao salvar um `enum` do Java no banco de dados, o comportamento padrão da JPA é
persistir a posição ordinal numérica do enum (`0, 1, 2...`).

> **O Perigo do `EnumType.ORDINAL`:**
>
> Se novos valores forem adicionados no início ou no meio do enum no futuro, as
> posições numéricas mudarão e todos os registros antigos no banco ficarão
> corrompidos!

**Regra de Ouro:** Sempre utilize **`@Enumerated(EnumType.STRING)`** para salvar
o valor textual do enum:

```java
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;

public enum ProductStatus {
    ACTIVE,
    OUT_OF_STOCK,
    DISCONTINUED
}

// Na entidade:
@Enumerated(EnumType.STRING)
@Column(name = "status", nullable = false)
private ProductStatus status = ProductStatus.ACTIVE;
```

## Exemplo Completo da Entidade Mapeada

Veja como fica a classe `Product` completa, bem encapsulada e pronta para uso:

```java
package br.com.fatec.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProductStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Construtor sem argumentos para o Hibernate:
    protected Product() {}

    // Construtor de conveniência para a aplicação:
    public Product(String name, Double price, Integer quantity) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Nome do produto é obrigatório.");
        }
        if (price == null || price < 0) {
            throw new IllegalArgumentException("Preço deve ser positivo.");
        }
        this.name = name;
        this.price = price;
        this.quantity = (quantity != null) ? quantity : 0;
        this.status = ProductStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
    }

    // Getters e métodos expressivos de domínio
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Double getPrice() {
        return price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void updatePrice(Double newPrice) {
        if (newPrice == null || newPrice < 0) {
            throw new IllegalArgumentException("O preço não pode ser negativo.");
        }
        this.price = newPrice;
    }

    public void sell(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser positiva.");
        }
        if (this.quantity < amount) {
            throw new IllegalStateException("Estoque insuficiente.");
        }
        this.quantity -= amount;
    }

    public void restock(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser positiva.");
        }
        this.quantity += amount;
    }
}
```

<details>
<summary>⚠️ <b>Dá para usar Lombok aqui? (Cuidados e Boas Práticas)</b></summary>

Se você utiliza ou pretende utilizar a biblioteca
[Lombok](../lombok/01-fundamentos-e-setup.md) para reduzir código repetitivo, é
comum a tentação de colocar a anotação agregadora `@Data` em cima de uma
entidade JPA. **Evite fazer isso!**

1. **`@Data` gera `equals()` e `hashCode()` usando todos os campos:** Entidades
   JPA que ainda não foram salvas possuem `id == null`. Se você colocá-las em um
   `HashSet` ou `HashMap`, o comportamento será imprevisível quando o ID for
   atribuído após o `persist`.
2. **`@Data` gera `toString()` completo:** Em entidades com relacionamentos
   bidirecionais (como pedidos e itens), o `toString()` causará chamadas
   recursivas infinitas, estourando a memória com `StackOverflowError`.
3. **`@Data` gera setters públicos para tudo:** Quebra o encapsulamento de
   invariantes de negócio (como permitir alterar um ID ou definir um saldo sem
   passar por validações).

**Combinação segura recomendada com Lombok:**

```java
@Entity
@Table(name = "products")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product {
    // Mantém construtores de negócio e métodos de domínio manuais
}
```

</details>

---

<a href="02-configuracao-persistence-xml.md">← Configuração do
persistence.xml</a>

<p align="right"><a href="04-entity-manager-e-operacoes-crud.md">Próximo: EntityManager e Operações CRUD →</a></p>
