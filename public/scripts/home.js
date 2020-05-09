
let form = document.getElementsByTagName("form")[0];


form.addEventListener("submit",(event)=>{
    
    event.preventDefault();

    let trackingNum = event.target.getElementsByTagName("input")[0].value
    let status = document.getElementById("status");
    status.innerText = "please wait...";

    fetch(`/track?num=${trackingNum}`,{
        method : 'POST'
    }).then((res)=>{
        console.log(res);
        if(res.status == 200){
            status.innerText = "successfully found data!";
            res.json().then((data)=>{
                
                let {shipment , summary , history} = data;
                let temp_html = `<h1>shipment details</h1>`;

                for(let s of shipment){
                    Array.from(s).forEach((elem)=>{
                        temp_html += `<p>${elem}</p>`
                    })
                    temp_html += `<hr/>`
                }

                temp_html += `<h1>summary details</h1>`
                for(let s of summary){
                    Array.from(s).forEach((elem)=>{
                        temp_html += `<p>${elem}</p>`
                    })
                    temp_html += `<hr/>`
                }

                temp_html += `<h1>history details</h1>`
                for(let h of history){
                    Array.from(h).forEach((elem)=>{
                        temp_html += `<p>${elem}</p>`
                    })
                    temp_html += `<hr/>`
                }

                document.getElementById("result").innerHTML = temp_html;

            })

        }
    }).catch((err)=>{
        status.innerText = "Error occured";
        console.log(err);
    })


})
