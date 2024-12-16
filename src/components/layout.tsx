import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../firebase';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column; /* 위에서 아래로 배치 */
    justify-content: space-between; /* 콘텐츠와 푸터 사이 간격 유지 */
    height: 100vh; /* 화면 전체 높이 */
    padding: 0; /* 불필요한 여백 제거 */
    width: 100%;
    max-width: 860px;
    margin: 0 auto; /* 중앙 정렬 */
`;

const Menu = styled.div`
    position: fixed; /* 화면에 고정 */
    bottom: 0; /* 하단 위치 */
    left: 0;
    width: 100%; /* 화면 너비 */
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding: 10px 0;
    background-color: #ffffff;
    border-top: 1px solid #e9ecef;
    z-index: 1000; /* 다른 요소 위에 배치 */
`;

interface MenuItemProps {
    active?: boolean;
}

const MenuItem = styled.div<MenuItemProps>`
    cursor: pointer;
    display: grid;
    margin-left: 50px;
    margin-right: 50px;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 50px;
    svg {
        width: 30px;
        fill: none;
        path {
            stroke: ${(props) => (props.active ? 'black' : 'gray')}; /* active 속성 처리 */

            stroke-linecap: round;
            stroke-linejoin: round;
        }
    }
    &.log-out {
        border-color: tomato;
        svg {
            fill: tomato;
            path {
                stroke: tomato; /* active 속성 처리 */
                stroke-linecap: round;
                stroke-linejoin: round;
            }
        }
    }
`;

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const onLogOut = async () => {
        const ok = confirm('Are you sure you want to log out?');
        if (ok) {
            await auth.signOut();
            navigate('/login');
        }
    };
    return (
        <Wrapper>
            <Outlet />
            <Menu>
                <Link to="/">
                    <MenuItem active={location.pathname === '/'}>
                        <svg width="48" height="37" viewBox="0 0 48 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M1 20.5235C5.54196 7.93672 15.8407 -2.05905 28.6948 1.86414C37.6642 4.60175 33.9014 9.70322 37.3869 13.0571C39.3534 14.57 44.6925 12.5393 46.0734 14.4282C47.2943 16.0988 46.4122 19.1465 46.0734 21.1471C44.7371 29.0357 35.694 30.1969 28.0325 30.1969"
                                stroke="black ! import"
                                stroke-opacity="0.9"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M46.5178 17.3213C45.8863 16.1229 44.4453 15.0025 42.7095 14.057"
                                stroke="black"
                                stroke-opacity="0.9"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M11.5618 15.0036C11.1059 17.4859 4.0778 34.3938 11.3538 35.8342C24.8665 37.7645 23.2447 22.3937 23.2447 12.7876"
                                stroke="black"
                                stroke-opacity="0.9"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M30.0156 12.6062V13.513"
                                stroke="black"
                                stroke-opacity="0.9"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </MenuItem>
                </Link>
                <Link to="/profile">
                    <MenuItem active={location.pathname === '/profile'}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                {' '}
                                <path
                                    d="M22 22L2 22"
                                    stroke="#1C274C"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                ></path>{' '}
                                <path
                                    d="M2 11L10.1259 4.49931C11.2216 3.62279 12.7784 3.62279 13.8741 4.49931L22 11"
                                    stroke="#1C274C"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                ></path>{' '}
                                <path
                                    d="M15.5 5.5V3.5C15.5 3.22386 15.7239 3 16 3H18.5C18.7761 3 19 3.22386 19 3.5V8.5"
                                    stroke="#1C274C"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                ></path>{' '}
                                <path d="M4 22V9.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path>{' '}
                                <path d="M20 22V9.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path>{' '}
                                <path
                                    d="M15 22V17C15 15.5858 15 14.8787 14.5607 14.4393C14.1213 14 13.4142 14 12 14C10.5858 14 9.87868 14 9.43934 14.4393C9 14.8787 9 15.5858 9 17V22"
                                    stroke="#1C274C"
                                    stroke-width="1.5"
                                ></path>{' '}
                                <path
                                    d="M14 9.5C14 10.6046 13.1046 11.5 12 11.5C10.8954 11.5 10 10.6046 10 9.5C10 8.39543 10.8954 7.5 12 7.5C13.1046 7.5 14 8.39543 14 9.5Z"
                                    stroke="#1C274C"
                                    stroke-width="1.5"
                                ></path>{' '}
                            </g>
                        </svg>
                    </MenuItem>
                </Link>
            </Menu>
        </Wrapper>
    );
}
