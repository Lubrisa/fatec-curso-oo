# 4. Lombok vs Records

Com a chegada do Java 16, a linguagem introduziu um novo tipo nativo para
representar dados concisos: os **Records**.

Isso costuma gerar uma dúvida muito comum entre quem está aprendendo Java
moderno:

> _"Se o Java agora possui Records nativos para reduzir código, o Project Lombok
> ainda é relevante?"_

A resposta é **sim**. Records e Lombok resolvem problemas de código repetitivo,
mas partem de **filosofias de design diferentes** e atendem a cenários
distintos.

> **Records no Java Moderno:**
>
> A sintaxe completa, os recursos avançados e as regras detalhadas de Records
> são explorados no submódulo de **Tipos e Modelagem** do módulo de Java
> Moderno. Aqui, nosso foco é comparar as diferenças práticas em relação ao
> Lombok.

## 1. Comparativo Funcionalidade por Funcionalidade

Para compreender as diferenças, vamos comparar lado a lado uma representação de
cliente feita com **Record** e com uma classe tradicional usando **Lombok**.

```java
// Com Record (Nativo do Java):
public record ClientRecord(Long id, String name, String email) {
}

// Com Lombok:
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class ClientLombok {
    private Long id;
    private String name;
    private String email;
}
```

### 1. Leitura de Dados (Getters)

- **Record:** Gera métodos acessores com o **mesmo nome do atributo**, sem o
  prefixo `get`:

  ```java
  ClientRecord rec = new ClientRecord(1L, "Ana", "ana@email.com");
  System.out.println(rec.name()); // Sem o prefixo 'get'
  ```

- **Lombok:** Gera métodos seguindo o padrão clássico do Java com o prefixo
  `get`:

  ```java
  ClientLombok lmb = new ClientLombok(1L, "Ana", "ana@email.com");
  System.out.println(lmb.getName()); // Padrão clássico getNome()
  ```

### 2. Mutabilidade vs Imutabilidade (Setters)

- **Record:** É **100% imutável por padrão**. Todos os atributos de um Record
  são implicitamente `private final`. Uma vez criado o objeto, seus dados nunca
  podem ser alterados. Não existem setters.
- **Lombok:** Oferece **total flexibilidade**. Você pode criar classes
  totalmente mutáveis (com `@Setter`), parcialmente mutáveis ou imutáveis (com
  campos `final` e apenas `@Getter`).

```java
// No Record: não é possível alterar valores após a criação
// rec.setName("Novo Nome"); // ❌ Erro de compilação!

// No Lombok: você decide se quer permitir alterações
lmb.setName("Novo Nome"); // ✅ Permitido com @Setter
```

### 3. Construtores

- **Record:** Cria automaticamente o **construtor canônico** (que recebe todos
  os atributos declarados). Não possui construtor vazio por padrão, pois campos
  `final` não podem ficar sem valor.
- **Lombok:** Permite gerar múltiplos construtores conforme a necessidade
  (`@NoArgsConstructor`, `@AllArgsConstructor`, `@RequiredArgsConstructor`).

### 4. `toString`, `equals` e `hashCode`

- **Record:** Gera nativamente implementações de `toString()`, `equals()` e
  `hashCode()` considerando **sempre todos os atributos** do Record. Não é
  possível excluir um campo específico sem reescrever o método manualmente.
- **Lombok:** Gera através de `@ToString` e `@EqualsAndHashCode`, permitindo
  **excluir campos sensíveis** facilmente (como senhas com `@ToString.Exclude`)
  ou comparar apenas por chaves específicas (`@EqualsAndHashCode.Include`).

### 5. Herança e Orientação a Objetos

- **Record:** **Não pode herdar outras classes** (`extends` é proibido, pois
  todo record já herda internamente de `java.lang.Record`). Ele pode apenas
  implementar interfaces (`implements`).
- **Lombok:** São classes Java normais, com suporte completo a **herança de
  classes**, classes abstratas e polimorfismo (`public class Client extends Person`).

## 2. Bússola de Decisão: Quando Usar Cada Um?

| Cenário / Necessidade                                     | Escolha Recomendada | Motivo Principal                                                  |
| :-------------------------------------------------------- | :-----------------: | :---------------------------------------------------------------- |
| Objeto simples e imutável para transportar dados          |     **Record**      | Solução nativa, enxuta e sem necessidade de bibliotecas externas. |
| Objeto que precisa ter campos alterados ao longo do tempo |     **Lombok**      | Suporte a métodos `@Setter` e mutabilidade controlada.            |
| Classe que precisa herdar outra classe (`extends`)        |     **Lombok**      | Records não suportam herança de classes.                          |
| Exclusão de campos sensíveis em logs (senhas, tokens)     |     **Lombok**      | Facilidade com a anotação `@ToString.Exclude`.                    |
| Classes que precisam de construtor vazio para frameworks  |     **Lombok**      | Geração simples com `@NoArgsConstructor`.                         |
| Resultados intermediários ou agrupamentos em Streams      |     **Record**      | Criação rápida em uma única linha dentro do fluxo.                |

---

<a href="03-construtores-e-data.md">← 3. Construtores Automáticos e @Data</a>
