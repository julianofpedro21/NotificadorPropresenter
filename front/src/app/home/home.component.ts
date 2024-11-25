import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  conectadoPP: boolean = false;
  tipo: string = '';
  erro: any;
  private intervalId: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.validaPP();
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  kids() {
    this.validaPP();
    this.tipo = 'k';
  }

  estacionamento() {
    this.validaPP();
    this.tipo = 'e';
  }

  voltar() {
    this.validaPP();
    this.tipo = '';
  }

  validaPP() {
    this.http.get('http://' + environment.ip + '/validaPP').subscribe({
      next: (response) => {
        this.conectadoPP = true;
      },
      error: (error) => {
        this.conectadoPP = false;
        this.erro = error;
      }
    });
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      this.validaPP();
    }, 30000);
  }
}
