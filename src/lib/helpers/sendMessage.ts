// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
import twilio from 'twilio';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import {
	TWILIO_ACCOUNT_SID,
	TWILIO_AUTH_TOKEN,
	TWILIO_VERIFY_SERVICE_SID
} from '$env/static/private';

const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const verifySid = TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

export const sendOPTCodeToPhoneNumber = async (phoneNumber: string) => {
	// phoneNumber example: +519266890xx

	const verification = await client.verify.v2.services(verifySid).verifications.create({
		to: phoneNumber,
		channel: 'sms'
	});

	return verification;
};

export const verifyOPTCode = async (phoneNumber: string, otpCode: string) => {
	const verification_check = await client.verify.v2
		.services(verifySid)
		.verificationChecks.create({ to: phoneNumber, code: otpCode });

	return verification_check;
};

export const getCountryCodes = async () => {
	// get all available countries codes to send a sms
	const countries = await client.voice.v1.dialingPermissions.countries.list();

	const countryMeta = countries.map((c) => {
		return {
			countryCode: `+${c.countryCodes.at(0)}`,
			countryName: c.name,
			icon: getUnicodeFlagIcon(c.isoCode)
		};
	});
	return countryMeta;
};
