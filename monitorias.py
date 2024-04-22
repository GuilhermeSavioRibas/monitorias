import pandas as pd
from flask import Flask, render_template, request

app = Flask(__name__)

# Função para carregar os dados da planilha Excel
def carregar_dados():
    try:
        return pd.read_excel('monitorias.xlsx')
    except FileNotFoundError:
        return pd.DataFrame(columns=['Nome_Analista', 'Data', 'ID_Atendimento', 'Duracao', 'Nome_Cliente', 'Categoria'])

# Função para salvar os dados na planilha Excel
def salvar_dados(dados):
    dados.to_excel('monitorias.xlsx', index=False)

# Rota para exibir o formulário de registro de monitoria e as monitorias registradas
@app.route('/')
def formulario_monitoria():
    # Carregar os dados das monitorias
    monitorias = carregar_dados().to_dict('records')
    return render_template('formulario.html', monitorias=monitorias)

# Rota para lidar com o envio do formulário
@app.route('/registrar', methods=['POST'])
def registrar_monitoria():
    nome_analista = request.form['nome_analista']
    data = request.form['data']
    id_atendimento = request.form['id_atendimento']
    duracao = request.form['duracao']
    nome_cliente = request.form['nome_cliente']
    categoria = request.form['categoria']

    # Carregar dados existentes
    dados = carregar_dados()

    # Adicionar nova entrada aos dados
    nova_linha = pd.DataFrame([[nome_analista, data, id_atendimento, duracao, nome_cliente, categoria]], columns=dados.columns)
    dados = pd.concat([dados, nova_linha], ignore_index=True)

    # Salvar dados atualizados
    salvar_dados(dados)

    # Limpar campos do formulário
    request.form = {}

    return render_template('formulario.html', mensagem='Monitoria registrada com sucesso!')

if __name__ == '__main__':
    app.run(debug=True)