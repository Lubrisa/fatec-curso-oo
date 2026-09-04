# 2. ObjectMapper e Operações Básicas

No capítulo anterior, compreendemos a estrutura do JSON e configuramos a
dependência do Jackson no `pom.xml`.

Agora, vamos aprender a realizar as duas operações fundamentais no dia a dia do
desenvolvimento:

- **Serialização:** Converter um objeto Java em texto ou arquivo JSON (_Object
  $\rightarrow$ JSON_).
- **Desserialização:** Converter um texto ou arquivo JSON de volta para um
  objeto Java (_JSON $\rightarrow$ Object_).

## O Coração da Biblioteca: `ObjectMapper`

A classe **`ObjectMapper`** é o motor central do Jackson. Ela é responsável por
inspecionar as classes Java, ler a estrutura do JSON e realizar a conversão
automática entre os dois mundos.

Criar um `ObjectMapper` com `new ObjectMapper()` é uma operação pesada, pois a
biblioteca analisa e armazena em cache as informações de mapeamento das classes.

Como o `ObjectMapper` é **seguro para uso concorrente (_thread-safe_)**, a
melhor prática é **criar uma única instância reutilizável** em toda a aplicação
(por exemplo, como uma constante em uma classe utilitária ou de serviço):

```java
public class JsonUtils {
    // Instância única reaproveitada por todas as partes do sistema:
    public static final ObjectMapper MAPPER = new ObjectMapper();
}
```

## Serialização: Transformando Objetos em JSON

Para exemplificar, vamos utilizar uma classe Java simples representando um
produto:

```java
public class Product {
    private Long id;
    private String name;
    private double price;

    // Construtor sem argumentos necessário para o Jackson (pode ser protected):
    protected Product() {}

    public Product(Long id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    // Getters públicos (usados pelo Jackson na serialização para ler os dados):
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

    // Setters protegidos (obrigatórios para o Jackson preencher os dados na desserialização):
    private void setId(Long id) {
        this.id = id;
    }

    private void setName(String name) {
        this.name = name;
    }

    private void setPrice(double price) {
        this.price = price;
    }
}
```

> **Por que os _setters_ são necessários?**
>
> Para reconstruir o objeto a partir de um JSON (desserialização), o Jackson
> utiliza _reflection_ e precisa obrigatoriamente de métodos _setters_
> correspondentes para preencher os valores dos atributos. Ao declará-los como
> `private`, atendemos aos requisitos da biblioteca sem expor métodos de
> alteração públicos desnecessários para o resto da aplicação.

### 1. Gerando uma String JSON (`writeValueAsString`)

O método mais comum para converter um objeto em texto JSON é o
**`writeValueAsString()`**:

```java
Product prod = new Product(1L, "Teclado Mecânico", 350.0);

String json = mapper.writeValueAsString(prod);
System.out.println(json);
// Saída: {"id":1,"name":"Teclado Mecânico","price":350.0}
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

> **Opções de Configuração:**
>
> O Jackson possui dezenas de opções para controlar a saída do JSON através da
> enum `SerializationFeature` (como `SerializationFeature.INDENT_OUTPUT` para
> indentação automática ou recursos de formatação de datas), que podem ser
> ativadas globalmente via `mapper.enable(...)` ou `mapper.configure(...)`.

### 3. Salvando o JSON Diretamente em um Arquivo

Podemos salvar o objeto serializado direto no disco passando um objeto `File` ou
`Path` para o método **`writeValue()`**:

```java
import java.io.File;

