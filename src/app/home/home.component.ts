import { Component, OnInit } from '@angular/core';
import { BlogservicesService } from '../services/blogservices.service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  links: any[] = [];
  current_page: number = 1;
  last_page = 0;
  total_paginas: any = [];
  posicion_lista: any = 0;
  totalPosts: number = 0;

  constructor(private BlogSvc:BlogservicesService){}

  ngOnInit(): void {
    this.getPosts(this.current_page);
    $('.hero-slider-one').slick({
      dots: false,
          arrows: false,
          lazyLoad: 'ondemand',
          centerPadding: '0px',
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          fade: true,
          autoplaySpeed: 7000,
    });
    if($(".feedback-slider-one").length) {
      $('.feedback-slider-one').slick({
          dots: false,
          arrows: false,
          lazyLoad: 'ondemand',
          centerPadding: '0px',
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: true,
          autoplay: true,
          autoplaySpeed: 10000
        });
    }

    // ------------------------ Feedback Slider Two
    if($(".feedback-slider-two").length) {
      $('.feedback-slider-two').slick({
          dots: false,
          arrows: false,
          lazyLoad: 'ondemand',
          centerPadding: '0px',
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: true,
          autoplay: true,
          autoplaySpeed: 10000,
          responsive: [
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1
              }
            }
          ]
        });
    }

    // ------------------------ Feedback Slider Three
    if($(".feedback-slider-three").length) {
      $('.feedback-slider-three').slick({
          dots: true,
          arrows: false,
          lazyLoad: 'ondemand',
          centerPadding: '0px',
          slidesToShow: 1,
          slidesToScroll: 1,
          fade:true,
          autoplay: true,
          autoplaySpeed: 10000
        });
    }

    // ------------------------ Feedback Slider Four
    if($(".feedback-slider-four").length) {
      $('.feedback-slider-four').slick({
          dots: false,
          arrows: true,
          prevArrow: $('.prev_a'),
          nextArrow: $('.next_a'),
          lazyLoad: 'ondemand',
          centerPadding: '0px',
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: true,
          autoplay: false,
          autoplaySpeed: 10000,
          responsive: [
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1
              }
            }
          ]
        });
    }

    // ------------------------ Feedback Slider Five
    if($(".feedback-slider-five").length) {
      $('.feedback-slider-five').slick({
          dots: true,
          arrows: false,
          fade: true,
          lazyLoad: 'ondemand',
          centerPadding: '0px',
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          autoplay: false,
          autoplaySpeed: 10000,
        });
    }

    // ------------------------ Feedback Slider Six
    if($(".feedback-slider-six").length) {
      $('.feedback-slider-six').slick({
          dots: false,
          arrows: true,
          prevArrow: $('.prev_S'),
          nextArrow: $('.next_S'),
          lazyLoad: 'ondemand',
          centerPadding: '0px',
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          autoplay: false,
          autoplaySpeed: 10000,
        });
    }


        // ------------------------ Service Slider One
        if($(".service-slider-one").length) {
          $('.service-slider-one').slick({
              dots: true,
              arrows: false,
              lazyLoad: 'ondemand',
              centerPadding: '0px',
              slidesToShow: 3,
              slidesToScroll: 3,
              centerMode: true,
              autoplay: false,
              autoplaySpeed: 10000,
              responsive: [
                {
                  breakpoint: 1200,
                  settings: {
                    slidesToShow: 2
                  }
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 1
                  }
                }
              ]
            });
        }

        // ------------------------ Project Slider One
        if($(".project-slider-one").length) {
          $('.project-slider-one').slick({
              dots: false,
              arrows: true,
              prevArrow: $('.prev_b'),
              nextArrow: $('.next_b'),
              lazyLoad: 'ondemand',
              centerPadding: '0px',
              slidesToShow: 3,
              slidesToScroll: 1,
              centerMode: true,
              autoplay: false,
              autoplaySpeed: 10000,
              responsive: [
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 1
                  }
                }
              ]
            });
        }


        // ------------------------ Partner Slider One
        if($(".partner-slider-one").length) {
          $('.partner-slider-one').slick({
              dots: false,
              arrows: false,
              lazyLoad: 'ondemand',
              centerPadding: '0px',
              slidesToShow: 5,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 5000,
              responsive: [
                {
                  breakpoint: 992,
                  settings: {
                    slidesToShow: 4
                  }
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 3
                  }
                },
                {
                  breakpoint: 576,
                  settings: {
                    slidesToShow: 2
                  }
                }
              ]
            });
        }



  }


  getPosts(pagina: number) {
    this.BlogSvc.listEntradas(pagina).subscribe((response: any) => {
      console.log(response);

      this.posts = response.data;  // Posts en la página actual
      this.current_page = response.current_page;
      this.last_page = response.last_page;
      let page = this.paginacion(this.last_page);
      this.total_paginas = page;

    });
  }

  paginacion(last: number){
    const total_paginas: any[] = [];
    const paginasPorGrupo = 10;
    let grupoActual: any[] = [];

    for (let i = 1; i <= last; i++) {
      grupoActual.push({ page: i });

      if (i % paginasPorGrupo === 0 || i === last) {
        total_paginas.push(grupoActual);
        grupoActual = [];
      }
    }

    // Elimina los grupos vacíos al final (si los hay)
    while (total_paginas.length > 0 && total_paginas[total_paginas.length - 1].length === 0) {
      total_paginas.pop();
    }

    return total_paginas;
	}

}
