import client from '@/libs/server/client';
import smtpTransport from '@/libs/server/email';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
	const { phone, email } = req.body;
	const user = phone ? { phone } : { email };
	if (!user) return res.status(400).json({ ok: false });
	const payload = Math.floor(100000 + Math.random() * 900000) + '';
	const html = `<div>
		<h3>Carrot Authentication Code</h3>
		<div style='background-color:red;color:white;padding:30px;'>${payload}</div>
	</div>`;
	if (phone) {
	}
	if (email) {
		const mailOptions = {
			from: process.env.EMAIL_ID,
			to: email,
			subject: 'Carrot Authentication Email',
			html, //`Authentication Code : ${payload}`,
			text: `Authentication Code : ${payload}`,
		};
		const result = smtpTransport.sendMail(mailOptions, (error, response) => {
			if (error) {
				console.log(error);
				return null;
			} else {
				console.log('good job', response);
				smtpTransport.close();
				return null;
			}
		});
		smtpTransport.close();
		console.log(result);
	}

	const token = await client.token.create({
		data: {
			payload,
			user: {
				connectOrCreate: {
					where: {
						...user,
					},
					create: {
						name: 'Anonymous',
						...user,
					},
				},
			},
		},
	});
	console.log(token);

	return res.json({
		ok: true,
	});
};

export default withHandler({ methods: ['POST'], handler, isPrivate: false });
