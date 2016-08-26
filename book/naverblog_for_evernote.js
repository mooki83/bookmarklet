var chkRun = false;

function goBlog(blog_id, blog_logNo) {
	location.href = "http://blog.naver.com/PostView.nhn?blogId=" + blog_id + "&logNo=" + blog_logNo;
}

if ("blog.naver.com" == location.host) {
	// 블로그 주소로 되어있을때 처리
	var r = new RegExp("^(http|https)://(.*)/(.*)/(.*)"),
		href = location.href;
	if (r.test(href)) {
		console.log("type1");
		chkRun = true;
		var exec_r = r.exec(href);
		goBlog(exec_r[3], exec_r[4]);
	}
} else {
	// blog.me 도메인일 경우 처리
	var r = new RegExp(/^(http|https):\/\/(.+)\.blog\.me\/(.+)/),
		href = location.href;
	if (r.test(href)) {
		console.log("type2");
		chkRun = true;
		var exec_r = r.exec(href);
		goBlog(exec_r[2], exec_r[3]);
	} else {
		// 도메인 형태로 되어있을 경우 처리
		var el = document.getElementById("screenFrame");
		if (el != null) {
			// SRC가 http://blog.naver.com/블로그아이디?Redirect=Log&logNo=글번호&........... 형태일 경우
			var r = new RegExp(/blog.naver.com\/(.+)\?(.+)logNo=(.+)\&/),
				src = el.src;
			if (r.test(src)) {
				console.log("type3");
				chkRun = true;
				var exec_r = r.exec(src);
				goBlog(exec_r[1], exec_r[3]);
			} else {
				// SRC가 http://blog.naver.com/블로그아이디/글번호? 형태일 경우
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
	/*
	if ( confirm("개발자에게 해당 URL을 보내시겠습니까?\n(보내주신 URL을 참고하여 버전업에 힘쓰도록 하겠습니다.)") ) {
		
	}
	*/
	alert("개발자에게 문의하세요");
};
