import { Search } from '../../domain/search';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Busca } from '../../domain/busca';
import { ApoService } from '../../services/imdbapi/imdbapi.service';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-filme',
  templateUrl: './filme.component.html',
  styleUrls: ['./filme.component.scss']
})
export class FilmeComponent implements OnInit, OnChanges {
  //@Input() text : any;
  text: any;
  busca!: Busca;
  erro!: boolean;
  loading!: boolean;
  color: ThemePalette = 'accent';

  constructor(private rankingService: ApoService, private route: ActivatedRoute, serviceLogin: LoginService) {
    serviceLogin.verificaUserLogado();
    console.log("constructor()");
  }

  ngOnInit(): void {
    console.log("ngOnInit()");
    this.route.paramMap.subscribe(params => {
      this.text = params.get('text');
      this.getRankings();
      this.erro = false;
      console.log("text: " + this.text);
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("ngOnChanges()");
    this.getRankings();
  }


  getRankings() {
    console.log("getRankings()");
    this.busca = new Busca();
    this.erro = false;
    if (this.text != undefined) {
      console.log("não está vazio : " + this.text);
      this.loading = true;
      this.rankingService.getRanking(this.text).subscribe((buscas: Busca) => {
        if (buscas.Search != null) {
          console.log("if");
          console.table(buscas.Search);
          this.busca = this.filtrarBuscas(buscas);
          this.loading = false;
          this.erro = false;
        } else {
          console.log("else");
          this.erro = true;
          this.loading = false;

        }
      });
    }
    // console.log("tamanho do array: " + this.rankings.length);
  }

  buscar(): void {
    console.log("buscar()");
    this.getRankings();
  }

  filtrarBuscas(buscas: Busca): Busca {
    console.log("filtrarBuscas()");
    for (let i = 0; i < buscas.Search.length; i++) {
      if (buscas.Search[i].Poster == "" || buscas.Search[i].Poster == null || buscas.Search[i].Poster == "N/A") {
        buscas.Search[i].Poster = "../assets/img/img_padrao.jpeg";
      }
    }
    return buscas;
  }
}

