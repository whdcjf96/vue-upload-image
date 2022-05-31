<template>
  <div>
    <div class="row">
      <div class="col-8">
        <label class="btn btn-default p-0">
          <!--          파일 선택상자-->
          <input
              type="file"
              accept="image/*"
              ref="file"
              @change="selectImage">
        </label>
      </div>
      <div class="col-4">
        <button class="btn btn-success btn-sm float-right"
                :disabled="!currentImage" @click="upload">Upload
        </button>
      </div>
      <!--      프로그래스 바 시작-->
      <div v-if="currentImage" class="progress">
        <div class="progress-bar progress-bar-info" role="progressbar" :style="{width:+progress+'%'}"
             :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100"></div>
        {{ progress }}%
      </div>
    </div>
    <!--      프로그래스 바 끝-->

    <!--    미리보기 이미지 시작-->
    <div v-if="previewImage">
      <div>
        <img class="preview my-3" :src="previewImage" alt=""/>
      </div>
    </div>
    <!--    미리보기 이미지 끝-->

    <div v-if="message" class="alert alert-secondary" role="alert">
      {{ message }}
    </div>

    <!--    List(목록) 이미지 정보를 출력-->
    <div class="card mt-3">
      <div class="card-header">List of Image</div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item" v-for="(image,index) in imageInfo" :key="index">
          <a :href="image.url">{{image.name}}</a>
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
import UploadService from '../services/UploadFilesService'

export default {
  name: "upload-image",
  data() {
    return {
      currentImage: undefined,
      previewImage: undefined,
      progress: 0,
      message: "",
      imageInfo: [],
    }
  },
  methods: {
    selectImage() {
      this.currentImage = this.$refs.file.files.item(0);
      this.previewImage = URL.createObjectURL(this.currentImage);
      this.message = "";
      this.progress = 0;
    },
    upload() {
      this.progress = 0;
      //서버에 이미지 업로드 요청(insert문 실행)
      UploadService.upload(this.currentImage, (event) => {
        //파일이 업로드될때 진척상황이 저장됨(%)
        this.progress = Math.round((100 * event.loaded) / event.total);
      })
          .then((response) => {
            //  서버쪽 응답 메시지 저장
            this.message = response.data.message;
            //서버쪽에 insert가 잘되었는지
            //select문 호출
            return UploadService.getFiles();
          })
          .then((image) => {
            this.imageInfo = image.data;
          })
          .catch((err) => {
            this.progress = 0;
            this.message = "Could not upload the image!" + err;
            this.currentImage = undefined;
          })

    }
  },
  mounted() {
    UploadService.getFiles()
        .then((response) => {
          this.imageInfo = response.data;
        })
  }
}
</script>
<style>
.preview {
  max-width: 200px;
}
</style>
