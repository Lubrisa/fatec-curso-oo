# 2. ObjectMapper e Operações Básicas

No capítulo anterior, compreendemos a estrutura do JSON e configuramos a
dependência do Jackson no `pom.xml`.

Agora, vamos aprender a realizar as duas operações fundamentais no dia a dia do
desenvolvimento:

- **Serialização:** Converter um objeto Java em texto ou arquivo JSON (_Object
  $\rightarrow$ JSON_).
- **Desserialização:** Converter um texto ou arquivo JSON de volta para um
  objeto Java (_JSON $\rightarrow$ Object_).

## 1. O Coração da Biblioteca: `ObjectMapper`

A classe **`ObjectMapper`** é o motor central do Jackson. Ela é responsável por
inspecionar as classes Java, ler a estrutura do JSON e realizar a conversão
automática entre os dois mundos.

```java
import com.fasterxml.jackson.databind.ObjectMapper;

public class Main {
    public static void main(String[] args) {
        ObjectMapper mapper = new ObjectMapper();
        // Pronto para serializar e desserializar!
    }
}
```

> **Boa Prática: Ciclo de Vida do `ObjectMapper`**
>
> Criar uma instância de `ObjectMapper` consome processamento e memória porque a
> biblioteca precisa construir tabelas internas de introspecção. Como o
> `ObjectMapper` é **completamente seguro para uso concorrente
> (_thread-safe_)**, a melhor prática é **criar uma única instância
> reutilizável** em toda a aplicação (como uma constante `static final`).

## 2. Serialização: Transformando Objetos em JSON

Para exemplificar, vamos utilizar uma classe Java simples representando um
produto:

```java
public class Product {
    private Long id;
    private String name;
    private double price;

    public Product() {}

    public Product(Long id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
```

### 1. Gerando uma String JSON (`writeValueAsString`)

O método mais comum para converter um objeto em texto JSON é o
**`writeValueAsString()`**:

```java
import com.fasterxml.jackson.databind.ObjectMapper;

public class SerializationDemo {
    public static void main(String[] args) throws Exception {
        ObjectMapper mapper = new ObjectMapper();

        Product prod = new Product(1L, "Teclado Mecânico", 350.0);

        String json = mapper.writeValueAsString(prod);
        System.out.println(json);
        // Saída: {"id":1,"name":"Teclado Mecânico","price":350.0}
    }
}
```

### 2. Formatando o JSON com Quebras de Linha (_Pretty Printing_)

Por padrão, o Jackson gera o JSON em uma única linha contínua para economizar
espaço. Se você quiser imprimir o JSON formatado e indentado para facilitar a
leitura humana, use **`writerWithDefaultPrettyPrinter()`**:

```java
String prettyJson = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(prod);
System.out.println(prettyJson);
```

Saída formatada:

```json
{
  "id": 1,
  "name": "Teclado Mecânico",
  "price": 350.0
}
```

### 3. Salvando o JSON Diretamente em um Arquivo

Podemos salvar o objeto serializado direto no disco passando um objeto `File` ou
`Path` para o método **`writeValue()`**:

```java
import java.io.File;

// Salva o JSON no arquivo "produto.json":
mapper.writerWithDefaultPrettyPrinter().writeValue(new File("produto.json"), prod);
```

## 3. Desserialização: Transformando JSON em Objetos

A desserialização é o processo inverso: receber um texto ou arquivo JSON e
reconstruir a instância do objeto Java correspondente.

### 1. Lendo a Partir de uma String JSON (`readValue`)

Usamos o método **`readValue()`**, informando a String JSON e a classe alvo:

```java
public class DeserializationDemo {
    public static void main(String[] args) throws Exception {
        ObjectMapper mapper = new ObjectMapper();

        String json = """
        {
          "id": 2,
          "name": "Mouse Sem Fio",
          "price": 120.0
        }
        """;

        Product prod = mapper.readValue(json, Product.class);

        System.out.println("ID: " + prod.getId());
        System.out.println("Nome: " + prod.getName());
        System.out.println("Preço: " + prod.getPrice());
    }
}
```

### 2. Lendo a Partir de um Arquivo Local

Podemos ler um arquivo `.json` diretamente:

```java
import java.io.File;

Product prod = mapper.readValue(new File("produto.json"), Product.class);
```

> **Requisitos da Classe para a Desserialização Funcionar:**
>
> Para conseguir reconstruir o objeto Java a partir do JSON, o Jackson precisa:
>
> 1. De um **construtor sem argumentos** (pode ser `protected`, para evitar que
>    seja usado em outras situações).
> 2. De métodos **setters** ou atributos acessíveis para conseguir preencher os
>    dados lidos.

## 4. Desserializando Listas e Coleções (`TypeReference`)

Quando precisamos desserializar uma lista de objetos (um array JSON `[ { ... },
{ ... } ]`), nos deparamos com uma limitação do Java chamada **_Type Erasure_**
(apagamento de tipos genéricos em tempo de execução).

Se tentarmos passar apenas `List.class`:

```java
// ⚠️ Não faça isso:
List<Product> lista = mapper.readValue(jsonArray, List.class);
```

O Jackson não saberá qual é o tipo de elemento da lista e criará uma lista de
`LinkedHashMap` em vez de objetos `Product`.

### A Solução: `TypeReference`

Para instruir o Jackson sobre o tipo exato dos elementos contidos na lista,
utilizamos uma classe anônima criada a partir de **`TypeReference`**:

```java
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.List;

String jsonArray = """
    [
      {"id": 1, "name": "Mouse", "price": 80.0},
      {"id": 2, "name": "Teclado", "price": 250.0}
    ]
    """;

// Informamos o tipo genérico completo através do TypeReference:
List<Product> produtos = mapper.readValue(jsonArray, new TypeReference<List<Product>>() {});

for (Product p : produtos) {
    System.out.println(p.getName() + " -> R$ " + p.getPrice());
}
```

---

<a href="01-fundamentos-e-setup.md">← 1. Fundamentos de JSON e Setup do
Jackson</a>

<p align="right"><a href="03-anotacoes-essenciais.md">Próximo: Anotações Essenciais do Jackson →</a></p>
