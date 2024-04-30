$(document).ready(function() {
    $('#filtro-form').submit(function(event) {
        event.preventDefault(); // Evitar o envio do formulário
        filtrarTabela(); // Aplicar filtro à tabela
    });

    function filtrarTabela() {
        // Mostrar todas as linhas da tabela
        $('#monitorias-table table tbody tr').show();

        // Aplicar filtros
        filtrarLinhas($('#filtro_projeto').val(), 2);
        filtrarLinhas($('#filtro_categoria').val(), 8);
        filtrarLinhas($('#filtro_nome_analista').val().toLowerCase(), 3, 'indexOf');
        filtrarLinhas($('#filtro_id_atendimento').val().toLowerCase(), 4, 'indexOf');
        filtrarLinhas($('#filtro_chamado').val().toLowerCase(), 6, 'indexOf');
        filtrarLinhas($('#filtro_nome_cliente').val().toLowerCase(), 7, 'indexOf');
        filtrarLinhas($('#filtro_nota').val().toLowerCase(), 9, 'indexOf');
        filtrarLinhas($('#filtro_data').val(), 1);
    }

    function filtrarLinhas(value, column, method = '!==') {
        if (!value) return; // Se o valor estiver vazio, não há necessidade de filtrar

        $('#monitorias-table table tbody tr').each(function() {
            var cellText = $(this).find('td:nth-child(' + column + ')').text().toLowerCase();
            var showRow = false;
            if (method === '!==') {
                showRow = (cellText !== value.toLowerCase());
            } else if (method === 'indexOf') {
                showRow = (cellText.indexOf(value) === -1);
            }
            if (showRow) {
                $(this).hide();
            }
        });
    }

    // AJAX para obter dados de monitorias
    $.ajax({
        url: '/monitorias_json',
        type: 'GET',
        success: function(data) {
            var monitorias = JSON.parse(data);
            // Exibir os dados das monitorias na página
            var table = '<table id="tabelaMonitorias" class="display">';
            table += '<h2>Tabela de monitorias</h2><thead><tr><th>Data</th><th>Projeto</th><th>Nome do Analista</th><th>Call ID</th><th>Duração</th><th>Chamado</th><th>Nome do Cliente</th><th>Categoria</th><th>Nota</th><th>Observação</th></tr></thead><tbody>';
            for (var i = 0; i < monitorias.length; i++) {
                table += '<tr>';
                table += '<td>' + monitorias[i].data + '</td>';
                table += '<td>' + monitorias[i].projeto + '</td>';
                table += '<td>' + monitorias[i].nome_analista + '</td>';
                table += '<td>' + monitorias[i].id_atendimento + '</td>';
                table += '<td>' + monitorias[i].duracao + '</td>';
                table += '<td>' + monitorias[i].chamado + '</td>';
                table += '<td>' + monitorias[i].nome_cliente + '</td>';
                table += '<td>' + monitorias[i].categoria + '</td>';
                table += '<td>' + monitorias[i].nota + '</td>';
                table += '<td>' + (monitorias[i].observacao ? monitorias[i].observacao : '') + '</td>';
                table += '</tr>';
            }
            table += '</tbody></table>';
            $('#monitorias-table').html(table);

            

            // Exibir mensagem de confirmação se necessário
            var mensagemStatus = $('#mensagem_status').val();
            if (mensagemStatus === 'visivel') {
                $('#mensagem_registro').addClass('mensagem_visivel');
            }
        }
    });

    // Ação ao clicar no botão "Limpar formulário"
    $('#registrar_nova_monitoria').click(function() {
        // Ocultar a mensagem de confirmação
        $('#mensagem_registro').addClass('mensagem_oculta');
        $('#mensagem_status').val('invisivel');
        // Limpar os valores dos campos do formulário
        $('#projeto, #nome_analista, #id_atendimento, #duracao, #chamado, #nome_cliente, #categoria, #nota, #observacao').val("");
    });

    // Função para redirecionar para a página inicial após um tempo
    function redirecionarParaPaginaInicial() {
        // Verificar se a mensagem está presente na URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('mensagem')) {
            // Aguardar 2 segundos e redirecionar para a URL inicial
            setTimeout(function() {
                window.location.href = "/";
            }, 2000); // 2000 milissegundos = 2 segundos
        }
    }

    // Chamar a função de redirecionamento assim que o documento estiver pronto
    redirecionarParaPaginaInicial();

    // Verificar se a mensagem está presente na URL após o redirecionamento
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('mensagem')) {
        // Chamar a função de redirecionamento novamente
        redirecionarParaPaginaInicial();
    }
});