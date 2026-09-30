import { Link, NavLink, Outlet } from 'react-router';
import { useState } from 'react';
import styles from './Layout.module.css';

export default function Layout() {
    const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

    function selectTheme(next) {
        document.documentElement.dataset.theme = next;
        setTheme(next);
        try { localStorage.setItem('menu-studio-theme', next); } catch { /* 테마 전환은 저장 실패와 관계없이 유지합니다. */ }
    }
    return (
        <div className={styles.shell}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <Link to="/" className={styles.brand}>
                        <span className={`${styles.mark} title2`} aria-hidden="true">🍽️</span>
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
                    <div className={styles.themePicker} role="group" aria-label="화면 테마">
                        <button type="button" aria-pressed={theme === 'light'} onClick={() => selectTheme('light')} className={`${styles.themeButton} label2 ${theme === 'light' ? styles.themeSelected : ''}`}><span aria-hidden="true">☀</span> 라이트</button>
                        <button type="button" aria-pressed={theme === 'dark'} onClick={() => selectTheme('dark')} className={`${styles.themeButton} label2 ${theme === 'dark' ? styles.themeSelected : ''}`}><span aria-hidden="true">☾</span> 다크</button>
                    </div>
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
