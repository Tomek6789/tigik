import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'app/auth/user.model';

@Component({
    selector: 'app-profile',
    styleUrls: ['profile.component.css'],
    templateUrl: 'profile.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileComponent  {

    @Input() user: User;
    @Input() showLogout: boolean;
    @Output() signOut = new EventEmitter();



}