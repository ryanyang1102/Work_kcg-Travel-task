
const zoneSelect = document.querySelector('#area');
const listContent = document.querySelector('.listContent');
const zoneTitle = document.querySelector('.zoneTitle');
const popularAreaBtn = document.querySelector('.popularArea');
const pageNumberID = document.getElementById('pagenumber');
const goTop = document.querySelector('.goTop');
let newData = [];

let xhr = new XMLHttpRequest();
xhr.open('get','https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json',true);
xhr.send(null);
xhr.onload = function(){
    data = JSON.parse(xhr.responseText).result.records;
    // console.log(data)

// 將原始data帶進，產生全部列表
// 增加選單函式
addSelect()

// 這邊統一變數newData
// 是因為要使'更換頁面函式'索取的資料為 "預設data" 及 "監聽listFilter函式" 統一
newData = data;
// 預設先處理分頁1
pagination(newData,1)
}

// 監聽：熱門地點按鈕，列表篩選函式
popularAreaBtn.addEventListener('click',function (e) {
    if (e.target.nodeName === 'A') {
        listFilter(e.target.textContent);
    }
  },false);
// 監聽：選取選單，列表篩選函式
zoneSelect.addEventListener('change',function (e) {
    listFilter(e.target.value);
  },false);
// 監聽：更換頁面
pageNumberID.addEventListener('click',switchPage,false);
// 監聽：畫面置頂
goTop.addEventListener('click', pageGoTop,false);



// 由data資料增加選單option
function addSelect() {
    let selectData = '<option value="請選擇">--請選擇行政區--</option>'
    let zoneArray = [];

    // 先撈出不重複的地區到空陣列
    data.forEach(function (item) {
        if(zoneArray.indexOf(item.Zone) === -1){
            zoneArray.push(item.Zone)  
        }
    });

    // 將撈出的陣列值逐一放入選單
    zoneArray.forEach(function (item){
        selectData += `
        <option class="selectOpt" value="${item}">${item}</option>;
        ` 
        // 方法二：用 DOM 節點
        // const newOpt = document.createElement('option');
        // newOpt.setAttribute(`value`,`${item}`);
        // newOpt.textContent = `${item}`;
        // select.appendChild(newOpt);
    })
    zoneTitle.textContent = '全部列表';
    // 預設列表標題是「全部列表」
    zoneSelect.innerHTML = selectData;
}


// 列表篩選函式
// 將所點選到的值對應data的地點
// 並將其放進陣列中
// 再用渲染函式渲染出來
function listFilter(i) {
    newData = [];
    let target = i;
    // 參數i來自e.target.textContent和e.target.value
    // 為解決a標籤沒有value值
    // 用input做按鈕又容易造成點選父元素undefined畫面跑掉的問題
    // 故將兩監聽參數統一成一個變數（數值一樣）
    // console.log(i)
    
    data.forEach(function (item) {
        if(target !== item.Zone){
            return
            }
            zoneTitle.textContent = target;
            // console.log(e.target.value)
            newData.push({
                Picture1:item.Picture1,
                Name:item.Name,
                Zone:item.Zone,
                Opentime:item.Opentime,
                Add:item.Add,
                Tel:item.Tel,
                Ticketinfo:item.Ticketinfo
            });
    })
    if(target === '請選擇' ){
        zoneTitle.textContent = '全部列表';
        newData = data;
    }    
    pagination(newData,1);
    // 預設分頁為第一頁
};


// 處理分頁及當頁資料
function pagination(dataX,nowPage) {
    let dataLen = dataX.length;
    let perPage = 4;
    let pageNumber = Math.ceil(dataLen / perPage);
    
    // 設定分頁第一筆資料及最後一筆資料
    const minData = (nowPage * perPage) - perPage + 1;  //第2頁 2*4-4+1=5
    const maxData = nowPage * perPage;  //第2頁 2*4=8

    let zoneItem = [];
    dataX.forEach(function (item,index) {
        const pageRange = index + 1; // 資料索引從0開始
        if ( pageRange >= minData && pageRange <= maxData) {
            zoneItem.push(item);
        }; 
    }); 
    // 用物件傳遞資料
    const page = {
        nowPage,  // 當前頁數
        pageNumber, // 總頁數
        addPrev: nowPage > 1, //判斷當前的頁數有沒有大於1
        addNext: nowPage < pageNumber, //判斷當前的頁數有沒有小於總頁數
    }; 
    // 渲染分頁畫面
    randerList(zoneItem);
    // 渲染分頁按鈕
    pageBtn(page);
};


// 渲染分頁畫面
function randerList(zone) {
    let str = '';    
    zone.forEach(function(item){
        str +=`
            <li class="item">
                <div class="img">
                    <div class="img-bg" style="background-image: url(${item.Picture1});"></div>
                    <div class="img-text">
                        <h3>${item.Name}</h3>
                        <p>${item.Zone}</p>
                    </div>
                </div>
                <div class="content">
                    <p>${item.Opentime}</p>
                    <p>${item.Add}</p>
                    <div class="number">
                        <p>${item.Tel}</p>
                        <p>${item.Ticketinfo}</p>
                    </div>
                </div>
            </li>`;
    });
    listContent.innerHTML = str;
};
{/* <img src="${item.Picture1}" alt=""></img> */}
// 渲染分頁按鈕
function pageBtn(page) {
    // console.log(page)
    let eleStr = '';
    // console.log(page.addPrev)
    if(page.addPrev) { //如果當前的頁數大於1，Prev 的按鈕就可以按
        eleStr += `<li href="#" data-num="${Number(page.nowPage) - 1}" class="prev">prev</li>`;
        } else { //否則不顯示
        eleStr += `<li style="display:none"><span>prev</span></li>`;
        } ;
    
    for (let i = 1; i <= page.pageNumber; i++) {
        if(Number(page.nowPage) === i){
            eleStr +=`
            <li href="#" data-num="${i}"><span class="active">${i}</span></li>
            `}else{
                eleStr +=`<li href="#" data-num="${i}">${i}</li>`;
            };
        };
    if(page.addNext) {//如果當前的頁數小於總頁數，Next 的按鈕就可以按
        eleStr += `<li href="#" data-num="${Number(page.nowPage) + 1}" class="next">next</li>`;
        } else { //否則不顯示
        eleStr += `<li style="display:none"><span>next</span></li>`;
        };
    pageNumberID.innerHTML = eleStr;
};

// 更換頁面函式
function switchPage(e) {
    if(e.target.nodeName !== 'LI') return;
    const pageNum = e.target.dataset.num; // 由自定義的data-num鎖定頁數
    // console.log(newData,pageNum);
    pagination(newData,pageNum)
}

// 畫面置頂按鈕函式
function pageGoTop(){
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
};


