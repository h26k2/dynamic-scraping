const port = 8080;
const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const url = "https://www.tcsexpress.com/tracking";

app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("home");
});

app.post('/track',async(req,res)=>{

    let {num} = req.query;
    console.log(`sending recieved for tracking : ${num}`);


    try{

        let browser =  await puppeteer.launch({headless : false});
        let page = await browser.newPage();
        await page.goto(url , {waitUntil : 'networkidle0' ,  timeout : 0});

        await page.type("#track_no",num);
        await page.click("#btnload")

        await page.waitForSelector(".shipment-detail");

        let shipment = await page.$$eval(".shipment-detail",(elem)=>{
        
            let s_temp = [];

            for(let i=0 ; i<elem.length ; i++){

                let shipments = elem[i].getElementsByTagName("p");
                let temp = [];

                for(let d of shipments){
                    temp.push(d.innerText)
                }

                s_temp.push([...temp])

            }

            return s_temp;
            
        })
        
        let summary = await page.$$eval(".shipment-tracking-summary",(elem)=>{

            let summary_temp = []

            for(let i=0 ; i<elem.length ; i++){
                
                let t_summary = elem[i].getElementsByTagName("p");
                let temp = [];

                for(let s of t_summary){
                    temp.push(s.innerText);
                }

                summary_temp.push([...temp]);
                
            }

            return summary_temp;

        })

        let history = await page.$$eval(".track-history",(elem)=>{

            let t_temp = [];

            for(let i=0 ; i<elem.length ; i++){
                
                let t_history = elem[i].getElementsByTagName("tr");
                let temp = [];

                for(let j= 1 ; j<t_history.length ; j++){
                
                    let td = t_history[j].getElementsByTagName("td");
                    let td_temp = []
                    for(let t of td){
                        td_temp.push(t.innerText);
                    }
                    temp.push(td_temp);
                }

                t_temp.push([...temp])

            }

            return t_temp;

        })
        
        let details = {
            shipment ,
            summary ,
            history 
        }

        console.log(details);
        await browser.close();
        res.status(200).json(details);

    }
    catch(err){
        res.status(500).end();
        console.log(err);
    }

});


app.listen(port,()=>{
    console.log(`app is live at port : ${port}`)
});
