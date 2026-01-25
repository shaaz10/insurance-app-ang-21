import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-agent-claims',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `<div class="min-h-screen bg-stone-900 p-6"><a routerLink="/agent" class="text-gold">← Back</a><h1 class="text-3xl font-display text-white mt-4">Claims</h1></div>`
})
export class AgentClaimsComponent { }
