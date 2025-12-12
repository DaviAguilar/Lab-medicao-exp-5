# Relatório Experimental – Avaliação Quantitativa de APIs REST e GraphQL

## 1. Introdução

A linguagem de consulta **GraphQL**, proposta originalmente pelo Facebook, surgiu como uma alternativa às tradicionais APIs baseadas em **REST** para o desenvolvimento de aplicações Web. Enquanto APIs REST expõem dados por meio de *endpoints* previamente definidos, GraphQL adota um modelo baseado em grafos, no qual os dados são descritos por *schemas* e os clientes podem especificar exatamente quais informações desejam obter.

Desde sua introdução, diversas organizações migraram total ou parcialmente de soluções REST para GraphQL, mantendo compatibilidade com APIs REST legadas, mas explorando os potenciais benefícios da nova abordagem. Apesar dessa adoção crescente, ainda não é totalmente claro quais são os **benefícios quantitativos reais** da utilização de GraphQL em comparação com REST, especialmente no que se refere a desempenho e eficiência de comunicação.

Nesse contexto, o objetivo deste experimento controlado é **avaliar quantitativamente os benefícios da adoção de uma API GraphQL em detrimento de uma API REST**, respondendo às seguintes perguntas de pesquisa:

- **RQ1**: Respostas às consultas GraphQL são mais rápidas que respostas às consultas REST?
- **RQ2**: Respostas às consultas GraphQL têm tamanho menor que respostas às consultas REST?

A partir dessas perguntas, foram formuladas as seguintes hipóteses:

### Hipóteses

**RQ1 – Tempo de resposta**
- **H0₁ (Hipótese nula)**: Não há diferença estatisticamente significativa entre o tempo de resposta das consultas GraphQL e REST.
- **H1₁ (Hipótese alternativa)**: Consultas GraphQL apresentam menor tempo de resposta do que consultas REST.

**RQ2 – Tamanho da resposta**
- **H0₂ (Hipótese nula)**: Não há diferença estatisticamente significativa entre o tamanho das respostas GraphQL e REST.
- **H1₂ (Hipótese alternativa)**: Consultas GraphQL produzem respostas menores do que consultas REST.

---

## 2. Metodologia

Esta seção descreve detalhadamente o desenho experimental, permitindo a **reprodução e replicação** do experimento.

### 2.1 Desenho do Experimento

#### A. Variáveis Independentes
- Estilo de API: **REST** e **GraphQL**.

#### B. Variáveis Dependentes
- Tempo de resposta das requisições (em milissegundos).
- Tamanho da resposta retornada (em bytes).

#### C. Tratamentos
Os tratamentos consistem na execução de consultas equivalentes em duas APIs funcionalmente idênticas:
- Uma API implementada seguindo o estilo arquitetural REST.
- Uma API implementada utilizando GraphQL.

#### D. Objetos Experimentais
- Serviços Web REST e GraphQL desenvolvidos sobre o mesmo conjunto de dados.
- Scripts automatizados responsáveis pela execução das consultas e coleta das métricas.

#### E. Tipo de Projeto Experimental
O experimento segue um **projeto experimental controlado e comparativo**, no qual os mesmos cenários de consulta são aplicados aos dois tratamentos.

#### F. Quantidade de Medições
Para cada cenário de consulta foram realizados múltiplos *trials*, de forma a reduzir o impacto de variações ocasionais e permitir análise estatística dos resultados.

#### G. Ameaças à Validade
- **Validade interna**: variações de carga e processos concorrentes no ambiente local.
- **Validade externa**: execução em ambiente local, sem considerar latência e instabilidade de redes reais.
- **Validade de construção**: métricas limitadas a tempo e tamanho de resposta.
- **Validade de conclusão**: quantidade limitada de medições pode impactar a força estatística.

---

## 3. Preparação e Execução do Experimento

### 3.1 Ambiente Experimental

Os *trials* foram executados em ambiente local com as seguintes configurações:

- Sistema Operacional: ambiente desktop local
- Linguagem: JavaScript
- Runtime: Node.js
- Frameworks:
  - REST: Express.js
  - GraphQL: Apollo Server
- Ferramentas de análise e visualização:
  - Pandas
  - Matplotlib e Seaborn

### 3.2 Procedimento Experimental

1. Implementação das APIs REST e GraphQL com dados e funcionalidades equivalentes.
2. Definição de cenários de consulta compatíveis entre as duas abordagens.
3. Execução automatizada das consultas por meio de scripts.
4. Coleta das métricas de tempo de resposta e tamanho da resposta.
5. Armazenamento dos dados coletados para análise posterior.

---

## 4. Análise de Resultados

### 4.1 Revisão Inicial dos Dados

Os dados coletados foram inicialmente revisados com o objetivo de identificar valores atípicos ou inconsistentes. Não foram observadas medições fora do intervalo esperado que justificassem a exclusão de amostras.

### 4.2 Resultados para RQ1 – Tempo de Resposta

A análise estatística dos tempos de resposta indicou que:
- Em cenários simples, REST e GraphQL apresentaram desempenhos semelhantes.
- Em cenários mais complexos, GraphQL apresentou tempos de resposta inferiores ou equivalentes aos do REST.

Esses resultados fornecem **evidência parcial** para rejeição da hipótese nula H0₁, sugerindo que GraphQL pode apresentar melhor desempenho em consultas mais elaboradas.

### 4.3 Resultados para RQ2 – Tamanho da Resposta

Os resultados mostram que, em todos os cenários avaliados, as respostas GraphQL apresentaram **tamanho médio inferior** às respostas REST. Esse comportamento está associado à capacidade do GraphQL de retornar apenas os campos explicitamente solicitados pelo cliente.

Dessa forma, os resultados permitem rejeitar a hipótese nula H0₂, apoiando a hipótese alternativa H1₂.

---

## 5. Discussão Final

Os resultados obtidos indicam que a adoção de GraphQL oferece benefícios claros em termos de **eficiência de comunicação**, especialmente no que se refere ao tamanho das respostas (RQ2). Em relação ao tempo de resposta (RQ1), os ganhos são dependentes do cenário, sendo mais evidentes em consultas mais complexas.

Apesar dos resultados positivos, o experimento apresenta limitações relacionadas ao ambiente controlado e à ausência de variabilidade de rede real. Assim, a generalização dos resultados deve ser realizada com cautela.

Como trabalhos futuros, sugere-se:
- Execução do experimento em ambientes distribuídos.
- Avaliação de métricas adicionais, como consumo de CPU e memória.
- Ampliação do conjunto de cenários e do volume de dados analisados.

Ainda assim, este estudo fornece evidências quantitativas relevantes para apoiar decisões sobre a adoção de APIs REST ou GraphQL.
