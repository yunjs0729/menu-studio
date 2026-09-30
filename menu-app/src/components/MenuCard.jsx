import { Link } from 'react-router';
import styles from './MenuCard.module.css';
import { categoryColors } from './categoryColors.js';
import { categoryEmoji } from './categoryEmoji.js';
import { formatPrice, formatCode } from '../format.js';

export default function MenuCard({ menu }) {
    const orderable = menu.orderableStatus === 'Y';

    return (
        <article className={styles.card}>
            <div className={styles.meta}>
                <span className={`${styles.chip} label2`} style={categoryColors(menu.categoryName)}>{menu.categoryName}</span>
                <span className={`${styles.status} ${orderable ? styles.on : styles.off} label2`}>
                    <span className={styles.dot} aria-hidden="true" />
                    {orderable ? '주문 가능' : '주문 불가'}
                </span>
            </div>
            <div className={styles.menuTitle}>
                <span className={`${styles.emoji} title1`} style={categoryColors(menu.categoryName)} aria-hidden="true">{categoryEmoji(menu.categoryName)}</span>
                <Link to={`/menus/${menu.menuCode}`} className={`${styles.name} headline1 bold`}>{menu.menuName}</Link>
            </div>
            <span className={`${styles.code} caption1`}>{formatCode(menu.menuCode)}</span>
            <div className={styles.bottom}>
                <p className={`${styles.price} title3 bold`}>{formatPrice(menu.menuPrice)}</p>
                <Link to={`/menus/${menu.menuCode}`} className={`${styles.more} label2`}>상세 보기 ↗</Link>
            </div>
        </article>
    );
}

export function MenuCardSkeleton() {
    return <div className={styles.skeleton} aria-hidden="true" />;
}
