import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DTOParams } from '../Models/parms';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return this.http
      .get<DTOParams>('assets/config.json')
      .toPromise()
      .then((config) => {
        if (config) {
          environment.ip = config.ip;
          environment.nrMaximoNumeroPai = config.nrMaximoNumeroPai;
        } else {
          throw new Error('Configuração não encontrada.');
        }
      })
      .catch((error) => {
        console.error('Erro ao carregar configurações:', error);
        throw error;
      });
  }
}
