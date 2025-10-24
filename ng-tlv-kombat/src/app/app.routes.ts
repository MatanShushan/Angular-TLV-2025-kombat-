import { Routes } from '@angular/router';
import { PollComponent } from './poll/poll.component';
import { VoteComponent } from './vote/vote.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: 'poll/:round', component: PollComponent },
  { path: 'vote/:round', component: VoteComponent },
  {
    path: 'admin',
    component: AdminComponent,
  },
];
