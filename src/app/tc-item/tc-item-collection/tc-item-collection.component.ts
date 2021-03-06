import { Component, Input, OnInit} from '@angular/core';
import { TcLanguageService } from '../../tc-language/tc-language.service';
import { TcAuthService } from '../../tc-auth/tc-auth.service';
import { TcStarService } from '../../tc-star/tc-star.service';
import { TcCollection } from '../../tc-collection/tc-collection.class';

@Component({
  selector: 'tc-item-collection',
  templateUrl: 'tc-item-collection.component.html',
  styleUrls: ['tc-item-collection.component.scss'],
})

export class TcItemCollectionComponent implements OnInit {

  public isAuthor: boolean;
  private isWorking: boolean;

  @Input() collection: TcCollection;
  @Input() sortable: boolean;

  constructor(public t: TcLanguageService, private starService: TcStarService, private authService: TcAuthService) {
  }

  ngOnInit() {
    this.isWorking = false;
    this.isAuthor = (this.authService.isLoggedIn && this.authService.currentUser._id == this.collection._author._id);
  }

  public onStarCliked() {
    if (!this.authService.isLoggedIn || this.isAuthor || this.isWorking)
      return;
    if (!this.collection._star) {
      this.addStarredCollection();
    } else {
      this.removeStarredCollection();
    }
  }

  private addStarredCollection() {
    this.isWorking = true;
    this.starService.postStar(this.collection).subscribe((star) => {
      this.collection._star = star;
      this.collection.starsCount++;
      this.isWorking = false;
    });
  }

  private removeStarredCollection() {
    this.starService.deleteStare(this.collection._star).subscribe((response) => {
      this.collection._star = null;
      this.collection.starsCount--;
      this.isWorking = false;
    });
  }

}
