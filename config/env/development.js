'use strict';

module.exports = {
	db: 'mongodb://laurie:Sunsh1ne1@ds029831.mongolab.com:29831/test',
	app: {
		title: 'FriendlyRoad - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1655337394692802',
		clientSecret: process.env.FACEBOOK_SECRET || 'b67e3be6099dfb356e21aabd0fb1422a',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'COCLyLt585SfdwZDfZA8YKl6v',
		clientSecret: process.env.TWITTER_SECRET || 'cM7ghqQjQpPkcqU3Vjw1tU1Xo69aP08g70S4sCJrhr09c2IJTj',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '845632653830-jf00q917p58a3ioq94dkngsv792dl3ko',
		clientSecret: process.env.GOOGLE_SECRET || '7gmwy7ReEtgcheQGsmtOk6Du',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'a7dcd97d-2604-4713-9195-30b41002a5c8',
		clientSecret: process.env.LINKEDIN_SECRET || 'f97e51a4-7ae3-45fa-8551-20227816d554',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'fdfe09443bcd133b70c5',
		clientSecret: process.env.GITHUB_SECRET || '9d3d35beb4661384265fcbf244cd1d12d4473022',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
