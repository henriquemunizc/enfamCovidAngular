import { Component, OnInit, Input } from '@angular/core';
import { ElasticCovidModel } from '../models/elastic.model';


@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent implements OnInit {

  @Input() resultadoAtual: any;
  objElastic = new ElasticCovidModel();


  constructor() { }

  ngOnInit() {
    this.objElastic.source = this.resultadoAtual._source;
    this.objElastic.highlight = this.resultadoAtual.highlight;
    console.log(this.objElastic);
  }


}
