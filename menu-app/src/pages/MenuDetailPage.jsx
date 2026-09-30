import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { fetchMenu, removeMenu } from '../api/menu.js';
import { toMessage } from '../api/client.js';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatCode, formatPrice } from '../format.js';
import styles from './MenuDetailPage.module.css';

export default function MenuDetailPage() {
    const { menuCode } = useParams();
    const navigate = useNavigate();

    /* 어느 메뉴를 담은 결과인지 함께 들고 있는다.
     * 그래야 주소가 바뀐 직후에 이전 메뉴가 잠깐 비치지 않는다.
     * effect 안에서 setState 로 비우면 렌더가 한 번 더 도는데, 그럴 필요가 없다. */
    const [loaded, setLoaded] = useState({ code: null, menu: null, error: null });
    const [confirmCode, setConfirmCode] = useState(null);
    const [removing, setRemoving] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        fetchMenu(menuCode, controller.signal)
            .then((menu) => setLoaded({ code: menuCode, menu, error: null }))
            .catch((err) => {
                const message = toMessage(err);
                if (message) setLoaded({ code: menuCode, menu: null, error: message });
            });

        return () => controller.abort();
    }, [menuCode]);

    const ready = loaded.code === menuCode;
    const menu = ready ? loaded.menu : null;
    const error = ready ? loaded.error : null;
    const confirming = confirmCode === menuCode;

    async function handleRemove() {
        setRemoving(true);
        try {
            await removeMenu(menuCode);
            navigate('/', { replace: true });
        } catch (err) {
            setLoaded({ code: menuCode, menu: null, error: toMessage(err) });
            setConfirmCode(null);
            setRemoving(false);
        }
    }

    if (error) {
        return (
            <EmptyState
                tone="error"
                title="메뉴를 찾지 못했습니다"
                description={error}
                action={
                    <Link to="/">
                        <Button variant="secondary">목록으로 돌아가기</Button>
                    </Link>
                }
            />
        );
    }

    if (!menu) {
        return <p className="body1">불러오는 중…</p>;
    }

    const orderable = menu.orderableStatus === 'Y';

    return (
        <article className={styles.page}>
            <Link to="/" className={`${styles.back} label1`}>
                ‹ 목록으로 돌아가기
            </Link>

            <div className={styles.hero}>
                <span className={`${styles.code} label1`}>{formatCode(menu.menuCode)}</span>
                <h1 className={`${styles.name} display3 bold`}>{menu.menuName}</h1>
                <p className={`${styles.price} title1 bold`}>{formatPrice(menu.menuPrice)}</p>

                <dl className={styles.facts}>
                    <div className={styles.fact}>
                        <dt className={`${styles.factLabel} caption1`}>카테고리</dt>
                        <dd className={`${styles.factValue} headline2 bold`}>{menu.categoryName}</dd>
                    </div>
                    <div className={styles.fact}>
                        <dt className={`${styles.factLabel} caption1`}>카테고리 코드</dt>
                        <dd className={`${styles.factValue} headline2 bold`}>{menu.categoryCode}</dd>
                    </div>
                    <div className={styles.fact}>
                        <dt className={`${styles.factLabel} caption1`}>주문 가능 여부</dt>
                        <dd className={`${styles.factValue} headline2 bold`}>
                            {orderable ? '주문 가능 (Y)' : '주문 불가 (N)'}
                        </dd>
                    </div>
                </dl>
            </div>

            {confirming ? (
                <div className={styles.confirm}>
                    <span className="body1">
                        «{menu.menuName}» 을(를) 삭제합니다. 되돌릴 수 없습니다.
                    </span>
                    <div className={styles.actions}>
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => setConfirmCode(null)}
                            disabled={removing}
                        >
                            취소
                        </Button>
                        <Button variant="danger" size="small" onClick={handleRemove} disabled={removing}>
                            {removing ? '삭제하는 중…' : '삭제한다'}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={styles.actions}>
                    <Link to={`/menus/${menu.menuCode}/edit`}>
                        <Button>수정</Button>
                    </Link>
                    <Button variant="danger" onClick={() => setConfirmCode(menuCode)}>
                        삭제
                    </Button>
                </div>
            )}
        </article>
    );
}
