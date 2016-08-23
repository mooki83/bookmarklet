var chkRun = false;

function goBlog(blog_id, blog_logNo) {
	location.href = "http://blog.naver.com/PostView.nhn?blogId=" + blog_id + "&logNo=" + blog_logNo;
}

if ("blog.naver.com" == location.host) {
	var r = new RegExp("^(http|https)://(.*)/(.*)/(.*)"),
		href = location.href;
	if (r.test(href)) {
		chkRun = true;
		var exec_r = r.exec(href);
		goBlog(exec_r[3], exec_r[4]);
	}
} else {
	var r = new RegExp(/^(http|https):\/\/(.+)\.blog\.me\/(.+)/),
		href = location.href;
	if (r.test(href)) {
		chkRun = true;
		var exec_r = r.exec(href);
		goBlog(exec_r[1], exec_r[2]);
	} else {
		var el = document.getElementById("screenFrame");
		if (el != null) {
			var r = new RegExp(/blog.naver.com\/(.+)\?(.+)logNo=(.+)\&/),
				src = el.src;
			if (r.test(src)) {
				chkRun = true;
				var exec_r = r.exec(src);
				goBlog(exec_r[1], exec_r[3]);
			}
		}
	}
}

if (!chkRun) {
	alert("개발자에게 문의하세요");
};