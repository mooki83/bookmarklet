function sendLinkToLink(url) {

	var httpRequest;

	if (window.XMLHttpRequest) { // Mozilla, Safari, ...
		httpRequest = new XMLHttpRequest();
	} else if (window.ActiveXObject) { // IE
		try {
			httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
			}
		}
	}

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}

	//var sData = "payload=" + JSON.stringify({"channel":"#채널설정", "text":"텍스트 설정", "username":"사용자명 설정"});
	var sData = "payload=" + JSON.stringify({"text":url});
	var slackUrl = "https://hooks.slack.com/services/";	// TODO: 키값 설정
	httpRequest.onreadystatechange = function(){
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				alert(httpRequest.responseText);
			} else {
				alert('에러가 발생하였습니다.');
			}
		}
	};
	httpRequest.open('POST', slackUrl);
	httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	httpRequest.send(sData);
	// JSON.stringify({name:"John Rambo", time:"2pm"})
}

function alertContents() {
	console.log(httpRequest);
	if (httpRequest.readyState === 4) {
		if (httpRequest.status === 200) {
			alert(httpRequest.responseText);
		} else {
			alert('에러가 발생하였습니다.');
		}
	}
}

sendLinkToLink(encodeURIComponent(location.href));
