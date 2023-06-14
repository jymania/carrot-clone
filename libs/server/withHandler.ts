import { NextApiRequest, NextApiResponse } from 'next';

export interface ResponseType {
	ok: boolean;
	[key: string]: any;
}

type method = 'POST' | 'GET' | 'DELETE';

interface ConfigType {
	methods: method[];
	handler: (req: NextApiRequest, res: NextApiResponse) => void;
	isPrivate?: boolean;
}

const withHandler = ({ methods, handler, isPrivate = true }: ConfigType) /* : Promise<any> */ => {
	return async function (req: NextApiRequest, res: NextApiResponse) {
		if (req.method && !methods.includes(req.method as any)) {
			return res.status(405).end();
		}
		if (isPrivate && !req.session.user) return res.status(401).json({ ok: false, error: 'Plz log in' });
		try {
			await handler(req, res);
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error });
		}
	};
};

export default withHandler;
