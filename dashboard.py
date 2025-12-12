"""
Dashboard de Visualização - GraphQL vs REST Experiment
Lab05S03 - Criação de dashboard para exibição dos resultados

Este script importa os dados resultantes do experimento e processa-os para gerar
tabelas e gráficos que permitam uma interpretação clara das diferenças entre
REST e GraphQL com base nas métricas avaliadas nas perguntas de pesquisa (RQ1 e RQ2).
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import json
import os
from pathlib import Path

# Configuração do estilo
sns.set_style("whitegrid")
sns.set_palette("husl")
plt.rcParams['figure.figsize'] = (14, 8)
plt.rcParams['font.size'] = 10

# Cores para as APIs
REST_COLOR = '#3498db'
GRAPHQL_COLOR = '#e74c3c'

def load_data():
    """Carrega os dados do experimento"""
    # Tenta encontrar o arquivo de dados
    base_path = Path(__file__).parent
    data_path = base_path / 'code' / 'data' / 'experiment-results.json'
    
    if not data_path.exists():
        print(f"Erro: Arquivo de dados não encontrado em {data_path}")
        print("Por favor, execute primeiro a coleta de dados:")
        print("  cd code && npm run collect-data")
        return None
    
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    df = pd.DataFrame(data)
    
    # Filtra apenas requisições bem-sucedidas
    df = df[df['success'] == True]
    
    return df

def load_analysis_results():
    """Carrega os resultados da análise estatística"""
    base_path = Path(__file__).parent
    analysis_path = base_path / 'code' / 'data' / 'analysis-results.json'
    
    if not analysis_path.exists():
        print(f"Aviso: Arquivo de análise não encontrado em {analysis_path}")
        print("Execute primeiro a análise: cd code && npm run analyze")
        return None
    
    with open(analysis_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def create_summary_table(df):
    """Cria tabela resumo com estatísticas descritivas"""
    print("\n" + "="*80)
    print("TABELA RESUMO - ESTATÍSTICAS DESCRITIVAS")
    print("="*80)
    
    summary = df.groupby('apiType').agg({
        'responseTime': ['mean', 'median', 'std', 'min', 'max'],
        'responseSize': ['mean', 'median', 'std', 'min', 'max']
    }).round(2)
    
    print("\nTempo de Resposta (ms):")
    print(summary['responseTime'])
    
    print("\nTamanho da Resposta (bytes):")
    print(summary['responseSize'])
    
    return summary

def plot_response_time_comparison(df):
    """Gráfico 1: Comparação de tempo de resposta (RQ1)"""
    fig, axes = plt.subplots(2, 2, figsize=(16, 12))
    fig.suptitle('RQ1: Comparação de Tempo de Resposta - GraphQL vs REST', 
                 fontsize=16, fontweight='bold')
    
    # 1. Box plot geral
    ax1 = axes[0, 0]
    df.boxplot(column='responseTime', by='apiType', ax=ax1, 
               patch_artist=True, 
               boxprops=dict(facecolor='lightblue', alpha=0.7))
    ax1.set_title('Distribuição de Tempo de Resposta (Todos os Cenários)')
    ax1.set_xlabel('Tipo de API')
    ax1.set_ylabel('Tempo de Resposta (ms)')
    ax1.grid(True, alpha=0.3)
    plt.setp(ax1.get_xticklabels(), rotation=0)
    
    # 2. Violin plot
    ax2 = axes[0, 1]
    sns.violinplot(data=df, x='apiType', y='responseTime', ax=ax2,
                   palette=[REST_COLOR, GRAPHQL_COLOR])
    ax2.set_title('Distribuição de Densidade de Tempo de Resposta')
    ax2.set_xlabel('Tipo de API')
    ax2.set_ylabel('Tempo de Resposta (ms)')
    
    # 3. Comparação por cenário
    ax3 = axes[1, 0]
    scenario_means = df.groupby(['scenario', 'apiType'])['responseTime'].mean().unstack()
    scenario_means.plot(kind='bar', ax=ax3, color=[REST_COLOR, GRAPHQL_COLOR])
    ax3.set_title('Tempo Médio de Resposta por Cenário')
    ax3.set_xlabel('Cenário')
    ax3.set_ylabel('Tempo Médio (ms)')
    ax3.legend(['REST', 'GraphQL'])
    ax3.tick_params(axis='x', rotation=45)
    ax3.grid(True, alpha=0.3, axis='y')
    
    # 4. Histograma comparativo
    ax4 = axes[1, 1]
    rest_times = df[df['apiType'] == 'REST']['responseTime']
    graphql_times = df[df['apiType'] == 'GraphQL']['responseTime']
    ax4.hist(rest_times, bins=30, alpha=0.6, label='REST', color=REST_COLOR)
    ax4.hist(graphql_times, bins=30, alpha=0.6, label='GraphQL', color=GRAPHQL_COLOR)
    ax4.set_title('Distribuição de Frequência de Tempo de Resposta')
    ax4.set_xlabel('Tempo de Resposta (ms)')
    ax4.set_ylabel('Frequência')
    ax4.legend()
    ax4.grid(True, alpha=0.3, axis='y')
    
    plt.tight_layout()
    plt.savefig('response_time_comparison.png', dpi=300, bbox_inches='tight')
    print("\n✓ Gráfico salvo: response_time_comparison.png")
    return fig

def plot_response_size_comparison(df):
    """Gráfico 2: Comparação de tamanho de resposta (RQ2)"""
    fig, axes = plt.subplots(2, 2, figsize=(16, 12))
    fig.suptitle('RQ2: Comparação de Tamanho de Resposta - GraphQL vs REST', 
                 fontsize=16, fontweight='bold')
    
    # 1. Box plot geral
    ax1 = axes[0, 0]
    df.boxplot(column='responseSize', by='apiType', ax=ax1,
               patch_artist=True,
               boxprops=dict(facecolor='lightgreen', alpha=0.7))
    ax1.set_title('Distribuição de Tamanho de Resposta (Todos os Cenários)')
    ax1.set_xlabel('Tipo de API')
    ax1.set_ylabel('Tamanho de Resposta (bytes)')
    ax1.grid(True, alpha=0.3)
    plt.setp(ax1.get_xticklabels(), rotation=0)
    
    # 2. Violin plot
    ax2 = axes[0, 1]
    sns.violinplot(data=df, x='apiType', y='responseSize', ax=ax2,
                   palette=[REST_COLOR, GRAPHQL_COLOR])
    ax2.set_title('Distribuição de Densidade de Tamanho de Resposta')
    ax2.set_xlabel('Tipo de API')
    ax2.set_ylabel('Tamanho de Resposta (bytes)')
    
    # 3. Comparação por cenário
    ax3 = axes[1, 0]
    scenario_means = df.groupby(['scenario', 'apiType'])['responseSize'].mean().unstack()
    scenario_means.plot(kind='bar', ax=ax3, color=[REST_COLOR, GRAPHQL_COLOR])
    ax3.set_title('Tamanho Médio de Resposta por Cenário')
    ax3.set_xlabel('Cenário')
    ax3.set_ylabel('Tamanho Médio (bytes)')
    ax3.legend(['REST', 'GraphQL'])
    ax3.tick_params(axis='x', rotation=45)
    ax3.grid(True, alpha=0.3, axis='y')
    
    # 4. Histograma comparativo
    ax4 = axes[1, 1]
    rest_sizes = df[df['apiType'] == 'REST']['responseSize']
    graphql_sizes = df[df['apiType'] == 'GraphQL']['responseSize']
    ax4.hist(rest_sizes, bins=30, alpha=0.6, label='REST', color=REST_COLOR)
    ax4.hist(graphql_sizes, bins=30, alpha=0.6, label='GraphQL', color=GRAPHQL_COLOR)
    ax4.set_title('Distribuição de Frequência de Tamanho de Resposta')
    ax4.set_xlabel('Tamanho de Resposta (bytes)')
    ax4.set_ylabel('Frequência')
    ax4.legend()
    ax4.grid(True, alpha=0.3, axis='y')
    
    plt.tight_layout()
    plt.savefig('response_size_comparison.png', dpi=300, bbox_inches='tight')
    print("✓ Gráfico salvo: response_size_comparison.png")
    return fig

def plot_scenario_analysis(df):
    """Gráfico 3: Análise detalhada por cenário"""
    scenarios = df['scenario'].unique()
    n_scenarios = len(scenarios)
    
    fig, axes = plt.subplots(n_scenarios, 2, figsize=(16, 4 * n_scenarios))
    fig.suptitle('Análise Detalhada por Cenário', fontsize=16, fontweight='bold')
    
    if n_scenarios == 1:
        axes = axes.reshape(1, -1)
    
    for idx, scenario in enumerate(scenarios):
        scenario_data = df[df['scenario'] == scenario]
        scenario_name = scenario_data['description'].iloc[0]
        
        # Tempo de resposta por cenário
        ax1 = axes[idx, 0]
        scenario_data.boxplot(column='responseTime', by='apiType', ax=ax1,
                              patch_artist=True)
        ax1.set_title(f'Tempo de Resposta: {scenario_name}')
        ax1.set_xlabel('Tipo de API')
        ax1.set_ylabel('Tempo (ms)')
        ax1.grid(True, alpha=0.3)
        plt.setp(ax1.get_xticklabels(), rotation=0)
        
        # Tamanho de resposta por cenário
        ax2 = axes[idx, 1]
        scenario_data.boxplot(column='responseSize', by='apiType', ax=ax2,
                              patch_artist=True)
        ax2.set_title(f'Tamanho de Resposta: {scenario_name}')
        ax2.set_xlabel('Tipo de API')
        ax2.set_ylabel('Tamanho (bytes)')
        ax2.grid(True, alpha=0.3)
        plt.setp(ax2.get_xticklabels(), rotation=0)
    
    plt.tight_layout()
    plt.savefig('scenario_analysis.png', dpi=300, bbox_inches='tight')
    print("✓ Gráfico salvo: scenario_analysis.png")
    return fig

def plot_correlation_analysis(df):
    """Gráfico 4: Análise de correlação entre tempo e tamanho"""
    fig, axes = plt.subplots(1, 2, figsize=(16, 6))
    fig.suptitle('Análise de Correlação: Tempo vs Tamanho de Resposta', 
                 fontsize=16, fontweight='bold')
    
    # Scatter plot REST
    ax1 = axes[0]
    rest_data = df[df['apiType'] == 'REST']
    ax1.scatter(rest_data['responseSize'], rest_data['responseTime'], 
               alpha=0.6, color=REST_COLOR, label='REST')
    ax1.set_xlabel('Tamanho de Resposta (bytes)')
    ax1.set_ylabel('Tempo de Resposta (ms)')
    ax1.set_title('REST API')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # Calcular correlação
    rest_corr = rest_data['responseSize'].corr(rest_data['responseTime'])
    ax1.text(0.05, 0.95, f'Correlação: {rest_corr:.3f}', 
            transform=ax1.transAxes, verticalalignment='top',
            bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))
    
    # Scatter plot GraphQL
    ax2 = axes[1]
    graphql_data = df[df['apiType'] == 'GraphQL']
    ax2.scatter(graphql_data['responseSize'], graphql_data['responseTime'], 
               alpha=0.6, color=GRAPHQL_COLOR, label='GraphQL')
    ax2.set_xlabel('Tamanho de Resposta (bytes)')
    ax2.set_ylabel('Tempo de Resposta (ms)')
    ax2.set_title('GraphQL API')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    
    # Calcular correlação
    graphql_corr = graphql_data['responseSize'].corr(graphql_data['responseTime'])
    ax2.text(0.05, 0.95, f'Correlação: {graphql_corr:.3f}', 
            transform=ax2.transAxes, verticalalignment='top',
            bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))
    
    plt.tight_layout()
    plt.savefig('correlation_analysis.png', dpi=300, bbox_inches='tight')
    print("✓ Gráfico salvo: correlation_analysis.png")
    return fig

def create_summary_statistics_table(df):
    """Cria tabela de estatísticas resumidas"""
    print("\n" + "="*80)
    print("ESTATÍSTICAS RESUMIDAS POR TIPO DE API")
    print("="*80)
    
    # Calcula estatísticas para responseTime
    time_stats = df.groupby('apiType')['responseTime'].agg(['mean', 'median', 'std', 'min', 'max']).round(2)
    time_stats.columns = ['Média', 'Mediana', 'Desvio Padrão', 'Mínimo', 'Máximo']
    time_stats.index.name = 'API Type'
    
    # Calcula estatísticas para responseSize
    size_stats = df.groupby('apiType')['responseSize'].agg(['mean', 'median', 'std', 'min', 'max']).round(2)
    size_stats.columns = ['Média', 'Mediana', 'Desvio Padrão', 'Mínimo', 'Máximo']
    size_stats.index.name = 'API Type'
    
    print("\nTempo de Resposta (ms):")
    print(time_stats)
    
    print("\nTamanho de Resposta (bytes):")
    print(size_stats)
    
    # Combina em um dicionário para retorno
    stats = {
        'responseTime': time_stats,
        'responseSize': size_stats
    }
    
    return stats

def print_analysis_summary(analysis_data):
    """Imprime resumo da análise estatística"""
    if not analysis_data:
        return
    
    print("\n" + "="*80)
    print("RESUMO DA ANÁLISE ESTATÍSTICA")
    print("="*80)
    
    overall = analysis_data.get('overall', {})
    
    # RQ1: Tempo de Resposta
    print("\nRQ1: Tempo de Resposta")
    print("-" * 80)
    if 'responseTime' in overall:
        rt = overall['responseTime']
        print(f"REST - Média: {rt['rest']['mean']:.2f} ms")
        print(f"GraphQL - Média: {rt['graphql']['mean']:.2f} ms")
        print(f"Tamanho do Efeito (Cohen's d): {rt['effectSize']:.3f}")
        print(f"Diferença Significativa: {'SIM' if rt['significant'] else 'NÃO'}")
    
    # RQ2: Tamanho de Resposta
    print("\nRQ2: Tamanho de Resposta")
    print("-" * 80)
    if 'responseSize' in overall:
        rs = overall['responseSize']
        print(f"REST - Média: {rs['rest']['mean']:.2f} bytes")
        print(f"GraphQL - Média: {rs['graphql']['mean']:.2f} bytes")
        print(f"Tamanho do Efeito (Cohen's d): {rs['effectSize']:.3f}")
        print(f"Diferença Significativa: {'SIM' if rs['significant'] else 'NÃO'}")

def main():
    """Função principal"""
    print("="*80)
    print("DASHBOARD DE VISUALIZAÇÃO - GraphQL vs REST Experiment")
    print("="*80)
    
    # Carrega dados
    print("\nCarregando dados do experimento...")
    df = load_data()
    
    if df is None:
        return
    
    print(f"✓ {len(df)} medições carregadas")
    print(f"  - REST: {len(df[df['apiType'] == 'REST'])} medições")
    print(f"  - GraphQL: {len(df[df['apiType'] == 'GraphQL'])} medições")
    
    # Carrega resultados da análise
    analysis_data = load_analysis_results()
    
    # Cria tabelas resumo
    summary_table = create_summary_table(df)
    stats_table = create_summary_statistics_table(df)
    
    # Imprime resumo da análise estatística
    print_analysis_summary(analysis_data)
    
    # Gera gráficos
    print("\n" + "="*80)
    print("GERANDO GRÁFICOS...")
    print("="*80)
    
    plot_response_time_comparison(df)
    plot_response_size_comparison(df)
    plot_scenario_analysis(df)
    plot_correlation_analysis(df)
    
    print("\n" + "="*80)
    print("DASHBOARD CONCLUÍDO!")
    print("="*80)
    print("\nGráficos gerados:")
    print("  1. response_time_comparison.png - Comparação de tempo de resposta")
    print("  2. response_size_comparison.png - Comparação de tamanho de resposta")
    print("  3. scenario_analysis.png - Análise detalhada por cenário")
    print("  4. correlation_analysis.png - Análise de correlação")
    print("\nPara visualizar os gráficos, abra os arquivos PNG gerados.")

if __name__ == '__main__':
    main()

