import { Component, OnInit } from '@angular/core';
import { ProductSlider } from '../../shared/data/slider';
import { Product } from '../../shared/classes/product';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-vegetable',
  templateUrl: './vegetable.component.html',
  styleUrls: ['./vegetable.component.scss']
})
export class VegetableComponent implements OnInit {

  public products: Product[] = [];
  public ProductSliderConfig: any = ProductSlider;

  constructor(public productService: ProductService) {
    this.productService.getProducts.subscribe(response => 
      this.products = response.filter(item => item.type == 'perfume')
    );
  }

  // Sliders
  public sliders = [{
    title: 'Experience Elegance in Every Whiff',
    subTitle: 'Elevate your senses and make a lasting impression with our premium, oil-based perfumes.',
    image: 'assets/images/legend/legend-bg.jpg',
    buttonText:'shop now'
  }, {
    title: 'Discover Your Signature Scent',
    subTitle: 'Explore our diverse range of top perfume collections, each designed to match your unique style and personality.',
    image: 'assets/images/legend/ladies-bg.jpg',
    buttonText:'Find your scent'
  }];

  // Blogs
  public blogs = [{
    image: 'assets/images/blog/6.jpg',
    date: '25 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/7.jpg',
    date: '26 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/8.jpg',
    date: '27 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/9.jpg',
    date: '28 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }]

    // Collection banner
    public collections = [{
      image: 'assets/images/legend/legend-men.jpeg',
      save: 'save 50%',
      title: 'men'
    }, {
      image: 'assets/images/legend/legend-spray.jpg',
      save: 'save 50%',
      title: 'women'
    },
    {
      image: 'assets/images/legend/legend-unisex.jpg',
      save: 'save 50%',
      title: 'unisex'
    }];

  ngOnInit(): void {
  }

}
