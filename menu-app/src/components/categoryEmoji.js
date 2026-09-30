const emojis = {
    한식: '🍚', 중식: '🥟', 일식: '🍣', 퓨전: '🍝',
    커피: '☕', 쥬스: '🧃', 기타: '🍽️', 동양: '🍜', 서양: '🍰',
    식사: '🍲', 음료: '🥤', 디저트: '🧁',
};

export function categoryEmoji(name) {
    return emojis[name] ?? '🍽️';
}
