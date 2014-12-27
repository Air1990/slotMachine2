/**
 * Created by 明阳 on 2014/12/22.
 */
localStorage.unlucky = localStorage.unlucky || "{}";
function getLuckyStar() {
    var unlucky = JSON.parse(localStorage.unlucky);
    var try_cnt = 0;
	var luckyStar ;
    do {
        luckyStar = stars[parseInt(stars.length * Math.random())];
        ++try_cnt;
        if(try_cnt > 100000) {
            console.log("Can not find lucky star!");
			luckyStar = "00000000"
            return luckyStar;
        }
    }while(unlucky[lucky_star]);
    unlucky[lucky_star] = 1;
    localStorage.unlucky = JSON.stringify(unlucky);
	return luckyStar;
}

