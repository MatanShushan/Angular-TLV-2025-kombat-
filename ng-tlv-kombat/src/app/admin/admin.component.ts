import { Component, inject, signal } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, getDocs, updateDoc, } from '@angular/fire/firestore';

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

  round = signal(1);

  async finishBattle() {
     const colRef = collection(this.firestore, `roundStatus`);
    const snapshot = await getDocs(colRef);
    
    const doc = snapshot.docs.find((doc) => doc.data()['round'] == this.round());
    if (doc) updateDoc(doc.ref, { isFinish: true });
    

  }

  async startBattle() {
     const colRef = collection(this.firestore, `roundStatus`);
    const snapshot = await getDocs(colRef);
    
    const doc = snapshot.docs.find((doc) => doc.data()['round'] == this.round());
    if (doc) updateDoc(doc.ref, { isFinish: false });
    

  }

  async clearCollection() {
    const colRef = collection(this.firestore, `votes-${this.round()}`);
    const snapshot = await getDocs(colRef);

    const deletions = snapshot.docs.map((d) => {
      if (d.data()['s'] == 'y') return new Promise<void>(() => {});

      return deleteDoc(doc(this.firestore, `votes-${this.round()}`, d.id));
    });
    await Promise.all(deletions);

    console.log(`Cleared ${snapshot.size} docs from 'votes-${this.round()}'`);
  }
}
