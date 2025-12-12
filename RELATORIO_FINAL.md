# Relatório Final - GraphQL vs REST: Um Experimento Controlado

## 1. Introdução

### 1.1 Contexto

A linguagem de consulta GraphQL, proposta pelo Facebook como metodologia de implementação de APIs Web, representa uma alternativa às populares APIs REST. Baseada em grafos, a linguagem permite que usuários consultem banco de dados na forma de schemas, de modo que se possa exportar a base e realizar consultas num formato definido pelo fornecedor da API. Por outro lado, APIs criadas com base em abordagens REST baseiam-se em endpoints: operações pré-definidas que podem ser chamadas por clientes que desejam consultar, deletar, atualizar ou escrever um dado na base.

Desde o seu surgimento, vários sistemas realizaram a migração entre ambas as soluções, mantendo soluções compatíveis REST, mas oferecendo os benefícios da nova linguagem de consulta proposta. Entretanto, não está claro quais os reais benefícios da adoção de uma API GraphQL em detrimento de uma API REST.

### 1.2 Objetivo

O objetivo deste laboratório é realizar um experimento controlado para avaliar quantitativamente os benefícios da adoção de uma API GraphQL em comparação com uma API REST.

### 1.3 Perguntas de Pesquisa

Este experimento busca responder às seguintes perguntas de pesquisa:

- **RQ1**: Respostas às consultas GraphQL são mais rápidas que respostas às consultas REST?
- **RQ2**: Respostas às consultas GraphQL tem tamanho menor que respostas às consultas REST?

### 1.4 Hipóteses

Com base nas perguntas de pesquisa, foram formuladas as seguintes hipóteses:

- **H1**: Respostas GraphQL são mais rápidas que respostas REST (hipótese alternativa para RQ1)
- **H0_RQ1**: Não há diferença significativa no tempo de resposta entre GraphQL e REST (hipótese nula para RQ1)

- **H2**: Respostas GraphQL têm tamanho menor que respostas REST (hipótese alternativa para RQ2)
- **H0_RQ2**: Não há diferença significativa no tamanho da resposta entre GraphQL e REST (hipótese nula para RQ2)

## 2. Metodologia

### 2.1 Desenho Experimental

Este experimento segue um desenho experimental comparativo, onde dois tratamentos (GraphQL e REST) são aplicados aos mesmos objetos experimentais (cenários de consulta) em condições controladas.

#### 2.1.1 Variáveis

- **Variável Independente**: Tipo de API (GraphQL vs REST)
- **Variáveis Dependentes**: 
  - Tempo de resposta (milissegundos)
  - Tamanho da resposta (bytes)
- **Variáveis de Controle**: 
  - Mesma fonte de dados (dados compartilhados em memória)
  - Mesmo ambiente de execução (mesma máquina, mesmas condições de rede)
  - Mesma complexidade de consulta e requisitos de dados
  - Mesmo número de iterações por cenário

#### 2.1.2 Tratamentos

O experimento compara dois tratamentos:
1. **API REST**: Implementação baseada em endpoints RESTful tradicionais
2. **API GraphQL**: Implementação baseada em schema GraphQL com queries flexíveis

#### 2.1.3 Objetos Experimentais

Os objetos experimentais consistem em 6 cenários de consulta representativos:

1. **Simple User**: Consulta de um único usuário
2. **Simple Users List**: Consulta de todos os usuários
3. **Simple Post**: Consulta de um único post
4. **Complex User with Posts**: Consulta de usuário com posts aninhados
5. **Complex Post with Details**: Consulta de post com autor e comentários aninhados
6. **Complex All Posts with Authors**: Consulta de todos os posts com autores

#### 2.1.4 Tipo de Projeto Experimental

O experimento segue um projeto experimental de comparação pareada (paired comparison), onde cada cenário é testado com ambos os tratamentos (GraphQL e REST) nas mesmas condições.

#### 2.1.5 Quantidade de Medições

Para garantir significância estatística, foram realizadas **50 iterações** de cada cenário para cada tipo de API, totalizando:
- 6 cenários × 2 APIs × 50 iterações = **600 medições totais**
- 300 medições para REST
- 300 medições para GraphQL

### 2.2 Ambiente Experimental

#### 2.2.1 Hardware e Software

- **Sistema Operacional**: Windows 10 (versão 10.0.26200)
- **Runtime**: Node.js (versão compatível com Express 4.18.2)
- **APIs**: 
  - REST API: Express.js na porta 3001
  - GraphQL API: Express-GraphQL na porta 3002
- **Ferramentas de Análise**: Node.js com biblioteca simple-statistics

#### 2.2.2 Fonte de Dados

Ambas as APIs utilizam a mesma fonte de dados compartilhada (in-memory), contendo:
- 5 usuários
- 10 posts
- 5 comentários

Esta abordagem garante que as diferenças observadas sejam atribuídas apenas ao tipo de API, e não a diferenças nos dados ou na infraestrutura.

### 2.3 Procedimento de Coleta de Dados

#### 2.3.1 Preparação

