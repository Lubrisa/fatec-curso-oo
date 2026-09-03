# 3. Anotações Essenciais do Jackson

No capítulo anterior, aprendemos a utilizar o `ObjectMapper` para realizar
conversões diretas entre objetos Java e documentos JSON.

Por padrão, o Jackson assume que os nomes dos atributos Java coincidem
exatamente com as chaves do JSON. No entanto, no mundo real:

- APIs externas frequentemente utilizam padrões de nomenclatura diferentes (como
  _snake_case_ em vez do _camelCase_ do Java).
- Alguns dados confidenciais (como senhas e tokens) **nunca** devem ser expostos
  no JSON gerado.
- Payloads JSON podem conter campos adicionais que nossa aplicação não precisa.

Para personalizar e ter controle total sobre como os dados são convertidos, o
Jackson disponibiliza um conjunto poderoso de anotações.

## Mapeando Chaves Diferentes (`@JsonProperty`)

Em Java, a convenção padrão para nomes de variáveis e métodos é o
**_camelCase_** (ex: `clientName`, `taxId`). Em muitas APIs REST e bancos de
dados, no entanto, é muito comum encontrar o padrão **_snake_case_** (ex:
`client_name`, `tax_id`).

A anotação **`@JsonProperty`** define explicitamente o nome da chave que o
Jackson deve utilizar no JSON:

```java
import com.fasterxml.jackson.annotation.JsonProperty;

public class CustomerDTO {
    @JsonProperty("customer_id")
    private Long id;

    @JsonProperty("full_name")
    private String name;

    @JsonProperty("contact_email")
    private String email;

    // Construtores, getters e setters...
}
```

O `@JsonProperty` funciona **bidirecionalmente**:

- **Na Serialização:** O Jackson gera o JSON usando os nomes definidos na
  anotação:

  ```json
  {
    "customer_id": 1,
    "full_name": "Carlos Santos",
    "contact_email": "carlos@email.com"
  }
  ```

- **Na Desserialização:** O Jackson lê a chave `"full_name"` do JSON e preenche
  corretamente o atributo `name` do Java.

## Ocultando Dados Sensíveis (`@JsonIgnore`)

Por motivos críticos de segurança e privacidade, dados sigilosos (como senhas,
códigos de segurança ou tokens de acesso) **jamais devem ser expostos** em
respostas JSON para clientes ou em logs.

A anotação **`@JsonIgnore`** instrui o Jackson a ignorar completamente o
atributo durante o processamento:

```java
import com.fasterxml.jackson.annotation.JsonIgnore;

public class UserAccount {
    private Long id;
    private String username;
    private String email;

    @JsonIgnore
    private String password; // 🔒 Nunca será incluído no JSON serializado!

    // Construtores, getters e setters...
}
```

Ao serializar um objeto `UserAccount`:

```java
UserAccount user = new UserAccount(10L, "luigi", "luigi@email.com", "senhaSuperSecreta");

String json = mapper.writeValueAsString(user);

System.out.println(json);
// Saída: {"id":10,"username":"luigi","email":"luigi@email.com"}
// Observe que o campo 'password' foi omitido com segurança!
```

## Omitindo Campos Nulos (`@JsonInclude`)

Por padrão, quando um atributo do objeto tem valor `null`, o Jackson inclui a
chave com o valor `null` no JSON (ex: `"phone": null`).

Em APIs que transferem muitos dados, enviar múltiplos campos nulos consome
largura de banda desnecessária. Podemos instruir o Jackson a **incluir apenas
campos que não sejam nulos** com **`@JsonInclude`**:

```java
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationRequest {
    private String recipient;
    private String message;
    private String smsCode; // Pode ser null se a notificação for por e-mail

    // Construtores, getters e setters...
}
```

```java
NotificationRequest notif = new NotificationRequest("ana@email.com", "Bem-vinda!", null);

String json = mapper.writeValueAsString(notif);

System.out.println(json);
// Saída enxuta: {"recipient":"ana@email.com","message":"Bem-vinda!"}
// O campo 'smsCode' (null) não é emitido no JSON.
```

> **Atenção aos Contratos de API:**
>
> Embora omitir campos nulos ajude a reduzir o tamanho do payload, **utilize
> essa anotação com cautela**.
>
> Algumas APIs externas ou contratos rígidos de integração exigem que todas as
> chaves estejam presentes no JSON, mesmo que seus valores sejam `null` (para
> diferenciar um campo expressamente nulo de um campo esquecido/não enviado).
> Sempre verifique os requisitos do contrato da API antes de aplicar
> `@JsonInclude`.

## Tolerando Propriedades Desconhecidas

Por padrão, se o Jackson tentar desserializar um JSON que contém uma chave que
**não existe** na sua classe Java, ele lançará a exceção
`UnrecognizedPropertyException` e interromperá a execução.

Em sistemas reais, APIs de terceiros frequentemente adicionam novos campos às
respostas JSON. Para que sua aplicação continue funcionando sem quebrar, podemos
configurar o Jackson para **ignorar campos desconhecidos**:

### Opção 1: Diretamente na Classe (`@JsonIgnoreProperties`)

```java
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// Se o JSON contiver "humidity", "wind_speed", etc., o Jackson simplesmente ignorará!
@JsonIgnoreProperties(ignoreUnknown = true)
public class WeatherResponse {
  private String city;
  private double temperature;

  // Construtores, getters e setters...
}
```

### Opção 2: Globalmente no `ObjectMapper`

Se quiser que toda a aplicação ignore campos desconhecidos por padrão:

```java
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

ObjectMapper mapper = new ObjectMapper();
mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
```

## Tabela Resumo das Anotações Essenciais

| Anotação                                          | Onde Aplicar       | Finalidade Principal                                                              |
| :------------------------------------------------ | :----------------- | :-------------------------------------------------------------------------------- |
| **`@JsonProperty("nome")`**                       | Atributo ou Método | Personaliza o nome da chave no JSON (_snake_case_ $\leftrightarrow$ _camelCase_). |
| **`@JsonIgnore`**                                 | Atributo ou Método | Oculta dados sigilosos ou internos da serialização/desserialização.               |
| **`@JsonInclude(NON_NULL)`**                      | Classe ou Atributo | Omite campos com valor `null` do JSON gerado, gerando payloads enxutos.           |
| **`@JsonIgnoreProperties(ignoreUnknown = true)`** | Topo da Classe     | Ignora campos extras do JSON sem lançar exceções.                                 |

---

<a href="02-object-mapper-e-operacoes-basicas.md">← 2. ObjectMapper e Operações
Básicas</a>
