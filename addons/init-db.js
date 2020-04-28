db = db.getSiblingDB("ya-ls-graphql");
db.createCollection("roles");

const roles = [
	{
		_id: ObjectId("5ea15f2576ecc747f3428bba"),
		code: "ADMIN",
		createdAt: Date.now()
	},
	{
		_id: ObjectId("5ea15f2576ecc747f3428bbb"),
		code: "USER",
		createdAt: Date.now()
	},
	{
		_id: ObjectId("5ea15f2576ecc747f3428bbc"),
		code: "USER_UNAUTH",
		createdAt: Date.now()
	},
	{
		_id: ObjectId("5ea15f2576ecc747f3428bbd"),
		code: "REVIEWER",
		createdAt: Date.now()
	}
];

db.roles.drop();
db.roles.insertMany(roles);
