import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr/_internal';
import { Noto_Sans_KR } from 'next/font/google';
import { cls } from '@/libs/client/utils';

const dokdo = Noto_Sans_KR({ weight: '400', subsets: ['latin'] });
function MyApp({ Component, pageProps }: AppProps) {
	return (
		<SWRConfig value={{ fetcher: (url: string) => fetch(url).then(response => response.json()) }}>
			<div className={cls(dokdo.className, 'w-full max-w-xl mx-auto')}>
				<Component {...pageProps} />
			</div>
		</SWRConfig>
	);
}

export default MyApp;
