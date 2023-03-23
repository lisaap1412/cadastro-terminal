const fs = require("fs");

console.log('Olá pessoas!');
console.log('#DesafioAmiko');

class Assistentes {
  constructor(id, cliente, hospital, quarto) {
    this.id = id;
    this.cliente = cliente;
    this.hospital = hospital;
    this.quarto = quarto;
  }
}

class Gerenciador {
  constructor() {
    this.reservas = [];
    this.lerReservas();
  }

  criaReserva(id, cliente, hospital, quarto) {
    const reserva = new Assistentes(id, cliente, hospital, quarto);
    this.reservas.push(reserva);
    console.log(`Reserva criada com sucesso: ${JSON.stringify(reserva)}`);

    const linha = `${reserva.id},${reserva.cliente},${reserva.hospital},${reserva.quarto}\n`;
    const promise = new Promise((resolve, reject) => {
      fs.appendFile("dados.txt", linha, (err) => {
        if (err) {
          console.error(err);
          this.reservas.pop(); // remove a reserva adicionada no array
          reject(err);
        } else {
          resolve();
        }
      });
    });

    return promise;
  }

  lerReservas() {
    const fileContents = fs.readFileSync("dados.txt", "utf-8");
    const lines = fileContents.trim().split("\n");
    this.reservas = lines.map((line) => {
      const [id, cliente, hospital, quarto] = line.split(",");
      return new Assistentes(id, cliente, hospital, quarto);
    });
  }

  pegaReservas() {
    return this.reservas;
  }

  atualizaReserva(id, novoCliente, novoHospital, novoQuarto) {
    const reserva = this.reservas.find((r) => r.id === id);
    if (reserva) {
      reserva.cliente = novoCliente || reserva.cliente;
      reserva.hospital = novoHospital || reserva.hospital;
      reserva.quarto = novoQuarto || reserva.quarto;
      console.log(`Reserva atualizada com sucesso: ${JSON.stringify(reserva)}`);
      this.atualizaArquivo();
    } else {
      console.log(`Reserva com id ${id} não encontrada.`);
    }
  }

  removeReserva(id) {
    const reservasAtualizadas = this.reservas.filter((r) => r.id !== id);
    if (reservasAtualizadas.length === this.reservas.length) {
      console.log(`Reserva com id ${id} não encontrada.`);
    } else {
      this.reservas = reservasAtualizadas;
      console.log(`Reserva com id ${id} removida com sucesso.`);
      this.atualizaArquivo();
    }
  }

  atualizaArquivo() {
    const linhas = this.reservas.map((reserva) => `${reserva.id},${reserva.cliente},${reserva.hospital},${reserva.quarto}`).join('\n');
    fs.writeFile('dados.txt', linhas, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
}

if (!fs.existsSync("dados.txt")) {
    fs.writeFileSync("dados.txt", "");
  }
  
const gerenciador = new Gerenciador();
  
function execute() {
      const prompt = require("prompt-sync")();
      let option = prompt("Digite uma opção: (create = 1, read = 2, update = 3, delete = 4, exit)");
      switch (option) {
        case "1":
          let id = prompt("Digite o id: ");
          let cliente = prompt("Digite o nome do cliente: ");
          let hospital = prompt("Digite o nome do hospital: ");
          let quarto = prompt("Digite o número do quarto: ");
          gerenciador.criaReserva(id, cliente, hospital, quarto)
            .then(() => console.log("Reserva adicionada ao arquivo."))
            .catch((err) => console.error("Erro ao adicionar reserva ao arquivo:", err));
          break;
        case "2":
          console.log(gerenciador.pegaReservas());
          break;
        case "3":
          let idToUpdate = prompt("Digite o id da reserva que deseja atualizar: ");
          let novoCliente = prompt("Digite o novo nome do cliente (deixe em branco se não quiser atualizar): ");
          let novoHospital = prompt("Digite o novo nome do hospital (deixe em branco se não quiser atualizar): ");
          let novoQuarto = prompt("Digite o novo número do quarto (deixe em branco se não quiser atualizar): ");
          gerenciador.atualizaReserva(idToUpdate, novoCliente, novoHospital, novoQuarto);
          break;
        case "4":
          let idToRemove = prompt("Digite o id da reserva que deseja remover: ");
          gerenciador.removeReserva(idToRemove);
          break;
        case "exit":
          return;
        default:
          console.log("Opção inválida.");
          break;
      }
      execute();
    }
    execute();

