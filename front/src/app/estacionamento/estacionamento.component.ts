import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-estacionamento',
  templateUrl: './estacionamento.component.html',
  styleUrls: ['./estacionamento.component.css']
})
export class EstacionamentoComponent {
  modelo: string = '';
  placa: string = '';
  successMessage: string | null = null;

  erroTitulo: string = '';
  erroMensagem: string = '';
  remainingTime: number = 0; // Tempo restante para a próxima requisição
  ultimoModelo: string = '';
  ultimaPlaca: string = '';

  constructor(private http: HttpClient) {
    this.checkCooldown();

    // Recupera o último veículo registrado no localStorage
    const modelo = localStorage.getItem('UltimoModelo');
    const placa = localStorage.getItem('UltimaPlaca');

    this.ultimoModelo = modelo ? modelo : '';
    this.ultimaPlaca = placa ? placa : '';
  }

  limparCampos() {
    this.erroMensagem = '';
    this.erroTitulo = '';
    this.modelo = '';
    this.placa = '';
  }

  checkCooldown() {
    const lastRequestTime = localStorage.getItem('lastRequestTimeEstacionamento');
    if (lastRequestTime) {
      const elapsedTime = (Date.now() - parseInt(lastRequestTime, 10)) / 1000;
      const cooldown = 30 - elapsedTime;

      if (cooldown > 0) {
        this.remainingTime = Math.ceil(cooldown);
        setTimeout(() => this.updateRemainingTime(), 1000);
      } else {
        this.remainingTime = 0;
      }
    }
  }

  updateRemainingTime() {
    if (this.remainingTime && this.remainingTime > 0) {
      this.remainingTime--;
      setTimeout(() => this.updateRemainingTime(), 1000);
    } else {
      this.remainingTime = 0;
    }
  }

  sendRequestEstacionamento() {
    if (this.modelo.toUpperCase().trim() === '') {
      alert('Digite o modelo do veículo.');
      return;
    }

    if (this.placa.toUpperCase().trim() === '') {
      alert('Digite a placa do veículo.');
      return;
    }

    // Verifica o tempo de cooldown
    const lastRequestTime = localStorage.getItem('lastRequestTimeEstacionamento');
    if (lastRequestTime) {
      const elapsedTime = (Date.now() - parseInt(lastRequestTime, 10)) / 1000;
      if (elapsedTime < 30) {
        alert(`Aguarde ${30 - Math.floor(elapsedTime)} segundos antes de fazer outra requisição.`);
        return;
      }
    }

    const estacionamento = [
      {
        name: 'Modelo',
        text: {
          text: this.modelo.toUpperCase()
        }
      },
      {
        name: 'Placa',
        text: {
          text: this.placa.toUpperCase()
        }
      }
    ];

    const urlEstacionamento = 'http://' + environment.ip + '/estacionamento';

    this.http.post(urlEstacionamento, estacionamento).subscribe({
      next: (response) => {
        this.successMessage = 'Operação realizada com sucesso!';

        // Salva o timestamp da última requisição e os dados do veículo no localStorage
        localStorage.setItem('lastRequestTimeEstacionamento', Date.now().toString());
        localStorage.setItem('UltimoModelo', this.modelo.toUpperCase());
        localStorage.setItem('UltimaPlaca', this.placa.toUpperCase());

        // Atualiza os últimos dados registrados
        this.ultimoModelo = this.modelo.toUpperCase();
        this.ultimaPlaca = this.placa.toUpperCase();

        this.checkCooldown();
        this.limparCampos();

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        this.erroTitulo = `Erro ao mostrar ${this.modelo.toUpperCase()} - ${this.placa.toUpperCase()} na tela.`;
        this.erroMensagem = error.error.details;
      }
    });
  }
}