// Salva o JSON no arquivo "produto.json":
mapper.writerWithDefaultPrettyPrinter().writeValue(new File("produto.json"), prod);
```

## Desserialização: Transformando JSON em Objetos

A desserialização é o processo inverso: receber um texto ou arquivo JSON e
reconstruir a instância do objeto Java correspondente.

> **Requisitos da Classe para a Desserialização:**
>
> Para conseguir instanciar e reconstruir o objeto Java a partir do JSON, o
> Jackson precisa:
>
> 1. De um **construtor sem argumentos** (pode ser `protected`, para evitar que
>    seja usado desprotegido pela aplicação).
> 2. De métodos **setters** (que podem ser `protected` ou `private`) ou acesso
>    direto aos campos via _reflection_.

### 1. Lendo a Partir de uma String JSON (`readValue`)

Usamos o método **`readValue()`**, informando a String com o JSON e a **classe
alvo (`Product.class`)**:

```java
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
```

> **Por que passamos `Product.class`?**
>
> Como o JSON recebido é apenas um texto bruto, o Jackson precisa receber o
> objeto de classe (`Product.class`) como um "molde" de referência para saber
> exatamente qual classe instanciar e para quais tipos converter cada chave.

### 2. Lendo a Partir de um Arquivo Local

Podemos ler um arquivo `.json` diretamente:

```java
import java.io.File;

Product prod = mapper.readValue(new File("produto.json"), Product.class);
```

## Desserializando Listas e Coleções (`TypeReference`)

Quando precisamos desserializar uma lista de objetos (um array JSON `[ { ... },
{ ... } ]`), nos deparamos com uma limitação da JVM chamada **_Type Erasure_**
(apagamento de tipos genéricos em tempo de execução).

Se tentarmos passar apenas `List.class`:

```java
// ⚠️ Não faça isso:
List<Product> lista = mapper.readValue(jsonArray, List.class);
```

Como os tipos genéricos são apagados pela JVM em tempo de execução, o Jackson
não saberá que os elementos internos devem ser do tipo `Product` e criará uma
lista genérica contendo instâncias da interface `Map`.

### A Solução: `TypeReference`

Para instruir o Jackson sobre o tipo exato dos elementos contidos na lista,
utilizamos a classe **`TypeReference`**:

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

<details>
<summary>🔍 <strong>Entenda os Bastidores: Por que usamos <code>new TypeReference&lt;...&gt;() {}</code> com chaves?</strong></summary>

A sintaxe com `{}` pode parecer curiosa à primeira vista, mas ela se baseia em
recursos fundamentais da linguagem Java:

1. **`TypeReference` é uma classe abstrata**: ela foi criada pelo Jackson com o
   propósito de capturar informações sobre tipos genéricos em tempo de execução.
   Por ser abstrata, não podemos instanciá-la diretamente.
2. **Normalmente precisaríamos declarar uma classe**: para utilizá-la da forma
   tradicional, teríamos que criar uma subclasse com nome:

   ```java
   // Criando uma classe apenas para herdar o tipo:
   class ProductListType extends TypeReference<List<Product>> {}

   // E depois instanciá-la:
   List<Product> produtos = mapper.readValue(jsonArray, new ProductListType());
   ```

3. **Classes anônimas como atalho**: para não precisarmos ficar criando classes
   minúsculas e descartáveis, o Java permite criar **classes anônimas**. Ao
   escrever `new TypeReference<List<Product>>() {}` (com o par de chaves `{}` no
   final), estamos dizendo ao Java: _"crie implicitamente uma classe que herda
   de `TypeReference<List<Product>>` e instancie-a imediatamente"_. Esse padrão
   era muito comum antes dos Lambdas (como explorado no módulo de Java
   Funcional).
4. **A herança preserva o tipo genérico**: enquanto o Java apaga tipos genéricos
   de variáveis comuns em tempo de execução (_Type Erasure_), **as informações
   de tipos genéricos passadas na herança de uma classe ficam gravadas no
   _bytecode_**.
5. **O Jackson recupera o tipo**: internamente, o construtor do `TypeReference`
   inspeciona a própria classe-mãe herdada e consegue extrair com precisão o
   tipo `List<Product>` via _reflection_.

> Se quiser entender os detalhes internos de como a JVM lida com tipos genéricos
> no geral, confira o tópico sobre [_Type Erasure_ no final do primeiro capítulo
> do módulo de Generics](../../java-moderno/02-generics/01-fundamentos.md).

</details>

---

<a href="01-fundamentos-e-setup.md">← Fundamentos e Setup do Jackson</a>

<p align="right"><a href="03-anotacoes-essenciais.md">Próximo: Anotações Essenciais do Jackson →</a></p>
