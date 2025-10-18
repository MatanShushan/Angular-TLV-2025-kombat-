import { Component, computed, effect, inject, signal } from '@angular/core';
import { PowerBarComponent } from '../power-bar/power-bar.component';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

interface Vote {
  vote: 'open' | 'closed';
  voter: string;
}
@Component({
  selector: 'poll',
  imports: [PowerBarComponent],
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss'],
})
export class PollComponent {
  router = inject(ActivatedRoute);

  queryParams = toSignal(this.router.queryParamMap);

  mainClass = computed(() => {
    const round = this.queryParams()?.get('round');
    return `main round-${round}`
  });

  firestore = inject(Firestore);
  votesCollection = collection(this.firestore, 'votes');
  votes$ = collectionData<Vote>(this.votesCollection as any);
  votes = toSignal<Vote[]>(this.votes$);
powers = computed(() => {
  const list = this.votes() ?? [];
  let open = 0, closed = 0;
  for (const { vote } of list) {
    if (vote === 'open') open++;
    else if (vote === 'closed') closed++;
  }

  const total = open + closed;

  // --- No votes ---
  if (total === 0) {
    return {
      share: { open: 50, closed: 50 },
      power: { open: 100, closed: 100 },
      counts: { open, closed, total }
    };
  }

  // --- Shares (percentile labels) ---
  const shareOpen = open / total;

  // --- Feel tuning ---
  const BASELINE = 55;   // tie visual
  const FLOOR = 5;      // never “dead”
  const UP_SPAN = 100 - BASELINE;        // 15 up
  const DOWN_SPAN = BASELINE - FLOOR;    // 30 down
  const GAIN = 3.0;      // increase for snappier swing
  const KICK_W = 0.6;    // weight of per-vote kick
  const KICK_EXP = 0.6;  // smaller -> kick decays slower with big totals

  // d in [-0.5, +0.5]
  const d = shareOpen - 0.5;

  // Logistic-ish amplification (smooth, more responsive around 50/50)
  const tanh = (x: number) => Math.tanh(x);
  const amp = tanh(GAIN * d) / tanh(GAIN * 0.5); // normalize to [-1, 1]

  // Per-vote kick: keeps each single vote visible even with many votes
  const margin = open - closed; // could be negative
  const kick = margin / Math.max(1, Math.pow(total, KICK_EXP)); // [-1..1]-ish

  // Combine & clamp to [-1, 1]
  const tilt = Math.max(-1, Math.min(1, amp + KICK_W * kick));

  const mapPower = (t: number) => {
    // t in [-1, 1]; +1 means 'open' dominates
    const up = BASELINE + t * UP_SPAN;                // toward 100
    const down = BASELINE - (-t) * DOWN_SPAN;         // toward FLOOR
    return Math.round(Math.max(FLOOR, Math.min(100, t >= 0 ? up : down)));
  };

  const powerOpen = mapPower( tilt);
  const powerClosed = mapPower(-tilt);

  return {
    share: { open: Math.round(shareOpen * 100), closed: 100 - Math.round(shareOpen * 100) },
    power: { open: powerOpen, closed: powerClosed },
    counts: { open, closed, total }
  };
});


}
