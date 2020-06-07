export class ElasticCovidModel {
    source: SourceModel;
    highlight: HighlightModel;

}

export class HighlightModel {
    content: string[];
}

export class SourceModel {
    categoria: string;
    content: any;
    name: string;
    index: string;
    type: string;
}
