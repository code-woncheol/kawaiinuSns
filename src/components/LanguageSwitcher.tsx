// src/components/LanguageSwitcher.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const LanguageSwitcherContainer = styled.div`
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
`;

const CurrentLanguageButton = styled.button`
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 8px 16px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Dropdown = styled.div<{ isOpen: boolean }>`
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: absolute;
    top: 40px;
    right: 0;
    background-color: black;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    width: auto; /* 가로 길이를 내용에 맞게 설정 */
    min-width: 100%; /* 현재 언어 버튼과 최소 동일 너비 */
    white-space: nowrap; /* 텍스트가 줄 바꿈되지 않도록 설정 */
`;

const DropdownItem = styled.div`
    padding: 10px 1.5vh;
    cursor: pointer;
    &:hover {
        background-color: #f0f0f0;
        color: black;
    }
`;

// 언어 코드와 이름 매핑
const languages: { [key: string]: string } = {
    en: 'ENG',
    ko: '한국어',
    ja: '日本語',
};

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    return (
        <LanguageSwitcherContainer>
            {/* 현재 선택된 언어 표시 */}
            <CurrentLanguageButton onClick={() => setIsOpen((prev) => !prev)}>
                {languages[i18n.language] || 'ENG'}
            </CurrentLanguageButton>

            {/* 드롭다운 메뉴 */}
            <Dropdown isOpen={isOpen}>
                {Object.entries(languages).map(([lngCode, lngName]) => (
                    <DropdownItem key={lngCode} onClick={() => changeLanguage(lngCode)}>
                        {lngName}
                    </DropdownItem>
                ))}
            </Dropdown>
        </LanguageSwitcherContainer>
    );
}
