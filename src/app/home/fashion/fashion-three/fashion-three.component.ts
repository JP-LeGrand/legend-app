import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductSlider } from '../../../shared/data/slider';
import { Product } from '../../../shared/classes/product';
import { ProductService } from '../../../shared/services/product.service';

@Component({
  selector: 'app-fashion-three',
  templateUrl: './fashion-three.component.html',
  styleUrls: ['./fashion-three.component.scss']
})
export class FashionThreeComponent implements OnInit, OnDestroy {

  public products : Product[] = [];
  public productCollections: any[] = [];
  active

  constructor(public productService: ProductService) {
    this.productService.getProducts.subscribe(response => {
      this.products = response.filter(item => item.type == 'fashion');
      // Get Product Collection
      this.products.filter((item) => {
        item.collection.filter((collection) => {
          const index = this.productCollections.indexOf(collection);
          if (index === -1) this.productCollections.push(collection);
        })
      })
    });
  }

  public ProductSliderConfig: any = ProductSlider;

  public sliders = [{
    title: 'FOR HIM',
    subTitle: 'Men Fragrances',
    image: 'assets/images/slider/5.jpg'
  }, {
    title: 'FOR HER',
    subTitle: 'Women Fragrances',
    image: 'assets/images/legend/ladies-bg.jpg'
  }];

  ngOnInit(): void {
    document.body.classList.add('box-layout-body');
  }

  ngOnDestroy() {
  	document.body.classList.remove('box-layout-body');
  }

  // Product Tab collection
  getCollectionProducts(collection) {
    return this.products.filter((item) => {
      if (item.collection.find(i => i === collection)) {
        return item
      }
    })
  }
  
}
