import { Component, OnInit } from '@angular/core';
import { BlogservicesService } from '../services/blogservices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-blog',
  templateUrl: './detalle-blog.component.html',
  styleUrls: ['./detalle-blog.component.css']
})
export class DetalleBlogComponent implements OnInit {

  identrada:any;
  entrada:any;

  constructor( private router: Router, private BlogSvc:BlogservicesService ){
    const navigation = this.router.getCurrentNavigation();
    this.identrada = navigation?.id;
    console.log(navigation);
  }

  ngOnInit(): void {

    this.listarEntrada()
  }

  listarEntrada(){
    this.BlogSvc.detalleEntrada(this.identrada).subscribe(
      (res:any)=>{
        this.entrada = res;
        console.log(res);

      }
    );
  }



}