1. Instalação de dependências em todos os módulos do projeto
2. Inicialização da API REST na porta 3001
3. Inicialização da API GraphQL na porta 3002
4. Verificação de que ambas as APIs estão respondendo corretamente

#### 2.3.2 Execução

Para cada cenário de teste:

1. Execução de 50 requisições sequenciais à API REST
2. Pequeno delay de 10ms entre requisições para evitar sobrecarga do servidor
3. Execução de 50 requisições sequenciais à API GraphQL
4. Pequeno delay de 10ms entre requisições

Para cada requisição, são coletados:
- **Tempo de resposta**: Medido usando `process.hrtime.bigint()` (alta precisão), do envio da requisição até o recebimento da resposta completa
- **Tamanho da resposta**: Calculado como o tamanho em bytes da string JSON serializada da resposta
- **Status da requisição**: Sucesso ou falha
- **Código de status HTTP**: Código de resposta HTTP

#### 2.3.3 Armazenamento

Os dados são armazenados em dois formatos:
- **CSV**: `code/data/experiment-results.csv` - Para fácil importação em ferramentas de análise
- **JSON**: `code/data/experiment-results.json` - Para processamento programático

### 2.4 Métodos de Análise Estatística

#### 2.4.1 Estatísticas Descritivas

Para cada variável dependente e cada tratamento, são calculadas:
- Média (mean)
- Mediana (median)
- Desvio padrão (standard deviation)
- Mínimo e máximo
- Quartis (Q1 e Q3)

#### 2.4.2 Testes de Hipótese

Para verificar se há diferenças estatisticamente significativas entre os tratamentos, é utilizado o **teste t de Welch** (t-test), que é apropriado quando as variâncias podem ser diferentes entre os grupos.

- **Nível de significância**: α = 0.05
- **Hipótese nula**: Não há diferença entre as médias dos dois grupos
- **Hipótese alternativa**: Há diferença entre as médias dos dois grupos

#### 2.4.3 Tamanho do Efeito

O tamanho do efeito é calculado usando **Cohen's d**, que quantifica a magnitude da diferença entre os grupos:

- |d| < 0.2: efeito pequeno
- 0.2 ≤ |d| < 0.5: efeito médio
- 0.5 ≤ |d| < 0.8: efeito grande
- |d| ≥ 0.8: efeito muito grande

#### 2.4.4 Intervalos de Confiança

São calculados intervalos de confiança de 95% para as médias de cada grupo, usando a distribuição normal (Z-score = 1.96).

### 2.5 Ameaças à Validade

#### 2.5.1 Ameaças à Validade Interna

- **Variação no ambiente**: Mitigada executando todas as medições na mesma máquina, no mesmo período de tempo
- **Ordem de execução**: As requisições REST são sempre executadas antes das GraphQL para cada cenário, o que pode introduzir viés. No entanto, o delay entre requisições e a execução sequencial minimizam efeitos de aquecimento
- **Carga do sistema**: Execuções em ambiente controlado minimizam variações na carga do sistema

#### 2.5.2 Ameaças à Validade Externa

- **Dados sintéticos**: Os dados utilizados são sintéticos e pequenos em volume. Resultados podem não se generalizar para sistemas de produção com grandes volumes de dados
- **Complexidade limitada**: Os cenários, embora representativos, não cobrem todas as possíveis complexidades de consultas reais
- **Ambiente local**: Execução em ambiente local pode não refletir condições de rede e latência de sistemas distribuídos

#### 2.5.3 Ameaças à Validade de Construção

- **Medição de tempo**: O tempo medido inclui latência de rede local, processamento do servidor e serialização JSON. Em ambiente local, a latência de rede é mínima
- **Medição de tamanho**: O tamanho é medido após serialização JSON, o que pode não refletir exatamente o tamanho transmitido (que incluiria headers HTTP)

## 3. Resultados

### 3.1 Visão Geral

Os resultados apresentados nesta seção são baseados na análise estatística dos dados coletados. Para visualizar os resultados completos, execute o script de análise:

```bash
cd code
npm run analyze
```

Os resultados detalhados são salvos em `code/data/analysis-results.json`.

### 3.2 Resultados para RQ1: Tempo de Resposta

**Pergunta**: Respostas às consultas GraphQL são mais rápidas que respostas às consultas REST?

#### 3.2.1 Estatísticas Descritivas (Geral)

Os resultados gerais agregando todos os cenários mostram:

- **REST API**: 
  - Média: [será preenchido após execução]
  - Mediana: [será preenchido após execução]
  - Desvio Padrão: [será preenchido após execução]

- **GraphQL API**: 
  - Média: [será preenchido após execução]
  - Mediana: [será preenchido após execução]
  - Desvio Padrão: [será preenchido após execução]

#### 3.2.2 Teste de Hipótese

