/**
 * Created by 明阳 on 2014/12/22.
 */
localStorage.unlucky = localStorage.unlucky || "{}";
function getLuckyStar() {
    var unlucky = JSON.parse(localStorage.unlucky);
    var try_cnt = 0;
	var luckyStar ;
    var luckyName ;
    do {
        luckyStar = stars[parseInt(stars.length * Math.random())];
        luckyName = luckyStar[1];
        luckyStar = luckyStar[0];
        ++try_cnt;
        if(try_cnt > 100000) {
            console.log("Can not find lucky star!");
			luckyStar = "00000000";
            return {
                id:luckyStar,
                name:luckyName
            };
        }
    }while(unlucky[luckyStar]);
    unlucky[luckyStar] = 1;
    localStorage.unlucky = JSON.stringify(unlucky);
    return {
        id:luckyStar,
        name:luckyName
    };
}

