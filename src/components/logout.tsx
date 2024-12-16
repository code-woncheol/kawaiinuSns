import { Link, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../firebase';
const MenuItem = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 50px;
    svg {
        width: 30px;
        fill: none;
    }
    &.log-out {
        border-color: tomato;
        svg {
            fill: tomato;
        }
    }
`;
export default function LogoutBtn() {
    const navigate = useNavigate();
    const onLogOut = async () => {
        const ok = confirm('Are you sure you want to log out?');
        if (ok) {
            await auth.signOut();
            navigate('/login');
        }
    };
    return <MenuItem />;
}
