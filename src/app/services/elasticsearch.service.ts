import { Injectable } from '@angular/core';
import { Client } from 'elasticsearch-browser';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {
  elasticHost = environment.elasticHost;
  private client: Client;

  constructor() {
    if (!this.client) {
      this.connect();
    }
  }

  private connect() {
    this.client = new Client({
      host: this.elasticHost,
      log: 'trace'
    });
  }

  isAvailable(): any {
    return this.client.ping({
      requestTimeout: Infinity,
      body: 'elastic conectado!'
    });
  }

  fullTextSearch(index: string, type: string, field: string, queryText: string, tamanho: number): any {
    return this.client.search({
      index: index,
      type: type,
      filterPath: ['hits.hits._source', 'hits.hits.highlight', 'hits.total', '_scroll_id'],
      body: {       
        'size': tamanho,
        'query': {
          'match': {
            [field]: queryText,
          }
        },
        "highlight": {
          "fields": {
            "content": { "order": "score" }
          }
        }
      },
      '_source': ['content', 'categoria', 'name']
    });
  }

  getNextPage(scrollId: any): any {
    return this.client.scroll({
      scrollId: scrollId,
      scroll: '1m',
      filterPath: ['hits.hits._source', 'hits.hits.highlight', 'hits.total', '_scroll_id'],
    });
  }

}
