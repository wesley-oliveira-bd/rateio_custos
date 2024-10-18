function calcularCusto() {
    const ipi = parseFloat(document.getElementById('ipi').value) || 0;
    const icmsST = parseFloat(document.getElementById('icmsST').value) || 0;
    const frete = parseFloat(document.getElementById('frete').value) || 0;
    const adicional = parseFloat(document.getElementById('adicional').value) || 0;

    const produtos = document.querySelectorAll('.produto');
    let valorCustoTotal = 0;

    // Primeiro, calcular o custo total de todos os produtos
    produtos.forEach((produto) => {
        const quantidade = parseFloat(produto.querySelector('.quantidade').value) || 0;
        const custoUnitario = parseFloat(produto.querySelector('.custoUnitario').value) || 0;
        const custoTotalProduto = quantidade * custoUnitario;
        valorCustoTotal += custoTotalProduto;
    });

    let valorCustoCalculadoTotal = 0;

    // Em seguida, ratear os tributos proporcionalmente
    produtos.forEach((produto) => {
        const quantidade = parseFloat(produto.querySelector('.quantidade').value) || 0;
        const custoUnitario = parseFloat(produto.querySelector('.custoUnitario').value) || 0;
        const margem = parseFloat(produto.querySelector('.margem').value) || 0;

        const custoTotalProduto = quantidade * custoUnitario;

        // Calcula a proporção do custo total
        const proporcao = custoTotalProduto / valorCustoTotal;

        // Rateia os custos adicionais proporcionalmente
        const custoAdicional = proporcao * (ipi + icmsST + frete + adicional);

        // Custo calculado unitário = custo unitário + parte proporcional dos custos adicionais
        const custoCalculadoUnitario = custoUnitario + (custoAdicional / quantidade);
        const custoCalculado = custoTotalProduto + custoAdicional;

        valorCustoCalculadoTotal += custoCalculado;

        // Atualiza os campos de custo calculado unitário e custo calculado total
        produto.querySelector('.custoCalculadoUnitario').value = custoCalculadoUnitario.toFixed(2);
        produto.querySelector('.custoCalculado').value = custoCalculado.toFixed(2);
        
        // Atualiza o campo de valor de venda
        produto.querySelector('.valorVenda').value = (custoCalculadoUnitario * (1 + margem / 100)).toFixed(2);
    });

    // Atualiza os totais no final da página
    document.getElementById('custoTotal').textContent = valorCustoTotal.toFixed(2);
    document.getElementById('custoCalculadoTotal').textContent = valorCustoCalculadoTotal.toFixed(2);
}


function exportarRelatorio() {
    window.print();
}

// Adiciona um listener a todos os inputs da tabela
document.querySelectorAll('#produtos input').forEach(input => {
    input.addEventListener('keydown', function(event) {
        // Verifica se a tecla pressionada é "Enter"
        if (event.key === 'Enter') {
            // Verifica se o campo com foco é o último campo da linha
            const currentRow = this.closest('tr');
            const lastInput = currentRow.querySelector('td:last-child input');
            if (this === lastInput) {
                event.preventDefault(); // Previne o comportamento padrão
                adicionarNovaLinhaProduto();
            }
        }
    });
    document.getElementById('dataAtual').valueAsDate = new Date();
});

function adicionarNovaLinhaProduto() {
    const tabela = document.getElementById('produtos');

    const novaLinha = document.createElement('tr');
    novaLinha.classList.add('produto');

    novaLinha.innerHTML = `
        <td><input type="text" class="codigo"></td>
        <td><input type="number" class="quantidade" step="0.01"></td>
        <td><input type="text" class="referencia"></td>
        <td><input type="number" class="custoUnitario" step="0.01"></td>
        <td><input type="number" class="custoCalculadoUnitario" readonly></td> <!-- Novo campo -->
        <td><input type="number" class="custoCalculado" readonly></td>
        <td><input type="number" class="margem" step="0.01"></td>
        <td><input type="number" class="valorVenda"></td>
        <td><button onclick="adicionarNovaLinhaProduto()">+</button></td>
    `;

    tabela.appendChild(novaLinha);

    // Colocar foco no primeiro input da nova linha
    const novosInputs = novaLinha.querySelectorAll('input');
    if (novosInputs.length > 0) {
        novosInputs[0].focus();
    }
}
