const express = require("express")
const bodyParser = require("body-parser");
const cors = require('cors');
const {ratownicy} = require("./tables/ratownicy");
const {daty} = require("./tables/daty");
const {gotowezmiany} = require("./tables/gotowezmiany");


const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({
	extended: true,
}))
app.use(bodyParser.json());
app.use(cors());

const port = 8080;


const ROUTES = {
	ratownicy: "/api/ratownicy",
	gotowezmiany: "/api/gotowezmiany",
	daty: "/api/daty"
}

app.post(ROUTES.ratownicy+"/login", (req,res)=>{
	const email = req.body.email;
	const index = ratownicy.findIndex(item=> item.email===email)
	if(index!==-1&&ratownicy[index].haslo===req.body.haslo){
				res.json({message: "Udało się", data:ratownicy[index]});
		}
	else{
			res.status(400).json({message: "Błąd"})
		}
})

app.post(ROUTES.daty+"/alldates", (req,res)=>{
	const dates = daty.filter(element=>element.id_ratownika === req.body.id_ratownika)
	res.json(dates)
})

app.get(ROUTES.gotowezmiany+"/getreadysshifts", (req,res)=>{
	res.json(gotowezmiany)
})

app.get(ROUTES.gotowezmiany,(req, res)=>{
	res.json(gotowezmiany)
})

app.get(ROUTES.gotowezmiany+"/getunaddedshifts",(req,res)=>{
	const results = daty
		.map((t1) => ({
			...t1,
			...ratownicy.find((r) => r.id_ratownika === t1.id_ratownika),
		}))
		.filter((t1) => !daty.some((t2) => t2.id_ratownika === t1.id_ratownika && t2.start === t1.start && t2.end === t1.end));
	res.json(results)
})

app.listen(port, () => {
	console.log(`Express server is running on port ${port}`);
});