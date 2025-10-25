import { Component, inject, signal } from '@angular/core';
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
  round = this.router.snapshot.params['round'];
  votesCollection = collection(this.firestore, `votes-${this.round}`);
  
  hasVoted = signal<'open' | 'closed' | null>(null);
  showCelebration = signal(false);
  
  vote(option: 'open' | 'closed') {
    const vote = this.getFromLocalStorage();
    // if (vote) {
    //   return;
    // }
    this.setInLocalStorage(option);  
    const newVote: Vote = {
        vote: option,
        voter: 'user'
    };
    addDoc(this.votesCollection, newVote);
    
    // Trigger celebration animation
    this.hasVoted.set(option);
    this.showCelebration.set(true);
  }

  setInLocalStorage(option: 'open' | 'closed') {
    localStorage.setItem(`vote-${this.round}`, option);
  }

  getFromLocalStorage() {
    return localStorage.getItem(`vote-${this.round}`) as 'open' | 'closed' | null;
  }
}