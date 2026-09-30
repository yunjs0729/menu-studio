import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { fetchAllMenus, fetchMenuPage, searchMenusOverPrice } from '../api/menu.js';
import { fetchCategories, onlyChildren } from '../api/category.js';
import { toMessage } from '../api/client.js';
import MenuCard, { MenuCardSkeleton } from '../components/MenuCard.jsx';
import Pagination from '../components/Pagination.jsx';
import Filters from '../components/Filters.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Button from '../components/Button.jsx';
import styles from './MenuListPage.module.css';

const PAGE_SIZE = 12;

export default function MenuListPage() {
    const [params, setParams] = useSearchParams();

    const page = Math.max(1, Number(params.get('page')) || 1);
    const keyword = params.get('q') ?? '';
    const minPrice = params.get('minPrice') ?? '';
    const categoryCode = params.get('category') ?? '';

    const filtering = keyword !== '' || minPrice !== '' || categoryCode !== '';

    const [categories, setCategories] = useState([]);
    const [menus, setMenus] = useState([]);
    const [pageInfo, setPageInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        fetchCategories(controller.signal)
            .then((list) => setCategories(onlyChildren(list)))
            .catch((err) => {
                const message = toMessage(err);
                if (message) setError(message);
            });
        return () => controller.abort();
    }, []);

    /* 조건이 없으면 서버 페이징을 그대로 쓴다.
     * 조건이 있으면 목록을 받아 화면에서 거른다. 서버에 그런 검색이 없기 때문이다. */
    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            setLoading(true);
            setError(null);
            try {
                if (!filtering) {
                    const result = await fetchMenuPage(
                        { page, size: PAGE_SIZE },
                        controller.signal,
                    );
                    setMenus(result.menus);
                    setPageInfo(result);
                } else {
                    const base =
                        minPrice !== ''
                            ? await searchMenusOverPrice(Number(minPrice), controller.signal)
                            : await fetchAllMenus(controller.signal);
                    setMenus(base);
                    setPageInfo(null);
                }
            } catch (err) {
                const message = toMessage(err);
                if (message) setError(message);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        load();
        return () => controller.abort();
    }, [page, keyword, minPrice, categoryCode, filtering]);

    /* 이름과 카테고리는 받아 온 목록에서 거른다. */
    const filtered = useMemo(() => {
        if (!filtering) return menus;
        const needle = keyword.trim().toLowerCase();
        return menus.filter((m) => {
            if (needle && !m.menuName.toLowerCase().includes(needle)) return false;
            if (categoryCode && String(m.categoryCode) !== categoryCode) return false;
            return true;
        });
    }, [menus, keyword, categoryCode, filtering]);

    const lastPage = filtering
        ? Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
        : (pageInfo?.totalPages ?? 1);

    const current = Math.min(page, lastPage);

    const shown = filtering
        ? filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
        : filtered;

    const total = filtering ? filtered.length : (pageInfo?.totalElements ?? 0);

    const change = useCallback(
        (patch) => {
            const next = { q: keyword, minPrice, category: categoryCode, page: 1, ...patch };
            const query = {};
            if (next.q) query.q = next.q;
            if (next.minPrice) query.minPrice = next.minPrice;
            if (next.category) query.category = next.category;
            if (next.page > 1) query.page = String(next.page);
            setParams(query);
        },
        [keyword, minPrice, categoryCode, setParams],
    );

    const goPage = useCallback(
        (next) => {
            change({ page: next });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        [change],
    );

    return (
        <div className={styles.page}>
            <div className={styles.head}>
                <div>
                    <p className={`${styles.eyebrow} label2 medium`}>MENU COLLECTION</p>
                    <h1 className={`${styles.title} title1 bold`}>좋은 메뉴, 깔끔한 관리.</h1>
                    <p className={`${styles.summary} label1-reading`}>
                        가격부터 주문 상태까지, 우리 가게의 메뉴를 살펴보세요.
                    </p>
                </div>
                <Link to="/menus/new">
                    <Button>＋ 메뉴 등록</Button>
                </Link>
            </div>

            <div className={styles.stats}>
                <div className={styles.stat}><span className="label2">{filtering ? '조건에 맞는 메뉴' : '전체 메뉴'}</span><strong className="title2 bold">{loading || error ? '—' : `${total.toLocaleString('ko-KR')}개`}</strong></div>
                <div className={styles.stat}><span className="label2">현재 화면에서 주문 가능</span><strong className="title2 bold">{loading || error ? '—' : `${shown.filter((menu) => menu.orderableStatus === 'Y').length}개`}</strong></div>
                <div className={styles.stat}><span className="label2">선택 가능한 카테고리</span><strong className="title2 bold">{categories.length}개</strong></div>
            </div>

            <Filters
                keyword={keyword}
                minPrice={minPrice}
                categoryCode={categoryCode}
                categories={categories}
                onChange={change}
            />

            <div className={styles.listHeading}><h2 className="headline1 bold">메뉴 목록</h2><span className="caption1">{loading ? '불러오는 중…' : `${shown.length}개 표시 · ${current}페이지`}</span></div>
            {error ? (
                <EmptyState
                    tone="error"
                    title="목록을 불러오지 못했습니다"
                    description={error}
                    action={
                        <Button variant="secondary" onClick={() => window.location.reload()}>
                            다시 시도
                        </Button>
                    }
                />
            ) : loading ? (
                <ul className={styles.grid}>
                    {Array.from({ length: PAGE_SIZE }, (_, i) => (
                        <li key={i}>
                            <MenuCardSkeleton />
                        </li>
                    ))}
                </ul>
            ) : shown.length === 0 ? (
                <EmptyState
                    title="조건에 맞는 메뉴가 없습니다"
                    description="이름을 줄이거나 가격·카테고리 조건을 풀어 보세요."
                    action={
                        filtering && (
                            <Button variant="secondary" onClick={() => setParams({})}>
                                조건 초기화
                            </Button>
                        )
                    }
                />
            ) : (
                <>
                    <ul className={styles.grid}>
                        {shown.map((menu) => (
                            <li key={menu.menuCode}>
                                <MenuCard menu={menu} />
                            </li>
                        ))}
                    </ul>
                    <Pagination page={current} lastPage={lastPage} onChange={goPage} />
                </>
            )}
        </div>
    );
}
