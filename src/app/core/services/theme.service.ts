import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    darkMode = signal<boolean>(false);

    constructor() {
        this.initializeTheme();
    }

    private initializeTheme() {
        // Check if we are in a browser environment to avoid SSR errors
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                this.setTheme(savedTheme === 'dark');
            } else {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.setTheme(prefersDark);
            }
        }
    }

    toggleTheme() {
        this.setTheme(!this.darkMode());
    }

    private setTheme(isDark: boolean) {
        this.darkMode.set(isDark);
        if (typeof window !== 'undefined') {
            if (isDark) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        }
    }
}
