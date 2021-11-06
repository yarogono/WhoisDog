// onload 되면 자동으로 카드가 붙고, 로그인 상태 확인해서 냇바 버튼이 변경되도록 설정
$(document).ready(function () {
    get_cards();
    checkCookie();
})

// 업로드 데이터 불러와서 화면에 카드 붙이기 / ajax에서 jinja2 템플릿 엔진으로 수정함
function get_cards() {
    // $("#card-box").empty()
    $.ajax({
        type: "GET",
        url: "/api/get_cards",
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                // 업로드 데이터를 가져와서 템플릿 양식에 맞춰 데이터 수만큼 카드가 생성되도록 함 > 구현 실패로 jinja2 템플릿 엔진 사용으로 변경
                let cards = response["cards"]
                for (let i = 0; i < cards.length; i++) {
                    let card = cards[i]
                    let temp_html = `<div class="card-container">
                                        <div class="card-top">
                                            <span class="card-username">${card['user_name']}</span>
                                            <span class="card-like">
                                                <span class="card-like-count">${card['like_count']}</span>
                                                <span>
                                                <button class="btn btn-like" id="${card['_id']}" aria-label="like" onclick="likeClick(), 'like'"><i
                                                        class="far fa-heart" style="font-size: 1.5rem; color: dimgray"></i></button>
                                            </span>
                                            </span>
                                        </div>
                                        <!--            image-->
                                        <div class="card-middle">
                                            <img src="${card['pet_img']}"
                                                 alt="card-image" class="card-img">
                                        </div>
                                        <div class="card-bottom">
                                            <div class="card-desc">
                                                <div class="pet-desc">
                                                    <p>제 이름은 <span class="pet-name" style="font-weight: 700">${card['pet_name']}</span> 에요!</p>
                                                    <p>나이는 <span class="pet-age" style="font-weight: 700">${card['pet_age']}</span>살 이구요,</p>
                                                    <p><span class="pet-species" style="font-weight: 700">${card['pet_species']}</span> 랍니다!</p>
                                                </div>
                                                <p class="pet-intro"><span style="font-size: 1.5rem">"</span>${card['pet_intro']}<span style="font-size: 1.5rem">"</span></p>
                                            </div>
                                        </div>
                                    </div>`
                    $("#card-box").append(temp_html)
                }
            }
        }
    })
}

// (구현 못 함) 좋아요 클릭 이벤트 함수
function likeClick(_id, type) {
    console.log(_id, type)
    // 좋아요를 클릭한 게시물의 고유 식별 id와 타입 변수 설정
    let $a_like = $(`#${_id} button[aria-label='${type}']`)
    let $i_like = $a_like.find("i")
    // 현재 좋아요 아이콘의 상태
    let class_s = {"like": "far fa-heart"}
    let class_o = {"like": "fas fa-heart"}

    // 현재 좋아요 아이콘이 비어 있는 하트일 때 클릭하는 경우 > 좋아요
    if ($i_like.hasClass(class_s[type])) {
        $.ajax({
            type: "POST",
            url: "/api/like",
            data: {
                post_id_give: _id,
                type_give: type,
                action_give: "like"
            },
            // 좋아요를 클릭하면 빈 하트 아이콘을 없애고 꽉 차 있는 아이콘으로 변경하고 페이지 리로드
            success: function (response) {
                console.log("like")
                $i_like.addClass(class_o[type]).removeClass(class_s[type])
                window.location.reload()
            }
        })
    }
    // 현재 좋아요 아이콘이 꽉 차 있는 하트일 때 클릭하는 경우 > 좋아요 취소
    else {
        $.ajax({
            type: "POST",
            url: "/api/like",
            data: {
                post_id_give: _id,
                type_give: type,
                action_give: "dislike"
            },
            // 좋아요를 취소하면 꽉 차 있는 아이콘에서 빈 하트 아이콘으로 변경하고 페이지 리로드
            success: function (response) {
                console.log("unlike")
                $i_like.addClass(class_s[type]).removeClass(class_o[type])
                window.location.reload()
            }
        })
    }
}

// (구현 못 함) 정렬에서 최신순을 클릭하면 업로드 날짜순으로 데이터를 가져 와서 카드 재생성
function sortByDate() {
    // $("#card-box").empty()
    $.ajax({
        type: 'GET',
        url: '/sort/date',
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let cards = response["cards"]
                for (let i = 0; i < cards.length; i++) {
                    let card = cards[i]
                    let temp_html = `<div class="card-container">
                                        <div class="card-top">
                                            <span class="card-username">${card['user_name']}</span>
                                            <span class="card-like">
                                                <span class="card-like-count">${card['like_count']}</span>
                                                <span>
                                                <button class="btn btn-like" id="${card['_id']}" aria-label="like" onclick="likeClick(), 'like'"><i
                                                        class="far fa-heart" style="font-size: 1.5rem; color: dimgray"></i></button>
                                            </span>
                                            </span>
                                        </div>
                                        <!--            image-->
                                        <div class="card-middle">
                                            <img src="${card['pet_img']}"
                                                 alt="card-image" class="card-img">
                                        </div>
                                        <div class="card-bottom">
                                            <div class="card-desc">
                                                <div class="pet-desc">
                                                    <p>제 이름은 <span class="pet-name" style="font-weight: 700">${card['pet_name']}</span> 에요!</p>
                                                    <p>나이는 <span class="pet-age" style="font-weight: 700">${card['pet_age']}</span>살 이구요,</p>
                                                    <p><span class="pet-species" style="font-weight: 700">${card['pet_species']}</span> 랍니다!</p>
                                                </div>
                                                <p class="pet-intro"><span style="font-size: 1.5rem">"</span>${card['pet_intro']}<span style="font-size: 1.5rem">"</span></p>
                                            </div>
                                        </div>
                                    </div>`
                    $("#card-box").append(temp_html)
                }
            }

        }
    });
}

