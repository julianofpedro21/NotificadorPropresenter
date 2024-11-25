import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-kids',
  templateUrl: './kids.component.html',
  styleUrls: ['./kids.component.css']
})
export class KidsComponent {
  inputValue: string = '';
  successMessage: string | null = null;

  erroTitulo: string = '';
  erroMensagem: string = '';
  remainingTime: number = 0;

  ultimoNumero:number = 0;

  constructor(private http: HttpClient) {
    this.checkCooldown();
    const numero = localStorage.getItem('Numero');
    if (numero)
      this.ultimoNumero = parseInt(numero);
    else
    this.ultimoNumero = 0;

  }

  limparCampos() {
    this.erroMensagem = '';
    this.erroTitulo = '';
    this.inputValue = '';
  }

  checkCooldown() {
    const lastRequestTime = localStorage.getItem('lastRequestTime');
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

  sendRequestKids() {
    if (this.inputValue.toString() === '') {
      alert('O número não pode ser 0');
      return;
    }

    if (environment.nrMaximoNumeroPai > 0 && parseInt(this.inputValue) > environment.nrMaximoNumeroPai){
      alert('Não é possível chamar um numero maior que ' + environment.nrMaximoNumeroPai);
      return;
    }

    const lastRequestTime = localStorage.getItem('lastRequestTime');
    if (lastRequestTime) {
      const elapsedTime = (Date.now() - parseInt(lastRequestTime, 10)) / 1000;
      if (elapsedTime < 30) {
        alert(`Aguarde ${30 - Math.floor(elapsedTime)} segundos antes de fazer outra requisição.`);
        return;
      }
    }

    const payload = [
      {
        name: 'Numero',
        text: {
          text: this.inputValue.toString()
        }
      }
    ];

    this.ultimoNumero = parseInt(this.inputValue);

    this.http.post('http://' + environment.ip + '/kid', payload).subscribe({
      next: (response) => {
        this.successMessage = 'Operação realizada com sucesso!';

        // Salva o timestamp da última requisição no localStorage
        localStorage.setItem('lastRequestTime', Date.now().toString());
        localStorage.setItem('Numero', this.inputValue.toString());
        this.checkCooldown();

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);

        this.limparCampos();
      },
      error: (error) => {
        this.erroTitulo = "Erro ao mostrar numero " + this.inputValue + " na tela.";
        this.erroMensagem = error.error.details;
      }
    });
  }
}
