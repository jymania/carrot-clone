import nodemailer from 'nodemailer';

const smtpTransport = nodemailer.createTransport({
	service: 'Naver',
	host: 'smtp.naver.com',
	port: 465,
	auth: {
		user: process.env.EMAIL_ID,
		pass: process.env.EMAIL_PASSWORD,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

export default smtpTransport;
