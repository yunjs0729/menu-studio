import { Link, NavLink, Outlet } from 'react-router';
import styles from './Layout.module.css';

export default function Layout() {
    return (
        <div className={styles.shell}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <Link to="/" className={styles.brand}>
                        <span className={`${styles.mark} headline1 bold`} aria-hidden="true">M</span>
                        <span className="headline1 bold">메뉴 스튜디오</span>
                    </Link>

                    <nav className={styles.nav}>
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `${styles.navLink} label1 ${isActive ? styles.current : ''}`
                            }
                        >
                            메뉴 목록
                        </NavLink>
                        <NavLink
                            to="/menus/new"
                            className={({ isActive }) =>
                                `${styles.navLink} label1 ${isActive ? styles.current : ''}`
                            }
                        >
                            메뉴 등록
                        </NavLink>
                    </nav>
                </div>
            </header>

            <main className={styles.main}>
                <Outlet />
            </main>

            <footer className={styles.footer}>
                <div className={`${styles.footerInner} caption1`}>
                    <span>MENU STUDIO · 내 가게의 메뉴를 한곳에서</span>
                    <span>매일의 메뉴 관리가 조금 더 편안하게</span>
                </div>
            </footer>
        </div>
    );
}
