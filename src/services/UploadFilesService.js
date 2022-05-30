import http from "../http-common";

class UploadFilesService {
    //upload를 위한 메소드
    upload(file, onUploadProgress){
        //자바스크립트 제공 클래스
        //<form> 이미지 전송을 해야함 : json 형태x
        //<from> == FormData()
        let formData = new FormData();

        //vue에서 선택한 파일을 form 데이터로 담기
        formData.append("file", file);

        return http.post("/upload",formData),{
            headers:{
                "Content-Type":"multipart/form-data"
            },
            //이미지 처리 결과를 화면에 프로그래스바 표기 위해 실행(함수)
            onUploadProgress
        }

    }
    // 이미지를 서버에서 다운로드 받음
    // select 문 호출
    getFiles() {
        return http.get("/files");
    }

}

export default new UploadFilesService();