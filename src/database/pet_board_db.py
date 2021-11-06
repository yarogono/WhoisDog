from src.database import WhoisDog_db

# 소스코드 작성자 => 임전혁

# 메인페이지 카드섹션에 반려동물 정보를 입력
class Pet_board:

    def insert_pet(pet_info):
        WhoisDog_db.pet_board.insert_one(pet_info)