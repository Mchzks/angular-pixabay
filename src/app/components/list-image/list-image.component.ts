import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-list-image',
  templateUrl: './list-image.component.html',
  styleUrls: ['./list-image.component.css']
})
export class ListImageComponent implements OnInit {

  term = '';
  subscription: Subscription;
  listImages: any[] = [];
  loading = false;
  imagesPages = 30;
  actualPage = 1;
  totalPages = 0;

  constructor(
    private _imageService: ImageService
  ) { 
    this.subscription = this._imageService.getSearchTerm().subscribe(data => {
      this.term = data;
      this.actualPage = 1;
      this.loading = true;
      this.getImages();
    })
  }

  ngOnInit(): void {
  }

  getImages() {
    this._imageService.getImages(this.term, this.imagesPages, this.actualPage).subscribe(data => {
      this.loading = false;
      if(data.hits.length === 0){
        this._imageService.setError('No results were found!');
        return;
      }
      this.totalPages = Math.ceil(data.totalHits / this.imagesPages);

      this.listImages = data.hits;
    }, error => {
      this._imageService.setError('Something went wrong!');
      this.loading = false;
    })
  }

  nextPage() {
    this.actualPage++;
    this.loading = true;
    this.listImages = [];
    this.getImages();
  }

  prevPage() {
    this.actualPage--;
    this.loading = true;
    this.listImages = [];
    this.getImages();
  }

  prevPageClass() {
    if(this.actualPage === 1) {
      return false;
    } else {
      return true;
    }
  }

  nextPageClass() {
    if(this.actualPage === this.totalPages) {
      return false;
    } else {
      return true;
    }
  }
}