// (구현 못 함) 정렬에서 좋아요순을 클릭하면 좋아요 갯수 순으로 데이터를 가져 와서 카드 재생성
function sortByLike() {
    // $("#card-box").empty()
    $.ajax({
        type: 'GET',
        url: '/sort/like',
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let cards = response["cards"]
                for (let i = 0; i < cards.length; i++) {
                    let card = cards[i]
                    let temp_html = `<div class="card-container">
                                        <div class="card-top">
                                            <span class="card-username">${card['user_name']}</span>
                                            <span class="card-like">
                                                <span class="card-like-count">${card['like_count']}</span>
                                                <span>
                                                <button class="btn btn-like" id="${card['_id']}" aria-label="like" onclick="likeClick(), 'like'"><i
                                                        class="far fa-heart" style="font-size: 1.5rem; color: dimgray"></i></button>
                                            </span>
                                            </span>
                                        </div>
                                        <!--            image-->
                                        <div class="card-middle">
                                            <img src="${card['pet_img']}"
                                                 alt="card-image" class="card-img">
                                        </div>
                                        <div class="card-bottom">
                                            <div class="card-desc">
                                                <div class="pet-desc">
                                                    <p>제 이름은 <span class="pet-name" style="font-weight: 700">${card['pet_name']}</span> 에요!</p>
                                                    <p>나이는 <span class="pet-age" style="font-weight: 700">${card['pet_age']}</span>살 이구요,</p>
                                                    <p><span class="pet-species" style="font-weight: 700">${card['pet_species']}</span> 랍니다!</p>
                                                </div>
                                                <p class="pet-intro"><span style="font-size: 1.5rem">"</span>${card['pet_intro']}<span style="font-size: 1.5rem">"</span></p>
                                            </div>
                                        </div>
                                    </div>`
                    $("#card-box").append(temp_html)
                }
            }
        }
    });
}

// Modal JS
const body = document.querySelector('body')
const modal = document.querySelector('#modal');
const btnPost = document.querySelector('.btn-post');
const btnModalClose = document.querySelector('.modal-close')

// 업로드를 클릭하면 모달 페이지가 보이고, 메인 페이지는 스크롤이 안 되도록 설정
btnPost.addEventListener('click', () => {
    modal.style.display = 'block';
    body.style.overflow = 'hidden';
});

// 모달 업로드 페이지에서 홈 버튼을 클릭하면 모달 페이지는 안 보이고, 메인 페이지는 스크롤이 다시 되도록 설정
btnModalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    body.style.overflow = 'auto';
});

// const getCookieValue = (key) => {
//     let cookieKey = key + "=";
//     let result = "";
//     const cookieArr = document.cookie.split(";");
//
//     for (let i = 0; i < cookieArr.length; i++) {
//         if (cookieArr[i][0] === " ") {
//             cookieArr[i] = cookieArr[i].substring(1);
//         }
//
//         if (cookieArr[i].indexOf(cookieKey) === 0) {
//             result = cookieArr[i].slice(cookieKey.length, cookieArr[i].length);
//             return result;
//         }
//     }
//     return result;
// }

// 로그인/로그아웃 여부에 따라 냇바의 로그인 관련 버튼이 변경되도록 설정
function checkCookie() {
    // 페이지의 쿠키 가져오기
    let cookieArr = document.cookie.split(";");
    try {
        for (let i = 0; i < cookieArr.length; i++) {
            // 만약 쿠키 리스트에 로그인을 한 경우에만 나타나는 mytoken 문자가 있으면 로그인 상태로 설정
            let logIn = cookieArr[i].match('mytoken')
            if (logIn) { // 로그인 상태 //
                // 회원가입 버튼이 보이지 않도록 설정
                document.querySelector(".btn-join").style.visibility = "hidden";
                // 로그인 버튼이 로그아웃 버튼으로 변경되고 로그아웃 버튼을 클릭하면 메인페이지로 이동하도록 설정
                let loginBtn = document.querySelector(".btn-login")
                loginBtn.innerHTML = "LOGOUT";
                loginBtn.addEventListener("click", logOut);
            }
        // 로그아웃 상태이면 do nothing 으로 설정
        else {
                return;
            }
        }
    } catch (e) {
        console.log(e);
    }
}

// 로그아웃 클릭 시 발생하는 이벤트
function logOut() {
    // mytoken 이라는 쿠키가 만료되도록 설정
    document.cookie = "mytoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // 메인 페이지로 이동되도록 설정
    window.location.href = "/"
}