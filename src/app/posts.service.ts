import { Injectable } from '@angular/core';
import { FoodPosts } from 'src/posts';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private fPosts: FoodPosts[] = [];
  private postSubject = new Subject<FoodPosts[]>();

  constructor() { }

  public getPosts() {
    return [...this.fPosts];
  }

  public postsListener() {
    return this.postSubject.asObservable();
  }

  public addPosts(post: FoodPosts) {
    this.fPosts.push(post);
    this.postSubject.next([...this.fPosts]);
  }
}
