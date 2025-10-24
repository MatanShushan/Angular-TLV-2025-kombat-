import { Component, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
interface Vote {
  vote: 'open' | 'closed';
  voter: string;
}

@Component({
  selector: 'vote',
  imports: [],
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss'],
})
export class VoteComponent {
  router = inject(ActivatedRoute);
  firestore = inject(Firestore);
  votesCollection = collection(this.firestore, `votes-${this.router.snapshot.params['round']}`);

  vote(option: 'open' | 'closed') {
    
    const newVote: Vote = {
        vote: option,
        voter: 'user'
    };
    addDoc(this.votesCollection, newVote);
  }
}