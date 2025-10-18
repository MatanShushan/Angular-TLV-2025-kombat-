import { Component, inject } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, getDocs } from '@angular/fire/firestore';

interface Vote {
  vote: 'open' | 'closed';
  voter: string;
}

@Component({
  selector: 'admin',
  imports: [],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {

  firestore = inject(Firestore);
  votesCollection = collection(this.firestore, 'votes');


  finishBattle(option: 'open' | 'closed') {
    console.log('Finish battle: ' + option);
    
  } 

  async clearCollection() {
        const colRef = collection(this.firestore, 'votes');
    const snapshot = await getDocs(colRef);

    const deletions = snapshot.docs.map((d) => deleteDoc(doc(this.firestore, 'votes', d.id)));
    await Promise.all(deletions);

    console.log(`Cleared ${snapshot.size} docs from 'votes'`);
  }
}