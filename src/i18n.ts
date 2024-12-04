// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(Backend) // 언어 파일을 HTTP로 로드
    .use(LanguageDetector) // 언어 감지
    .use(initReactI18next) // react-i18next와 통합
    .init({
        fallbackLng: 'en', // 기본 언어
        debug: true, // 디버그 모드 (개발 시에만 사용)
        interpolation: {
            escapeValue: false, // React는 기본적으로 XSS를 방지하므로 false로 설정
        },
        detection: {
            // 언어 감지 옵션
            order: ['navigator', 'htmlTag', 'path', 'subdomain'], // 언어 감지 순서
            caches: ['localStorage', 'cookie'], // 감지 결과 캐시
        },
        // 언어 리소스 로드
        resources: {
            en: {
                translation: {
                    logIntoKawaiinu: 'Log into Kawaiinu',
                    joinKawaiinu: 'Join Kawaiinu',
                    name: 'Name',
                    email: 'Email',
                    password: 'Password',
                    loading: 'Loading...',
                    createAccount: 'Create Account',
                    dontHaveAccount: `you don't have an account?`,
                    alreadyHaveAccount: 'Already have an account?',
                    logIn: 'Log in',
                    ContinuewithGithub: 'Continue with Github',
                    forgotYourPassword: 'Forgot your password?',
                    resetPassword: 'Reset Password',
                    pleaseEnterYourEmail: 'Please enter your email',
                    resetYourPassword: 'Reset Your Password',
                    backToLoginPage: 'back to Login Page',
                    invalidEmailFormat: 'Please enter a valid email format.',
                    userNotRegistered: 'User is not registered.',
                    resetPasswordLinkSent: 'A password reset link has been sent to [{{email}}].',
                    errorOccurred: 'An error occurred: {{message}}',
                    socialLogin: 'Social login',
                    passwordCheck: 'Input password Again',
                    nickname: 'user name',
                },
            },
            ko: {
                translation: {
                    logIntoKawaiinu: 'Kawaiinu 로그인',
                    joinKawaiinu: 'Kawaiinu 회원가입',
                    name: '이름',
                    email: '이메일',
                    password: '비밀번호',
                    loading: '로딩 중...',
                    createAccount: '계정 만들기',
                    dontHaveAccount: `계정이 없으신가요?`,
                    alreadyHaveAccount: '이미 계정이 있으신가요?',
                    logIn: '로그인',
                    ContinuewithGithub: 'Github로 로그인',
                    forgotYourPassword: '비밀번호를 잊으셨나요?',
                    resetPassword: '비밀번호 초기화',
                    pleaseEnterYourEmail: '이메일을 입력해주세요',
                    resetYourPassword: '비밀번호 초기화하기',
                    backToLoginPage: '로그인 페이지로 가기',
                    invalidEmailFormat: '유효한 이메일 형식을 입력해주세요.',
                    userNotRegistered: '등록되지 않은 사용자입니다.',
                    resetPasswordLinkSent: '[{{email}}]로 비밀번호 재설정 링크를 전송했습니다.',
                    errorOccurred: '오류가 발생했습니다: {{message}}',
                    socialLogin: '소셜 로그인',
                    passwordCheck: '비밀번호 재입력',
                    nickname: '닉네임',
                },
            },
            ja: {
                translation: {
                    logIntoKawaiinu: 'Kawaiinuにログイン',
                    joinKawaiinu: 'Kawaiinuに参加する',
                    name: '名前',
                    email: 'メール',
                    password: 'パスワード',
                    loading: '読み込み中...',
                    createAccount: 'アカウントを作成する',
                    dontHaveAccount: 'アカウントをお持ちでないですか？',
                    alreadyHaveAccount: 'すでにアカウントをお持ちですか？',
                    logIn: 'ログイン',
                    ContinuewithGithub: 'Githubでログイン',
                    forgotYourPassword: 'パスワードをお忘れですか？',
                    resetPassword: 'パスワードをリセットする',
                    pleaseEnterYourEmail: 'メールアドレスを入力してください',
                    resetYourPassword: 'パスワードをリセットする',
                    backToLoginPage: 'ログインページに戻る',
                    invalidEmailFormat: '有効なメール形式を入力してください。',
                    userNotRegistered: '登録されていないユーザーです。',
                    resetPasswordLinkSent: '[{{email}}]にパスワードリセットリンクが送信されました。',
                    errorOccurred: 'エラーが発生しました: {{message}}',
                    socialLogin: 'ソーシャル·ログイン',
                },
            },
        },
    });

export default i18n;
