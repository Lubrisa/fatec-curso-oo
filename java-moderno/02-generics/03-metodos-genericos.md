# 3. Métodos Genéricos

Nos capítulos anteriores, vimos como criar classes e interfaces genéricas onde o
tipo `<T>` pertence a todo o escopo do componente.

No entanto, há muitas situações em que uma classe inteira **não precisa ser
genérica**, mas possui um ou dois métodos utilitários que deveriam funcionar com
qualquer tipo de dado. É exatamente para isso que servem os **Métodos
Genéricos**.

## O Problema das Classes Utilitárias

Pense nas classes utilitárias da biblioteca padrão do Java, como
`java.util.Collections` ou `java.util.Arrays`. Elas contêm apenas métodos
estáticos e não guardam nenhum estado.

Se quisermos criar uma classe utilitária com um método para obter o primeiro
elemento de qualquer lista, como faríamos?

Sem métodos genéricos, teríamos que:

1. Criar um método para cada tipo existente (`getFirstString(List<String>)`,
   `getFirstAccount(List<BankAccount>)`... duplicação infinita).
2. Ou recorrer ao `Object` e forçar quem chama a fazer _cast_ manual.

Com métodos genéricos, resolvemos isso declarando o parâmetro de tipo
**exclusivamente no método**:

## Declarando um Método Genérico

A sintaxe de um método genérico exige que a declaração do tipo `<T>` fique
**imediatamente antes do tipo de retorno**:

```java
public class ListUtils {
    // <T> antes do tipo de retorno declara que este método possui um tipo genérico próprio:
    public static <T> T getFirst(List<T> list) {
        if (list == null || list.isEmpty()) {
            return null;
        }
        return list.get(0); // retorna o tipo T sem cast
    }
}
```

Observe a anatomia da assinatura:

| Elemento         | Significado                                             |
| :--------------- | :------------------------------------------------------ |
| `public static`  | Modificadores de acesso e escopo                        |
| **`<T>`**        | **Declaração do parâmetro de tipo genérico do método**  |
| `T`              | Tipo de retorno do método                               |
| `getFirst`       | Nome do método                                          |
| `(List<T> list)` | Parâmetro que recebe uma lista de elementos do tipo `T` |

> **Conectando com o Capítulo Anterior:**
>
> Lembra da fábrica estática `Result.ok(T data)` do [capítulo
> anterior](02-classes-e-interfaces-genericas.md#caso-de-uso-real-objeto-de-resultado-resultt)?
>
> ```java
> public static <T> Result<T> ok(T data) { ... }
> ```
>
> Ela é exatamente um método genérico! Como o método é `static`, ele não tem
> acesso ao `T` da classe `Result<T>` — por isso precisou declarar seu próprio
> `<T>` antes do retorno `Result<T>`.

### Invocando o Método (Inferência de Tipo)

Ao chamar o método, o compilador do Java analisa o tipo do argumento passado e
**infere o tipo `T` automaticamente**, sem você precisar especificar nada:

```java
List<String> names = List.of("Ana", "Bruno", "Carla");

// O compilador deduz que T é String, pois o método recebe uma List<String>:
String firstPerson = ListUtils.getFirst(names); // "Ana"

List<BankAccount> accounts = List.of(new BankAccount("Carlos", "001", 500.0));

// O compilador deduz que T é BankAccount, pois o método recebe uma List<BankAccount>:
BankAccount firstAccount = ListUtils.getFirst(accounts);
```

## Métodos Genéricos com Múltiplos Tipos

Assim como nas classes, um método pode declarar mais de um tipo genérico:

```java
import java.util.HashMap;
import java.util.Map;

public class CollectionUtils {
    public static <K, V> Map<K, V> ofSingleEntry(K key, V value) {
        Map<K, V> map = new HashMap<>();
        map.put(key, value);
        return map;
    }
}
```

```java
Map<String, BankAccount> accountMap = CollectionUtils.ofSingleEntry("001", account);
```

> **Nota:** Embora o caso de uso mais comum para métodos genéricos seja em
> utilitários e fábricas estáticas, eles também podem ser declarados em métodos
> de instância comuns (sem `static`) quando necessário.

---

<a href="02-classes-e-interfaces-genericas.md">← Classes e Interfaces
Genéricas</a>
