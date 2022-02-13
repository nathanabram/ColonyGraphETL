const fs = require("fs");
const { setPriority } = require("os");
const requestData = require("./GQLqueryMaker");

// a list of data types which can be queried
const dataTypes = [
	"colonies",
	"domains",
	"payments",
	"oneTxPayments",
	"tokens",
	"fundingPots",
	"transactions",
	"blocks",
	"events",
	"colonyExtensions",
	"motions",
	"coinMachinePeriods",
];

// function to fetch all of a given datatype
const fetchAll = async (dataType, step = 1000) => {
	let data = [];
	let moreToFetch = true;
	let skip = 0;
	while (moreToFetch) {
		let fetched = [];
		// while data is still being returned
		try {
			fetched = await requestData(dataType, skip);
			fetched = fetched[dataType];
		} catch (err) {
			console.log(err);
		}

		if (fetched.length == 0 || fetched == undefined) {
			moreToFetch = false;
		} else {
			data = data.concat(fetched); // merge the arrays
		}
		skip += step; // increase so that the query fetches the next chunk of data
	}
	fs.writeFileSync(`./data/${dataType}`, JSON.stringify(data));
	return data;
};

// for each datatype, execute fetchAll

dataTypes.forEach((dataType) => {
	fetchAll(dataType);
});