- **T-statistic**: [será preenchido após execução]
- **P-value**: [será preenchido após execução]
- **Diferença significativa**: [SIM/NÃO - será determinado após execução]
- **Tamanho do efeito (Cohen's d)**: [será preenchido após execução]

#### 3.2.3 Intervalos de Confiança (95%)

- **REST**: [será preenchido após execução]
- **GraphQL**: [será preenchido após execução]

#### 3.2.4 Análise por Cenário

Para cada cenário individual, os resultados são analisados separadamente para identificar padrões específicos. Consulte o arquivo `code/data/analysis-results.json` para detalhes completos.

### 3.3 Resultados para RQ2: Tamanho da Resposta

**Pergunta**: Respostas às consultas GraphQL tem tamanho menor que respostas às consultas REST?

#### 3.3.1 Estatísticas Descritivas (Geral)

Os resultados gerais agregando todos os cenários mostram:

- **REST API**: 
  - Média: [será preenchido após execução]
  - Mediana: [será preenchido após execução]
  - Desvio Padrão: [será preenchido após execução]

- **GraphQL API**: 
  - Média: [será preenchido após execução]
  - Mediana: [será preenchido após execução]
  - Desvio Padrão: [será preenchido após execução]

#### 3.3.2 Teste de Hipótese

- **T-statistic**: [será preenchido após execução]
- **P-value**: [será preenchido após execução]
- **Diferença significativa**: [SIM/NÃO - será determinado após execução]
- **Tamanho do efeito (Cohen's d)**: [será preenchido após execução]

#### 3.3.3 Intervalos de Confiança (95%)

- **REST**: [será preenchido após execução]
- **GraphQL**: [será preenchido após execução]

#### 3.3.4 Análise por Cenário

Para cada cenário individual, os resultados são analisados separadamente. Consulte o arquivo `code/data/analysis-results.json` para detalhes completos.

### 3.4 Resumo dos Resultados

Após a execução do experimento, o script de análise fornece um resumo indicando:
- Em quantos cenários GraphQL foi mais rápido que REST
- Em quantos cenários GraphQL teve respostas menores que REST

## 4. Discussão

### 4.1 Interpretação dos Resultados

[Esta seção será preenchida após a execução do experimento e análise dos resultados. Deve incluir:]

- Interpretação dos resultados estatísticos obtidos
- Comparação entre os resultados esperados e os observados
- Explicação dos padrões identificados
- Análise das diferenças entre cenários simples e complexos

### 4.2 Respostas às Perguntas de Pesquisa

#### 4.2.1 RQ1: Tempo de Resposta

[Após análise dos dados, responder se GraphQL é mais rápido que REST, com base nos testes estatísticos realizados.]

#### 4.2.2 RQ2: Tamanho da Resposta

[Após análise dos dados, responder se GraphQL produz respostas menores que REST, com base nos testes estatísticos realizados.]

### 4.3 Limitações do Estudo

1. **Escala limitada**: O experimento utiliza dados sintéticos em pequena escala. Resultados podem não se generalizar para sistemas de produção.

2. **Ambiente controlado**: Execução em ambiente local não reflete condições reais de rede distribuída.

3. **Cenários limitados**: Embora representativos, os cenários não cobrem todas as possíveis variações de consultas.

4. **Implementação específica**: Os resultados são específicos para as implementações testadas e podem variar com diferentes bibliotecas e configurações.

### 4.4 Trabalhos Futuros

Possíveis extensões deste estudo incluem:

1. **Experimentos em escala**: Testar com volumes maiores de dados e em ambientes de produção
2. **Diferentes complexidades**: Incluir cenários com diferentes níveis de aninhamento e filtros
3. **Análise de cache**: Investigar o impacto de estratégias de cache em ambas as abordagens
4. **Métricas adicionais**: Incluir métricas como uso de CPU, memória e throughput
5. **Replicação**: Replicar o experimento em diferentes ambientes e configurações

## 5. Conclusão

[Esta seção será preenchida após a análise completa dos resultados, resumindo os principais achados e suas implicações práticas.]

## 6. Referências

- GraphQL Specification: https://graphql.org/
- REST Architectural Style: Fielding, R. T. (2000). Architectural Styles and the Design of Network-based Software Architectures
- Cohen, J. (1988). Statistical Power Analysis for the Behavioral Sciences (2nd ed.)

## 7. Apêndices

### 7.1 Reprodução do Experimento

Para reproduzir este experimento:

1. Instale as dependências:
   ```bash
   cd code
   npm run install-all
   ```

2. Inicie as APIs:
   ```bash
   # Terminal 1
   npm run start:rest
   
   # Terminal 2
   npm run start:graphql
   ```

3. Execute a coleta de dados:
   ```bash
   # Terminal 3
   npm run collect-data
   ```

4. Execute a análise:
   ```bash
   npm run analyze
   ```

5. Visualize os resultados no dashboard:
   ```bash
   python dashboard.py
   ```

### 7.2 Estrutura de Arquivos

```
.
├── EXPERIMENT_DESIGN.md          # Desenho do experimento
├── RELATORIO_FINAL.md            # Este relatório
├── dashboard.py                  # Dashboard de visualização
└── code/
    ├── rest-api/                 # API REST
    ├── graphql-api/              # API GraphQL
    ├── experiments/              # Scripts de coleta e análise
    ├── shared/                   # Dados compartilhados
    └── data/                     # Resultados do experimento
        ├── experiment-results.csv
        ├── experiment-results.json
        └── analysis-results.json
```

