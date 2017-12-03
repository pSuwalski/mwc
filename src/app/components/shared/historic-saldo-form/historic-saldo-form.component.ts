import { Component, OnInit, Input } from '@angular/core';
import { ContactData, Saldo } from '../../../models/owner';

@Component({
  selector: 'mwc-historic-saldo-form',
  templateUrl: './historic-saldo-form.component.html',
  styleUrls: ['./historic-saldo-form.component.css']
})
export class HistoricSaldoFormComponent implements OnInit {

  @Input() historicSaldo: Saldo;
  @Input() editionDisabled = false;
  constructor() { }

  ngOnInit() {
  }

}
