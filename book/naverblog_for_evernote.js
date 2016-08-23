var chkRun = false;

function goBlog(blog_id, blog_logNo) {
	location.href = "http://blog.naver.com/PostView.nhn?blogId=" + blog_id + "&logNo=" + blog_logNo;
}

if ("blog.naver.com" == location.host) {
	var r = new RegExp("^(http|https)://(.*)/(.*)/(.*)"),
		href = location.href;
	if (r.test(href)) {
		console.log("type1");
		chkRun = true;
		var exec_r = r.exec(href);
		goBlog(exec_r[3], exec_r[4]);
	}
} else {
	var r = new RegExp(/^(http|https):\/\/(.+)\.blog\.me\/(.+)/),
		href = location.href;
	if (r.test(href)) {
		console.log("type2");
		chkRun = true;
		var exec_r = r.exec(href);
		goBlog(exec_r[2], exec_r[3]);
	} else {
		var el = document.getElementById("screenFrame");
		if (el != null) {
			var r = new RegExp(/blog.naver.com\/(.+)\?(.+)logNo=(.+)\&/),
				src = el.src;
			if (r.test(src)) {
				console.log("type3");
				chkRun = true;
				var exec_r = r.exec(src);
				goBlog(exec_r[1], exec_r[3]);
			} else {
				// SRC가 http://blog.naver.com/blogId/logNo? 형태일 경우
				var r = new RegExp(/^(http|https):\/\/blog\.naver\.com\/(.*)\/(.\d+)/);
				if ( r.test(src) ) {
					console.log("type4");
					chkRun = true;
					var exec_r = r.exec(src);
					goBlog(exec_r[2], exec_r[3]);
				}
			}
		}
	}
}

if (!chkRun) {
	alert("개발자에게 문의하세요");
};
