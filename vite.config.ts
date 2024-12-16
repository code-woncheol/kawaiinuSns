import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate', // 서비스 워커 자동 업데이트
            manifest: {
                name: 'My App', // 앱의 전체 이름
                short_name: 'App', // 홈 화면에 표시될 간단한 이름
                start_url: '/', // 앱이 시작될 URL
                display: 'standalone', // 네이티브 앱처럼 보이게 설정
                background_color: '#ffffff', // 앱의 배경색
                theme_color: '#000000', // 앱의 테마 색상
                icons: [
                    {
                        src: '/icon-192x192.png', // 192x192 아이콘 경로
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/icon-512x512.png', // 512x512 아이콘 경로
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: ({ request }) => request.destination === 'image', // 이미지 요청 캐싱
                        handler: 'CacheFirst', // 캐시 우선 전략
                        options: {
                            cacheName: 'images-cache',
                            expiration: {
                                maxEntries: 10, // 최대 10개 이미지 캐싱
                                maxAgeSeconds: 60 * 60 * 24 * 30, // 30일 동안 캐싱 유지
                            },
                        },
                    },
                ],
            },
        }),
    ],
    server: {
        host: '0.0.0.0', // 외부 IP로도 접근할 수 있도록 설정
        port: 5174, // 원하는 포트 번호로 설정
    },
});
