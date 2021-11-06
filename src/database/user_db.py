from src.database import WhoisDog_db

class User:
    
    # DB에 유저를 insert 하는 함수 => 딕셔너리 형태의 유저 정보 인자를 받아와 추가
    def insert_user(new_user):

        # 유저정보 insert 완료 여부를 True False로 확인하는 변수
        success = False
        
        # 아이디 중복검사 => WhoisDog DB의 users 콜렉션(테이블)에서 find해서 중복 여부 확인
        if WhoisDog_db.users.find_one({'email': new_user['email']}) is None:

            # 중복여부 확인 후 문제가 없으면 insert
            # success 변수에 True 할당
            WhoisDog_db.users.insert_one(new_user)
            success = True

        return success

    # 유저 아이디 중복검사
    def find_user(email_receive):
        result = False

        finded_email = WhoisDog_db.users.find_one({'email': email_receive})
        if finded_email is not None:
            result = True

        return result

    # 닉네임 중복 검사
    def find_nickname(nick_receive):
        result = False

        finded_nick = WhoisDog_db.users.find_one({'nick_name': nick_receive})
        if finded_nick is not None:
            result = True

        return result










