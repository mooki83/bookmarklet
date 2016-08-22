var chkRun = false;

function goBlog(id, no) {
	location.href = "http://blog.naver.com/PostView.nhn?blogId=" + id + "&logNo=" + no
}

if ("blog.naver.com" == location.host) {
	var r = new RegExp("^(http|https)://(.*)/(.*)/(.*)"),
		href = location.href;
	if (r.test(href)) {
		chkRun = true;
		var exec_r = r.exec(href),
			blog_id = exec_r[3],
			blog_logNo = exec_r[4];
		goBlog(blog_id, blog_logNo);
	}
} else {
	var r = new RegExp(/^(http|https):\/\/(.+)\.blog\.me\/(.+)/),
		href = location.href;
	if (r.test(href)) {
		chkRun = true;
		var exec_r = r.exec(href),
			blog_id = exec_r[1],
			blog_logNo = exec_r[2];
		goBlog(blog_id, blog_logNo);
	} else {
		var el = document.getElementById("screenFrame");
		if (el != null) {
			var r = new RegExp(/blog.naver.com\/(.+)\?(.+)logNo=(.+)\&/),
				src = el.src;
			if (r.test(src)) {
				chkRun = true;
				var exec_r = r.exec(href),
					blog_id = exec_r[1],
					blog_logNo = exec_r[3];
				goBlog(blog_id, blog_logNo);
			}
		}
	}
}

if (!chkRun) {
	alert("개발자에게 문의하세요")
};