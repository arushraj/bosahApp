import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  private students = [
    { name: 'Noah', gender: 'male' },
    { name: 'Emma', gender: 'female' },
    { name: 'Sophia', gender: 'female' },
    { name: 'Jacob', gender: 'male' },
    { name: 'Mia', gender: 'female' },
    { name: 'Matthew', gender: 'male' },
    { name: 'Olivia', gender: 'female' },
    { name: 'Alexander', gender: 'male' },
    { name: 'Victoria', gender: 'female' },
    { name: 'Isabella', gender: 'female' },
    { name: 'Michael', gender: 'male' },
    { name: 'Evelyn', gender: 'female' },
    { name: 'Alexa', gender: 'female' },
    { name: 'James', gender: 'male' },
    { name: 'William', gender: 'male' },
    { name: 'Charlotte', gender: 'female' },
    { name: 'Christopher', gender: 'male' },
    { name: 'Allison', gender: 'female' },
    { name: 'Brooklyn', gender: 'female' },
    { name: 'Andrew', gender: 'male' }
  ];
  public items = {
    match: [],
    preferred: []
  };
  public slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  // Array<{ title: string; note: string; icon: string }> = [];
  constructor() {
    for (let i = 1; i < 5; i++) {
      const randomName = Math.floor(Math.random() * this.students.length);
      this.items.match.push({
        name: this.students[randomName].name,
        message: `Hi, I'm ${this.students[randomName].name}`,
        gender: this.students[randomName].gender
      });
    }
    for (let i = 1; i < 10; i++) {
      const randomName = Math.floor(Math.random() * this.students.length);
      this.items.preferred.push({
        name: this.students[randomName].name,
        message: `Hello, This is ${this.students[randomName].name}`,
        gender: this.students[randomName].gender
      });
    }
  }

  ngOnInit() {
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
  public currentSlide() {
    console.log('hello');
  }
}
