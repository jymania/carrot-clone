import client from '@/libs/server/client';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import withApiSession from '@/libs/server/withSession';

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
	const {
		session: { user },
	} = req;

	// client.record.findMany({
	// 	where: {
	// 		userId : user?.id,
	// 		kind :
	// 	}
	// })
	const sales = await client.sale.findMany({
		where: {
			userId: user?.id,
		},
		include: {
			product: {
				include: {
					_count: {
						select: { favs: true },
					},
				},
			},
		},
	});
	res.json({ ok: true, sales });
};

export default withApiSession(withHandler({ methods: ['GET'], handler }));
