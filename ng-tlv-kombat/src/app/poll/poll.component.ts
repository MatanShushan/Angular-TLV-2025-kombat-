import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { PowerBarComponent } from '../power-bar/power-bar.component';
import { Firestore, collection, collectionData, getDocs } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { filter, map, tap } from 'rxjs';

interface Vote {
  vote: 'open' | 'closed';
  voter: string;
}
@Component({
  selector: 'poll',
  imports: [PowerBarComponent, QRCodeComponent],
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss'],
})
export class PollComponent {
  router = inject(ActivatedRoute);
  firestore = inject(Firestore);

  round = signal(this.router.snapshot.params['round']);
  qrCodeHeightPx = signal(window.innerWidth * 0.3);
  qrCodeUrl = computed(() => `https://ng-tlv-kombat.web.app/vote/${this.round()}`);

  mainClass = computed(() => {
    const round = this.round();
    return `main round-${round}`;
  });

  statusCollection = collection(this.firestore, 'roundStatus');
  status$ = collectionData<{ isFinish: boolean; round: number }>(this.statusCollection as any);

  status = toSignal<{ isFinish: boolean; round: number }[] | undefined>(this.status$);

  isBattleFinished = computed(() => {
    return this.status()?.find((s) => s.round == this.round())?.isFinish;
  });

  votesCollection = collection(this.firestore, `votes-${this.round()}`);
  votes$ = collectionData<Vote>(this.votesCollection as any);
  votes = toSignal<Vote[]>(this.votes$);

  battleStatus = computed(() => ({
    votes: this.votes(),
    isBattleFinished: this.isBattleFinished(),
  }));

  powers = linkedSignal<any, { open: number; closed: number }>({
    source: () => this.battleStatus(),
    computation: (value, previous) => {
      const { votes, isBattleFinished } = value;

      const list = votes ?? [];
      let open = 0,
        closed = 0;
      for (const { vote } of list) {
        if (vote === 'open') open++;
        else if (vote === 'closed') closed++;
      }
      if (open === 0 && closed === 0) {
        return {
          open: 100,
          closed: 100,
        };
      }

      const total = open + closed;

      if (total === 0) {
        return { open: 100, closed: 100 };
      }
      if (isBattleFinished) {
        const pctOpen = Math.round((open / total) * 100);
        const pctClosed = 100 - pctOpen; // keep sum = 100
        return { open: pctOpen, closed: pctClosed };
      }

      let openPower = 100;
      for (let i = 0; i < open; i++) {
        const openHit = (openPower * 5) / 100 || 5;
        openPower -= openHit;
      }
      let closedPower = 100;
      for (let i = 0; i < closed; i++) {
        const closedHit = (closedPower * 5) / 100 || 5;
        closedPower -= closedHit;
      }

      return { open: openPower, closed: closedPower };
    },
  });
}
