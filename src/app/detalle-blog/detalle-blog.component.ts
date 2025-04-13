import { Component, OnInit } from '@angular/core';
import { BlogservicesService } from '../services/blogservices.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-blog',
  templateUrl: './detalle-blog.component.html',
  styleUrls: ['./detalle-blog.component.css']
})
export class DetalleBlogComponent implements OnInit {

  identrada:any;
  entrada:any;

  constructor( private router: ActivatedRoute, private BlogSvc:BlogservicesService ){
    this.router.params.subscribe(params => {
      this.identrada = params['id'];
    });
    console.log(this.identrada);
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
