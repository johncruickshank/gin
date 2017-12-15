use gin_bars;
db.dropDatabase();

var bars = [
  {
  		name: "Gin71 Merchant City",
  		coords: { lat: 55.8589196, lng: -4.2494644 },
  		address: "40 Wilson Street, Glasgow, G1 1HD",
  		location: "Glasgow",
  		description: "",
  		website: "https://www.gin71.com/aboutgmc/",
  		image: "https://2.bp.blogspot.com/-SuvzXeyaQ4s/WNATuW_-vxI/AAAAAAAAKwk/3OYW2vOP1-w4SEPvBPdAtPQDeD4Fn1BbACEw/s1600/17409909_10158563424400294_2084261702_n.jpg",
  		top3_gins: [{
  			name: "Rock Rose",
  			mixer: "Fever-Tree Tonic Water",
  			price: 8.50
  		},
  		{
  			name: "Isle of Harris",
  			mixer: "Gin71 Lemon & Rosemary Tonic",
  			price: 9.50
  		},
  		{
  			name: "Arbikie AK’s Gin",
  			mixer: "Gin71 Ginger Ale",
  			price: 8.50
  		}],
  		twitter_last_tweet: [],
  		social_media_links: {facebook: "https://www.facebook.com/gin71bar", instagram: "https://www.instagram.com/gin71bar/", twitter: "https://twitter.com/Gin71Bar"},
  		reviews: [],
  		theme: "Merchant City sophistication",
  		opening_times: {open: "17:00", closed: "00:00"},
  		phone_number: "0141 553 2326"
  	},
    {
		name: "The Spiritualist",
		coords: { lat: 55.8590068, lng: -4.2508912},
		address: "62 Miller Street, Glasgow, G1 1DT",
		location: "Glasgow",
		description: "A relative newcomer to Glasgow (est.2016), with a stylish art-deco inspired interior, The Spiritualist has over 75 gins on its menu - with an impressive 400 spirits overall!",
		website: "http://www.thespiritualistglasgow.com/",
		image: "https://files.list.co.uk/images/2017/03/29/begin-glasgow-gin-bar-byres-road1-ne-lst237403_thumb.jpg",
		top3_gins: [{
			name: "Audemus Pink Pepper",
			mixer: "Walter Gregor's Handmade Scottish Tonic",
			price: 10.00
		},
  	{
			name: "Warner Edwards Rhubarb",
    	mixer: "Fever-Tree Tonic Water",
    	price:  6.70
  	},
  	{
			name: "Makar Glasgow",
    	mixer: "Fever-Tree Mediterranean Tonic Water",
    	price:  5.95
  	}],
	   twitter_last_tweet: [],
	    social_media_links: {facebook: "https://en-gb.facebook.com/TheSpiritualistGlasgow/", instagram: "https://www.instagram.com/explore/locations/1030201701/", twitter: "https://twitter.com/spiritualistgla"},
	     reviews: [],
	      theme: "art-deco",
	       opening_times: {open: "12:00", closed: "00:00"},
	        phone_number: "0141 248 4165"
    },
    {
  		name: "Gin71 Glasgow",
  		coords: { lat: 55.8632928, lng: -4.2574232 },
  		address: "71 Renfield Street, Glasgow, G2 1LP",
  		location: "Glasgow",
  		description: "Glasgow's first dedicated gin bar. A beautiful space to enjoy carefully selected gins.",
  		website: "https://www.gin71.com/aboutgla/",
  		image: "http://1.bp.blogspot.com/-n1G_C4J7h6A/VkJR-0ab8kI/AAAAAAAAK3Y/qxKmnVFbfnk/s1600/11820661_1668436650104697_887626269_n.jpg",
  		top3_gins: [{
  			name: "Eden Mill Love",
  			mixer: "Fever-Tree Tonic Water",
  			price: 8.50
  		},
  		{
  			name: "Lussa",
  			mixer: "Gin71 Lemon & Rosemary Tonic",
  			price: 9.50
  		},
  		{
  			name: "Gin Mare",
  			mixer: "Fever-Tree Mediterranean Tonic Water",
  			price: 8.00
  		}],
  		twitter_last_tweet: [],
  		social_media_links: {facebook: "https://www.facebook.com/gin71bar", instagram: "https://www.instagram.com/gin71bar/", twitter: "https://twitter.com/Gin71Bar"},
  		reviews: [],
  		theme: "old world elegance",
  		opening_times: {open: "17:00", closed: "00:00"},
  		phone_number: "0141 353 2959"
  	},
];

db.bars.insertMany(bars);

db.bars.find();