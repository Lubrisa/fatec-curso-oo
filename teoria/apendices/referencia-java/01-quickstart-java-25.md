# 01. Quickstart Java 25

Este guia apresenta o ferramental básico para compilar e executar programas em
Java 25, abordando desde o modelo clássico até as simplificações modernas da
linguagem.

## 1. Instalação e Verificação do SDK

Para trabalhar com o Java 25, você precisa do **JDK (Java Development Kit)**
instalado. Você pode fazer a instalação acessando [esse
link](https://www.oracle.com/java/technologies/javase/jdk25-archive-downloads.html).

Após a instalação, verifique se o JDK está configurado corretamente abrindo o
terminal e executando:

```bash
java --version
```

A saída deve ser semelhante a seguinte:

```text
java 25.0.1 2025-10-21 LTS
Java(TM) SE Runtime Environment (build 25.0.1+8-LTS-27)
Java HotSpot(TM) 64-Bit Server VM (build 25.0.1+8-LTS-27, mixed mode, sharing)
```

## 2. Estrutura Básica de um Programa Java

### Versão Tradicional (Classe e Método `main`)

Historicamente, o ponto de entrada de um programa Java precisa residir dentro de
uma classe, sendo definido por um método com a seguinte assinatura: `public
static void main`.

```java
public class App {
    public static void main(String[] args) {
        System.out.println("Olá, Orientação a Objetos!");
    }
}
```

O nome escolhido para a classe (neste caso, `App`) é indiferente para o Java —
você pode nomeá-la como desejar, desde que exista um método `main` válido dentro
dela. A única regra de organização do Java é que, ao declarar uma classe como
`public`, o nome do arquivo `.java` deve ser exatamente igual ao nome dessa
classe (por exemplo, `App.java` para `public class App`).

### Versão Moderna (Java 25 - Métodos `main` de Instância e Classes Implícitas)

No Java 25, a cerimônia inicial foi drasticamente reduzida. Para programas
simples e scripts de teste, você não precisa declarar explicitamente uma classe
pública, e os parâmetros `String[] args` se tornaram opcionais:

```java
void main() {
    System.out.println("Olá, Java 25!");
}
```

_O compilador do Java cria automaticamente uma classe implícita ao redor deste
arquivo._

## 3. Compilando e Executando Programas

Existem duas formas de rodar o seu código:

### Método 1: Execução Direta de Arquivo Fonte (Recomendado para Exercícios)

Para arquivos únicos de teste, você pode executar o código diretamente sem gerar
arquivos `.class` intermediários no disco:

```bash
java App.java
```

### Método 2: Fluxo Tradicional (`javac` + `java`)

Para projetos com múltiplos arquivos ou pacotes:

1. **Compilar** (gera o bytecode `.class`):

   ```bash
   javac App.java
   ```

2. **Executar** (inicia a Máquina Virtual Java - JVM):

   ```bash
   java App
   ```

## 4. Pacotes e Organização (`package` e `import`)

Conforme o que foi dito no [Módulo 1 sobre
modularização](../../01-paradigmas-de-programacao.md#modularização-módulos-pacotes-e-namespaces),
o Java utiliza **pacotes** (_packages_) para agrupar classes relacionadas e
evitar conflitos de nomes.

### Declaração de Pacote

O comando `package` deve ser a primeira linha do arquivo e deve refletir a
estrutura de diretórios no sistema de arquivos:

```java
package br.com.meucurso.model;

public class User {
    // ...
}
```

_Caminho físico no disco:_ `pastadoprojeto/br/com/meucurso/model/User.java`

### Importação de Pacotes

Para utilizar uma classe localizada em outro pacote, utilize a instrução
`import`:

```java
package br.com.meucurso;

import br.com.meucurso.model.User; // Importa uma classe específica
import java.util.*;                 // Importa todas as classes do pacote util

public class Main {
    void main() {
        User user = new User();
    }
}
```
