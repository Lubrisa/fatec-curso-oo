# 3. Mapeamento de Entidades com Anotações

No capítulo anterior, configuramos o arquivo `persistence.xml`.

Agora, precisamos instruir a JPA sobre como converter nossas classes Java em
tabelas e colunas no banco de dados. Isso é feito utilizando as **anotações de
mapeamento** da especificação JPA (localizadas no pacote
`jakarta.persistence.*`).

Neste capítulo, aprenderemos as principais anotações para mapear entidades,
chaves primárias, colunas, enums e atributos transitórios.

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
    private double price;

    // Construtor sem argumentos protegido (para uso exclusivo da JPA/Hibernate):
    protected Product() {}

    // Construtor público para uso da aplicação:
    public Product(String name, double price) {
        this.name = name;
        this.price = price;
    }
}
```

## Mapeando a Tabela com `@Table`

Por padrão, a JPA assume que o nome da tabela no banco de dados é idêntico ao
nome da classe Java (ex: classe `Product` mapeia para tabela `Product`).

Se você quiser customizar o nome da tabela (ou seguir convenções corporativas),
utilize a anotação **`@Table`**:

```java
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_products")
public class Product {
    // ...
}
```

## Identificador e Chave Primária

Toda entidade JPA **deve obrigatoriamente possuir uma chave primária**, marcada
com a anotação **`@Id`**.

Existem diferentes cenários para a definição da chave primária:

### 1. Autoincremento pelo Banco (`GenerationType.IDENTITY`)

Para números inteiros sequenciais gerados pelo próprio banco de dados (como
`INTEGER PRIMARY KEY` no SQLite, `AUTO_INCREMENT` no MySQL ou `SERIAL`/`IDENTITY`
no PostgreSQL):

```java
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

### 2. Chaves Geradas pela Aplicação e UUIDs

Quando o identificador não é gerado pelo autoincremento do banco, mas sim
fornecido pela própria aplicação (como um CPF, código de barras) ou um **UUID**:

- **UUID Automático (JPA 3.1 / Hibernate 6):**

  ```java
  import java.util.UUID;
  import jakarta.persistence.Id;
  import jakarta.persistence.GeneratedValue;
  import jakarta.persistence.GenerationType;

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;
  ```

- **Chave Atribuída Manualmente pela Aplicação:**  
  Basta omitir a anotação `@GeneratedValue`. O JPA exigirá que você defina o
  valor do `@Id` antes de salvar:

  ```java
  @Id
  private String code; // Ex: "PROD-2026-X" definido manualmente no construtor
  ```

### 3. Chaves Primárias Compostas (`@EmbeddedId` e `@Embeddable`)

Quando a chave primária de uma tabela é composta por **dois ou mais campos**
(como em tabelas associativas):

1. Criamos uma classe auxiliar que encapsula os campos da chave, anotada com
   **`@Embeddable`** (ela deve implementar `Serializable` e sobrescrever
   `equals` e `hashCode`):

   ```java
   import java.io.Serializable;
   import java.util.Objects;
   import jakarta.persistence.Embeddable;

   @Embeddable
   public class OrderItemId implements Serializable {
       private Long orderId;
       private Long productId;

       public OrderItemId() {}
       public OrderItemId(Long orderId, Long productId) {
           this.orderId = orderId;
           this.productId = productId;
       }

       // equals e hashCode obrigatórios para chaves compostas:
       @Override
       public boolean equals(Object o) {
           if (this == o) return true;
           if (o == null || getClass() != o.getClass()) return false;
           OrderItemId that = (OrderItemId) o;
           return Objects.equals(orderId, that.orderId) && Objects.equals(productId, that.productId);
       }

       @Override
       public int hashCode() {
           return Objects.hash(orderId, productId);
       }
   }
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

## Customizando Colunas com `@Column`

Se nenhum ajuste for necessário, os atributos da classe serão mapeados
automaticamente para colunas com o mesmo nome.

Porém, com a anotação **`@Column`**, podemos personalizar nomes e adicionar
regras de integridade:

```java
import jakarta.persistence.Column;

@Column(name = "product_name", nullable = false, length = 120, unique = true)
private String name;

@Column(nullable = false)
private Double price;
```

### Principais Parâmetros do `@Column`

- **`name`:** Define um nome customizado para a coluna no banco.
- **`nullable = false`:** Cria a coluna com a restrição `NOT NULL`.
- **`length = 120`:** Define o tamanho máximo para colunas de texto (padrão é
  `255`).
- **`unique = true`:** Adiciona uma restrição de unicidade (`UNIQUE`) na coluna.

## Ignorando Atributos com `@Transient`

Se a sua classe possuir algum atributo auxiliar em memória ou calculado (como um
dado de sessão ou status temporário) que **não deve ser salvo no banco de
dados**, utilize a anotação **`@Transient`**:

```java
import jakarta.persistence.Transient;

@Transient
private String tempToken; // O Hibernate ignorará este campo completamente
```

## Mapeando Enumerações com `@Enumerated`

Ao salvar um `enum` do Java no banco de dados, o comportamento padrão da JPA é
persistir a posição ordinal do enum (`0, 1, 2...`).

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
@Column(nullable = false)
private ProductStatus status = ProductStatus.ACTIVE;
```

## Exemplo Completo da Entidade Mapeada

Veja como fica a classe `Product` completa e pronta para produção:

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

    // Construtor sem argumentos para o Hibernate:
    protected Product() {}

    // Construtor de conveniência para a aplicação:
    public Product(String name, Double price, Integer quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.status = ProductStatus.ACTIVE;
    }

    // Getters e métodos de domínio
    public Long getId() { return id; }

    public String getName() { return name; }

    public Double getPrice() { return price; }

    public Integer getQuantity() { return quantity; }

    public ProductStatus getStatus() { return status; }

    public void updatePrice(Double newPrice) {
        if (newPrice == null || newPrice < 0) {
            throw new IllegalArgumentException("O preço não pode ser negativo.");
        }
        this.price = newPrice;
    }
}
```

No próximo capítulo, aprenderemos a utilizar o **`EntityManager`** para realizar
as operações de inserção, busca, atualização e exclusão com essas entidades.

---

<a href="02-configuracao-persistence-xml.md">← Configuração do persistence.xml</a>

<p align="right"><a href="04-entity-manager-e-operacoes-crud.md">Próximo: EntityManager e Operações CRUD →</a></p>
