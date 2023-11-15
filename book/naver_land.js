// eval 대응 
function looseJsonParse(obj){ 
    return Function(`"use strict";return ({obj})`)(); 
} 
function replaceAll(str, searchStr, replaceStr) { 
    return str.split(searchStr).join(replaceStr); 
}
function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}
function downloadText(exportText, exportName, exportProp = "txt") {  
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportText);  
    var downloadAnchorNode = document.createElement('a');  
    downloadAnchorNode.setAttribute("href", dataStr);  
    downloadAnchorNode.setAttribute("download", exportName + "." + exportProp);  
    document.body.appendChild(downloadAnchorNode); // required for firefox  
    downloadAnchorNode.click();  
    downloadAnchorNode.remove();  
} 
function downloadCSV(exportData, exportName){ 
    const BOM = "\uFEFF"; 
    exportData = BOM + exportData; 
    var downloadLink = document.createElement("a"); 
    var blob = new Blob([exportData], { type: "text/csv;charset=utf-8" }); 
    var url = URL.createObjectURL(blob); 
    downloadLink.href = url; 
    downloadLink.download = exportName + ".csv"; 
    document.body.appendChild(downloadLink); 
    downloadLink.click(); 
    document.body.removeChild(downloadLink); 
}
function isEmptyObject(param) {
    return Object.keys(param).length === 0 && param.constructor === Object;
}
async function getNaverLandDetail(comp) {  
    var obj = [];  
    await fetch(`https://m.land.naver.com/complex/info/${comp}`).then(function(response) {  
        return response.text();  
    }).then(function(string) {  
        var parser = new DOMParser(); 
        var doc = parser.parseFromString(string, "text/html"); 
        var r = /jsonPageData((.|\n)*)land\.jpage\.appendOO/gm; 
        var tmp = r.exec(doc.body.innerHTML)[0]; 
        tmp = tmp.replace("jsonPageData = ", ""); 
        tmp = tmp.replace("land.jpage.appendOO", ""); 
        tmp = tmp.replace("};", "}"); 
        tmp = replaceAll(tmp, "$.parseJSON", "JSON.parse"); 
        var oobj = looseJsonParse(String(tmp)); 
        // console.log(oobj); 
        // DCnt = 동 갯수, HCnt = 세대수 
        vv.push({"aptNm" : oobj.hscpNm, "aptUrl" : "https://new.land.naver.com/complexes/" + comp, "aptTel" : oobj.mgOfcTelNo || "", 
                 "aptAddr" : oobj.addr, "aptRoad" : oobj.roadAddr, "aptDCnt" : oobj.totDongCnt, "aptHCnt" : oobj.totHsehCnt, 
                 "lat" : oobj.lat, "lng" : oobj.lng, "aptNo" : oobj.hscpNo }); 
        // downloadText(tmp, comp); 
        // console.log(comp); 
    }).catch(function(e) {
        alert("BOT 감지 당했습니다. 페이지 인증을 진행해주시기 바랍니다.");
        g_stop = true;
    });  
}
var vv = [];
var g_stop = false;
if ( window.__g_m_obj !== undefined ) {
    // vv 진행하던 array가 있고
    // result가 그대로 있다는 기준으로 재진행
    vv = window.__g_m_obj.vv;
    var result = window.__g_m_obj.result;
    var addrName = window.__g_m_obj.addrName;
    console.log("재진행", window.__g_m_obj);
    for ( var l = vv.length - 1, len = result.length ; l < len ; l++ ) { 
        await getNaverLandDetail(result[l].hscpNo);
        if ( g_stop ) { break; }
        if ( l % 80 == 0 ) {
            await sleep(3);
            console.log("80 단위 Break;")
        } else {
            await sleep(0.2);
        }
    }
    if ( g_stop ) {
        // 실패 했기 때문에 다시 실행
        window.__g_m_obj = {
            addrName : addrName,
            result : result,
            vv : vv
        }
        alert("데이터 수집에 실패 했습니다. 페이지 인증 후 다시 실행해주세요.");
    } else {
        downloadText(JSON.stringify(vv), addrName + "_dev"); 
        var k = "건물명,전화번호,주소,도로명,동수,세대수,네이버링크\n"; 
        vv.forEach( i => { k += `"${i.aptNm}","${i.aptTel}","${i.aptAddr}","${i.aptRoad}","${i.aptDCnt}","${i.aptHCnt}","${i.aptUrl}"\n` } ); 
        downloadCSV(k, addrName);
        window.__g_m_obj = undefined;
    }
} else {
    // const  
    // document.querySelector("._btnApplyRegion").getAttribute('cortarno') == document.querySelector("._step4 [title='읍,면,동 선택']").getAttribute('cortarno') 
    var addrList = []; 
    document.querySelectorAll("._step4 .inter_area_inner .region_select_item.is-active").forEach( i => { addrList.push(i.textContent) }); 
    var addrName = addrList.join(" "); 
    var cortarNo = document.querySelector("._step4 [title='읍,면,동 선택']").getAttribute('cortarno'); 
    if ( cortarNo == document.querySelector("._btnApplyRegion").getAttribute('cortarno') ) { 
        if ( confirm(`${addrName}\n\n해당 지역의 아파트정보를 수집하겠습니까?`) ) { 
            var resJson = {}; 
            await fetch(`https://m.land.naver.com/complex/ajax/complexListByCortarNo?cortarNo=${cortarNo}`).then( response => { 
                return response.json();  
            }).then(function(string) { 
                resJson = string; 
            });; 
            var result = resJson.result; 
            if ( result.length > 80 ) {
                alert("대상 아파트가 " + result.length + "개 입니다. 따라서 작업시간이 길게 걸릴 수 있습니다.")
            }
            for ( var l = 0, len = result.length ; l < len ; l++ ) { 
                await getNaverLandDetail(result[l].hscpNo);
                if ( g_stop ) { break; }
                if ( l % 80 == 0 ) {
                    await sleep(3);
                    console.log("80 단위 Break;")
                } else {
                    await sleep(0.2);
                }
            }
            if ( g_stop ) {
                // 실패 했기 때문에 다시 실행
                window.__g_m_obj = {
                    addrName : addrName,
                    result : result,
                    vv : vv
                }
                alert("데이터 수집에 실패 했습니다. 페이지 인증 후 다시 실행해주세요.");
            } else {
                downloadText(JSON.stringify(vv), addrName + "_dev"); 
                var k = "건물명,전화번호,주소,도로명,동수,세대수,네이버링크\n"; 
                vv.forEach( i => { k += `"${i.aptNm}","${i.aptTel}","${i.aptAddr}","${i.aptRoad}","${i.aptDCnt}","${i.aptHCnt}","${i.aptUrl}"\n` } ); 
                downloadCSV(k, addrName);
                window.__g_m_obj = undefined;
            }
        } 
    } else { 
        alert("읍, 면, 동을 선택하시기 바랍니다."); 
    } 
}
