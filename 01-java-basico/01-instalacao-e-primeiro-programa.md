# 1. Instalação e Primeiro Programa

## O Que Você Precisa para Rodar Java

Para escrever e executar código Java, você precisa do **JDK — Java Development
Kit**. O JDK inclui o compilador (`javac`), a máquina virtual (`java`) e as
bibliotecas padrão da linguagem.

Este curso usa **Java 25**. Faça o download no site oficial da Oracle e siga o
instalador para o seu sistema operacional.

> **LTS — Long Term Support:** versões LTS do Java recebem correções e
> atualizações de segurança por vários anos após o lançamento. São as versões
> recomendadas para projetos que precisam de estabilidade. Versões não-LTS ficam
> sem suporte após seis meses. **Java 25 é a LTS mais recente**.

Após a instalação, abra uma nova sessão do terminal (sessões antigas podem não
reconhecer o comando) e verifique se tudo está configurado:

```bash
java --version
```

A saída deve ser semelhante a:

```text
java 25.0.1 2025-10-21 LTS
Java(TM) SE Runtime Environment (build 25.0.1+8-LTS-27)
Java HotSpot(TM) 64-Bit Server VM (build 25.0.1+8-LTS-27, mixed mode, sharing)
```

Se aparecer um erro como:

```text
'java' não é reconhecido como um comando interno ou externo,
um programa operável ou um arquivo em lotes.
```

Significa que o JDK não foi adicionado ao `PATH` do sistema — a variável de
ambiente que informa onde encontrar programas. Verifique onde o binário `java`
foi instalado e configure o `PATH` de acordo com o seu sistema operacional.

## Seu Primeiro Programa

Crie um arquivo chamado `App.java` com o seguinte conteúdo:

```java
public class App {
    public static void main(String[] args) {
        System.out.println("Olá, Java!");
    }
}
```

Algumas observações importantes sobre essa estrutura:

- **`public class App`**: todo código Java vive dentro de uma classe. O nome da
  classe (`App`) deve ser idêntico ao nome do arquivo (`App.java`) — _Java exige
  isso quando a classe é declarada como `public`_.
- **`public static void main(String[] args)`**: é o ponto de entrada do
  programa. Quando você pede para o Java executar `App`, ele procura exatamente
  esse método para começar.
- **`System.out.println`**: imprime uma linha de texto no terminal.

## Como Executar o Programa

Há duas formas de rodar um programa Java.

**Execução direta** — recomendada para programas escritos em um único arquivo,
como pequenas demonstrações e exercícios simples:

```bash
java App.java
```

O Java compila e executa em uma etapa só, sem gerar arquivos intermediários.

**Fluxo tradicional** — necessário para projetos com múltiplos arquivos:

```bash
javac App.java   # compila: gera App.class com o bytecode
java App         # executa: a JVM lê App.class e roda o programa
```

O arquivo `.class` contém **bytecode** — uma representação intermediária que não
é código de máquina nem código-fonte. A JVM lê esse bytecode e o executa, o que
é o que permite o mesmo programa Java rodar em qualquer sistema operacional que
tenha uma JVM instalada.

## Java 25: Menos Cerimônia

O Java 25 introduziu **classes implícitas** e **métodos `main` de instância**,
que eliminam boa parte da estrutura obrigatória para programas simples. A versão
mínima de um programa Java passou a ser:

```java
void main() {
    System.out.println("Olá, Java 25!");
}
```

O compilador sintetiza automaticamente a classe ao redor do arquivo (é como se
ele mesmo escrevesse a classe para você). Os parâmetros `String[] args` também
se tornaram opcionais.

Em diversos exemplos, você vai encontrar essa forma simplificada. Nas definições
de classes — `BankAccount`, `Customer` e similares — a declaração explícita
usando a palavra-chave `class` (mais sobre isso no capítulo sobre classes)
continua sendo necessária e é o estilo que usaremos para o código de produção.

## Pacotes e Imports

O conceito de pacotes foi introduzido no módulo anterior. Na prática, em Java um
pacote é declarado na primeira linha do arquivo:

```java
package com.bank.account;  // declara a que pacote esta classe pertence

public class BankAccount {
    // ...
}
```

Para usar uma classe de outro pacote, usa-se `import`:

```java
package com.bank.app;

import com.bank.account.BankAccount;  // importa uma classe específica
import java.util.*;                    // importa todas as classes de java.util

public class Main {
    void main() {
        BankAccount account = new BankAccount(1000.0);
    }
}
```

Classes do pacote `java.lang` — como `String`, `Math` e `System` — são
importadas automaticamente em qualquer programa Java; você nunca precisa
declará-las com `import`.

---

<a href="../00-fundamentos/05-classificacao-de-paradigmas.md">← Módulo 0 —
Classificação dos Paradigmas</a>

<p align="right"><a href="02-tipos-primitivos.md">Próximo: Tipos Primitivos →</a></p>
