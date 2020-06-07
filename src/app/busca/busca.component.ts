import { ElasticCovidModel, SourceModel } from './../models/elastic.model';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Client } from 'elasticsearch-browser';
import { ElasticsearchService } from '../services/elasticsearch.service';
import { environment } from '../../environments/environment';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.css']
})

export class BuscaComponent implements OnInit {

  searchValue = 'Juiz';
  searchValueElastic = '';
  isConnected = false;
  status: string;
  objElastic: ElasticCovidModel;
  resultadoElastic: ElasticCovidModel[];
  expressao = '';

  qntdadeResultados = 0;
  pageSize = 10;
  textoAguardandoProcura = '';




  constructor(
    private es: ElasticsearchService,
    private cd: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.statusElastic();
    this.iniciaVariaveis();
  }

  iniciaVariaveis() {
    this.resultadoElastic = [];
    this.objElastic = new ElasticCovidModel();
    this.objElastic.source = new SourceModel();
    this.objElastic.source.index = environment.elasticIndex;
    this.objElastic.source.type = '_doc';
  }
  statusElastic() {
    this.es.isAvailable().then(() => {
      this.status = 'OK';
      this.isConnected = true;
    }, error => {
      this.status = 'ERROR';
      this.isConnected = false;
      console.error('Server is down', error);
    }).then(() => {
      this.cd.detectChanges();
    });
  }

  procurar(expressao: string) {
    this.expressao = expressao;
    this.resultadoElastic = [];
    this.textoAguardandoProcura = 'Aguarde a busca';
    this.es.fullTextSearch(
      this.objElastic.source.index,
      this.objElastic.source.type,
      'content', this.expressao, this.pageSize).then(
        response => {
          this.resultadoElastic = response.hits.hits;
          this.qntdadeResultados = response.hits.total.value;
          console.log( this.qntdadeResultados);
        }, error => {
          this.textoAguardandoProcura = 'Erro na busca';
          console.error(error);
        }).then(() => {
          this.textoAguardandoProcura = '';
          console.log('Busca feita para ' + expressao);
        });
  }

  exibirTodos() {
    this.resultadoElastic = [];
    this.textoAguardandoProcura = 'Aguarde a busca';
    this.es.fullTextSearch(
      this.objElastic.source.index,
      this.objElastic.source.type,
      'content', this.expressao, this.qntdadeResultados).then(
        response => {
          this.resultadoElastic = response.hits.hits;
        }, error => {
          this.textoAguardandoProcura = 'Erro na busca';
          console.error(error);
        }).then(() => {
          this.textoAguardandoProcura = '';
          console.log('Busca feita para ' + this.expressao);
        });
  }

  // setPageSizeOptions(setPageSizeOptionsInput: string) {
  //   if (setPageSizeOptionsInput) {
  //     this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  //   }
  // }
}
