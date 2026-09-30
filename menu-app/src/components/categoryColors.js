const colors = {
    한식: 'var(--accent-foreground-orange)',
    중식: 'var(--accent-foreground-red)',
    일식: 'var(--accent-foreground-blue)',
    퓨전: 'var(--accent-foreground-violet)',
    커피: 'var(--accent-foreground-red-orange)',
    쥬스: 'var(--accent-foreground-green)',
    기타: 'var(--accent-foreground-purple)',
    동양: 'var(--accent-foreground-cyan)',
    서양: 'var(--accent-foreground-pink)',
    식사: 'var(--accent-foreground-lime)',
    음료: 'var(--accent-foreground-light-blue)',
    디저트: 'var(--accent-foreground-purple)',
};

export function categoryColors(name) {
    return { '--category-color': colors[name] ?? 'var(--label-neutral)' };
}
