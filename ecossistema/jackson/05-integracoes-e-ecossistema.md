# 5. Jackson no Ecossistema: Lombok e Spring Boot

Até agora, exploramos o Jackson como uma biblioteca independente e aprendemos a
utilizar seus recursos com o sistema de tipos do Java.

Em projetos reais, no entanto, o Jackson raramente atua de forma isolada: ele se
integra com as principais ferramentas e _frameworks_ do ecossistema Java.

Neste capítulo, vamos entender como o Jackson trabalha em conjunto com o
**Lombok** (para eliminar código repetitivo mantendo o encapsulamento) e como
ele funciona como o motor padrão de serialização no **Spring Boot**.

## 1. Jackson em Conjunto com o Lombok

Quando não estamos utilizando _Records_ (por exemplo, em entidades mutáveis ou
classes que exigem hierarquia de herança complexa), escrever manualmente todos
os _getters_, _setters_ e construtores gera muito código repetitivo
(_boilerplate_).

O **Lombok** e o **Jackson** se complementam perfeitamente para resolver esse
problema:

### Mapeando uma Classe com Lombok e Jackson

```java
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter(AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CustomerDTO {
    @JsonProperty("customer_id")
    private Long id;

    @JsonProperty("full_name")
    private String name;

    @JsonProperty("contact_email")
    private String email;
}
```

### Por que essa combinação é tão eficiente?

1. **`@Getter` público:** Fornece os métodos de leitura que o Jackson usa para
   extrair os dados durante a **serialização** (_Object $\rightarrow$ JSON_).
2. **`@Setter(AccessLevel.PROTECTED)`:** Cria os métodos de escrita necessários
   para o Jackson preencher os dados durante a **desserialização** (_JSON
   $\rightarrow$ Object_), sem expor métodos modificadores desnecessários para o
   restante da aplicação.
3. **`@NoArgsConstructor(access = AccessLevel.PROTECTED)`:** Cria o construtor
   sem argumentos exigido pela biblioteca para instanciar o objeto via
   _reflection_.
4. **`@AllArgsConstructor`:** Permite instanciar o objeto de forma completa e
   conveniente no código da sua aplicação.

> **Dica de Design:**
>
> Em vez de aplicar `@Data` indiscriminadamente (o que geraria _setters_
> públicos e abriria o encapsulamento), prefira a combinação granular acima para
> manter suas classes protegidas.

## 2. Jackson nos Bastidores do Spring Boot

O **Spring Boot** é o _framework_ mais utilizado no mercado para o
desenvolvimento de APIs e microsserviços em Java.

Ao criar APIs REST com Spring Boot, você raramente precisará instanciar ou
chamar o `ObjectMapper` manualmente. O Spring Boot já inclui o Jackson
automaticamente em qualquer projeto web (`spring-boot-starter-web`).

### Como a Conversão Automática Funciona

Quando criamos um controlador REST (`@RestController`), o Spring Boot utiliza o
Jackson nos bastidores para interceptar e converter as mensagens HTTP:

```java
@RestController
@RequestMapping("/api/produtos")
public class ProductController {
    // 1. DESSERIALIZAÇÃO AUTOMÁTICA (@RequestBody):
    // O Spring recebe o JSON da requisição HTTP e usa o Jackson internamente
    // para convertê-lo diretamente em uma instância de ProductDTO:
    @PostMapping
    public ResponseEntity<ProductDTO> criarProduto(@RequestBody ProductDTO novoProduto) {
        // Processa a regra de negócio...
        System.out.println("Produto recebido: " + novoProduto.name());

        // 2. SERIALIZAÇÃO AUTOMÁTICA (Corpo da Resposta):
        // O Spring pega o objeto retornado e usa o Jackson internamente para
        // transformá-lo de volta em JSON com status HTTP 201 (Created):
        return ResponseEntity.status(HttpStatus.CREATED).body(novoProduto);
    }
}
```

### O que isso significa para o desenvolvedor?

- Todas as anotações que você aprendeu neste módulo (`@JsonProperty`,
  `@JsonIgnore`, `@JsonInclude`, `@JsonFormat`, etc.) funcionam
  **automaticamente** nas suas classes DTO dentro do Spring Boot.
- Se você anotar um atributo com `@JsonIgnore`, o Spring Boot garantirá que ele
  não apareça na resposta JSON da API.
- Se você usar um _Record_ ou uma classe com _Lombok_, o Spring Boot fará a
  conversão transparente sem nenhuma linha adicional de código de mapeamento.

---

<a href="04-records-enums-e-datas.md">← Records, Enums e Datas no Jackson</a>
