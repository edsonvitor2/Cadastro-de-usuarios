class Controller{
    constructor(){
        this.iniciarEventos();
        this.listarUsuarios();
    }
    iniciarEventos(){
        let numero = document.querySelector("#telefone");
        numero.addEventListener("keyup", () => {
            this.formatarNumero();
        });

        let btnEnviar = document.querySelector("#Btn-Enviar");
        btnEnviar.addEventListener("click", (e) => {
            e.preventDefault();
            this.salvarUsuarios();
        });

    }
    salvarUsuarios(){
        let nome = document.querySelector("#name").value;
        let telefone = document.querySelector("#telefone").value;
        // se editar for verdadeiro atualiza os dados do cliente selecionado.
        if(this.editar == true){
            firebase.database().ref('usuarios').child(this.key).update({
                nome:document.querySelector("#name").value,
                dataNasc:document.querySelector("#dataNasc").value,
                telefone:document.querySelector("#telefone").value,
                email:document.querySelector("#email").value,
                endereco:document.querySelector("#endereco").value
            });
            document.querySelector("#name").value = '';
            document.querySelector("#dataNasc").value = '';
            document.querySelector("#telefone").value = '';
            document.querySelector("#email").value = '';
            document.querySelector("#endereco").value = '';

            this.listarUsuarios();
            this.editar = false;
        }else // se não salva os dados no firebase.
            {
            if(nome == "" && telefone == ""){
            alert("Prencha os Campos!!!")
            }
        else{
            firebase.database().ref('usuarios').push({
                nome:document.querySelector("#name").value,
                dataNasc:document.querySelector("#dataNasc").value,
                telefone:document.querySelector("#telefone").value,
                email:document.querySelector("#email").value,
                endereco:document.querySelector("#endereco").value
            });
            document.querySelector("#name").value = '';
            document.querySelector("#dataNasc").value = '';
            document.querySelector("#telefone").value = '';
            document.querySelector("#email").value = '';
            document.querySelector("#endereco").value = '';

            this.listarUsuarios();
            }
        }
    }

    formatarData(data) {
        const partes = data.split('-');
        if (partes.length === 3) {
            const ano = partes[0];
            const mes = partes[1];
            const dia = partes[2];
            return `${dia}/${mes}/${ano}`;
        } else {
            return data; 
        }
    }

    listarUsuarios(){
        firebase.database().ref('usuarios').once('value', snapshot => {
            let tabela = document.querySelector("#tableUser");
            tabela.innerHTML = "";
    
            snapshot.forEach(element => {

                let dados = element.val();
                let key = element.key;

                // Converter a data de nascimento para o formato desejado
                let dataNascFormatada = this.formatarData(dados.dataNasc);
    
                let tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${dados.nome}</td>
                    <td>${dataNascFormatada}</td>
                    <td>${dados.email}</td>
                    <td>${dados.telefone}</td>
                    <td>${dados.endereco}</td>
                    <td class="edit"><button>Editar</button></td>
                    <td class="excluir"><button>Excluir</button></td>
                `;
                tabela.appendChild(tr);
                // editar usuario.
                tr.querySelector('.edit').addEventListener("click", e=>{
                    document.querySelector("#name").value = dados.nome;
                    document.querySelector("#dataNasc").value = dados.dataNasc;
                    document.querySelector("#telefone").value = dados.telefone;
                    document.querySelector("#email").value = dados.email;
                    document.querySelector("#endereco").value = dados.endereco;
                    this.editar = true;
                    this.key = key;
                });
                // excluir usuario.
                tr.querySelector('.excluir').addEventListener("click", e=>{
                    firebase.database().ref('usuarios').child(key).remove();
                    this.listarUsuarios();
                });
            });
        });
    }
    
    formatarNumero(){
        let numero = document.querySelector("#telefone");

        numero.addEventListener("input", () => {
            let telefone = document.querySelector("#telefone").value;
          
            // Remover caracteres não numéricos do número de telefone
            telefone = telefone.replace(/\D/g, "");
          
            // Formatar o número de telefone conforme desejado
            let telefoneFormatado = telefone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");
          
            // Definir o valor formatado no campo de telefone
            document.querySelector("#telefone").value = telefoneFormatado;
          });
    }
}

var controle = new Controller();