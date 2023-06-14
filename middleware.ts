import { NextFetchEvent, NextRequest, NextResponse, userAgent } from 'next/server';

export const middleware = (req: NextRequest, ev: NextFetchEvent) => {
	const { device, isBot } = userAgent(req);
	if (isBot) return new Response('R U Human?', { status: 403 });
	if (req.url.includes('/enter')) return NextResponse.next();
	if (!req.url.includes('/api')) {
		if (!req.nextUrl.pathname.includes('/enter') && !req.cookies.get('carrotsession')) {
			return NextResponse.rewrite(new URL('/enter', req.url));
		}
	}

	// console.log(req.nextUrl.pathname);
	// console.log(req.nextUrl);
	// console.log(device);
	// console.log(req.geo);
};
export const config = {
	matcher: ['/'],
};
