const { cardapio } = require('./cardapio');
 
class CaixaDaLanchonete { 
    #entrada(itens) {
        let itensComprar = [];   
        itens.forEach(item => {
            const [codigo, quantidade] = item.split(',');
            itensComprar.push({
                codigo: codigo,
                quantidade: parseInt(quantidade),
            }); 
        });  
        return itensComprar;    
    }  
    
    #verificarEntrada(metodoDePagamento, itens) {
        let itensComprar = this.#entrada(itens);
        let message = "";
        
        if (itensComprar.length === 0) {
            message = "Não há itens no carrinho de compra!";
        } else { 
            itensComprar.forEach(item => {
                if (item.quantidade <= 0) {
                    message = "Quantidade inválida!" 
                } else if (
                    (item.codigo === "chantily" && !itensComprar.some(i => i.codigo === "cafe")) || 
                    (item.codigo === "queijo" && !itensComprar.some(i => i.codigo === "sanduiche")) ||
                    (item.codigo === "combo1" || item.codigo === "combo2")
                ) {
                    message = "Item extra não pode ser pedido sem o principal"; 
                } else if (!cardapio.map(i => i.codigo).includes(item.codigo)) {
                    message = "Item inválido!"; 
                } else if (!["dinheiro", "credito", "debito"].includes(metodoDePagamento)) {
                    message = "Forma de pagamento inválida!";
                } 
            }); 
        }
        
        if (message !== "") {
            return message;
        } else {
            return itensComprar;
        }

        
    } 
    
    calcularValorDaCompra(metodoDePagamento, itens) {
        let itensVerificados = this.#verificarEntrada(metodoDePagamento, itens);   
        if (Array.isArray(itensVerificados)) { 
            let valorTotal = 0; 
            itensVerificados.forEach(item => {
                const itemCardapio = cardapio.find(itemCard => itemCard.codigo === item.codigo); 
                valorTotal += itemCardapio.valor * item.quantidade;
            }); 
            
            let valorFinal = 0;
            if (metodoDePagamento === "dinheiro") {
                const desconto = 0.05;
                valorFinal = valorTotal - (valorTotal * desconto);
            } else if (metodoDePagamento === "credito") { 
                const acrescimo = 0.03;
                valorFinal = valorTotal + (valorTotal * acrescimo);
            } else if (metodoDePagamento === "debito") {
                valorFinal = valorTotal;
            }
            
            return `R$ ${valorFinal.toFixed(2).replace('.', ',')}`;
        } else {
            return itensVerificados;
        }
    }
} 

module.exports = { CaixaDaLanchonete };