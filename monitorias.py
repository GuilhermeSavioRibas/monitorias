import pandas as pd
import json
from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime


app = Flask(__name__, static_url_path='/static', static_folder='static')

# Função para carregar os dados da planilha Excel
def carregar_dados():
    try:
        return pd.read_excel('monitorias.xlsx')
    except FileNotFoundError:
        return pd.DataFrame(columns=['Data', 'Projeto', 'Nome_Analista', 'ID_Atendimento', 'Duracao', 'Chamado', 'Nome_Cliente', 'Categoria', 'Nota', 'Observacao'])

# Função para salvar os dados na planilha Excel
def salvar_dados(dados):
    dados.to_excel('monitorias.xlsx', index=False)

# Rota para exibir o formulário de registro de monitoria e as monitorias registradas
@app.route('/')
def formulario_monitoria():
    # Carregar os dados das monitorias
    monitorias = carregar_dados().to_dict('records')
    mensagem = request.args.get('mensagem')
    return render_template('formulario.html', monitorias=monitorias, today=datetime.now().strftime('%Y-%m-%d'), mensagem=mensagem)

# Rota para fornecer dados das monitorias em formato JSON
@app.route('/monitorias_json')
def monitorias_json():
    # Carregar dados das monitorias
    dados_monitorias = carregar_dados()
    # Converter dados para um formato JSON compatível
    monitorias_json = dados_monitorias.to_json(orient='records')
    return monitorias_json

# Rota para lidar com o envio do formulário
@app.route('/registrar', methods=['POST'])
def registrar_monitoria():
    # Extrair os dados do formulário
    data = request.form['data']
    projeto = request.form['projeto']
    nome_analista = request.form['nome_analista']
    id_atendimento = request.form['id_atendimento']
    duracao = request.form['duracao']
    chamado = request.form['chamado']
    nome_cliente = request.form['nome_cliente']
    categoria = request.form['categoria']
    nota = request.form['nota']
    # Verificar se o campo de observação está presente no formulário
    observacao = request.form.get('observacao', '')  # Se não estiver presente, usa uma string vazia
    # Carregar dados existentes
    dados = carregar_dados()

    # Adicionar nova entrada aos dados
    nova_linha = pd.DataFrame([[data, projeto, nome_analista, id_atendimento, duracao, chamado, nome_cliente, categoria, nota, observacao]], columns=dados.columns)
    dados = pd.concat([dados, nova_linha], ignore_index=True)

    # Salvar dados atualizados
    salvar_dados(dados)

    # Redirecionar para a página principal com mensagem de sucesso
    return redirect(url_for('formulario_monitoria', mensagem='Monitoria registrada com sucesso!'))

if __name__ == '__main__':
    app.run(debug=True)
